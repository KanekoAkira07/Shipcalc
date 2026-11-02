/* =====================================================================
   ShipCalc · DATOS DE ENVÍO DESDE CHINA (continental)
   Moneda: CNY. Tablas "hasta X kg" (primer tramo cuyo límite >= peso).
   Verificado: 2026-10-29 contra fuentes oficiales (ver "src" de cada servicio).
   China Post solo publica tarifa oficial para el pequeño paquete (小包);
   EMS, paquetes y e邮宝 se cotizan en su calculadora oficial.
   Para actualizar: cambia solo los números; no toques la estructura.
   ===================================================================== */
(function(SC){
'use strict';
function pair(ws,vals){var o=[];for(var i=0;i<ws.length;i++)o.push([ws[i],vals[i]]);return o;}
function zoned(ws,tbl){var o={};for(var z in tbl)o[z]=pair(ws,tbl[z]);return o;}
function steps(a,b,s){var o=[];for(var w=a;w<=b+1e-9;w+=s)o.push(Math.round(w*1000)/1000);return o;}

/* ---------- China Post · pequeño paquete aéreo (国际小包, 航空) ----------
   Tarifa oficial publicada: "国际函件资费表" (China Post, 2019-10-29, sigue publicada como vigente)
   https://www.chinapost.com.cn/cn/report/1910/11959-1.html
   Grupo 2 (Europa, EE.UU., Canadá, Australia…): 30 CNY hasta 100 g + 27 CNY por cada 100 g extra
   Grupo 3 (resto, incluida Latinoamérica y México): 35 CNY + 33 CNY por cada 100 g extra
   Certificado (挂号, con seguimiento): +16 CNY por envío. Máx. 2 kg. */
var CP_GROUP={ES:'g2',DE:'g2',GB:'g2',IT:'g2',US:'g2',CA:'g2',AU:'g2'}; // resto → g3
var CP_SP={g2:[30,27],g3:[35,33]};
function cpTable(first,add){var o=[];for(var g=100;g<=2000;g+=100)o.push([g/1000,first+add*(g/100-1)]);return o;}
var CP_SP_ZONES={g2:cpTable(30,27),g3:cpTable(35,33)};
var CP_SPR_ZONES={g2:cpTable(46,27),g3:cpTable(51,33)}; // +16 CNY certificado

/* ---------- FedEx International Priority (China) — tarifa 2026 en CNY ----------
   Fuente: "中国 出口费率" 2026, provincias fuera de Guangdong y Fujian (vigente desde 2026-01-05)
   https://www.fedex.com/content/dam/fedex/international/rates/fedex-rates-exp-zh-cno-2026.pdf
   (Guangdong/Fujian tienen una hoja propia algo más barata: fedex-rates-exp-zh-cns-2026.pdf)
   Zonas (fedex-rates-zi-zh-cn-2026.pdf): F Europa · 2 EE.UU. (resto)/Canadá/México · E Australia · G Latinoamérica */
var FX_CN_ZONE={ES:'F',DE:'F',GB:'F',IT:'F',US:'2',CA:'2',MX:'2',AU:'E',
  AR:'G',CO:'G',CL:'G',PE:'G',VE:'G',EC:'G',UY:'G',PY:'G',BO:'G',DO:'G',GT:'G',CR:'G',PA:'G'};
var FX_CN_W=steps(0.5,20.5,0.5);
var FX_CN={
 '2':[542,713,884,1055,1226,1408,1590,1772,1954,2136,2318,2500,2682,2864,3046,3228,3410,3592,3774,3956,4102,4248,4394,4540,4686,4832,4978,5124,5270,5416,5562,5708,5854,6000,6146,6292,6438,6584,6730,6876,7022],
 E:[458,614,770,926,1082,1216,1350,1484,1618,1752,1882,2012,2142,2272,2402,2532,2662,2792,2922,3052,3169,3286,3403,3520,3637,3754,3871,3988,4105,4222,4339,4456,4573,4690,4807,4924,5041,5158,5275,5392,5509],
 F:[610,774,938,1102,1266,1444,1622,1800,1978,2156,2320,2484,2648,2812,2976,3140,3304,3468,3632,3796,3926,4056,4186,4316,4446,4576,4706,4836,4966,5096,5226,5356,5486,5616,5746,5876,6006,6136,6266,6396,6526],
 G:[774,974,1174,1374,1574,1790,2006,2222,2438,2654,2857,3060,3263,3466,3669,3872,4075,4278,4481,4684,4880,5076,5272,5468,5664,5860,6056,6252,6448,6644,6840,7036,7232,7428,7624,7820,8016,8212,8408,8604,8800]
};
// Desde 21 kg: CNY por kg × peso total (21–44, 45–70, 71–99, 100–299 kg)
var FX_CN_PERKG={'2':[335,329,325,313],E:[270,268,265,263],F:[324,317,316,307],G:[420,412,409,396]};

/* ---------- SF Express · 国际标快 (International Express Standard) ----------
   Fuente: "2026年中国内地始发 国际标快&国际特惠 公布价格表" (vigente desde 2026-01-03)
   https://www.sf-international.com/cn/sc/support/querySupport/fee_rate
   Zonas: 4 Australia · 6 EE.UU./Canadá · 7 Europa. México y Latinoamérica solo con el producto
   GE+ (sin tabla propia publicada) → se cotiza. Paraguay, Rep. Dominicana y Costa Rica no figuran. */
var SF_ZONE={ES:'7',DE:'7',GB:'7',IT:'7',US:'6',CA:'6',AU:'4'};
var SF_QUOTE={MX:1,AR:1,CO:1,CL:1,PE:1,VE:1,EC:1,UY:1,BO:1,GT:1,PA:1};
var SF_W=steps(0.5,19.5,0.5);
var SF={
 '4':[274,339,404,469,534,599,664,728,793,858,923,988,1053,1118,1183,1247,1312,1377,1442,1507,1572,1637,1701,1767,1832,1897,1962,2027,2092,2157,2223,2288,2354,2420,2486,2552,2618,2684,2750],
 '6':[406,489,569,651,732,815,897,979,1061,1141,1223,1306,1387,1470,1550,1633,1713,1796,1878,1960,2041,2123,2204,2287,2368,2450,2531,2614,2696,2777,2861,2945,3031,3113,3197,3281,3365,3402,3443],
 '7':[420,499,576,652,729,806,882,960,1037,1114,1191,1267,1344,1421,1498,1576,1652,1729,1805,1883,1960,2036,2114,2190,2267,2345,2421,2498,2574,2652,2728,2806,2883,2959,3036,3112,3190,3268,3333]
};
// Desde 20 kg: CNY por kg × peso total (20–44, 45–70, 71–99, 100–299 kg)
var SF_PERKG={'4':[138,138,136,136],'6':[175,175,170,170],'7':[169,169,166,166]};

/* ---------- Recargos variables ----------
   FedEx China (semanal): https://www.fedex.com/zh-cn/shipping/surcharges.html
   SF Express (semanal): https://www.sf-express.com/chn/sc/support-more/international_fuel_surcharge_introduction
   Demanda FedEx China desde 19-10-2026 (CNY/kg): https://www.fedex.com/content/dam/fedex/international/rates/fedex-ds-2026-oct19-638-zh-cn.pdf */
SC.fuel.FX_CN=[{from:'2026-10-19',pct:51.75},{from:'2026-10-26',pct:52.50},{from:'2026-11-02',pct:53.50,until:'2026-11-08'}];
SC.fuel.SF_CN=[{from:'2026-10-12',pct:44.25},{from:'2026-10-26',pct:45.50,until:'2026-11-01'}];
SC.demand.FX_CN=[{from:'2026-10-19',perKg:{EU:12.5,AM:13.9,OC:3.5},min:1.8,fuelApplies:false}];

var CP_QUOTE='https://my.ems.com.cn/pcp-web/f/pcp/indexController/toquoteindex';

SC.origins.CN={
 currency:'CNY',
 services:[
  {id:'cn_sp',carrier:'China Post',name:'Pequeño paquete aéreo (平常小包)',name_en:'Small packet (air)',days:'10–30',tracked:false,insured:false,
   maxKg:function(){return 2;},unavailable:function(){return false;},
   zone:function(d){return CP_GROUP[d]||'g3';},periods:[{zones:CP_SP_ZONES}],
   src:'https://www.chinapost.com.cn/cn/report/1910/11959-1.html',verified:'2026-10-29',
   note_es:'Tarifa oficial publicada por China Post. Hasta 2 kg, sin seguimiento. En mostrador pueden aplicarse precios distintos; confirma que el país acepta envíos ahora mismo.',
   note_en:'Official published China Post rate. Up to 2 kg, untracked. Counter prices may differ; check the country is currently accepting mail.'},
  {id:'cn_spr',carrier:'China Post',name:'Pequeño paquete certificado (挂号小包)',name_en:'Registered small packet',days:'10–30',tracked:true,insured:false,
   maxKg:function(){return 2;},unavailable:function(){return false;},
   zone:function(d){return CP_GROUP[d]||'g3';},periods:[{zones:CP_SPR_ZONES}],
   src:'https://www.chinapost.com.cn/cn/report/1910/11959-1.html',verified:'2026-10-29',
   note_es:'Igual que el anterior + 16 CNY de certificado (con seguimiento).',note_en:'Same as above + 16 CNY registration (tracked).'},
  {id:'cn_ems',carrier:'China Post',name:'EMS internacional',name_en:'International EMS',days:'5–15',quoteOnly:true,
   maxKg:function(d){return d==='AU'?20:30;},unavailable:function(){return false;},zone:function(){return null;},periods:[],
   calcUrl:CP_QUOTE,src:'https://my.ems.com.cn/pcp-web/intl/shipping/product/product_1.html',verified:'2026-10-29',
   note_es:'China Post no publica tabla de EMS: el precio sale en su calculadora oficial (elige provincia de origen). Sin recargo de combustible. Volumétrico /6000 si un lado pasa de 40 cm.',
   note_en:'China Post publishes no EMS table: price comes from its official calculator (choose origin province). No fuel surcharge. Volumetric /6000 if any side exceeds 40 cm.'},
  {id:'cn_parcel',carrier:'China Post',name:'Paquete postal (航空 / SAL / marítimo)',name_en:'Postal parcel (air / SAL / surface)',days:'10–60',quoteOnly:true,
   maxKg:function(){return 30;},unavailable:function(){return false;},zone:function(){return null;},periods:[],
   calcUrl:CP_QUOTE,src:'https://my.ems.com.cn/pcp-web/intl/shipping/product/product_3.html',verified:'2026-10-29',
   note_es:'Con seguimiento. Tarifa solo en la calculadora oficial de China Post; el peso máximo cambia por país.',
   note_en:'Tracked. Rate only in China Post\'s official calculator; max weight varies by country.'},
  {id:'cn_epacket',carrier:'China Post',name:'e邮宝 (ePacket)',days:'7–20',quoteOnly:true,
   maxKg:function(){return 2;},unavailable:function(){return false;},zone:function(){return null;},periods:[],
   calcUrl:CP_QUOTE,src:'https://my.ems.com.cn/pcp-web/intl/shipping/product/product_4.html',verified:'2026-10-29',
   note_es:'Para vendedores online con cuenta de China Post. Tarifa en la calculadora oficial.',note_en:'For online sellers with a China Post account. Rate in the official calculator.'},
  {id:'cn_sf',carrier:'SF Express',name:'SF 国际标快 (Express Standard)',name_en:'SF International Express Standard',days:'3–6',tracked:true,insured:false,courier:true,volDiv:5000,
   maxKg:function(){return 300;},
   unavailable:function(d){return !SF_ZONE[d]&&!SF_QUOTE[d];},
   unavail_es:'SF no incluye este país en su lista de destinos publicada.',unavail_en:'SF does not list this country among its published destinations.',
   quoteFor:function(d){return !!SF_QUOTE[d];},
   zone:function(d){return SF_ZONE[d];},periods:[{zones:zoned(SF_W,SF)}],perKgFrom:{at:20,tiers:[44,70,99,299],rates:SF_PERKG},
   fuel:'SF_CN',publicRate:true,calcUrl:'https://www.sf-international.com/cn/sc/support/querySupport/freight_aging',
   src:'https://www.sf-international.com/cn/sc/support/querySupport/fee_rate',verified:'2026-10-29',
   note_es:'Tarifa pública oficial 2026 + combustible. Particulares pueden enviar con pago en origen.',
   note_en:'Official 2026 public rate + fuel. Individuals can ship prepaid.'},
  {id:'cn_fedex',carrier:'FedEx',name:'FedEx International Priority',days:'2–5',tracked:true,insured:false,courier:true,volDiv:5000,
   maxKg:function(){return 300;},pieceKg:68,unavailable:function(){return false;},zone:function(d){return FX_CN_ZONE[d];},
   periods:[{zones:zoned(FX_CN_W,FX_CN)}],perKgFrom:{at:21,tiers:[44,70,99,299],rates:FX_CN_PERKG},
   fuel:'FX_CN',demand:'FX_CN',publicRate:true,calcUrl:'https://www.fedex.com/zh-cn/online/rating.html',
   src:'https://www.fedex.com/content/dam/fedex/international/rates/fedex-rates-exp-zh-cno-2026.pdf',verified:'2026-10-29',
   note_es:'Tarifa oficial 2026 (provincias fuera de Guangdong/Fujian; allí es algo más barata) + combustible + recargo por demanda.',
   note_en:'Official 2026 rate (provinces outside Guangdong/Fujian; slightly cheaper there) + fuel + demand surcharge.'},
  {id:'cn_dhl',carrier:'DHL',name:'DHL Express Worldwide',days:'2–4',quoteOnly:true,courier:true,
   maxKg:function(){return 300;},unavailable:function(){return false;},zone:function(){return null;},periods:[],
   calcUrl:'https://www.dhl.com/cn-zh/home/get-a-quote.html',src:'https://www.dhl.com/cn-zh/home/get-a-quote.html',verified:'2026-10-29',
   note_es:'DHL China no publica tarifas por peso: cotiza en su web.',note_en:'DHL China does not publish weight rates: get a quote on its site.'},
  {id:'cn_ups',carrier:'UPS',name:'UPS Worldwide Saver',days:'2–4',quoteOnly:true,courier:true,
   maxKg:function(){return 70;},unavailable:function(){return false;},zone:function(){return null;},periods:[],
   calcUrl:'https://www.ups.com/cn/zh/help-center/sri/time-cost.page',src:'https://www.ups.com/cn/zh/help-center/sri/time-cost.page',verified:'2026-10-29',
   note_es:'UPS China no publica la tabla completa: cotiza en su calculadora.',note_en:'UPS China does not publish its full table: get a quote in its calculator.'}
 ]
};
})(window.SC);
