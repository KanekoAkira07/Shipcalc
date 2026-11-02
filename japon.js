/* =====================================================================
   ShipCalc · DATOS DE ENVÍO DESDE JAPÓN
   Moneda: JPY. Todas las tablas son "hasta X kg" (se cobra el primer
   tramo cuyo límite es >= peso).
   Verificado: 2026-10-29 contra fuentes oficiales (ver "src" de cada servicio).
   Para actualizar: cambia solo los números; no toques la estructura.
   ===================================================================== */
(function(SC){
'use strict';

/* ---------- Japan Post: zona por país de destino ---------- */
// z3 Oceanía/Canadá/México/Oriente Medio/Europa · z4 EE.UU. · z5 Centro y Sudamérica (sin México)/África
var JP_ZONE={ES:'z3',DE:'z3',GB:'z3',IT:'z3',CA:'z3',MX:'z3',AU:'z3',US:'z4',
  AR:'z5',CO:'z5',CL:'z5',PE:'z5',VE:'z5',EC:'z5',UY:'z5',PY:'z5',BO:'z5',DO:'z5',GT:'z5',CR:'z5',PA:'z5'};

/* ---------- Japan Post: disponibilidad actual por país ----------
   Fuente: Japan Post "Service availability by country", actualizado 2026-10-23
   https://www.post.japanpost.jp/int/information/overview_en.html
   Columnas: correo aéreo (Small Packet / Air Packet), paquete aéreo, paquete marítimo (surface), EMS
   true = se acepta · false = suspendido / sin servicio */
var JP_AVAIL={
  ES:{la:true ,pa:true ,ps:true ,ems:true },
  DE:{la:true ,pa:true ,ps:true ,ems:true },
  GB:{la:true ,pa:true ,ps:true ,ems:true },
  IT:{la:true ,pa:true ,ps:true ,ems:true },
  US:{la:true ,pa:true ,ps:true ,ems:true },
  CA:{la:true ,pa:true ,ps:true ,ems:true },
  AU:{la:true ,pa:true ,ps:true ,ems:true },
  MX:{la:true ,pa:true ,ps:false,ems:true },
  AR:{la:true ,pa:true ,ps:false,ems:true },
  CO:{la:true ,pa:true ,ps:false,ems:true },
  CL:{la:true ,pa:true ,ps:false,ems:true },
  PE:{la:true ,pa:true ,ps:true ,ems:true },
  VE:{la:false,pa:false,ps:false,ems:false},
  EC:{la:true ,pa:true ,ps:false,ems:true },
  UY:{la:true ,pa:true ,ps:false,ems:true },
  PY:{la:true ,pa:false,ps:false,ems:false},
  BO:{la:false,pa:false,ps:false,ems:false},
  DO:{la:true ,pa:true ,ps:false,ems:false},
  GT:{la:true ,pa:false,ps:false,ems:false},
  CR:{la:true ,pa:true ,ps:false,ems:true },
  PA:{la:true ,pa:true ,ps:false,ems:true }
};

/* ---------- Japan Post: peso máximo por país (EMS y paquetes) ----------
   Fuente: Japan Post 国際郵便条件表 (cgi-kokusai/country.php), consultado 2026-10-29.
   Por defecto 30 kg. Excepciones: */
var JP_MAXKG={AU:20, AR:20, DO:25};

/* ---------- Tablas vigentes hasta el 31-01-2027 ---------- */
var EMS_W=[0.5,0.6,0.7,0.8,0.9,1,1.25,1.5,1.75,2,2.5,3,3.5,4,4.5,5,5.5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];
var EMS_NOW={
 z1:[1450,1600,1750,1900,2050,2200,2500,2800,3100,3400,3900,4400,4900,5400,5900,6400,6900,7400,8200,9000,9800,10600,11400,12200,13000,13800,14600,15400,16200,17000,17800,18600,19400,20200,21000,21800,22600,23400,24200,25000,25800,26600],
 z2:[1900,2150,2400,2650,2900,3150,3500,3850,4200,4550,5150,5750,6350,6950,7550,8150,8750,9350,10350,11350,12350,13350,14350,15350,16350,17350,18350,19350,20350,21350,22350,23350,24350,25350,26350,27350,28350,29350,30350,31350,32350,33350],
 z3:[3150,3400,3650,3900,4150,4400,5000,5550,6150,6700,7750,8800,9850,10900,11950,13000,14050,15100,17200,19300,21400,23500,25600,27700,29800,31900,34000,36100,38200,40300,42400,44500,46600,48700,50800,52900,55000,57100,59200,61300,63400,65500],
 z4:[3900,4180,4460,4740,5020,5300,5990,6600,7290,7900,9100,10300,11500,12700,13900,15100,16300,17500,19900,22300,24700,27100,29500,31900,34300,36700,39100,41500,43900,46300,48700,51100,53500,55900,58300,60700,63100,65500,67900,70300,72700,75100],
 z5:[3600,3900,4200,4500,4800,5100,5850,6600,7350,8100,9600,11100,12600,14100,15600,17100,18600,20100,22500,24900,27300,29700,32100,34500,36900,39300,41700,44100,46500,48900,51300,53700,56100,58500,60900,63300,65700,68100,70500,72900,75300,77700]
};
var KG30=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];
var PAIR_NOW={ // 国際小包 航空便
 z1:[2050,2750,3450,4150,4850,5550,6250,6950,7650,8350,8850,9350,9850,10350,10850,11350,11850,12350,12850,13350,13850,14350,14850,15350,15850,16350,16850,17350,17850,18350],
 z2:[2500,3700,4900,6100,7300,8500,9700,10900,12100,13300,13950,14600,15250,15900,16550,17200,17850,18500,19150,19800,20450,21100,21750,22400,23050,23700,24350,25000,25650,26300],
 z3:[3850,6000,8150,10300,12450,14600,16750,18900,21050,23200,24800,26400,28000,29600,31200,32800,34400,36000,37600,39200,40800,42400,44000,45600,47200,48800,50400,52000,53600,55200],
 z4:[4200,6700,9200,11700,14200,16700,19200,21700,24200,26700,28700,30700,32700,34700,36700,38700,40700,42700,44700,46700,48700,50700,52700,54700,56700,58700,60700,62700,64700,66700],
 z5:[4550,7250,9950,12650,15350,18050,20750,23450,26150,28850,30650,32450,34250,36050,37850,39650,41450,43250,45050,46850,48650,50450,52250,54050,55850,57650,59450,61250,63050,64850]
};
var PSUR_NOW={ // 国際小包 船便
 z1:[1800,2200,2600,3000,3400,3800,4200,4600,5000,5400,5800,6200,6600,7000,7400,7800,8200,8600,9000,9400,9800,10200,10600,11000,11400,11800,12200,12600,13000,13400],
 z2:[2100,2600,3100,3600,4100,4600,5100,5600,6100,6600,7000,7400,7800,8200,8600,9000,9400,9800,10200,10600,11000,11400,11800,12200,12600,13000,13400,13800,14200,14600],
 z3:[2500,3100,3700,4300,4900,5500,6100,6700,7300,7900,8300,8700,9100,9500,9900,10300,10700,11100,11500,11900,12300,12700,13100,13500,13900,14300,14700,15100,15500,15900],
 z4:[2600,3300,4000,4700,5400,6100,6800,7500,8200,8900,9500,10100,10700,11300,11900,12500,13100,13700,14300,14900,15500,16100,16700,17300,17900,18500,19100,19700,20300,20900],
 z5:[2700,3400,4100,4800,5500,6200,6900,7600,8300,9000,9600,10200,10800,11400,12000,12600,13200,13800,14400,15000,15600,16200,16800,17400,18000,18600,19200,19800,20400,21000]
};
var G100=[0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1,1.1,1.2,1.3,1.4,1.5,1.6,1.7,1.8,1.9,2];
var SP_NOW={ // 小形包装物 航空便 (sin seguimiento)
 z1:[350,450,550,650,750,850,950,1050,1150,1250,1350,1450,1550,1650,1750,1850,1950,2050,2150,2250],
 z2:[380,500,620,740,860,980,1100,1220,1340,1460,1580,1700,1820,1940,2060,2180,2300,2420,2540,2660],
 z3:[510,690,870,1050,1230,1410,1590,1770,1950,2130,2310,2490,2670,2850,3030,3210,3390,3570,3750,3930],
 z4:[830,1040,1250,1460,1670,1880,2090,2300,2510,2720,2930,3140,3350,3560,3770,3980,4190,4400,4610,4820],
 z5:[550,810,1070,1330,1590,1850,2110,2370,2630,2890,3150,3410,3670,3930,4190,4450,4710,4970,5230,5490]
};
var AP_NOW={ // 国際エアパケット (con seguimiento) = Small Packet + 370
 z1:[720,820,920,1020,1120,1220,1320,1420,1520,1620,1720,1820,1920,2020,2120,2220,2320,2420,2520,2620],
 z2:[750,870,990,1110,1230,1350,1470,1590,1710,1830,1950,2070,2190,2310,2430,2550,2670,2790,2910,3030],
 z3:[880,1060,1240,1420,1600,1780,1960,2140,2320,2500,2680,2860,3040,3220,3400,3580,3760,3940,4120,4300],
 z4:[1200,1410,1620,1830,2040,2250,2460,2670,2880,3090,3300,3510,3720,3930,4140,4350,4560,4770,4980,5190],
 z5:[920,1180,1440,1700,1960,2220,2480,2740,3000,3260,3520,3780,4040,4300,4560,4820,5080,5340,5600,5860]
};

/* ---------- Tablas desde el 01-02-2027 (anunciadas 2026-10-09) ----------
   Fuente: https://www.post.japanpost.jp/service/send/oversea/information/fee_revision_2027/charges.pdf */
var EMS_27={ // EMS pasa a tramos de 1 kg (mínimo 1 kg)
 z1:[2850,4300,5550,6800,8050,9600,10700,11800,12900,14000,15650,16800,17950,19100,20250,21400,22550,23700,24850,26000,27150,28300,29450,30600,31750,32900,34050,35200,36350,37500],
 z2:[3800,5450,6900,8350,9800,11550,12850,14150,15450,16750,18600,19950,21300,22650,24000,25350,26700,28050,29400,30750,32100,33450,34800,36150,37500,38850,40200,41550,42900,44250],
 z3:[5100,7700,10100,12500,14900,17600,20050,22500,24950,27400,30400,32900,35400,37900,40400,42900,45400,47900,50400,52900,55400,57900,60400,62900,65400,67900,70400,72900,75400,77900],
 z4:[7400,10300,13000,15700,18400,21400,24150,26900,29650,32400,35700,38500,41300,44100,46900,49700,52500,55300,58100,60900,63700,66500,69300,72100,74900,77700,80500,83300,86100,88900],
 z5:[5800,9100,12400,15700,19000,22600,25350,28100,30850,33600,36900,39700,42500,45300,48100,50900,53700,56500,59300,62100,64900,67700,70500,73300,76100,78900,81700,84500,87300,90100]
};
var PAIR_27={
 z1:[2570,3870,5000,6120,7250,8640,9630,10620,11610,12600,14090,15120,16160,17190,18230,19260,20300,21330,22370,23400,24440,25470,26510,27540,28580,29610,30650,31680,32720,33750],
 z2:[3420,4910,6210,7520,8820,10400,11570,12740,13910,15080,16740,17960,19170,20390,21600,22820,24030,25250,26460,27680,28890,30110,31320,32540,33750,34970,36180,37400,38610,39830],
 z3:[4590,6930,9090,11250,13410,15840,18050,20250,22460,24660,27360,29610,31860,34110,36360,38610,40860,43110,45360,47610,49860,52110,54360,56610,58860,61110,63360,65610,67860,70110],
 z4:[6660,9270,11700,14130,16560,19260,21740,24210,26690,29160,32130,34650,37170,39690,42210,44730,47250,49770,52290,54810,57330,59850,62370,64890,67410,69930,72450,74970,77490,80010],
 z5:[5220,8190,11160,14130,17100,20340,22820,25290,27770,30240,33210,35730,38250,40770,43290,45810,48330,50850,53370,55890,58410,60930,63450,65970,68490,71010,73530,76050,78570,81090]
};
var PSUR_27={
 z1:[2050,2650,3250,3850,4450,5050,5650,6250,6850,7450,8050,8650,9250,9850,10450,11050,11650,12250,12850,13450,14050,14650,15250,15850,16450,17050,17650,18250,18850,19450],
 z2:[2400,3150,3900,4650,5400,6150,6900,7650,8400,9150,9800,10450,11100,11750,12400,13050,13700,14350,15000,15650,16300,16950,17600,18250,18900,19550,20200,20850,21500,22150],
 z3:[3300,4200,5100,6000,6900,7800,8700,9600,10500,11400,12100,12800,13500,14200,14900,15600,16300,17000,17700,18400,19100,19800,20500,21200,21900,22600,23300,24000,24700,25400],
 z4:[3400,4400,5400,6400,7400,8400,9400,10400,11400,12400,13300,14200,15100,16000,16900,17800,18700,19600,20500,21400,22300,23200,24100,25000,25900,26800,27700,28600,29500,30400],
 z5:[3500,4500,5500,6500,7500,8500,9500,10500,11500,12500,13400,14300,15200,16100,17000,17900,18800,19700,20600,21500,22400,23300,24200,25100,26000,26900,27800,28700,29600,30500]
};
var SP_27={
 z1:[620,770,920,1070,1220,1370,1520,1670,1820,1970,2120,2270,2420,2570,2720,2870,3020,3170,3320,3470],
 z2:[680,830,980,1130,1280,1430,1580,1730,1880,2030,2180,2330,2480,2630,2780,2930,3080,3230,3380,3530],
 z3:[800,990,1180,1370,1560,1750,1940,2130,2320,2510,2700,2890,3080,3270,3460,3650,3840,4030,4220,4410],
 z4:[1290,1550,1810,2070,2330,2590,2850,3110,3370,3630,3890,4150,4410,4670,4930,5190,5450,5710,5970,6230],
 z5:[950,1220,1490,1760,2030,2300,2570,2840,3110,3380,3650,3920,4190,4460,4730,5000,5270,5540,5810,6080]
};
var AP_27={
 z1:[1010,1160,1310,1460,1610,1760,1910,2060,2210,2360,2510,2660,2810,2960,3110,3260,3410,3560,3710,3860],
 z2:[1070,1220,1370,1520,1670,1820,1970,2120,2270,2420,2570,2720,2870,3020,3170,3320,3470,3620,3770,3920],
 z3:[1190,1380,1570,1760,1950,2140,2330,2520,2710,2900,3090,3280,3470,3660,3850,4040,4230,4420,4610,4800],
 z4:[1680,1940,2200,2460,2720,2980,3240,3500,3760,4020,4280,4540,4800,5060,5320,5580,5840,6100,6360,6620],
 z5:[1340,1610,1880,2150,2420,2690,2960,3230,3500,3770,4040,4310,4580,4850,5120,5390,5660,5930,6200,6470]
};

/* ---------- Ayudantes ---------- */
function pair(ws,vals){var o=[];for(var i=0;i<ws.length;i++)o.push([ws[i],vals[i]]);return o;}
function zoned(ws,tbl){var o={};for(var z in tbl)o[z]=pair(ws,tbl[z]);return o;}
var CHANGE='2027-02-01';
function jpPeriods(now,future){return [{until:'2027-01-31',zones:now},{from:CHANGE,zones:future}];}
function jpUnavail(key){return function(d){var a=JP_AVAIL[d];return a?!a[key]:true;};}
function jpMax(def){return function(d){return Math.min(def,JP_MAXKG[d]||def);};}

/* ---------- DHL Express (Japón) — tarifa pública 2026 (clientes sin cuenta) ----------
   Fuente: DHL Express Service & Rate Guide 2026 Japan, 輸出サービス料金表 (免税)
   https://www.dhl.com/discover/content/dam/japan/download-files/service/service_and_rate_guide_jp_ja_2026.pdf
   Zonas: 4 Australia · 5 EE.UU./Canadá/México · 6 Europa · 8 Latinoamérica */
var DHL_JP_ZONE={ES:'6',DE:'6',GB:'6',IT:'6',US:'5',CA:'5',MX:'5',AU:'4',
  AR:'8',CO:'8',CL:'8',PE:'8',VE:'8',EC:'8',UY:'8',PY:'8',BO:'8',DO:'8',GT:'8',CR:'8',PA:'8'};
var DHL_W=[0.5,1,1.5,2,2.5,3,3.5,4,4.5,5,5.5,6,6.5,7,7.5,8,8.5,9,9.5,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];
var DHL_JP={
 '4':[13700,16960,20110,23260,26550,29540,32530,35520,38510,41500,43020,44540,46060,47580,49100,50620,52140,53660,55180,56700,58800,60900,63000,65100,67200,69300,71400,73500,75600,77700,80780,83860,86940,90020,93100,96180,99260,102340,105420,108500],
 '5':[21200,22160,23510,24860,28400,33020,37640,42260,46880,51500,52710,53920,55130,56340,57550,58760,59970,61180,62390,63600,66160,68720,71280,73840,76400,78960,81520,84080,86640,89200,92540,95880,99220,102560,105900,109240,112580,115920,119260,122600],
 '6':[16910,22200,27490,32780,38070,42890,47710,52530,57350,62170,64860,67550,70240,72930,75620,78310,81000,83690,86380,89070,91670,94270,96870,99470,102070,104670,107270,109870,112470,115070,119730,124390,129050,133710,138370,143030,147690,152350,157010,161670],
 '8':[35060,41450,47840,54230,60620,65610,70600,75590,80580,85570,89670,93770,97870,101970,106070,110170,114270,118370,122470,126570,134790,143010,151230,159450,167670,175890,184110,192330,200550,208770,216630,224490,232350,240210,248070,255930,263790,271650,279510,287370]
};
// Por encima de 30 kg: + yen por cada kg adicional (30,1–70 kg) y (70,1–300 kg)
var DHL_JP_OVER={'4':[2460,3660],'5':[4150,4230],'6':[3940,4340],'8':[6030,7770]};

/* ---------- FedEx International Priority (Japón) — tarifa pública 2026 ----------
   Fuente: FedEx Japan export rates 2026 (vigente desde 2026-01-05)
   https://www.fedex.com/content/dam/fedex/international/rates/fedex-rates-exp-en-jp-2026.pdf
   Zonas: D Australia · F EE.UU. (resto)/Canadá/México · G Latinoamérica · H Europa
   (EE.UU. oeste = zona E, algo más barata; usamos F para no subestimar) */
var FX_JP_ZONE={ES:'H',DE:'H',GB:'H',IT:'H',US:'F',CA:'F',MX:'F',AU:'D',
  AR:'G',CO:'G',CL:'G',PE:'G',VE:'G',EC:'G',UY:'G',PY:'G',BO:'G',DO:'G',GT:'G',CR:'G',PA:'G'};
var FX_W=[];for(var w=0.5;w<=20.5001;w+=0.5)FX_W.push(Math.round(w*10)/10);
var FX_JP={
 D:[15110,18460,21810,25160,28510,31800,35090,38380,41670,44960,47080,49200,51320,53440,55560,57680,59800,61920,64040,66160,67450,68740,70030,71320,72610,73900,75190,76480,77770,79060,80350,81640,82930,84220,85510,86800,88090,89380,90670,91960,93250],
 F:[16600,19480,22360,25240,28120,33140,38160,43180,48200,53220,54570,55920,57270,58620,59970,61320,62670,64020,65370,66720,67940,69160,70380,71600,72820,74040,75260,76480,77700,78920,80140,81360,82580,83800,85020,86240,87460,88680,89900,91120,92340],
 G:[19080,25210,31340,37470,43600,49540,55480,61420,67360,73300,74810,76320,77830,79340,80850,82360,83870,85380,86890,88400,89920,91440,92960,94480,96000,97520,99040,100560,102080,103600,105120,106640,108160,109680,111200,112720,114240,115760,117280,118800,120320],
 H:[20390,25290,30190,35090,39990,44990,49990,54990,59990,64990,67250,69510,71770,74030,76290,78550,80810,83070,85330,87590,88860,90130,91400,92670,93940,95210,96480,97750,99020,100290,101560,102830,104100,105370,106640,107910,109180,110450,111720,112350,112350]
};
// Desde 21 kg: yen por kg × peso total (tramos 21–44, 45–70, 71–99, 100–299 kg)
var FX_JP_PERKG={D:[4490,3890,3840,3620],F:[4560,4180,4140,3840],G:[5760,5190,5150,4950],H:[5350,4730,4680,4450]};

/* ---------- Recargo por combustible (cambia cada semana/mes) ----------
   DHL Japón: https://mydhl.express.dhl/jp/ja/ship/surcharges.html
   FedEx Japón: https://www.fedex.com/ja-jp/shipping/rates/monthly-fuel-surcharge.html */
SC.fuel.DHL_JP=[{from:'2026-10-19',pct:49.75},{from:'2026-10-26',pct:49.25},{from:'2026-11-02',pct:49.50,until:'2026-11-08'}];
SC.fuel.FX_JP=[{from:'2026-10-05',pct:46.00},{from:'2026-11-02',pct:51.50,until:'2026-12-06'}];
/* Recargo temporal por demanda (por kg facturado)
   DHL Japón 01-10-2026 a 05-02-2027: https://mydhl.express.dhl/jp/ja/ship/surcharges/demand-surcharge.html
   FedEx Japón desde 19-10-2026: https://www.fedex.com/content/dam/fedex/international/rates/fedex-ds-2026-oct19-638-en-jp.pdf */
SC.demand.DHL_JP=[{from:'2026-10-01',until:'2027-02-05',perKg:{EU:230,AM:270,OC:90},fuelApplies:true}];
SC.demand.FX_JP=[{from:'2026-10-19',perKg:{EU:200,AM:242,OC:77},min:37,fuelApplies:false}];

SC.origins.JP={
 currency:'JPY',
 services:[
  {id:'jp_ems',carrier:'Japan Post',name:'EMS',days:'3–7',split:true,tracked:true,insured:true,
   maxKg:jpMax(30),unavailable:jpUnavail('ems'),zone:function(d){return JP_ZONE[d];},
   periods:[{until:'2027-01-31',zones:zoned(EMS_W,EMS_NOW)},{from:CHANGE,zones:zoned(KG30,EMS_27)}],
   src:'https://www.post.japanpost.jp/send/oversea/charge/list-ems/all_en.html',verified:'2026-10-29',
   note_es:'El más rápido de Japan Post. Seguimiento y seguro incluidos.',note_en:'Fastest Japan Post option. Tracking and insurance included.'},
  {id:'jp_air',carrier:'Japan Post',name:'Paquete aéreo (Airmail parcel)',name_en:'Airmail parcel',days:'6–13',split:true,tracked:true,insured:false,
   maxKg:jpMax(30),unavailable:jpUnavail('pa'),zone:function(d){return JP_ZONE[d];},
   periods:jpPeriods(zoned(KG30,PAIR_NOW),zoned(KG30,PAIR_27)),
   src:'https://www.post.japanpost.jp/send/oversea/charge/list-parcel/zone3_en.html',verified:'2026-10-29',
   note_es:'Paquete por avión con seguimiento. Más barato que EMS en pesos altos.',note_en:'Tracked air parcel. Cheaper than EMS for heavier boxes.'},
  {id:'jp_sal',carrier:'Japan Post',name:'SAL (Economy Air)',days:'—',suspended:true,maxKg:function(){return 30;},
   unavailable:function(){return true;},zone:function(d){return JP_ZONE[d];},periods:[],
   src:'https://www.post.japanpost.jp/service/send/oversea/information/fee_revision_2027/',verified:'2026-10-29',
   note_es:'Suspendido por Japan Post a todos los países desde abril 2020. Sin fecha de vuelta.',note_en:'Suspended by Japan Post to all countries since April 2020. No restart date.'},
  {id:'jp_sur',carrier:'Japan Post',name:'Paquete marítimo (Surface)',name_en:'Surface (sea) parcel',days:'30–90',split:true,tracked:true,insured:false,
   maxKg:jpMax(30),unavailable:jpUnavail('ps'),zone:function(d){return JP_ZONE[d];},
   periods:jpPeriods(zoned(KG30,PSUR_NOW),zoned(KG30,PSUR_27)),
   src:'https://www.post.japanpost.jp/send/oversea/charge/list-parcel/zone3_en.html',verified:'2026-10-29',
   note_es:'El más barato para cajas grandes. Tarda 1 a 3 meses.',note_en:'Cheapest for big boxes. Takes 1–3 months.'},
  {id:'jp_sp',carrier:'Japan Post',name:'Small Packet aéreo',name_en:'Small Packet (air)',days:'6–13',tracked:false,insured:false,
   maxKg:function(){return 2;},unavailable:jpUnavail('la'),zone:function(d){return JP_ZONE[d];},
   periods:jpPeriods(zoned(G100,SP_NOW),zoned(G100,SP_27)),
   src:'https://www.post.japanpost.jp/send/oversea/charge/list-normal/zone3_en.html',verified:'2026-10-29',
   note_es:'Hasta 2 kg. SIN seguimiento (Japan Post eliminó la opción certificada el 31-12-2025).',note_en:'Up to 2 kg. NO tracking (registered option ended 2025-12-31).'},
  {id:'jp_ap',carrier:'Japan Post',name:'Air Packet (con seguimiento)',name_en:'International Air Packet (tracked)',days:'5–21',tracked:true,insured:false,
   maxKg:function(){return 2;},unavailable:jpUnavail('la'),zone:function(d){return JP_ZONE[d];},
   periods:jpPeriods(zoned(G100,AP_NOW),zoned(G100,AP_27)),
   src:'https://www.post.japanpost.jp/service/send/oversea/list/delivery/airpacket_en.html',verified:'2026-10-29',
   note_es:'Hasta 2 kg, con seguimiento, sin seguro. Entrega en buzón. Se compra online (etiqueta impresa).',note_en:'Up to 2 kg, tracked, no insurance. Mailbox delivery. Label must be printed online.'},
  {id:'jp_dhl',carrier:'DHL',name:'DHL Express Worldwide',days:'2–4',tracked:true,insured:false,courier:true,volDiv:5000,
   maxKg:function(){return 300;},pieceKg:70,unavailable:function(){return false;},zone:function(d){return DHL_JP_ZONE[d];},
   periods:[{zones:zoned(DHL_W,DHL_JP)}],over:{at:30,perKg:function(z,w){return w<=70?DHL_JP_OVER[z][0]:DHL_JP_OVER[z][1];},mode:'add'},
   fuel:'DHL_JP',demand:'DHL_JP',publicRate:true,calcUrl:'https://mydhl.express.dhl/jp/ja/home.html',
   src:'https://www.dhl.com/discover/content/dam/japan/download-files/service/service_and_rate_guide_jp_ja_2026.pdf',verified:'2026-10-29',
   note_es:'Tarifa oficial pública (sin cuenta de empresa) + combustible + recargo temporal por demanda. Con reenviadores tipo Tenso/Buyee suele salir mucho más barato.',
   note_en:'Official public rate (no business account) + fuel + temporary demand surcharge. Forwarders like Tenso/Buyee are usually much cheaper.'},
  {id:'jp_fedex',carrier:'FedEx',name:'FedEx International Priority',days:'2–4',tracked:true,insured:false,courier:true,volDiv:5000,
   maxKg:function(){return 300;},pieceKg:68,unavailable:function(){return false;},zone:function(d){return FX_JP_ZONE[d];},
   periods:[{zones:zoned(FX_W,FX_JP)}],perKgFrom:{at:21,tiers:[44,70,99,299],rates:FX_JP_PERKG},
   fuel:'FX_JP',demand:'FX_JP',publicRate:true,calcUrl:'https://www.fedex.com/ja-jp/online/rating.html',
   src:'https://www.fedex.com/content/dam/fedex/international/rates/fedex-rates-exp-en-jp-2026.pdf',verified:'2026-10-29',
   note_es:'Tarifa oficial pública 2026 + combustible + recargo por demanda. Requiere cuenta FedEx (gratis).',
   note_en:'Official 2026 public rate + fuel + demand surcharge. Requires a (free) FedEx account.'},
  {id:'jp_ups',carrier:'UPS',name:'UPS Worldwide Saver',days:'2–4',quoteOnly:true,courier:true,
   maxKg:function(){return 70;},unavailable:function(){return false;},zone:function(){return null;},periods:[],
   calcUrl:'https://www.ups.com/jp/ja/support/shipping-support/shipping-costs-rates',
   src:'https://www.ups.com/jp/ja/support/shipping-support/shipping-costs-rates',verified:'2026-10-29',
   note_es:'UPS Japón no publica tarifas por peso para particulares: cotiza en su web.',note_en:'UPS Japan does not publish weight rates for individuals: get a quote on their site.'}
 ]
};
SC.origins.JP._jp={zone:JP_ZONE,avail:JP_AVAIL,maxkg:JP_MAXKG};
})(window.SC);
