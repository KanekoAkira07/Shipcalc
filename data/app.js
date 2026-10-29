/* =====================================================================
   ShipCalc · INTERFAZ (textos, eventos y pintado de resultados)
   Depende de: japon.js, corea.js, china.js, destinos.js, motor.js
   ===================================================================== */
(function(SC){
'use strict';
var VERIFIED='2026-10-29';
var JP_CHANGE='2027-02-01';

/* Tipos de cambio de respaldo (1 USD = X), ExchangeRate-API, 29-10-2026.
   Solo se usan si falla la consulta en vivo. */
var FALLBACK_USD={USD:1,JPY:157.91,KRW:1340.24,CNY:6.68,EUR:0.897,GBP:0.752,CAD:1.40,AUD:1.42,MXN:18.65,ARS:1538.47,COP:3146.9,CLP:984.88,PEN:3.45,UYU:40.18,PYG:5808.85,BOB:12,DOP:60.82,GTQ:7.64,CRC:454.55};

var T={
es:{
 title:'¿Cuánto te cuesta realmente enviar o importar desde Japón, Corea o China?',
 subtitle:'Tarifas oficiales de envío + aduana + impuestos + comisión de reventa, en tu moneda. Desde 1 gramo hasta 100 kg.',
 chip1:'Japan Post · Korea Post · China Post',chip2:'DHL · FedEx · SF Express',chip3:'21 países de destino',
 'qc-label':'Conversor rápido',
 step1:'País de origen','o-JP':'Japón','o-KR':'Corea del Sur','o-CN':'China',
 'o-JP-sub':'Coleccionismo · Retro · Anime','o-KR-sub':'K-pop · Skincare · Moda','o-CN-sub':'Electrónica · Accesorios',
 step2:'Producto y destino','weight-label':'Peso del paquete','weight-hint':'De 1 g a 100 kg (con embalaje).',
 'dest-label':'País de destino','cat-label':'Tipo de producto',
 'adv-open':'+ Opciones avanzadas (medidas de la caja y fecha de envío)','adv-close':'− Ocultar opciones avanzadas',
 'vol-note':'Los couriers (y algunos servicios postales) cobran por peso volumétrico si es mayor que el real. Mete las medidas de la caja en cm.',
 'vol-l':'Largo (cm)','vol-w':'Ancho (cm)','vol-h':'Alto (cm)',
 'date-label':'Fecha de envío','date-hint':'Los recargos de combustible cambian cada semana o mes y Japan Post sube tarifas el 1-2-2027: la fecha decide qué tarifa se aplica.',
 step3:'Servicio de envío','ship-hint':'Precios oficiales del operador para la fecha elegida. Toca un servicio para seleccionarlo.',
 step4:'Rentabilidad de reventa',optional:'Opcional','platform-label':'Plataforma de venta',
 'calc-btn':'Calcular coste real →',history:'Cálculos recientes','history-clear':'Borrar',
 breakdown:'Desglose completo',live:'Cambio en vivo',liveoff:'Cambio aproximado',
 'empty-msg':'Rellena el formulario y pulsa calcular para ver el desglose completo.',
 compare:'Todos los servicios disponibles (coste total)',
 'travel-title':'Útil para tu viaje',
 'aff-holafly':'Internet en Japón, Corea y más sin roaming. Usa el código <strong>JAPANGEMU</strong> para tener descuento.',
 'aff-saily':'eSIM de Saily (Nord Security). Código <strong>JAPANGEMU</strong> con descuento. Funciona en más de 150 países.',
 'aff-btn':'Ver eSIM →',
 'seo-title':'Cómo funciona ShipCalc',
 'seo-p1':'ShipCalc calcula cuánto cuesta de verdad enviar o importar un producto desde Japón, Corea del Sur o China a España, México, Argentina, Colombia, Chile, Perú y otros 15 países. Mete el precio en la moneda de origen, el peso y el destino: verás el envío de cada servicio, la aduana, el IVA y, si vas a revender, tu margen después de comisiones.',
 'seo-h-ship':'Servicios de envío incluidos',
 'seo-jp':'Japón: Japan Post EMS, paquete aéreo, marítimo, Small Packet y Air Packet (con la subida del 1-2-2027 ya cargada), DHL Express y FedEx.',
 'seo-kr':'Corea: Korea Post EMS, EMS Premium, K-Packet, paquete aéreo y marítimo, pequeño paquete, DHL Express y FedEx.',
 'seo-cn':'China: China Post pequeño paquete (normal y certificado), SF Express y FedEx; EMS, paquetes y e邮宝 con enlace a la calculadora oficial.',
 'seo-h-tax':'Aduana e impuestos',
 'seo-p2':'Cada país tiene sus reglas: IVA desde el primer euro en la UE, el nuevo arancel de 3 € por envío pequeño desde julio de 2026, la tasa global del 33,5 % de México para mensajería, la franquicia de 400 USD de Argentina, el régimen 4x4 de Ecuador, etc. Cuando un país no publica reglas claras, el resultado se marca como ESTIMADO.',
 'seo-h-upd':'Datos actualizados',
 'seo-p3':'Tarifas verificadas el 29-10-2026 en las webs oficiales de cada operador y aduana. El tipo de cambio se actualiza en vivo. Los recargos de combustible y por demanda se aplican según la fecha de envío.',
 footer:'ShipCalc · Tarifas oficiales verificadas el 29-10-2026. Los impuestos son orientativos: confirma siempre con la aduana o el operador antes de enviar.',
 privacy:'Privacidad: tus cálculos se guardan solo en tu navegador. Los formularios se envían a ShipCalc únicamente para responderte.',
 'send-title':'Te enviamos el paquete','send-sub':'Recogemos tu paquete, revisamos el contenido contigo y gestionamos todo el envío internacional.',
 'sf-name':'Nombre completo *','sf-email':'Email *','sf-dest':'País de destino *','sf-city':'Ciudad donde estás (Japón)',
 'sf-weight':'Peso estimado (kg)','sf-date':'Fecha aproximada de envío','sf-notes':'Qué contiene (lo pide la aduana)',
 'sf-notice':'<strong>Importante:</strong> el contenido se revisa en persona contigo antes de enviarlo. No aceptamos artículos prohibidos, réplicas, baterías de litio sueltas ni mercancía sin declarar.',
 'sf-rates':'<strong style="display:block;margin-bottom:4px">Tarifa de gestión (se suma al envío):</strong>0,5–2 kg: 1.500 JPY · 2–5 kg: 2.500 JPY · 5–10 kg: 3.500 JPY · 10–20 kg: 5.000 JPY',
 'sf-submit':'Solicitar servicio de envío','form-privacy':'Usaremos tus datos solo para responder a esta solicitud.',
 'send-ok':'¡Solicitud recibida!','send-ok-sub':'Te escribiremos por email en menos de 24 horas para confirmar los detalles.',
 'pro-sub':'Para revendedores y compradores frecuentes que calculan muchos productos.',
 'pro-f1':'Modo lote: sube un Excel con hasta 50 productos','pro-f2':'Exporta a PDF o Excel','pro-f3':'Perfiles de destino guardados','pro-f4':'Acceso anticipado a novedades',
 'pro-mo':'/mes','pro-price-sub':'Precio previsto. Aún no se cobra nada.',
 'pro-email-label':'Tu email: te avisamos cuando esté listo','pro-submit':'Apuntarme a la lista (gratis)',
 'pro-ok':'¡Estás en la lista de PRO!','pro-ok-sub':'Te avisaremos en cuanto se lance.',
 'ssb-eyebrow':'Servicio de envío ShipCalc','ssb-title':'Te enviamos el paquete',
 'ssb-body':'¿De viaje por Japón, Corea o China? Recogemos tu paquete, revisamos el contenido contigo y gestionamos todo el envío internacional. Tú sigues disfrutando del viaje.',
 'ssb-btn':'Solicitar envío'
},
en:{
 title:'How much does it really cost to ship or import from Japan, Korea or China?',
 subtitle:'Official shipping rates + customs + taxes + resale fees, in your currency. From 1 gram up to 100 kg.',
 chip1:'Japan Post · Korea Post · China Post',chip2:'DHL · FedEx · SF Express',chip3:'21 destination countries',
 'qc-label':'Quick convert',
 step1:'Origin country','o-JP':'Japan','o-KR':'South Korea','o-CN':'China',
 'o-JP-sub':'Collectibles · Retro · Anime','o-KR-sub':'K-pop · Skincare · Fashion','o-CN-sub':'Electronics · Accessories',
 step2:'Product & destination','weight-label':'Package weight','weight-hint':'From 1 g to 100 kg (including packaging).',
 'dest-label':'Destination country','cat-label':'Product type',
 'adv-open':'+ Advanced options (box size and shipping date)','adv-close':'− Hide advanced options',
 'vol-note':'Couriers (and some postal services) charge volumetric weight when it is higher than the actual weight. Enter the box size in cm.',
 'vol-l':'Length (cm)','vol-w':'Width (cm)','vol-h':'Height (cm)',
 'date-label':'Shipping date','date-hint':'Fuel surcharges change weekly or monthly and Japan Post raises rates on 2027-02-01: the date decides which rate applies.',
 step3:'Shipping service','ship-hint':'Official carrier prices for the chosen date. Tap a service to select it.',
 step4:'Resale profit',optional:'Optional','platform-label':'Sales platform',
 'calc-btn':'Calculate real cost →',history:'Recent calculations','history-clear':'Clear',
 breakdown:'Full breakdown',live:'Live rate',liveoff:'Approx. rate',
 'empty-msg':'Fill in the form and press calculate to see the full breakdown.',
 compare:'All available services (total cost)',
 'travel-title':'Useful for your trip',
 'aff-holafly':'Internet in Japan, Korea and more without roaming. Use code <strong>JAPANGEMU</strong> for a discount.',
 'aff-saily':'Saily eSIM (Nord Security). Code <strong>JAPANGEMU</strong> for a discount. Works in 150+ countries.',
 'aff-btn':'Get eSIM →',
 'seo-title':'How ShipCalc works',
 'seo-p1':'ShipCalc calculates the real cost of shipping or importing a product from Japan, South Korea or China to Spain, Mexico, Argentina, Colombia, Chile, Peru and 15 more countries. Enter the price in the origin currency, the weight and the destination: you get every service\'s shipping cost, customs, VAT and, if you resell, your margin after fees.',
 'seo-h-ship':'Shipping services included',
 'seo-jp':'Japan: Japan Post EMS, air parcel, surface, Small Packet and Air Packet (2027-02-01 increase already loaded), DHL Express and FedEx.',
 'seo-kr':'Korea: Korea Post EMS, EMS Premium, K-Packet, air and surface parcel, small packet, DHL Express and FedEx.',
 'seo-cn':'China: China Post small packet (standard and registered), SF Express and FedEx; EMS, parcels and e-Packet link to the official calculator.',
 'seo-h-tax':'Customs and taxes',
 'seo-p2':'Every country has its own rules: VAT from the first euro in the EU, the new €3 duty per small parcel from July 2026, Mexico\'s 33.5% courier flat rate, Argentina\'s USD 400 allowance, Ecuador\'s 4x4 regime, etc. When a country publishes no clear rules, the result is marked ESTIMATE.',
 'seo-h-upd':'Up-to-date data',
 'seo-p3':'Rates verified on 2026-10-29 on each carrier\'s and customs authority\'s official site. Exchange rates update live. Fuel and demand surcharges follow the shipping date.',
 footer:'ShipCalc · Official rates verified on 2026-10-29. Taxes are indicative: always confirm with customs or the carrier before shipping.',
 privacy:'Privacy: your calculations are stored only in your browser. Forms are sent to ShipCalc only so we can reply to you.',
 'send-title':'We ship it for you','send-sub':'We pick up your package, check the contents with you and handle the whole international shipment.',
 'sf-name':'Full name *','sf-email':'Email *','sf-dest':'Destination country *','sf-city':'City where you are (Japan)',
 'sf-weight':'Estimated weight (kg)','sf-date':'Approximate shipping date','sf-notes':'Contents (required by customs)',
 'sf-notice':'<strong>Important:</strong> contents are checked in person with you before shipping. We do not accept prohibited items, replicas, loose lithium batteries or undeclared goods.',
 'sf-rates':'<strong style="display:block;margin-bottom:4px">Handling fee (added to shipping):</strong>0.5–2 kg: 1,500 JPY · 2–5 kg: 2,500 JPY · 5–10 kg: 3,500 JPY · 10–20 kg: 5,000 JPY',
 'sf-submit':'Request shipping service','form-privacy':'We will only use your data to reply to this request.',
 'send-ok':'Request received!','send-ok-sub':'We will email you within 24 hours to confirm the details.',
 'pro-sub':'For resellers and frequent buyers who calculate many products.',
 'pro-f1':'Batch mode: upload an Excel with up to 50 products','pro-f2':'Export to PDF or Excel','pro-f3':'Saved destination profiles','pro-f4':'Early access to new features',
 'pro-mo':'/mo','pro-price-sub':'Planned price. Nothing is charged yet.',
 'pro-email-label':'Your email: we will tell you when it is ready','pro-submit':'Join the waitlist (free)',
 'pro-ok':'You are on the PRO waitlist!','pro-ok-sub':'We will let you know as soon as it launches.',
 'ssb-eyebrow':'ShipCalc delivery service','ssb-title':'We ship it for you',
 'ssb-body':'Travelling in Japan, Korea or China? We pick up your package, check the contents with you and handle the whole international shipment. You keep enjoying your trip.',
 'ssb-btn':'Request shipping'
}};

/* Textos dinámicos */
var D_TXT={
es:{price:{JP:'Precio de compra (yenes, JPY)',KR:'Precio de compra (wones, KRW)',CN:'Precio de compra (yuanes, CNY)'},
 sell:'Precio de venta estimado',
 st_unav:'No disponible',st_susp:'Suspendido',st_quote:'Cotizar',st_over:'Máx.',
 b_off:'Oficial',b_pub:'Tarifa pública',b_est:'Estimado',b_q:'Sin tabla pública',
 tracked:'con seguimiento',untracked:'sin seguimiento',insured:'con seguro',days:'días',
 src:'Fuente',calc:'Calculadora oficial ↗',quoteLink:'Cotiza en la web oficial ↗',
 unav_def:'El operador no ofrece este servicio a este país ahora mismo.',
 err_price:'Introduce un precio de compra válido (mayor que 0).',err_w:'Introduce un peso entre 1 g y 100 kg.',err_svc:'Elige un servicio de envío disponible.',err_rates:'No se pudo cargar el tipo de cambio. Inténtalo de nuevo en unos segundos.',
 r_purchase:'Precio de compra',r_ship:'Envío',r_base:'Tarifa base',r_fuel:'Recargo combustible',r_demand:'Recargo por demanda (temporal)',r_pk:'paquetes',
 r_customs:'Aduana e impuestos',r_notax:'Sin impuestos de importación',r_pfee:'Comisión',r_total:'Coste total real',
 r_profit:'Ganancia estimada',r_loss:'Pérdida estimada',r_even:'Sin margen',r_margin:'de margen',r_sug:'Para ganar un 20 % vende a',
 conf_off:'Reglas oficiales',conf_est:'ESTIMADO',notes:'A tener en cuenta',sources:'Fuentes',verified:'Tarifas de envío verificadas el 29-10-2026.',
 fx:'Tipo de cambio',fxlive:'ExchangeRate-API, en vivo',fxold:'aproximado del 29-10-2026 (sin conexión al servicio de cambio)',
 al_jp:'Japan Post sube sus tarifas el 1 de febrero de 2027. Para ver el precio nuevo, elige una fecha de envío posterior en «Opciones avanzadas».',
 al_jp27:'Mostrando las tarifas de Japan Post vigentes desde el 1-2-2027.',
 al_us:'EE.UU. cobra aranceles a todos los envíos (sin exención). Por correo, el remitente los paga por adelantado.',
 al_est:'Los impuestos de este país son una ESTIMACIÓN: no hay reglas oficiales claras y actualizadas. Confírmalos con la aduana o tu courier.',
 al_fx:'Sin conexión al tipo de cambio en vivo: usamos valores aproximados del 29-10-2026.',
 al_past:'La fecha de envío es anterior a hoy: se usará la tarifa vigente en esa fecha si la tenemos.',
 maps:'cerca de ti',share:'Compartir resultado',copy:'Copiar resumen',copied:'Copiado',img:'Descargar imagen',email:'Recibir por email',send:'Enviar',
 emailok:'✓ Enviado a tu correo',emailerr:'No se pudo enviar el email. Inténtalo de nuevo.',emailbad:'Introduce un email válido.',
 formerr:'No se pudo enviar el formulario. Revisa tu conexión e inténtalo de nuevo.',formreq:'Rellena los campos obligatorios (*).',
 hist_del:'Borrar',best:'MEJOR',noship:'Sin servicios con precio para estos datos.',
 split:'Ojo',perpkg:'por paquete',vol:'Peso de cobro',
 extraUS:'',days_unit:''},
en:{price:{JP:'Purchase price (yen, JPY)',KR:'Purchase price (won, KRW)',CN:'Purchase price (yuan, CNY)'},
 sell:'Estimated sale price',
 st_unav:'Not available',st_susp:'Suspended',st_quote:'Get quote',st_over:'Max',
 b_off:'Official',b_pub:'Public rate',b_est:'Estimate',b_q:'No public table',
 tracked:'tracked',untracked:'untracked',insured:'insured',days:'days',
 src:'Source',calc:'Official calculator ↗',quoteLink:'Get a quote on the official site ↗',
 unav_def:'The carrier does not offer this service to this country right now.',
 err_price:'Enter a valid purchase price (greater than 0).',err_w:'Enter a weight between 1 g and 100 kg.',err_svc:'Choose an available shipping service.',err_rates:'Exchange rates could not be loaded. Please try again in a few seconds.',
 r_purchase:'Purchase price',r_ship:'Shipping',r_base:'Base rate',r_fuel:'Fuel surcharge',r_demand:'Demand surcharge (temporary)',r_pk:'parcels',
 r_customs:'Customs & taxes',r_notax:'No import taxes',r_pfee:'Fee',r_total:'Total real cost',
 r_profit:'Estimated profit',r_loss:'Estimated loss',r_even:'Break even',r_margin:'margin',r_sug:'For a 20% margin sell at',
 conf_off:'Official rules',conf_est:'ESTIMATE',notes:'Good to know',sources:'Sources',verified:'Shipping rates verified on 2026-10-29.',
 fx:'Exchange rate',fxlive:'ExchangeRate-API, live',fxold:'approximate, 2026-10-29 (exchange service unreachable)',
 al_jp:'Japan Post raises its rates on 1 February 2027. To see the new price, pick a later shipping date under "Advanced options".',
 al_jp27:'Showing Japan Post rates in force from 2027-02-01.',
 al_us:'The US charges duty on every parcel (no exemption). By post, the sender prepays it.',
 al_est:'Taxes for this country are an ESTIMATE: there are no clear, up-to-date official rules. Confirm with customs or your courier.',
 al_fx:'Live exchange rates unavailable: using approximate values from 2026-10-29.',
 al_past:'The shipping date is in the past: the rate in force on that date is used if we have it.',
 maps:'near you',share:'Share result',copy:'Copy summary',copied:'Copied',img:'Download image',email:'Send to my email',send:'Send',
 emailok:'✓ Sent to your email',emailerr:'The email could not be sent. Please try again.',emailbad:'Enter a valid email.',
 formerr:'The form could not be sent. Check your connection and try again.',formreq:'Fill in the required fields (*).',
 hist_del:'Clear',best:'BEST',noship:'No priced services for these inputs.',
 split:'Note',perpkg:'per parcel',vol:'Chargeable weight',
 extraUS:'',days_unit:''}};

var CUR_DEC={JPY:0,KRW:0,CLP:0,COP:0,PYG:0,CRC:0,ARS:0,UYU:0};
var MAPQ={'Japan Post':'郵便局','Korea Post':'우체국','China Post':'中国邮政 邮局','DHL':'DHL Express Service Point','FedEx':'FedEx','UPS':'UPS Access Point','SF Express':'顺丰速运'};
var ORIGIN_CUR={JP:'JPY',KR:'KRW',CN:'CNY'};

var st={lang:'es',origin:'JP',sel:null,rates:null,ratesBase:null,ratesLive:false,ratesDate:null,lastQuotes:[],last:null};
var hist=[];
try{hist=JSON.parse(localStorage.getItem('sc_hist_v2')||'[]')||[];}catch(e){hist=[];}

function $(id){return document.getElementById(id);}
function t(k){return (T[st.lang]&&T[st.lang][k])||T.es[k]||k;}
function d(k){return (D_TXT[st.lang]&&D_TXT[st.lang][k])!=null?D_TXT[st.lang][k]:D_TXT.es[k];}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function tx(o){return o?(st.lang==='es'?o.es:o.en):'';}
function nm(svc){return (st.lang==='en'&&svc.name_en)?svc.name_en:svc.name;}
function fmtNum(n,dec){
  var neg=n<0;n=Math.abs(n);
  var s=n.toFixed(dec),parts=s.split('.'),ip=parts[0],th=st.lang==='es'?'.':',',dp=st.lang==='es'?',':'.';
  ip=ip.replace(/\B(?=(\d{3})+(?!\d))/g,th);
  return (neg?'-':'')+ip+(parts[1]?dp+parts[1]:'');
}
function fmt(n,cur){
  if(n==null||!isFinite(n))return '—';
  return fmtNum(Number(n),(CUR_DEC[cur]===0)?0:2);
}
function kgs(x){var v=Math.round(x*1000)/1000;return st.lang==='es'?String(v).replace('.',','):String(v);}
function loc(str){return st.lang==='es'?String(str).replace(/(\d)\.(\d+)\s?%/g,'$1,$2 %'):str;}
var SYM={EUR:'€',USD:'US$',GBP:'£',CAD:'CA$',AUD:'A$',MXN:'MX$',ARS:'AR$',COP:'COL$',CLP:'CLP$',PEN:'S/ ',UYU:'$U ',PYG:'₲ ',BOB:'Bs ',DOP:'RD$',GTQ:'Q ',CRC:'₡',JPY:'¥',KRW:'₩',CNY:'CN¥'};
function money(n,cur){return (SYM[cur]||cur+' ')+fmt(n,cur);}

/* Números: acepta 5000 / 5.000 / 5,000 / 1,5 / 1.5
   mode: 'int' (sin decimales: JPY, KRW, gramos) · 'dec' (coma o punto = decimal: kg) · otro = dinero */
function parseNum(s,mode){
  s=String(s||'').trim().replace(/\s/g,'').replace(/[^\d.,]/g,'');
  if(!s)return NaN;
  if(mode===true||mode==='int')return parseFloat(s.replace(/[.,]/g,''));
  if(mode==='dec'&&(s.split(',').length+s.split('.').length)===3)return parseFloat(s.replace(',','.'));
  var hasC=s.indexOf(',')>=0,hasD=s.indexOf('.')>=0;
  if(hasC&&hasD){var dec=s.lastIndexOf(',')>s.lastIndexOf('.')?',':'.';s=s.split(dec==='.'?',':'.').join('');s=s.replace(dec,'.');}
  else if(hasC){var p=s.split(',');s=(p.length>2)?p.join(''):(p[1].length===3&&p[0].length<=3&&p[0]!=='0'?p.join(''):p.join('.'));}
  else if(hasD){var q=s.split('.');if(q.length>2)s=q.join('');}
  return parseFloat(s);
}

/* ---------- Textos estáticos ---------- */
function applyTexts(){
  document.documentElement.lang=st.lang;
  document.querySelectorAll('[data-i]').forEach(function(el){
    var k=el.getAttribute('data-i');
    if(el.getAttribute('data-html'))el.innerHTML=t(k);else el.textContent=t(k);
  });
  document.querySelectorAll('.lang-btn').forEach(function(b){b.classList.toggle('active',b.getAttribute('data-lang')===st.lang);});
  $('price-label').textContent=d('price')[st.origin];
  $('adv-toggle').textContent=$('adv').classList.contains('open')?t('adv-close'):t('adv-open');
  $('year').textContent=new Date().getFullYear();
  buildDestSelect();buildCatSelect();renderPlatforms();updateSellLabel();
}
function setLang(l){st.lang=l;try{localStorage.setItem('sc_lang',l);}catch(e){}applyTexts();refresh();renderHistory();if(st.last)calculate(true);}
window.setLang=setLang;

function buildDestSelect(){
  var sel=$('dest'),cur=sel.value||null;sel.innerHTML='';
  for(var g in SC.DEST_ORDER){
    var og=document.createElement('optgroup');og.label=g.split(' / ')[st.lang==='es'?0:1];
    SC.DEST_ORDER[g].forEach(function(code){var D=SC.dest[code];var o=document.createElement('option');o.value=code;o.textContent=D.flag+' '+(st.lang==='es'?D.name_es:D.name_en);og.appendChild(o);});
    sel.appendChild(og);
  }
  sel.value=cur||guessDest();
}
function guessDest(){
  var saved=null;try{saved=localStorage.getItem('sc_dest');}catch(e){}
  if(saved&&SC.dest[saved])return saved;
  var langs=(navigator.languages||[navigator.language||'']);
  for(var i=0;i<langs.length;i++){var m=/^[a-z]{2}-([A-Z]{2})/.exec(langs[i]||'');if(m&&SC.dest[m[1]])return m[1];}
  return 'ES';
}
function buildCatSelect(){
  var sel=$('cat'),cur=sel.value||'figures';sel.innerHTML='';
  SC.CATS.forEach(function(c){var o=document.createElement('option');o.value=c.id;o.textContent=tx(c);sel.appendChild(o);});
  sel.value=cur;
}
function renderPlatforms(){
  var D=SC.dest[$('dest').value];if(!D)return;
  var sel=$('platform'),cur=sel.value;sel.innerHTML='';
  D.platforms.forEach(function(p){var o=document.createElement('option');o.value=p.id;o.textContent=p.name+(p.fee>0?' ('+(Math.round(p.fee*1000)/10)+'%'+(p.fixed?' + '+fmt(p.fixed,D.cur):'')+')':' (0%)');sel.appendChild(o);});
  if(cur&&D.platforms.some(function(p){return p.id===cur;}))sel.value=cur;
  updatePlatformNote();
}
function curPlatform(){var D=SC.dest[$('dest').value];var id=$('platform').value;for(var i=0;i<D.platforms.length;i++)if(D.platforms[i].id===id)return D.platforms[i];return null;}
function updatePlatformNote(){var p=curPlatform();$('platform-note').textContent=p?((st.lang==='es'?p.note_es:p.note_en)+(p.v?'':' · '+(st.lang==='es'?'orientativo':'indicative'))):'';}
function updateSellLabel(){var D=SC.dest[$('dest').value];if(!D)return;$('sell-label').textContent=d('sell')+' ('+D.cur+')';}

/* ---------- Tipos de cambio ---------- */
function fallbackRates(base){var b=FALLBACK_USD[base],r={};for(var k in FALLBACK_USD)r[k]=FALLBACK_USD[k]/b;return r;}
function fetchRates(base,cb){
  var key='sc_fx_'+base,cached=null;
  try{cached=JSON.parse(localStorage.getItem(key)||'null');}catch(e){}
  if(cached&&cached.rates&&(Date.now()-cached.ts)<6*3600*1000){setRates(base,cached.rates,true,cached.date);cb&&cb();return;}
  var done=false;
  var to=setTimeout(function(){if(!done){done=true;setRates(base,(cached&&cached.rates)||fallbackRates(base),!!cached,cached&&cached.date);cb&&cb();}},6000);
  fetch('https://api.exchangerate-api.com/v4/latest/'+base).then(function(r){if(!r.ok)throw new Error('http');return r.json();}).then(function(j){
    if(done)return;done=true;clearTimeout(to);
    if(!j||!j.rates||!j.rates.USD)throw new Error('bad');
    try{localStorage.setItem(key,JSON.stringify({rates:j.rates,ts:Date.now(),date:j.date}));}catch(e){}
    setRates(base,j.rates,true,j.date);cb&&cb();
  }).catch(function(){if(done)return;done=true;clearTimeout(to);setRates(base,(cached&&cached.rates)||fallbackRates(base),!!cached,cached&&cached.date);cb&&cb();});
}
function setRates(base,rates,live,date){
  st.rates=rates;st.ratesBase=base;st.ratesLive=live;st.ratesDate=date||null;
  $('live-dot').classList.toggle('off',!live);$('live-txt').textContent=live?t('live'):t('liveoff');
  updateRateDisplay();quickConvert();
}
function fxFn(){return SC.makeFx(st.rates||fallbackRates(ORIGIN_CUR[st.origin]),st.ratesBase||ORIGIN_CUR[st.origin]);}
function updateRateDisplay(){
  var D=SC.dest[$('dest').value];if(!D||!st.rates)return;
  var oc=ORIGIN_CUR[st.origin],f=fxFn(),one=(oc==='KRW')?1000:(oc==='JPY'?100:1);
  var v=f(one,oc,D.cur);
  $('rate-display').textContent=one.toLocaleString(st.lang==='es'?'es-ES':'en-US')+' '+oc+' = '+(v>=100?fmt(v,D.cur):Number(v.toPrecision(4)).toLocaleString(st.lang==='es'?'es-ES':'en-US'))+' '+D.cur;
}
var qcRates={};
function quickConvert(){
  var from=$('qc-from').value,to=$('qc-to').value,a=parseNum($('qc-amount').value);
  function show(r){var res=a*r[to];$('qc-result').textContent=(a>0&&isFinite(res))?(to+' '+fmt(res,to)):'—';$('qc-rate').textContent='1 '+from+' = '+(r[to]?(st.lang==='es'?String(Number(r[to].toPrecision(4))).replace('.',','):String(Number(r[to].toPrecision(4)))):'?')+' '+to;}
  if(st.ratesBase===from&&st.rates){show(st.rates);return;}
  if(qcRates[from]){show(qcRates[from]);return;}
  show(fallbackRates(from));
  fetch('https://api.exchangerate-api.com/v4/latest/'+from).then(function(r){return r.json();}).then(function(j){if(j&&j.rates){qcRates[from]=j.rates;show(j.rates);}}).catch(function(){});
}

/* ---------- Entradas ---------- */
function readKg(){
  var unit=$('wunit').value,v=parseNum($('weight').value,unit==='g'?'int':'dec');
  if(!(v>0))return NaN;
  return unit==='g'?v/1000:v;
}
function readPrice(){var oc=ORIGIN_CUR[st.origin];return parseNum($('price').value,CUR_DEC[oc]===0);}
function readDims(){var l=parseFloat($('dl').value),w=parseFloat($('dw').value),h=parseFloat($('dh').value);return (l>0&&w>0&&h>0)?{l:l,w:w,h:h}:null;}
function readDate(){var v=$('sdate').value;return /^\d{4}-\d{2}-\d{2}$/.test(v)?v:SC.today();}

/* ---------- Avisos ---------- */
function renderAlerts(){
  var out=[],dest=$('dest').value,D=SC.dest[dest],date=readDate();
  if(st.origin==='JP')out.push(['info',date>=JP_CHANGE?d('al_jp27'):d('al_jp')]);
  if(dest==='US')out.push(['warn',d('al_us')]);
  if(D&&D.conf==='estimado')out.push(['warn',d('al_est')]);
  if(st.rates&&!st.ratesLive)out.push(['warn',d('al_fx')]);
  if(date<SC.today())out.push(['info',d('al_past')]);
  $('alerts').innerHTML=out.map(function(a){return '<div class="alert '+a[0]+'">'+esc(a[1])+'</div>';}).join('');
}

/* ---------- Lista de servicios ---------- */
function quoteAll(kgForStatus){
  var dest=$('dest').value,date=readDate(),dims=readDims();
  return SC.origins[st.origin].services.map(function(s){
    return SC.quote(st.origin,s,dest,{kg:kgForStatus,date:date,dims:dims});
  });
}
function renderShipList(){
  var kg=readKg(),has=kg>=0.001&&kg<=100,dest=$('dest').value,D=SC.dest[dest],oc=ORIGIN_CUR[st.origin],f=fxFn();
  var qs=quoteAll(has?kg:0.5);st.lastQuotes=has?qs:[];
  /* selección: si no hay o ya no es válida, el más barato disponible */
  var okIds=qs.filter(function(q){return q.status==='ok';});
  if(has&&(!st.sel||!okIds.some(function(q){return q.svc.id===st.sel;}))){
    var best=null;okIds.forEach(function(q){if(!best||q.total<best.total)best=q;});st.sel=best?best.svc.id:null;
  }
  var html=qs.map(function(q){
    var s=q.svc,cls='ship-row',right='',badges='',note=[];
    var dys=SC.svcDays(s,dest),meta=[s.carrier];if(dys&&dys!=='—')meta.push(dys+' '+d('days'));
    if(s.tracked===true)meta.push(d('tracked'));else if(s.tracked===false)meta.push(d('untracked'));
    if(s.insured)meta.push(d('insured'));
    if(q.status==='ok'){
      badges+=q.estimate?'<span class="badge b-est">'+d('b_est')+'</span>':(s.publicRate?'<span class="badge b-off">'+d('b_pub')+'</span>':'<span class="badge b-off">'+d('b_off')+'</span>');
      if(has){right=money(q.total,oc)+'<small>≈ '+money(f(q.total,oc,D.cur),D.cur)+'</small>';}
      else right='<small>—</small>';
      if(st.sel===s.id&&has)cls+=' selected';
      if(!has)cls+=' disabled';
    } else {
      cls+=' disabled';
      if(q.status==='unavailable'){badges+='<span class="badge b-no">'+d('st_unav')+'</span>';right='<span class="status-txt no">'+d('st_unav')+'</span>';note.push(esc(tx({es:s.unavail_es||d('unav_def'),en:s.unavail_en||D_TXT.en.unav_def})));}
      else if(q.status==='suspended'){badges+='<span class="badge b-no">'+d('st_susp')+'</span>';right='<span class="status-txt no">'+d('st_susp')+'</span>';}
      else if(q.status==='overmax'){right='<span class="status-txt no">'+d('st_over')+' '+q.maxKg+' kg</span>';note.push(esc(st.lang==='es'?'Este servicio admite como máximo '+q.maxKg+' kg por envío a este país.':'This service accepts at most '+q.maxKg+' kg per item to this country.'));}
      else if(q.status==='quote'){badges+='<span class="badge b-q">'+d('b_q')+'</span>';right='<a class="status-txt q" href="'+esc(s.calcUrl)+'" target="_blank" rel="noopener">'+d('st_quote')+' ↗</a>';}
    }
    var sn=tx({es:s.note_es,en:s.note_en});if(sn)note.unshift(esc(sn));
    if(q.status==='ok'&&has)q.notes.forEach(function(n){note.push(esc(tx(n)));});
    var links=[];
    if(s.src)links.push('<a href="'+esc(s.src)+'" target="_blank" rel="noopener">'+d('src')+' ↗</a>');
    if(s.calcUrl&&s.calcUrl!==s.src&&q.status!=='quote')links.push('<a href="'+esc(s.calcUrl)+'" target="_blank" rel="noopener">'+d('calc')+'</a>');
    if(q.status==='quote'&&s.calcUrl)links.push('<a href="'+esc(s.calcUrl)+'" target="_blank" rel="noopener">'+d('quoteLink')+'</a>');
    return '<div class="'+cls+'" data-id="'+s.id+'" role="button" tabindex="'+(cls.indexOf('disabled')<0?'0':'-1')+'" aria-pressed="'+(cls.indexOf('selected')>=0)+'">'+
      '<div><div class="ship-carrier">'+esc(s.carrier)+'</div><div class="ship-name">'+esc(nm(s))+badges+'</div><div class="ship-meta">'+esc(meta.slice(1).join(' · '))+'</div></div>'+
      '<div class="ship-cost">'+right+'</div>'+
      '<div class="ship-note">'+note.join(' · ')+(links.length?' · '+links.join(' · '):'')+'</div></div>';
  }).join('');
  $('ship-list').innerHTML=html;
}
function onShipClick(e){
  if(e.target.closest('a'))return;
  var row=e.target.closest('.ship-row');if(!row||row.classList.contains('disabled'))return;
  st.sel=row.getAttribute('data-id');renderShipList();clearResults();
}

function refresh(){renderAlerts();renderShipList();updateRateDisplay();}

/* ---------- Cálculo ---------- */
function showError(m){var el=$('error-msg');el.textContent=m;el.style.display='block';el.scrollIntoView({block:'nearest',behavior:'smooth'});}
function hideError(){$('error-msg').style.display='none';}
function clearResults(){$('results-body').style.display='none';$('results-empty').style.display='block';$('compare-section').style.display='none';st.last=null;}

function calculate(silent){
  hideError();
  var price=readPrice(),kg=readKg();
  if(!(price>0)){if(!silent)showError(d('err_price'));return;}
  if(!(kg>=0.001&&kg<=100)){if(!silent)showError(d('err_w'));return;}
  if(!st.rates){if(!silent)showError(d('err_rates'));return;}
  var q=null;st.lastQuotes.forEach(function(x){if(x.svc.id===st.sel&&x.status==='ok')q=x;});
  if(!q){if(!silent)showError(d('err_svc'));return;}
  var dest=$('dest').value,sell=parseNum($('sell').value)||0,plat=curPlatform(),date=readDate(),cat=$('cat').value,f=fxFn();
  var r=SC.calcTotal({origin:st.origin,svcRes:q,dest:dest,goodsOrig:price,fx:f,cat:cat,kg:kg,date:date,sellPrice:sell,platform:sell>0?plat:null});
  st.last={q:q,r:r,dest:dest,price:price,kg:kg,sell:sell,plat:plat,cat:cat,date:date};
  renderResults();renderCompare();
  if(!silent)saveHistory();
  if(!silent&&window.innerWidth<860)$('results-panel').scrollIntoView({behavior:'smooth'});
}

function rl(label,val,sub){return '<div class="r-line'+(sub?' sub':'')+'"><span class="r-label">'+label+'</span><span class="r-val">'+val+'</span></div>';}

function renderResults(){
  var L=st.last,q=L.q,r=L.r,D=SC.dest[L.dest],oc=ORIGIN_CUR[st.origin],f=fxFn(),cur=D.cur,s=q.svc,h='';
  h+=rl(d('r_purchase'),money(L.price,oc)+' → '+money(r.goods,cur));
  h+=rl('<strong>'+d('r_ship')+'</strong> · '+esc(nm(s)),money(r.ship,cur));
  h+=rl(d('r_base')+(q.pkgs>1?' ('+q.pkgs+' '+d('r_pk')+')':''),money(q.base,oc),1);
  if(q.extra>0)h+=rl(esc(tx(q.extraLabel)),money(q.extra,oc),1);
  if(q.demand>0)h+=rl(d('r_demand'),money(q.demand,oc),1);
  if(q.fuel>0)h+=rl(d('r_fuel')+' ('+loc(q.fuelPct+'%')+')',money(q.fuel,oc),1);
  if(q.billKg>L.kg+1e-9)h+=rl(d('vol'),kgs(q.billKg)+' kg',1);
  var cu=r.customs,conf=(D.conf==='estimado'||cu.estimate);
  h+='<div class="r-section">'+d('r_customs')+' <span class="badge '+(conf?'b-est':'b-off')+'">'+(conf?d('conf_est'):d('conf_off'))+'</span></div>';
  if(!cu.lines.length)h+=rl(d('r_notax'),money(0,cur));
  cu.lines.forEach(function(l){h+=rl(esc(loc(tx(l))),money(l.amt,cur));});
  if(r.pfee>0)h+=rl(d('r_pfee')+' · '+esc(L.plat.name),money(r.pfee,cur));
  h+='<hr class="r-divider"><div class="r-total-row"><div class="r-total-label">'+d('r_total')+'</div><div><div class="r-total-val">'+money(r.total,cur)+'</div><div class="r-total-alt">≈ '+money(f(r.total,cur,oc),oc)+'</div></div></div>';
  if(r.profit!==null){
    var pc=r.profit>0.005?'gain':(r.profit<-0.005?'loss':'neutral');
    var pl=pc==='gain'?d('r_profit'):(pc==='loss'?d('r_loss'):d('r_even'));
    var feeR=(L.plat&&L.plat.fee)||0,fixed=(L.plat&&L.plat.fixed)||0,costNoFee=r.total-r.pfee;
    var sug=(costNoFee+fixed)/(1-feeR-0.20);
    var sub=pc==='gain'?((Math.round(r.profit/L.sell*1000)/10)+'% '+d('r_margin')):(d('r_sug')+' '+money(sug,cur));
    h+='<div class="profit-box '+pc+'"><div><div class="pb-label">'+pl+'</div><div class="pb-sub">'+esc(sub)+'</div></div><div class="pb-val">'+(r.profit>=0?'+':'−')+money(Math.abs(r.profit),cur)+'</div></div>';
  }
  /* Notas */
  var notes=[];
  var sn=tx({es:s.note_es,en:s.note_en});if(sn)notes.push(sn);
  q.notes.forEach(function(n){notes.push(tx(n));});
  if(q.demandInfo&&q.demandInfo.until)notes.push(st.lang==='es'?'Recargo por demanda vigente hasta el '+q.demandInfo.until+'.':'Demand surcharge in force until '+q.demandInfo.until+'.');
  cu.notes.forEach(function(n){notes.push(tx(n));});
  if(D.extraNote)notes.push(tx(D.extraNote));
  h+='<div class="note-box'+(conf?' warn':'')+'"><strong>'+d('notes')+'</strong><ul>'+notes.map(function(n){return '<li>'+esc(n)+'</li>';}).join('')+'</ul></div>';
  /* Fuentes */
  var srcs=[];if(s.src)srcs.push(s.src);(D.src||[]).forEach(function(u){srcs.push(u);});
  h+='<div class="src-box"><strong>'+d('sources')+':</strong> '+srcs.map(function(u){return '<a href="'+esc(u)+'" target="_blank" rel="noopener">'+esc(u.replace(/^https?:\/\/(www\.)?/,'').split('/')[0])+'</a>';}).join(' · ')+
     '<br>'+d('fx')+': '+(st.ratesLive?d('fxlive')+(st.ratesDate?' ('+esc(st.ratesDate)+')':''):d('fxold'))+'. '+d('verified')+'</div>';
  /* Servicio de envío propio */
  h+='<div class="ship-service-banner"><div class="ssb-eyebrow">'+t('ssb-eyebrow')+'</div><div class="ssb-title">'+t('ssb-title')+'</div><div class="ssb-body">'+t('ssb-body')+'</div>'+
     '<div class="ssb-prices">'+[['0'+(st.lang==='es'?',':'.')+'5–2',1500],['2–5',2500],['5–10',3500],['10–20',5000]].map(function(p){return '<span class="ssb-price-tag">'+p[0]+' kg: ¥'+fmtNum(p[1],0)+'</span>';}).join('')+'</div>'+
     '<button class="ssb-btn" type="button" onclick="openModal(\'send-modal\')">📦 '+t('ssb-btn')+'</button></div>';
  /* Mapa */
  var mq=(MAPQ[s.carrier]||s.carrier);
  h+='<div class="maps-box"><div>📍 '+esc(s.carrier)+' '+d('maps')+'</div><a class="maps-link" href="https://www.google.com/maps/search/'+encodeURIComponent(mq)+'" target="_blank" rel="noopener">Google Maps ↗</a></div>';
  /* Compartir */
  h+='<div style="margin-top:12px;padding-top:10px;border-top:1px solid var(--border)"><div class="r-section" style="margin-top:0">'+d('share')+'</div>'+
     '<div class="share-row"><button class="share-btn" type="button" id="b-wa">WhatsApp</button><button class="share-btn" type="button" id="b-x">X / Twitter</button></div>'+
     '<div class="share-row"><button class="share-btn" type="button" id="b-img">⬇ '+d('img')+'</button><button class="share-btn" type="button" id="b-copy">'+d('copy')+'</button></div>'+
     '<button class="email-btn" type="button" id="b-email">✉ '+d('email')+'</button>'+
     '<div class="email-inline" id="email-box"><input type="email" id="r-email" placeholder="tu@email.com" aria-label="Email"><button type="button" id="b-send">'+d('send')+'</button></div>'+
     '<div class="form-msg" id="email-msg"></div></div>';
  var body=$('results-body');body.innerHTML=h;body.style.display='block';$('results-empty').style.display='none';
  $('b-wa').onclick=shareWA;$('b-x').onclick=shareX;$('b-img').onclick=shareImage;$('b-copy').onclick=copySummary;
  $('b-email').onclick=function(){$('email-box').classList.toggle('open');};$('b-send').onclick=sendEmail;
}

function renderCompare(){
  var L=st.last,D=SC.dest[L.dest],f=fxFn(),rows=[];
  st.lastQuotes.forEach(function(q){
    if(q.status!=='ok')return;
    var r=SC.calcTotal({origin:st.origin,svcRes:q,dest:L.dest,goodsOrig:L.price,fx:f,cat:L.cat,kg:L.kg,date:L.date,sellPrice:L.sell,platform:L.sell>0?L.plat:null});
    rows.push({q:q,r:r});
  });
  rows.sort(function(a,b){return a.r.total-b.r.total;});
  $('compare-list').innerHTML=rows.length?rows.map(function(x,i){
    var pm='<span class="compare-margin neu">—</span>';
    if(x.r.profit!==null){var c=x.r.profit>0?'pos':(x.r.profit<0?'neg':'neu');pm='<span class="compare-margin '+c+'">'+(x.r.profit>=0?'+':'−')+money(Math.abs(x.r.profit),D.cur)+'</span>';}
    return '<div class="compare-row'+(i===0?' best':'')+'"><span class="compare-name">'+esc(x.q.svc.carrier+' · '+nm(x.q.svc))+(i===0?'<span class="best-badge">'+d('best')+'</span>':'')+'</span><span class="compare-cost">'+money(x.r.total,D.cur)+'</span>'+pm+'</div>';
  }).join(''):'<div class="hint">'+d('noship')+'</div>';
  $('compare-section').style.display='block';
}

/* ---------- Historial (solo en el navegador) ---------- */
function saveHistory(){
  var L=st.last,D=SC.dest[L.dest];
  hist.unshift({ts:Date.now(),o:st.origin,d:L.dest,p:L.price,oc:ORIGIN_CUR[st.origin],kg:L.kg,s:L.q.svc.carrier+' · '+nm(L.q.svc),t:L.r.total,c:D.cur,pr:L.r.profit});
  hist=hist.slice(0,10);try{localStorage.setItem('sc_hist_v2',JSON.stringify(hist));}catch(e){}
  renderHistory();
}
function renderHistory(){
  var sec=$('history-section');
  if(!hist.length){sec.style.display='none';return;}
  sec.style.display='block';
  $('history-list').innerHTML=hist.map(function(h){
    var D=SC.dest[h.d];if(!D)return '';
    var dt=new Date(h.ts),ds=dt.toLocaleDateString(st.lang==='es'?'es-ES':'en-US')+' '+String(dt.getHours()).padStart(2,'0')+':'+String(dt.getMinutes()).padStart(2,'0');
    var pr=(h.pr!=null)?(' · '+(h.pr>=0?'+':'−')+money(Math.abs(h.pr),h.c)):'';
    return '<div class="history-item"><div class="history-item-top"><span class="history-item-name">'+esc(h.o+' → '+(st.lang==='es'?D.name_es:D.name_en))+'</span><span class="history-item-total">'+esc(money(h.t,h.c))+'</span></div><div class="history-item-sub">'+esc(money(h.p,h.oc)+' · '+kgs(h.kg)+' kg · '+h.s+' · '+ds+pr)+'</div></div>';
  }).join('');
}

/* ---------- Compartir ---------- */
function summaryText(){
  var L=st.last;if(!L)return '';
  var D=SC.dest[L.dest],oc=ORIGIN_CUR[st.origin],es=st.lang==='es';
  var lines=[(es?'Ruta: ':'Route: ')+T[st.lang]['o-'+st.origin]+' → '+(es?D.name_es:D.name_en),
    d('r_purchase')+': '+money(L.price,oc)+' ('+money(L.r.goods,D.cur)+')',
    d('r_ship')+' ('+L.q.svc.carrier+' '+nm(L.q.svc)+', '+kgs(L.kg)+' kg): '+money(L.r.ship,D.cur),
    d('r_customs')+': '+money(L.r.tax,D.cur)];
  if(L.r.pfee>0)lines.push(d('r_pfee')+' '+L.plat.name+': '+money(L.r.pfee,D.cur));
  lines.push(d('r_total')+': '+money(L.r.total,D.cur));
  if(L.r.profit!==null)lines.push((L.r.profit>=0?d('r_profit'):d('r_loss'))+': '+money(Math.abs(L.r.profit),D.cur));
  return lines.join('\n');
}
function shareWA(){var es=st.lang==='es';var msg=(es?'📦 Calculé mi envío con ShipCalc\n\n':'📦 I calculated my shipment with ShipCalc\n\n')+summaryText()+'\n\n'+(es?'Calcúlalo gratis: ':'Calculate yours free: ')+'https://shipcalc.live';window.open('https://wa.me/?text='+encodeURIComponent(msg),'_blank','noopener');}
function shareX(){var L=st.last,D=SC.dest[L.dest],es=st.lang==='es';var msg=(es?'Calculé mi envío ':'I calculated my shipment ')+T[st.lang]['o-'+st.origin]+' → '+(es?D.name_es:D.name_en)+(es?' con ShipCalc 📦 Total: ':' with ShipCalc 📦 Total: ')+money(L.r.total,D.cur)+' https://shipcalc.live';window.open('https://twitter.com/intent/tweet?text='+encodeURIComponent(msg),'_blank','noopener');}
function copySummary(){
  var b=$('b-copy'),txt=summaryText()+'\n\nhttps://shipcalc.live';
  var done=function(){b.classList.add('copied');b.textContent='✓ '+d('copied');setTimeout(function(){b.classList.remove('copied');b.textContent=d('copy');},2500);};
  if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(txt).then(done,function(){fallbackCopy(txt);done();});else{fallbackCopy(txt);done();}
}
function fallbackCopy(txt){var ta=document.createElement('textarea');ta.value=txt;document.body.appendChild(ta);ta.select();try{document.execCommand('copy');}catch(e){}document.body.removeChild(ta);}
function rrect(ctx,x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();}
function shareImage(){
  var L=st.last,D=SC.dest[L.dest],es=st.lang==='es',oc=ORIGIN_CUR[st.origin];
  var c=document.createElement('canvas');c.width=1200;c.height=630;var x=c.getContext('2d');
  x.fillStyle='#0f1117';x.fillRect(0,0,1200,630);
  var g=x.createLinearGradient(0,0,1200,0);g.addColorStop(0,'#0052cc');g.addColorStop(1,'#00b386');x.fillStyle=g;x.fillRect(0,0,1200,8);
  x.fillStyle='#0052cc';rrect(x,80,70,56,56,12);x.fill();x.fillStyle='#fff';x.font='bold 22px monospace';x.textAlign='center';x.fillText('SC',108,106);
  x.textAlign='left';x.font='bold 36px sans-serif';x.fillStyle='#fff';x.fillText('ShipCalc',152,110);
  x.font='22px sans-serif';x.fillStyle='#9aa4b8';x.fillText(T[st.lang]['o-'+st.origin]+'  →  '+(es?D.name_es:D.name_en)+'   ·   '+kgs(L.kg)+' kg',80,180);
  var rows=[[d('r_purchase'),money(L.r.goods,D.cur)],[d('r_ship')+' · '+L.q.svc.carrier,money(L.r.ship,D.cur)],[d('r_customs'),money(L.r.tax,D.cur)]];
  if(L.r.pfee>0)rows.push([d('r_pfee'),money(L.r.pfee,D.cur)]);
  rows.forEach(function(rw,i){var y=220+i*58;x.fillStyle='rgba(255,255,255,.06)';rrect(x,80,y,560,44,8);x.fill();x.fillStyle='#9aa4b8';x.font='18px sans-serif';x.textAlign='left';x.fillText(rw[0],100,y+29);x.fillStyle='#fff';x.font='bold 18px monospace';x.textAlign='right';x.fillText(rw[1],620,y+29);});
  x.fillStyle='rgba(0,82,204,.25)';rrect(x,690,220,430,150,14);x.fill();
  x.textAlign='center';x.fillStyle='#9aa4b8';x.font='bold 15px sans-serif';x.fillText(d('r_total').toUpperCase(),905,255);
  x.fillStyle='#fff';x.font='bold 46px monospace';x.fillText(money(L.r.total,D.cur),905,320);
  x.fillStyle='#9aa4b8';x.font='16px monospace';x.fillText('≈ '+money(fxFn()(L.r.total,D.cur,oc),oc),905,352);
  if(L.r.profit!==null){var gain=L.r.profit>=0;x.fillStyle=gain?'rgba(0,179,134,.18)':'rgba(255,77,109,.18)';rrect(x,690,390,430,110,14);x.fill();x.fillStyle='#9aa4b8';x.font='bold 15px sans-serif';x.fillText((gain?d('r_profit'):d('r_loss')).toUpperCase(),905,425);x.fillStyle=gain?'#2bd9a8':'#ff6b81';x.font='bold 38px monospace';x.fillText((gain?'+':'−')+money(Math.abs(L.r.profit),D.cur),905,475);}
  x.textAlign='left';x.fillStyle='#4d8dff';x.font='bold 20px monospace';x.fillText('shipcalc.live',80,575);
  x.textAlign='right';x.fillStyle='#6b7385';x.font='15px sans-serif';x.fillText(es?'Tarifas oficiales · Cálculo gratuito':'Official rates · Free calculator',1120,575);
  var a=document.createElement('a');a.download='shipcalc.png';a.href=c.toDataURL('image/png');document.body.appendChild(a);a.click();document.body.removeChild(a);
}
/* Email del resultado (EmailJS, clave pública) */
var EJS={service:'service_m2zlfc2',template:'template_txpa10k',key:'eE1WhtAPVLFGvsGST'};
function sendEmail(){
  var em=$('r-email').value.trim(),msg=$('email-msg');
  msg.style.display='block';
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em)){msg.className='form-msg err';msg.textContent=d('emailbad');return;}
  if(!window.emailjs){msg.className='form-msg err';msg.textContent=d('emailerr');return;}
  var L=st.last,D=SC.dest[L.dest],es=st.lang==='es';
  var params={user_email:em,origin:T[st.lang]['o-'+st.origin],destination:es?D.name_es:D.name_en,breakdown:summaryText(),lang:st.lang,site_url:'https://shipcalc.live',
    esim_text:es?'¿De viaje? Usa el código JAPANGEMU en Holafly o Saily para tener descuento en tu eSIM.':'Travelling? Use code JAPANGEMU on Holafly or Saily for an eSIM discount.'};
  try{window.emailjs.init({publicKey:EJS.key});}catch(e){try{window.emailjs.init(EJS.key);}catch(e2){}}
  window.emailjs.send(EJS.service,EJS.template,params).then(function(){msg.className='form-msg ok';msg.textContent=d('emailok');$('email-box').classList.remove('open');},function(){msg.className='form-msg err';msg.textContent=d('emailerr');});
}

/* ---------- Modales y formularios (Netlify Forms) ---------- */
function openModal(id){var m=$(id);m.classList.add('open');var i=m.querySelector('input:not([type=hidden]):not([name=bot-field])');if(i)setTimeout(function(){i.focus();},50);}
function closeModal(id){$(id).classList.remove('open');}
window.openModal=openModal;window.closeModal=closeModal;
function wireForm(formId,errId,okId,requiredIds){
  var form=$(formId);
  form.addEventListener('submit',function(e){
    e.preventDefault();
    var err=$(errId);err.style.display='none';
    for(var i=0;i<requiredIds.length;i++){var el=$(requiredIds[i]);if(!el.value.trim()||(el.type==='email'&&!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(el.value.trim()))){err.textContent=d('formreq');err.style.display='block';el.focus();return;}}
    var btn=form.querySelector('button[type=submit]');btn.disabled=true;
    var body=new URLSearchParams(new FormData(form)).toString();
    fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:body})
      .then(function(r){if(!r.ok)throw new Error('http '+r.status);form.style.display='none';$(okId).style.display='block';})
      .catch(function(){err.textContent=d('formerr');err.style.display='block';})
      .then(function(){btn.disabled=false;});
  });
}

/* ---------- Inicio ---------- */
function selectOrigin(o){
  if(!SC.origins[o])return;
  st.origin=o;st.sel=null;
  document.querySelectorAll('.origin-card').forEach(function(c){var on=c.getAttribute('data-origin')===o;c.classList.toggle('selected',on);c.setAttribute('aria-checked',on);});
  $('price-label').textContent=d('price')[o];
  $('price').placeholder=o==='JP'?'5.000':(o==='KR'?'50.000':'300');
  $('qc-from').value=ORIGIN_CUR[o];
  try{localStorage.setItem('sc_origin',o);}catch(e){}
  clearResults();refresh();
  fetchRates(ORIGIN_CUR[o],function(){refresh();});
}
function init(){
  var l=null;try{l=localStorage.getItem('sc_lang');}catch(e){}
  if(!l){var nl=(navigator.languages&&navigator.languages[0])||navigator.language||'es';l=/^en/i.test(nl)?'en':'es';}
  st.lang=(l==='en')?'en':'es';
  var today=SC.today();$('sdate').value=today;$('sdate').min='2026-01-01';$('sdate').max='2027-12-31';
  applyTexts();
  document.querySelectorAll('.origin-card').forEach(function(c){
    c.addEventListener('click',function(){selectOrigin(c.getAttribute('data-origin'));});
    c.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();selectOrigin(c.getAttribute('data-origin'));}});
  });
  $('ship-list').addEventListener('click',onShipClick);
  $('ship-list').addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();onShipClick(e);}});
  ['price','sell'].forEach(function(id){$(id).addEventListener('input',function(){clearResults();});});
  ['weight','dl','dw','dh'].forEach(function(id){$(id).addEventListener('input',function(){clearResults();renderShipList();});});
  $('wunit').addEventListener('change',function(){
    var nu=this.value,ou=(nu==='kg')?'g':'kg',v=parseNum($('weight').value,ou==='g'?'int':'dec');
    if(v>0){var kgv=(ou==='g')?v/1000:v;$('weight').value=(nu==='g')?String(Math.round(kgv*1000)):String(Math.round(kgv*1000)/1000).replace('.',st.lang==='es'?',':'.');}
    clearResults();renderShipList();
  });
  $('sdate').addEventListener('change',function(){clearResults();refresh();});
  $('dest').addEventListener('change',function(){try{localStorage.setItem('sc_dest',this.value);}catch(e){}renderPlatforms();updateSellLabel();clearResults();refresh();});
  $('cat').addEventListener('change',clearResults);
  $('platform').addEventListener('change',function(){updatePlatformNote();clearResults();});
  $('calc-btn').addEventListener('click',function(){calculate(false);});
  $('history-clear').addEventListener('click',function(){hist=[];try{localStorage.removeItem('sc_hist_v2');}catch(e){}renderHistory();});
  $('adv-toggle').addEventListener('click',function(){var a=$('adv');a.classList.toggle('open');this.setAttribute('aria-expanded',a.classList.contains('open'));this.textContent=a.classList.contains('open')?t('adv-close'):t('adv-open');});
  $('qc-amount').addEventListener('input',quickConvert);$('qc-from').addEventListener('change',quickConvert);$('qc-to').addEventListener('change',quickConvert);
  document.querySelectorAll('.modal-overlay').forEach(function(m){m.addEventListener('click',function(e){if(e.target===m)m.classList.remove('open');});});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')document.querySelectorAll('.modal-overlay.open').forEach(function(m){m.classList.remove('open');});});
  wireForm('send-form','send-err','send-success',['sf-name','sf-email','sf-dest']);
  wireForm('pro-form','pro-err','pro-success',['pro-email']);
  var o=null;try{o=localStorage.getItem('sc_origin');}catch(e){}
  renderHistory();
  selectOrigin(SC.origins[o]?o:'JP');
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})(window.SC);
