/* =====================================================================
   ShipCalc · DATOS DE ENVÍO DESDE COREA DEL SUR
   Moneda: KRW. Tablas "hasta X kg" (primer tramo cuyo límite >= peso).
   Verificado: 2026-10-29. Todas las tarifas de Korea Post se comprobaron
   una por una contra la calculadora oficial (ems.epost.go.kr,
   front.newEmsGetDaysAndPrice.postal), incluido el 추가운송수수료.
   Para actualizar: cambia solo los números; no toques la estructura.
   ===================================================================== */
(function(SC){
'use strict';
function pair(ws,vals){var o=[];for(var i=0;i<ws.length;i++)o.push([ws[i],vals[i]]);return o;}
function zoned(ws,tbl){var o={};for(var z in tbl)o[z]=pair(ws,tbl[z]);return o;}
function steps(a,b,s){var o=[];for(var w=a;w<=b+1e-9;w+=s)o.push(Math.round(w*1000)/1000);return o;}

/* ---------- Korea Post: recargo de transporte adicional (추가운송수수료) ----------
   Se cobra aparte del franqueo en paquetes, pequeños paquetes y K-Packet
   (EMS y EMS Premium ya lo incluyen). KRW por cada 100 g del tramo cobrado.
   Fuente: calculadora oficial ems.epost.go.kr (2026-10-29). */
var KR_FEE100={ES:460,DE:340,GB:610,IT:390,US:600,CA:610,AU:210,MX:570,AR:690,CO:500,CL:670,PE:520,
  VE:330,EC:480,UY:340,PY:330,BO:330,DO:560,GT:330,CR:670,PA:480};
function krFee(d,bracketKg){var r=KR_FEE100[d];return r?Math.round(r*bracketKg*10):0;}

/* ---------- EMS (국제특급) — tarifa vigente desde 2026-07-01 ----------
   Fuente: https://ems.epost.go.kr/front.EmsDeliveryDelivery02.postal?paper=N
   Columnas propias: AU CA DE ES GB US · z3 = Italia y resto de Europa · z4 = Latinoamérica.
   Países que aceptan EMS hoy (lista oficial "접수가능국가", 2026-10-29): */
var KR_EMS_OK={ES:1,DE:1,GB:1,US:1,CA:1,AU:1,MX:1,CL:1,PE:1,EC:1,DO:1,CR:1,PA:1};
var KR_EMS_COL={ES:'ES',DE:'DE',GB:'GB',US:'US',CA:'CA',AU:'AU',IT:'z3',MX:'z4',AR:'z4',CO:'z4',CL:'z4',PE:'z4',
  VE:'z4',EC:'z4',UY:'z4',PY:'z4',BO:'z4',DO:'z4',GT:'z4',CR:'z4',PA:'z4'};
var KR_EMS_MAX={ES:20,AU:20,MX:20}; // resto 30 kg
var KR_EMS_W=[0.5,0.75,1,1.25,1.5,1.75,2,2.5,3,3.5,4,4.5,5,5.5,6,6.5,7,7.5,8,8.5,9,9.5,10,10.5,11,11.5,12,12.5,13,13.5,14,14.5,15,15.5,16,16.5,17,17.5,18,18.5,19,19.5,20,20.5,21,21.5,22,22.5,23,23.5,24,24.5,25,25.5,26,26.5,27,27.5,28,28.5,29,29.5,30];
var KR_EMS={
 "AU":[33500,37000,40500,44000,47500,51000,55000,59000,63000,67000,71500,76000,81000,85500,90500,96000,102000,107500,113500,119500,125000,131000,136500,142000,147500,153500,159500,165000,171000,176500,182000,188000,193500,199500,205000,211000,216500,222000,228000,233500,239500,245500,252000,259000,266000,272500,279000,285500,291500,297000,303000,308500,314500,320000,326000,332000,337500,344000,349500,355500,361500,367000,373000],
 "CA":[30000,32500,36000,39000,42500,46000,49500,56000,62000,68500,75500,82500,89500,96500,104500,112500,120500,127500,135000,142000,149500,158000,166500,175000,183000,190500,198000,206000,214500,223000,231500,240000,249000,257500,265500,273500,281500,289500,297000,304500,312500,319500,327500,335000,342500,350500,357500,365500,373000,380500,388500,396000,403500,411000,418500,426500,434000,442000,449000,457000,464500,472000,480000],
 "DE":[43500,47000,50000,53000,55000,57500,60500,64500,69000,74000,79000,83500,88500,94000,100500,107000,114000,120500,126000,131500,138000,144000,150500,157000,163500,169500,176500,182500,188500,195500,201500,208000,214500,221000,227000,234000,240000,246000,253000,259000,266000,272000,278500,285000,291000,297500,304000,310500,316500,323500,329500,336000,342500,348500,355000,361500,368000,374000,381000,387000,393000,400000,406000],
 "ES":[27500,30500,33500,36500,39500,43000,45500,51500,57000,62500,70000,77500,85000,92000,98500,104500,111500,117500,123500,131000,139000,147000,154000,160000,166500,173500,180000,186500,193500,200000,206000,213000,219500,226000,233000,239500,245500,252500,259000,265500,273500,282000,290000,296500,304500,311500,318000,325000,332000,338000,345000,351500,358500,365500,372000,379000,385000,392000,399000,405500,412500,419000,425500],
 "GB":[39500,42000,44500,47500,50000,53000,55500,61000,66500,72000,79000,85000,91000,98000,105000,111500,117500,124500,133000,140500,148500,156500,163000,170500,177500,184500,192000,198500,206000,213000,220000,227500,234000,241000,248500,255500,263000,269500,276500,284000,291000,298000,307000,315500,324500,333000,340000,348000,355000,362000,369500,376500,384000,391000,398000,405500,412500,420000,427500,434500,442000,449000,456000],
 "US":[39000,42500,46000,51000,57000,62500,68500,76500,86000,96500,107000,117500,128500,139500,150500,161000,171000,180500,191000,201500,212000,223000,233500,244000,254500,264000,273500,283500,294500,304500,315000,325500,336000,346500,357000,367500,377500,388500,398500,409500,420000,430000,441000,451000,461500,472000,482500,493500,503500,514000,524500,535000,545500,556000,566500,576500,587500,597500,608500,619000,629000,640000,650000],
 "z3":[37500,41000,43500,46000,48000,51000,54500,60000,64500,69500,74500,79500,86000,91500,96500,102000,108500,115500,122000,128500,135500,142500,150000,157500,165500,173000,181000,188000,196000,203000,210500,217500,224000,231000,238000,245000,252000,259000,266500,273500,280500,289000,296000,304500,313000,321500,328500,336000,343000,350500,357500,364500,372000,379000,386500,393500,401000,407500,414500,422000,429000,436500,443500],
 "z4":[41500,45500,49500,53000,56000,60000,64000,69500,77000,87500,97500,108000,118000,128500,138500,148500,159000,169500,179500,189500,199500,209500,221500,233000,244500,257000,268500,279500,290500,300500,311000,321500,332000,343000,353500,364000,374000,384500,395000,406000,416500,427000,438500,450000,462000,475000,487500,500000,510500,521000,532000,543000,553500,564000,575000,585500,596500,607000,618000,628500,639000,650500,661000]
};

/* ---------- EMS Premium (operado con UPS) — vigente desde 2026-04-01 ----------
   Zonas: 3 Europa/EE.UU./Canadá/Australia · 4 México, Colombia, Chile, Centroamérica, Paraguay, Bolivia · 5 resto Sudamérica y Rep. Dominicana */
var KR_PREM_ZONE={ES:'z3',DE:'z3',GB:'z3',IT:'z3',US:'z3',CA:'z3',AU:'z3',MX:'z4',AR:'z5',CO:'z4',CL:'z4',PE:'z5',
  VE:'z5',EC:'z5',UY:'z5',PY:'z4',BO:'z4',DO:'z5',GT:'z4',CR:'z4',PA:'z4'};
var KR_PREM_MAX={BO:68,PY:68}; // resto 70 kg
var KR_PREM_W=steps(0.5,20,0.5).concat(steps(21,70,1));
var KR_PREM={
 "z3":[43800,54100,63700,73300,81100,88900,94000,99100,104300,109400,114500,119700,124800,129900,134600,139400,144200,149000,153600,158700,164500,170700,176300,181600,187000,192400,197700,202900,208200,213500,218800,224200,229000,233700,238500,243300,248000,252800,257600,262300,281100,290400,299600,308600,317600,328600,339600,350700,361800,372800,394000,409200,424400,439600,454300,469300,484300,497100,510000,522800,535700,548500,561400,574300,587100,600000,612800,625600,638600,651400,663500,675500,687600,699800,711900,723900,735900,748100,760100,772200,784300,796400,808500,820600,832700,844800,856800,868900,880900,893100],
 "z4":[45100,59200,72100,84900,95200,105400,114500,123400,127400,131200,139800,148400,157000,165600,174200,182800,191500,200100,208700,217400,227600,237900,247100,256400,265500,274700,283700,292900,302000,311200,320200,329200,338200,347100,356200,365100,374200,383200,392200,401200,419100,437100,455100,473200,491100,509100,527100,545100,563100,581100,603500,620100,636400,653000,669400,685800,702300,718700,735300,751700,768000,784600,801000,817600,833900,850700,867300,884100,900800,917500,933200,948900,964600,980200,995900,1011600,1027300,1042900,1058600,1074400,1090100,1105700,1121400,1137100,1152800,1168400,1184000,1199800,1215400,1231200],
 "z5":[64400,77200,88100,99100,110000,120800,131800,142800,153700,164600,175000,185500,195800,206200,216600,227100,237500,247800,258200,268800,279100,289400,299600,309900,320200,330400,340800,351100,361400,371600,382000,392500,402900,413300,423600,434100,444500,454900,465300,475700,496300,516800,537400,558000,578600,598900,619200,639500,659900,680200,705900,725700,745600,765300,785100,805000,824600,844400,864300,884100,903600,923200,942700,962200,981800,1001300,1020900,1040300,1059900,1079500,1097800,1116000,1134300,1152500,1170800,1188900,1207200,1225400,1243700,1262000,1280300,1298500,1316800,1335000,1353300,1371500,1389800,1408000,1426300,1444700]
};

/* ---------- Paquete aéreo (항공소포) — hasta 20 kg, tramos de 0,5 kg ----------
   Franqueo sin recargo; el recargo KR_FEE100 se suma aparte. Bolivia: sin servicio. */
var KR_PA_COL={ES:'ES',DE:'DE',GB:'GB',US:'US',CA:'CA',AU:'AU',IT:'IT',MX:'Z4',AR:'Z4',CO:'Z4',CL:'Z4',PE:'Z4',
  VE:'Z4',EC:'Z4',UY:'Z4',PY:'Z4',DO:'Z4',GT:'Z4',CR:'Z4',PA:'Z4'};
var KR_PA_W=steps(0.5,20,0.5);
var KR_PA={
 "AU":[18500,21000,24500,28500,32500,36500,40000,44000,48000,52000,56000,60000,64000,68000,72000,75500,79500,83500,87500,91500,95500,99500,103000,107000,111000,115000,119000,123000,127000,130500,134500,138500,142500,146500,150500,154500,158500,162000,166000,170000],
 "US":[23500,28000,31000,37000,42500,48000,54000,59500,65500,71000,77000,82500,88000,94000,99500,105500,111000,117000,122500,128000,134000,139500,145500,151000,157000,162500,168500,174000,179500,185500,191000,197000,202500,208500,214000,219500,225500,231000,237000,242500],
 "GB":[26000,30500,32000,34000,35500,37000,40500,44000,47500,51000,54500,58000,61500,65000,68500,72000,75500,79000,82500,86000,89500,93000,96500,100000,103500,107000,110500,114000,117500,121000,124500,128000,131500,135000,138500,142000,145500,149000,152500,156000],
 "ES":[19500,23000,26500,30000,33500,37000,40500,44000,47000,50500,54000,57500,61000,64500,68000,71500,75000,78500,81500,85000,88500,92000,95500,99000,102500,106000,109500,113000,116500,119500,123000,126500,130000,133500,137000,140000,143500,147000,150500,154000],
 "DE":[19500,23000,26500,29500,33000,36500,40000,43500,47000,50000,53500,57000,60500,64000,67500,70500,74000,77500,81000,84500,88000,91000,94500,98000,101500,105000,108000,111500,115000,118500,122000,125000,128500,132000,135500,139000,142000,145500,149000,152500],
 "CA":[23000,27000,31000,35000,39000,43000,47000,51000,55000,59000,63000,67000,71500,75000,79500,83500,87500,91500,95500,99500,103500,107500,111500,115500,119500,123500,127500,131500,136000,139500,143500,147500,151500,156000,159500,163500,167500,172000,176000,180000],
 "IT":[20500,24500,28000,31500,35000,39000,42500,46000,49500,53500,57000,60500,64500,68000,71500,75000,78500,82500,86000,89500,93500,97000,100500,104000,108000,111500,115000,118500,122500,126000,129500,133000,136500,140500,144000,147500,151000,155000,158500,162000],
 "Z4":[22000,27500,33500,39000,45500,52000,58500,65000,71500,78000,84500,91000,97500,104500,110500,117500,124000,130500,137000,143500,150000,156500,163000,169500,176000,182500,189000,195500,202000,209000,215000,221500,228500,235000,241500,248000,254500,261000,267500,274000]
};

/* ---------- Paquete marítimo (선편소포) — solo ES DE GB US CA AU ----------
   Tramos: 1, 2, 4, 6 … 20 kg. EE.UU. añade 100 KRW por kg del tramo. */
var KR_PS_OK={ES:1,DE:1,GB:1,US:1,CA:1,AU:1};
var KR_PS=[[1,12000],[2,18500],[4,24500],[6,30500],[8,37000],[10,43000],[12,49000],[14,55500],[16,61500],[18,67500],[20,74000]];

/* ---------- Pequeño paquete aéreo (국제소형포장물) — hasta 2 kg, sin seguimiento ----------
   Zona 3 Europa/Canadá/Australia · zona 4 Latinoamérica · columna propia EE.UU. */
var KR_SP_COL={ES:'Z3',DE:'Z3',GB:'Z3',IT:'Z3',CA:'Z3',AU:'Z3',US:'US',MX:'Z4',AR:'Z4',CO:'Z4',CL:'Z4',PE:'Z4',
  VE:'Z4',EC:'Z4',UY:'Z4',PY:'Z4',BO:'Z4',DO:'Z4',GT:'Z4',CR:'Z4',PA:'Z4'};
var G100=steps(0.1,2,0.1);
var KR_SP={
 "Z3":[5120,6130,7140,8150,10200,11150,12100,13050,14000,14940,16840,18140,19440,20740,21620,22920,23920,24920,25920,26920],
 "Z4":[5450,6580,7710,8840,11140,12550,13960,15370,16780,18230,19630,21030,22430,23830,24910,26910,28910,30910,32910,34910],
 "US":[8410,9420,10430,11440,13490,14440,15390,16340,17290,18230,20130,21430,22730,24030,24910,26210,28110,30010,31910,33810]
};

/* ---------- K-Packet — hasta 2 kg, con seguimiento (solo online, con contrato gratuito) ----------
   Fuente: https://www.koreapost.go.kr/kpost/subIndex/236.do + calculadora oficial. Solo 11 de nuestros destinos. */
var KR_KP={
 "US":[8090,8980,11060,13170,15280,16910,18530,20160,21780,23430,25780,28130,30480,32810,35160,37270,39350,41440,43530,45690],
 "ES":[5430,7080,8730,10380,12060,13340,14620,15900,17180,18490,19630,20770,21910,23050,24190,25330,26470,27310,28270,29170],
 "DE":[5450,7100,8770,10420,12090,13390,14670,15950,17250,18550,19560,20560,21570,22580,23590,24590,25600,26610,27610,28620],
 "GB":[5170,6740,8300,9870,11470,12690,13910,15120,16340,17590,19090,20590,22090,23590,25090,26590,28090,29590,31090,32590],
 "IT":[4590,8070,11540,15020,18490,21970,25440,28920,32390,35870,39340,42820,46290,49770,53240,56720,60190,63670,67140,70620],
 "CA":[5540,7240,8920,10610,12310,13620,14930,16240,17560,18890,20780,22670,24560,26460,28340,29430,30520,31620,32710,33800],
 "AU":[4670,6080,7500,8920,10360,11460,12560,13660,14770,15890,16910,17930,18950,19970,20990,22010,23030,24050,25070,26090],
 "MX":[4090,7070,10050,13030,16010,18990,21960,24940,27920,30900,33880,36850,39830,42810,45790,48770,51740,54720,57700,60680],
 "AR":[4990,8860,12730,16600,20480,24350,28220,32090,35960,39840,43710,47580,51450,55320,59200,63070,66940,70810,74680,78560],
 "CL":[6320,9060,11800,14540,17280,20020,22760,25500,28240,30980,33720,36460,39200,41930,44670,47410,50150,52890,55630,58370],
 "PE":[4600,8080,11570,15050,18530,22010,25500,28980,32460,35950,39430,42910,46390,49880,53360,56840,60330,63810,67290,70780]
};

/* ---------- DHL Express Worldwide (Corea) — tarifa pública 2026 ----------
   Fuente: DHL Express Korea, 2026년 요금 및 서비스 가이드, "DHL EXPRESS WORLDWIDE 수출 요금" (p.25-26)
   https://www.dhl.com/discover/content/dam/korea/service/service_and_rate_guide_kr_ko_2026.pdf
   Zonas: 4 Australia · 5 EE.UU./Canadá/México · 6 Europa · 8 Latinoamérica */
var DHL_KR_ZONE={ES:'6',DE:'6',GB:'6',IT:'6',US:'5',CA:'5',MX:'5',AU:'4',
  AR:'8',CO:'8',CL:'8',PE:'8',VE:'8',EC:'8',UY:'8',PY:'8',BO:'8',DO:'8',GT:'8',CR:'8',PA:'8'};
var DHL_KR_W=steps(0.5,30,0.5);
var DHL_KR={
 '4':[153600,175200,192900,210600,227200,243100,259000,274900,290800,306700,320600,334500,348400,362300,376200,390100,404000,417900,431800,445700,456900,468100,479300,490500,501700,512900,524100,535300,546500,557700,568900,580100,591300,602500,613700,624900,636100,647300,658500,669700,684000,698300,712600,726900,741200,755500,769800,784100,798400,812700,827000,841300,855600,869900,884200,898500,912800,927100,941400,955700],
 '5':[155300,177100,194900,212700,229600,245500,261400,277300,293200,309100,323600,338100,352600,367100,381600,396100,410600,425100,439600,454100,465100,476100,487100,498100,509100,520100,531100,542100,553100,564100,575100,586100,597100,608100,619100,630100,641100,652100,663100,674100,689300,704500,719700,734900,750100,765300,780500,795700,810900,826100,841300,856500,871700,886900,902100,917300,932500,947700,962900,978100],
 '6':[166800,203800,231900,260000,287400,310700,334000,357300,380600,403900,425100,446300,467500,488700,509900,531100,552300,573500,594700,615900,636500,657100,677700,698300,718900,739500,760100,780700,801300,821900,842500,863100,883700,904300,924900,945500,966100,986700,1007300,1027900,1050700,1073500,1096300,1119100,1141900,1164700,1187500,1210300,1233100,1255900,1278700,1301500,1324300,1347100,1369900,1392700,1415500,1438300,1461100,1483900],
 '8':[226900,275100,316000,356900,396100,432400,468700,505000,541300,577600,612500,647400,682300,717200,752100,787000,821900,856800,891700,926600,959100,991600,1024100,1056600,1089100,1121600,1154100,1186600,1219100,1251600,1284100,1316600,1349100,1381600,1414100,1446600,1479100,1511600,1544100,1576600,1608400,1640200,1672000,1703800,1735600,1767400,1799200,1831000,1862800,1894600,1926400,1958200,1990000,2021800,2053600,2085400,2117200,2149000,2180800,2212600]
};
// Más de 30 kg: KRW por kg (igual en 30,1–70 y 70,1–300 kg). La guía no aclara si se multiplica por el
// peso total o se suma al precio de 30 kg; aplicamos peso total × tarifa (cuadra con el precio de 30 kg)
// y lo marcamos como estimado.
var DHL_KR_PERKG={'4':31900,'5':32900,'6':49500,'8':71600};

/* ---------- FedEx International Priority (Corea) — tarifa 2026 en KRW ----------
   Fuente: "코리아 수출 운임" 2026 (vigente desde 2026-01-05)
   https://www.fedex.com/content/dam/fedex/international/rates/fedex-rates-exp-ko-kr-2026.pdf
   Zonas (fedex-rates-zi-ko-kr-2026.pdf): G Europa · F EE.UU. (resto)/Canadá/Australia/México · I Latinoamérica
   (EE.UU. oeste = zona E, algo más barata; usamos F para no subestimar) */
var FX_KR_ZONE={ES:'G',DE:'G',GB:'G',IT:'G',US:'F',CA:'F',AU:'F',MX:'F',
  AR:'I',CO:'I',CL:'I',PE:'I',VE:'I',EC:'I',UY:'I',PY:'I',BO:'I',DO:'I',GT:'I',CR:'I',PA:'I'};
var FX_KR_W=steps(0.5,20.5,0.5);
var FX_KR={
 F:[145500,160800,176100,191400,206700,221600,236500,251400,266300,281200,294300,307400,320500,333600,346700,359800,372900,386000,399100,412200,422600,433000,443400,453800,464200,474600,485000,495400,505800,516200,526600,537000,547400,557800,568200,578600,589000,599400,609800,620200,630600],
 G:[146400,173300,200200,227100,254000,273600,293200,312800,332400,352000,371100,390200,409300,428400,447500,466600,485700,504800,523900,543000,560600,578200,595800,613400,631000,648600,666200,683800,701400,719000,736600,754200,771800,789400,807000,824600,842200,859800,877400,895000,912600],
 I:[163400,188800,214200,239600,265000,292200,319400,346600,373800,401000,426300,451600,476900,502200,527500,552800,578100,603400,628700,654000,671400,688800,706200,723600,741000,758400,775800,793200,810600,828000,845400,862800,880200,897600,915000,932400,949800,967200,984600,1002000,1019400]
};
// Desde 21 kg: KRW por kg × peso total (tramos 21–44, 45–70, 71–99, 100–299 kg)
var FX_KR_PERKG={F:[30100,29500,29100,29000],G:[43500,42600,42200,41900],I:[51100,46600,46000,45700]};

/* ---------- Recargos variables de los couriers ----------
   Combustible DHL Corea (semanal): https://mydhl.express.dhl/kr/ko/ship/surcharges.html
   Combustible FedEx Corea (mensual): https://www.fedex.com/ko-kr/shipping/rates/monthly-fuel-surcharge.html
   Recargo por demanda DHL (01-10-2026 a 05-02-2027, KRW/kg): https://mydhl.express.dhl/kr/ko/ship/surcharges/demand-surcharge.html
   Recargo por demanda FedEx (desde 19-10-2026, KRW/kg): https://www.fedex.com/content/dam/fedex/international/rates/fedex-ds-2026-oct19-638-en-kr.pdf */
SC.fuel.DHL_KR=[{from:'2026-10-05',pct:48.00},{from:'2026-10-12',pct:49.00},{from:'2026-10-19',pct:49.75},{from:'2026-10-26',pct:49.25},{from:'2026-11-02',pct:49.50,until:'2026-11-08'}];
SC.fuel.FX_KR=[{from:'2026-10-05',pct:46.00},{from:'2026-11-02',pct:51.50,until:'2026-12-06'}];
SC.demand.DHL_KR=[{from:'2026-10-01',until:'2027-02-05',perKg:{EU:2200,AM:2600,OC:900},fuelApplies:true}];
SC.demand.FX_KR=[{from:'2026-10-19',perKg:{EU:1870,AM:2310,OC:720},min:360,fuelApplies:false}];

var KR_POST_SRC='https://ems.epost.go.kr/front.EmsDeliveryDelivery01.postal';
var KR_EMS_DAYS={US:'3–4',AU:'3–4',CA:'4–6',DE:'4–6',GB:'4–6',DO:'4–6',ES:'5–7',CL:'5–8',MX:'5–10',PA:'5–10',PE:'6–7',CR:'7–10',EC:'25–40'};

SC.origins.KR={
 currency:'KRW',
 services:[
  {id:'kr_ems',carrier:'Korea Post',name:'EMS',days:function(d){return KR_EMS_DAYS[d]||'4–10';},tracked:true,insured:true,split:true,volDiv:6000,
   maxKg:function(d){return KR_EMS_MAX[d]||30;},
   unavailable:function(d){return !KR_EMS_OK[d];},
   unavail_es:'Korea Post no acepta EMS a este país ahora mismo (lista oficial de países).',unavail_en:'Korea Post does not currently accept EMS to this country (official country list).',
   zone:function(d){return KR_EMS_COL[d];},periods:[{zones:zoned(KR_EMS_W,KR_EMS)}],
   src:'https://ems.epost.go.kr/front.EmsDeliveryDelivery02.postal?paper=N',verified:'2026-10-29',
   note_es:'El más rápido de Korea Post. Seguimiento y seguro básico. Peso volumétrico: largo×ancho×alto/6000.',
   note_en:'Fastest Korea Post option. Tracking and basic insurance. Volumetric weight: L×W×H/6000.'},
  {id:'kr_prem',carrier:'Korea Post',name:'EMS Premium',days:'2–5',tracked:true,insured:true,split:true,volDiv:6000,
   maxKg:function(d){return KR_PREM_MAX[d]||70;},unavailable:function(){return false;},
   zone:function(d){return KR_PREM_ZONE[d];},periods:[{zones:zoned(KR_PREM_W,KR_PREM)}],
   src:KR_POST_SRC,verified:'2026-10-29',
   note_es:'EMS exprés operado con UPS. Llega a más países que el EMS normal y admite hasta 70 kg.',
   note_en:'Express EMS operated with UPS. Reaches more countries than regular EMS, up to 70 kg.'},
  {id:'kr_air',carrier:'Korea Post',name:'Paquete aéreo (항공소포)',name_en:'Air parcel',days:'7–14',tracked:true,insured:false,split:true,
   maxKg:function(){return 20;},unavailable:function(d){return !KR_PA_COL[d];},
   unavail_es:'Korea Post no ofrece paquete aéreo a este país.',unavail_en:'Korea Post offers no air parcel service to this country.',
   zone:function(d){return KR_PA_COL[d];},periods:[{zones:zoned(KR_PA_W,KR_PA)}],
   extra:function(d,bk){return {amt:krFee(d,bk),es:'Recargo de transporte (추가운송수수료)',en:'Additional transport fee'};},
   src:KR_POST_SRC,verified:'2026-10-29',
   note_es:'Paquete por avión con seguimiento. Incluye el recargo de transporte obligatorio de Korea Post.',
   note_en:'Tracked air parcel. Includes Korea Post\'s mandatory additional transport fee.'},
  {id:'kr_sur',carrier:'Korea Post',name:'Paquete marítimo (선편소포)',name_en:'Surface (sea) parcel',days:'45–90',tracked:true,insured:false,split:true,
   maxKg:function(){return 20;},unavailable:function(d){return !KR_PS_OK[d];},
   unavail_es:'Korea Post solo envía por barco a España, Alemania, Reino Unido, EE.UU., Canadá y Australia.',
   unavail_en:'Korea Post only ships by sea to Spain, Germany, UK, USA, Canada and Australia.',
   zone:function(){return 'ALL';},periods:[{zones:{ALL:KR_PS}}],
   extra:function(d,bk){return {amt:d==='US'?Math.round(100*bk):0,es:'Recargo de transporte (EE.UU.)',en:'Additional transport fee (USA)'};},
   src:KR_POST_SRC,verified:'2026-10-29',
   note_es:'El más barato para cajas pesadas, pero tarda de 1,5 a 3 meses.',note_en:'Cheapest for heavy boxes, but takes 1.5–3 months.'},
  {id:'kr_sp',carrier:'Korea Post',name:'Pequeño paquete aéreo (소형포장물)',name_en:'Small packet (air)',days:'7–14',tracked:false,insured:false,
   maxKg:function(){return 2;},unavailable:function(){return false;},
   zone:function(d){return KR_SP_COL[d];},periods:[{zones:zoned(G100,KR_SP)}],
   extra:function(d,bk){return {amt:krFee(d,bk),es:'Recargo de transporte (추가운송수수료)',en:'Additional transport fee'};},
   src:'https://ems.epost.go.kr/front.EmsDeliveryDelivery072.postal',verified:'2026-10-29',
   note_es:'Hasta 2 kg. Sin seguimiento (el certificado cuesta extra en la oficina).',note_en:'Up to 2 kg. No tracking (registration costs extra at the counter).'},
  {id:'kr_kp',carrier:'Korea Post',name:'K-Packet',days:'7–14',tracked:true,insured:false,
   maxKg:function(){return 2;},unavailable:function(d){return !KR_KP[d];},
   unavail_es:'K-Packet no llega a este país.',unavail_en:'K-Packet does not serve this country.',
   zone:function(d){return KR_KP[d]?d:null;},periods:[{zones:zoned(G100,KR_KP)}],
   extra:function(d,bk){return {amt:krFee(d,bk),es:'Recargo de transporte (추가운송수수료)',en:'Additional transport fee'};},
   src:'https://www.koreapost.go.kr/kpost/subIndex/236.do',verified:'2026-10-29',
   note_es:'Hasta 2 kg con seguimiento. Solo online y con contrato (gratuito) con Korea Post; pensado para vendedores.',
   note_en:'Up to 2 kg, tracked. Online only, requires a (free) Korea Post contract; aimed at sellers.'},
  {id:'kr_dhl',carrier:'DHL',name:'DHL Express Worldwide',days:'2–4',tracked:true,insured:false,courier:true,volDiv:5000,
   maxKg:function(){return 300;},pieceKg:70,unavailable:function(){return false;},zone:function(d){return DHL_KR_ZONE[d];},
   periods:[{zones:zoned(DHL_KR_W,DHL_KR)}],over:{at:30,perKg:function(z){return DHL_KR_PERKG[z];},mode:'mult',estimate:true},
   fuel:'DHL_KR',demand:'DHL_KR',publicRate:true,calcUrl:'https://mydhl.express.dhl/kr/ko/home.html',
   src:'https://www.dhl.com/discover/content/dam/korea/service/service_and_rate_guide_kr_ko_2026.pdf',verified:'2026-10-29',
   note_es:'Tarifa oficial pública + combustible + recargo temporal por demanda. En puntos DHL hay cajas "Express Easy" a precio cerrado que pueden salir más baratas.',
   note_en:'Official public rate + fuel + temporary demand surcharge. DHL service points sell fixed-price "Express Easy" boxes that can be cheaper.'},
  {id:'kr_fedex',carrier:'FedEx',name:'FedEx International Priority',days:'2–4',tracked:true,insured:false,courier:true,volDiv:5000,
   maxKg:function(){return 300;},pieceKg:68,unavailable:function(){return false;},zone:function(d){return FX_KR_ZONE[d];},
   periods:[{zones:zoned(FX_KR_W,FX_KR)}],perKgFrom:{at:21,tiers:[44,70,99,299],rates:FX_KR_PERKG},
   fuel:'FX_KR',demand:'FX_KR',publicRate:true,calcUrl:'https://www.fedex.com/ko-kr/online/rating.html',
   src:'https://www.fedex.com/content/dam/fedex/international/rates/fedex-rates-exp-ko-kr-2026.pdf',verified:'2026-10-29',
   note_es:'Tarifa oficial 2026 + combustible + recargo por demanda. Requiere cuenta FedEx (gratis).',
   note_en:'Official 2026 rate + fuel + demand surcharge. Requires a (free) FedEx account.'},
  {id:'kr_ups',carrier:'UPS',name:'UPS Worldwide Express Saver',days:'2–4',quoteOnly:true,courier:true,
   maxKg:function(){return 70;},unavailable:function(){return false;},zone:function(){return null;},periods:[],
   calcUrl:'https://wwwapps.ups.com/ctc/request?loc=ko_KR',
   src:'https://wwwapps.ups.com/ctc/request?loc=ko_KR',verified:'2026-10-29',
   note_es:'UPS Corea no publica la tabla completa por peso: cotiza en su calculadora.',note_en:'UPS Korea does not publish its full weight table: get a quote in its calculator.'}
 ]
};
})(window.SC);
