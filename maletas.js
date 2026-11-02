/* =====================================================================
   ShipCalc · MALETAS: precios y reserva
   ---------------------------------------------------------------------
   Para cambiar precios toca SOLO los números de CFG.
   Referencia de coste (Yamato 宅急便, tarifa general con IVA, 29-10-2026):
   Tokio→Osaka: 100 cm ¥1.650 · 140 cm ¥2.780 · 160 cm ¥3.160 · 180 cm ¥4.480
   Envío a aeropuerto: Yamato suma ¥660 por bulto.
   ===================================================================== */
(function(w){
'use strict';
var CFG={
  /* Precio por maleta en rutas principales (yenes, impuestos incluidos) */
  sizes:{
    s:{price:2090,kg:5, cm:100},   /* Pequeña: mochila o bolsa */
    m:{price:3070,kg:15,cm:140},   /* Mediana: cabina o mediana */
    l:{price:4939,kg:25,cm:160},   /* Grande: maleta facturada */
    x:{price:4939,kg:30,cm:180}    /* Especial: XL, golf, esquí */
  },
  tierFee:[0,1000,2000],  /* suplemento por maleta según distancia (ver TIER) */
  airFee:700,             /* por maleta, si la entrega es en un aeropuerto */
  airDays:2,              /* al aeropuerto: días mínimos entre recogida y vuelo */
  maxBags:10,             /* máximo por tipo en una reserva */
  maxTotal:10,            /* máximo de bultos por reserva (límite del 集荷 de Yamato: 10 por solicitud) */
  /* Enlace de pago (por ejemplo un Stripe Payment Link). Vacío = el cliente
     reserva sin pagar y le envías tú el enlace de pago por email. */
  payURL:'',
  /* Tu número de WhatsApp con prefijo de país, solo números (por ejemplo '819012345678').
     Si lo pones, al terminar la reserva sale un botón para escribirte. Vacío = no sale. */
  whatsapp:''
};

/* Lugares: id, zona, aeropuerto (1).
   Zonas: K Kanto · C Chubu/Hokuriku · W Kansai · G Chugoku · Q Kyushu ·
          H Hokkaido · O Okinawa · X otra ciudad */
var PLACES=[
  ['tokyo','K'],['kyoto','W'],['osaka','W'],['yokohama','K'],['hakone','K'],['kawaguchiko','K'],['nikko','K'],
  ['nara','W'],['kobe','W'],['nagoya','C'],['takayama','C'],['kanazawa','C'],['hiroshima','G'],
  ['fukuoka','Q'],['sapporo','H'],['okinawa','O'],
  ['NRT','K',1],['HND','K',1],['KIX','W',1],['ITM','W',1],['NGO','C',1],['FUK','Q',1],['CTS','H',1],['HIJ','G',1],
  ['other','X']
];
/* Suplemento por par de zonas (en orden alfabético): 0, 1 o 2 = índice de tierFee;
   'q' = precio a confirmar. Los pares que no estén aquí también son 'q'. */
var TIER={
  KK:0,CK:0,KW:0,GK:1,KQ:1,HK:1,
  CC:0,CW:0,CG:0,CQ:1,CH:2,
  WW:0,GW:0,QW:0,HW:2,
  GG:0,GQ:0,GH:'q',
  QQ:0,HQ:'q',HH:0,OO:0
};
var ORDER=['s','m','l','x'];
/* Terminales con mostrador de Yamato para 空港宅急便 (lista del formulario oficial de 集荷, 29-10-2026).
   [código, español, inglés, nombre exacto en japonés] */
var TERMINALS={
  NRT:[['T1N','Terminal 1 (ala norte)','Terminal 1 (North Wing)','成田空港第１ターミナル（北ウイング）4F 宅急便カウンター'],
       ['T1S','Terminal 1 (ala sur)','Terminal 1 (South Wing)','成田空港第１ターミナル（南ウイング）4F 宅急便カウンター'],
       ['T2','Terminal 2','Terminal 2','成田空港第２ターミナル 3F 宅急便カウンター'],
       ['T3','Terminal 3','Terminal 3','成田空港第３ターミナル 1F 宅急便カウンター']],
  HND:[['T1D','Terminal 1 (vuelos nacionales)','Terminal 1 (domestic)','羽田空港第１ターミナル国内線 1F 宅急便カウンター'],
       ['T2D','Terminal 2 (vuelos nacionales)','Terminal 2 (domestic)','羽田空港第２ターミナル国内線 1F 宅急便カウンター'],
       ['T2I','Terminal 2 (vuelos internacionales)','Terminal 2 (international)','羽田空港第２ターミナル国際線 3F 宅急便カウンター'],
       ['T3I','Terminal 3 (vuelos internacionales)','Terminal 3 (international)','羽田空港第３ターミナル国際線 2F ヤマト運輸宅急便カウンター']],
  KIX:[['T1','Terminal 1 (único mostrador)','Terminal 1 (only counter)','関西国際空港第１ターミナルビル 4F 宅急便カウンター']],
  ITM:[['MAIN','Terminal (zona central)','Terminal (central area)','大阪（伊丹）空港 1F 空港ターミナルビル中央エリア']],
  NGO:[['T1','Terminal 1','Terminal 1','中部国際空港第１ターミナル 3F 手荷物サービスカウンター'],
       ['T2','Terminal 2','Terminal 2','中部国際空港第２ターミナル 2F 手荷物サービスカウンター']],
  FUK:[['INT','Terminal internacional','International terminal','福岡空港（国際線）1F 宅急便受付カウンター'],
       ['DOM','Terminal nacional','Domestic terminal','福岡空港（国内線）1F 宅急便カウンター']],
  CTS:[['DOM','Terminal nacional (único mostrador)','Domestic terminal (only counter)','新千歳空港国内線ターミナル 1F 手荷物預かり所']],
  HIJ:[['MAIN','Terminal','Terminal','広島空港 1F 宅急便カウンター']]
};
/* Tramos que Yamato hace en avión (全国⇔沖縄、北海道⇔中国・四国・九州): más objetos prohibidos */
function byAir(a,b){if(!a||!b)return false;var z=[a.zone,b.zone].sort().join('');return (a.zone==='O')!==(b.zone==='O')||z==='GH'||z==='HQ';}

function place(id){for(var i=0;i<PLACES.length;i++)if(PLACES[i][0]===id)return {id:id,zone:PLACES[i][1],air:!!PLACES[i][2]};return null;}
function tier(a,b){
  if(!a||!b||a.zone==='X'||b.zone==='X')return 'q';
  var k=[a.zone,b.zone].sort().join('');
  return Object.prototype.hasOwnProperty.call(TIER,k)?TIER[k]:'q';
}
function yen(n,lang){var s=String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,lang==='en'?',':'.');return '¥'+s;}

/* Cálculo del precio. bags = {s:n,m:n,l:n,x:n} */
function quote(fromId,toId,bags){
  var a=place(fromId),b=place(toId),tr=tier(a,b),n=0,base=0,lines=[];
  ORDER.forEach(function(k){var q=Math.max(0,Math.min(CFG.maxBags,bags[k]|0));if(q){n+=q;base+=q*CFG.sizes[k].price;lines.push({k:k,q:q,unit:CFG.sizes[k].price,sum:q*CFG.sizes[k].price});}});
  var sur=(tr==='q'||!n)?0:n*CFG.tierFee[tr];
  var air=(b&&b.air&&n)?n*CFG.airFee:0;
  return {from:a,to:b,tier:tr,n:n,lines:lines,base:base,sur:sur,air:air,total:base+sur+air,isQuote:!!(a&&b)&&tr==='q',toAir:!!(b&&b.air)};
}

/* Valores que se pueden usar en los textos: {from}, {p_s}, {t1}, {air}… */
function tokens(lang){
  var S=CFG.sizes,o={from:yen(S.s.price,lang),from_air:yen(S.s.price+CFG.airFee,lang),air:yen(CFG.airFee,lang),
    t1:yen(CFG.tierFee[1],lang),t2:yen(CFG.tierFee[2],lang),airdays:String(CFG.airDays),maxtotal:String(CFG.maxTotal)};
  ORDER.forEach(function(k){o['p_'+k]=yen(S[k].price,lang);o[k+'_max']=S[k].kg+' kg · '+S[k].cm+' cm';});
  return o;
}

w.SC_BAGS={CFG:CFG,PLACES:PLACES,TERMINALS:TERMINALS,byAir:byAir,quote:quote,tokens:tokens,yen:yen,place:place,tier:tier,
  lowPrice:Math.min(CFG.sizes.s.price,CFG.sizes.m.price,CFG.sizes.l.price,CFG.sizes.x.price),
  highPrice:Math.max(CFG.sizes.s.price,CFG.sizes.m.price,CFG.sizes.l.price,CFG.sizes.x.price)};

/* ------------------------------------------------------------------ */
/*  Interfaz de reserva (solo en el navegador, en maletas.html)        */
/* ------------------------------------------------------------------ */
if(typeof document==='undefined'||!document.getElementById)return;

/* Japonés para la etiqueta de Yamato (lo recibe ShipCalc en cada reserva) */
var JP_SLOT={am:'午前中','14-16':'14時～16時','16-18':'16時～18時','18-20':'18時～20時','19-21':'19時～21時'};
var JP_PSLOT={am:'13時まで','14-16':'14時から16時まで','16-18':'16時から18時まで','17-1830':'17時から18時30分まで'};
var JP_CONT={ropa:'衣類',calzado:'靴',aseo:'洗面用具・化粧品',libros:'書籍',souv:'お土産',elec:'電子機器',fig:'玩具・フィギュア'};
var JP_SIZE={s:'100',m:'140',l:'160',x:'180'};

function $(id){return document.getElementById(id);}
function v(id){var e=$(id);return e&&!e.disabled?e.value.trim():'';}
function S(){return w.SCSITE||{t:function(k){return k;},lang:function(){return 'es';}};}
function t(k){return S().t(k);}
function L(){return S().lang();}
function jstDate(add){var d=new Date(Date.now()+9*3600e3+(add||0)*864e5);return d.toISOString().slice(0,10);}
function addDays(iso,n){var d=new Date(iso+'T00:00:00Z');d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10);}
function fmtDate(iso){
  if(!iso)return '';
  try{return new Date(iso+'T12:00:00Z').toLocaleDateString(L()==='en'?'en-GB':'es-ES',{weekday:'short',day:'numeric',month:'short',timeZone:'UTC'});}catch(e){return iso;}
}
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function bookingId(){
  var c='ABCDEFGHJKLMNPQRSTUVWXYZ23456789',r='';
  for(var i=0;i<4;i++)r+=c.charAt(Math.floor(Math.random()*c.length));
  return 'SC-'+jstDate(0).slice(2).replace(/-/g,'')+'-'+r;
}
function term(id,code){var l=TERMINALS[id]||[];for(var i=0;i<l.length;i++)if(l[i][0]===code)return l[i];return null;}
function fillTerms(sel,id){
  var cur=sel.value,lang=L(),h='<option value="">'+esc(t('m-term-pick'))+'</option>';
  (TERMINALS[id]||[]).forEach(function(x){h+='<option value="'+x[0]+'">'+esc(lang==='en'?x[2]:x[1])+'</option>';});
  sel.innerHTML=h;var l=TERMINALS[id]||[];if(l.length===1)sel.value=l[0][0];else if(term(id,cur))sel.value=cur;
}
/* Precio aproximado en la moneda del cliente (se cobra en yenes).
   Respaldo: tipos del 29-10-2026 (ExchangeRate-API), por si falla la consulta en vivo. */
var FX_FALLBACK_USD={JPY:157.91,USD:1,EUR:0.897,GBP:0.752,CAD:1.40,AUD:1.42,MXN:18.65,ARS:1538.47,COP:3146.9,CLP:984.88,PEN:3.45,UYU:40.18,DOP:60.82,GTQ:7.64,CRC:454.55};
var FX_LIST=['EUR','USD','MXN','ARS','COP','CLP','PEN','UYU','DOP','CRC','GTQ','GBP','CAD','AUD'];
var FX_SYM={EUR:'€',USD:'US$',GBP:'£',CAD:'CA$',AUD:'A$',MXN:'MX$',ARS:'AR$',COP:'COL$',CLP:'CLP$',PEN:'S/ ',UYU:'$U ',DOP:'RD$',GTQ:'Q ',CRC:'₡'};
var FX_REGION={ES:'EUR',FR:'EUR',PT:'EUR',DE:'EUR',IT:'EUR',MX:'MXN',AR:'ARS',CO:'COP',CL:'CLP',PE:'PEN',UY:'UYU',DO:'DOP',CR:'CRC',GT:'GTQ',US:'USD',EC:'USD',PA:'USD',SV:'USD',VE:'USD',BO:'USD',PY:'USD',GB:'GBP',CA:'CAD',AU:'AUD'};
var fxRates=null;
FX_LIST.forEach(function(c){fxRates=fxRates||{};fxRates[c]=FX_FALLBACK_USD[c]/FX_FALLBACK_USD.JPY;});
function fxDefault(){
  try{var s=localStorage.getItem('sc_cur');if(s&&FX_LIST.indexOf(s)>=0)return s;}catch(e){}
  var ls=navigator.languages||[navigator.language||''];
  for(var i=0;i<ls.length;i++){var m=/^[a-z]{2}-([A-Z]{2})/.exec(ls[i]||'');if(m&&FX_REGION[m[1]])return FX_REGION[m[1]];}
  return /^en/i.test(ls[0]||'')?'USD':'EUR';
}
function fxLoad(done){
  try{var c=JSON.parse(localStorage.getItem('sc_fx_JPY')||'null');if(c&&c.r&&Date.now()-c.t<6*3600e3){fxRates=c.r;return done();}}catch(e){}
  if(typeof fetch!=='function')return;
  fetch('https://api.exchangerate-api.com/v4/latest/JPY').then(function(r){return r.json();}).then(function(j){
    if(!j||!j.rates||!j.rates.EUR)return;var r={};FX_LIST.forEach(function(c){if(j.rates[c])r[c]=j.rates[c];});
    fxRates=r;try{localStorage.setItem('sc_fx_JPY',JSON.stringify({t:Date.now(),r:r}));}catch(e){}done();
  }).catch(function(){});
}
function fxText(jpy){
  var cur=$('bk-cur').value,r=fxRates&&fxRates[cur];if(!r||!jpy)return '';
  var v2=jpy*r,dec=(['CLP','COP','ARS','CRC'].indexOf(cur)>=0||v2>=1000)?0:2,en=L()==='en';
  var str=v2.toFixed(dec).split('.'),i=str[0].replace(/\B(?=(\d{3})+(?!\d))/g,en?',':'.');
  var num=i+(str[1]?(en?'.':',')+str[1]:'');
  return '≈ '+(cur==='EUR'&&!en?num+' €':(FX_SYM[cur]||cur+' ')+num);
}
function label(el){var l=document.querySelector('label[for="'+el.id+'"]');return l?l.textContent.replace(/\s*\*\s*$/,''):'';}

var form,step=1,bid='',STEPS=4;

function bags(){var o={};ORDER.forEach(function(k){o[k]=parseInt($('bk-n-'+k).value,10)||0;});return o;}
function current(){return quote($('bk-from').value,$('bk-to').value,bags());}

/* Muestra solo los campos que corresponden (hotel, Airbnb, casa o aeropuerto).
   Los ocultos se desactivan: no se validan ni se envían. */
function groups(q){
  var fa=!!(q.from&&q.from.air),ta=!!(q.to&&q.to.air),pt=$('pk-type').value,dt=$('dl-type').value;
  document.querySelectorAll('[data-when]').forEach(function(g){
    var w2=g.getAttribute('data-when').split(':'),air=w2[0]==='from'?fa:ta,typ=w2[0]==='from'?pt:dt;
    var on=w2[1]==='city'?!air:w2[1]==='air'?air:(!air&&typ===w2[1]);
    g.hidden=!on;g.querySelectorAll('input,select,textarea').forEach(function(i){i.disabled=!on;});
  });
}

function render(){
  var q=current(),lang=L(),h='';
  q.lines.forEach(function(x){h+='<div class="bk-line"><span>'+x.q+' × '+esc(t('m-b'+x.k))+'</span><span>'+yen(x.sum,lang)+'</span></div>';});
  if(q.sur)h+='<div class="bk-line"><span>'+esc(t('m-sur1'))+'</span><span>+'+yen(q.sur,lang)+'</span></div>';
  if(q.air)h+='<div class="bk-line"><span>'+esc(t('m-sur-air'))+'</span><span>+'+yen(q.air,lang)+'</span></div>';
  $('bk-lines').innerHTML=h;
  $('bk-total').textContent=q.n?yen(q.total,lang):'—';
  $('bk-total-l').textContent=q.isQuote&&q.n?t('m-quote'):t('m-total');
  $('bk-qnote').style.display=(q.isQuote&&q.n)?'block':'none';
  var fx=fxText(q.total);$('bk-fx').textContent=fx?fx+' '+t('m-fx'):'';$('bk-fx').title=t('m-fx-n');
  var eta='';
  if(q.from&&q.to&&q.n){eta=q.isQuote?t('m-eta-q'):q.toAir?t('m-eta-air'):(q.tier===0?t('m-eta-1'):t('m-eta-2'));}
  $('bk-eta').textContent=eta?(t('m-eta')+': '+eta):'';
  $('bk-d2-l').textContent=q.toAir?t('m-d2-air'):t('m-d2');
  ORDER.forEach(function(k){var n=parseInt($('bk-n-'+k).value,10)||0;$('bk-m-'+k).disabled=n<=0;$('bk-p-'+k).disabled=n>=CFG.maxBags;});
  $('pk-where').textContent=q.from?'· '+t('pl-'+q.from.id)+($('bk-d1').value?' · '+fmtDate($('bk-d1').value):''):'';
  $('dl-where').textContent=q.to?'· '+t('pl-'+q.to.id)+($('bk-d2').value?' · '+fmtDate($('bk-d2').value):''):'';
  groups(q);
  if(q.from&&q.from.air)fillTerms($('pk-term'),q.from.id);
  if(q.to&&q.to.air)fillTerms($('dl-term'),q.to.id);
  $('bk-airroute').hidden=!byAir(q.from,q.to);
  var tot=0;ORDER.forEach(function(k){tot+=parseInt($('bk-n-'+k).value,10)||0;});
  ORDER.forEach(function(k){if(tot>=CFG.maxTotal)$('bk-p-'+k).disabled=true;});
  var payLbl=(q.isQuote||!CFG.payURL)?t('m-reserve'):t('m-pay');
  $('bk-pay').textContent=payLbl+(q.n?' · '+yen(q.total,lang):'');
  $('bk-pay-d').textContent=CFG.payURL&&!q.isQuote?t('m-pay-d-link'):t('m-pay-d');
  return q;
}

/* Fechas: recogida como pronto mañana (hora de Japón) */
function syncDates(){
  var d1=$('bk-d1'),d2=$('bk-d2'),q=current(),gap=q.toAir?CFG.airDays:1;
  d1.min=jstDate(1);
  if(d1.value){d2.min=addDays(d1.value,gap);
    if(!d2.value||d2.value<d2.min)d2.value=addDays(d1.value,q.toAir?CFG.airDays:(q.tier===0?1:2));}
  var ci=$('dl-checkin');if(ci&&d2.value){ci.min=d2.value;if(!ci.value||ci.value<d2.value)ci.value=d2.value;}
  else d2.min=addDays(jstDate(1),gap);
}

function err(m){var e=$('bk-msg');e.textContent=m;e.style.display=m?'block':'none';}
function firstMissing(box){
  var r=box.querySelectorAll('[data-req]');
  for(var i=0;i<r.length;i++){if(!r[i].disabled&&!r[i].value.trim())return r[i];}
  return null;
}
function contents(){
  var o=[];document.querySelectorAll('[data-cont]').forEach(function(c){if(c.checked)o.push(c.getAttribute('data-cont'));});return o;
}

function check1(){
  var q=current();
  if(!q.from||!q.to)return t('m-e-place');
  if(!q.n)return t('m-e-bags');
  if(q.n>CFG.maxTotal)return t('m-e-max');
  var d1=$('bk-d1').value,d2=$('bk-d2').value;
  if(!d1||d1<jstDate(1))return t('m-e-d1');
  if(!d2||d2<=d1)return t('m-e-d2');
  if(q.toAir&&d2<addDays(d1,CFG.airDays))return t('m-e-air');
  return '';
}
function check2(){
  var m=firstMissing($('bk2'));
  if(m){m.focus();return t('f-req')+' → '+label(m);}
  return '';
}
function check3(){
  if(!contents().length&&!$('bk-otros').value.trim()){$('bk-otros').focus();return t('m-e-cont');}
  if(!$('bk-name').value.trim()){$('bk-name').focus();return t('f-req')+' → '+label($('bk-name'));}
  var em=$('bk-email').value.trim();
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em)){$('bk-email').focus();return t('f-req')+' → '+label($('bk-email'));}
  if($('bk-wa').value.replace(/\D/g,'').length<7){$('bk-wa').focus();return t('m-e-tel');}
  if(!$('bk-acc').checked)return t('m-e-acc');
  return '';
}

/* Texto en español/inglés para el cliente y para el email de la reserva */
function summary(q){
  var lang=L(),r=[],en=lang==='en';
  var pt=$('pk-type').value,dt=$('dl-type').value;
  r.push((en?'Booking ':'Reserva ')+bid);
  var tp=term(q.from.id,v('pk-term')),td=term(q.to.id,v('dl-term')),en2=L()==='en';
  var pick=q.from.air?(tp?(en2?tp[2]:tp[1]):''):
    pt==='hotel'?v('pk-hotel')+', '+v('pk-haddr')+' ('+v('pk-guest')+')':
    pt==='airbnb'?v('pk-baddr')+' — '+t('m-t-airbnb'):v('pk-caddr');
  var drop=q.to.air?((td?(en2?td[2]:td[1]):'')+' · '+v('dl-flight')+' '+v('dl-ftime')):
    dt==='hotel'?v('dl-hotel')+', '+v('dl-haddr')+' ('+v('dl-guest')+', check-in '+fmtDate(v('dl-checkin'))+')':
    dt==='airbnb'?v('dl-baddr')+' — '+t('m-t-airbnb'):v('dl-recip')+', '+v('dl-caddr');
  r.push(t('m-from')+': '+t('pl-'+q.from.id)+' · '+fmtDate($('bk-d1').value)+'\n  '+pick);
  r.push((q.toAir?t('m-d2-air'):t('m-to'))+': '+t('pl-'+q.to.id)+' · '+fmtDate($('bk-d2').value)+'\n  '+drop);
  q.lines.forEach(function(x){r.push(x.q+' × '+t('m-b'+x.k)+' = '+yen(x.sum,lang));});
  if(q.sur)r.push(t('m-sur1')+': +'+yen(q.sur,lang));
  if(q.air)r.push(t('m-sur-air')+': +'+yen(q.air,lang));
  var fx=fxText(q.total);
  r.push((q.isQuote?t('m-quote')+' ('+(en?'from ':'desde ')+yen(q.total,lang)+')':t('m-total')+': '+yen(q.total,lang))+(fx?' ('+fx+')':''));
  return r.join('\n');
}

/* Datos de la etiqueta de Yamato, en japonés, listos para copiar */
function jpLabel(q){
  var o=[],name=$('bk-name').value.trim(),tel=$('bk-wa').value.trim();
  var d1=$('bk-d1').value.replace(/-/g,'/'),d2=$('bk-d2').value.replace(/-/g,'/');
  var pt=$('pk-type').value,dt=$('dl-type').value,slot=JP_SLOT[v('dl-hslot')||v('dl-cslot')]||'';
  var cont=contents().map(function(k){return JP_CONT[k];});if($('bk-otros').value.trim())cont.push($('bk-otros').value.trim());
  if(q.to.air){
    var tj=term(q.to.id,v('dl-term'));o.push('【お届け先】'+(tj?tj[3]:q.to.id)+'（空港宅急便）');
    o.push('搭乗日：'+d2+'　便名：'+v('dl-flight')+'　出発時刻：'+v('dl-ftime'));
    o.push('搭乗者名：'+name+' 様');
  }else if(dt==='hotel'){
    o.push('【お届け先】'+v('dl-hotel'));o.push(v('dl-haddr'));if(v('dl-htel'))o.push('TEL '+v('dl-htel'));
    o.push('宿泊者名：'+v('dl-guest')+' 様'+(v('dl-resv')?'（予約番号 '+v('dl-resv')+'）':''));o.push('宿泊日：'+v('dl-checkin').replace(/-/g,'/'));
  }else if(dt==='airbnb'){
    o.push('【お届け先】ヤマト運輸 営業所止め（'+v('dl-baddr')+' の最寄り営業所）');o.push('受取人：'+name+' 様');
  }else{
    o.push('【お届け先】'+v('dl-recip')+' 様');o.push(v('dl-caddr'));o.push('TEL '+v('dl-ctel'));
  }
  if(!q.to.air&&dt!=='airbnb')o.push('【お届け予定日】'+d2+(slot?'　【時間帯】'+slot:''));
  o.push('【ご依頼主】'+name+'　TEL '+tel);
  var care=[];if($('bk-fragil').checked)care.push('ワレモノ');if($('bk-precision').checked)care.push('精密機械');
  o.push('【品名】'+cont.join('・')+(care.length?'　【取扱注意】'+care.join('・'):''));
  o.push('【個数】'+q.n+'個（'+q.lines.map(function(x){return JP_SIZE[x.k]+'サイズ以内×'+x.q;}).join('、')+'）');
  var tpj=term(q.from.id,v('pk-term'));
  if(q.from.air)o.push('【受付】'+(tpj?tpj[3]:q.from.id)+' 持込　'+d1+(v('pk-arr')?'　到着便 '+v('pk-arr'):''));
  else if(pt==='hotel')o.push('【集荷】'+v('pk-hotel')+'（'+v('pk-haddr')+'）フロント預け　宿泊者名：'+v('pk-guest')+' 様　'+d1);
  else if(pt==='airbnb')o.push('【持込】'+v('pk-baddr')+' 付近のコンビニまたは営業所　'+d1);
  else o.push('【集荷】'+v('pk-caddr')+'　TEL '+v('pk-ctel')+'　'+d1+(JP_PSLOT[v('pk-cslot')]?'　'+JP_PSLOT[v('pk-cslot')]:''));
  if(byAir(q.from,q.to))o.push('※航空搭載区間（スプレー缶・香水などの液体・ライター・リチウム電池不可）');
  return o.join('\n');
}

/* Pasos que sigue el cliente después de reservar (se muestran al final y te llegan en la solicitud) */
function steps(q){
  var en=L()==='en',pt=$('pk-type').value,dt=$('dl-type').value;
  var tp=term(q.from.id,v('pk-term')),td=term(q.to.id,v('dl-term'));
  function fill(s,o){return s.replace(/\{(\w+)\}/g,function(m,k){return o[k]!=null&&o[k]!==''?o[k]:m;});}
  var po={d1:fmtDate($('bk-d1').value),hotel:v('pk-hotel'),guest:v('pk-guest'),addr:v('pk-caddr'),term:tp?t('pl-'+q.from.id)+' — '+(en?tp[2]:tp[1]):''};
  var dO={d2:fmtDate($('bk-d2').value),hotel:v('dl-hotel'),guest:v('dl-guest'),addr:v('dl-caddr'),term:td?t('pl-'+q.to.id)+' — '+(en?td[2]:td[1]):''};
  return [t('m-n1'),t('m-n2'),fill(t('m-n3-'+(q.from.air?'air':pt)),po),fill(t('m-n4-'+(q.to.air?'air':dt)),dO)];
}
var lastSteps=[];

function go(n){
  step=n;
  for(var i=1;i<=STEPS;i++)$('bk'+i).hidden=i!==n;
  document.querySelectorAll('.bk-steps li').forEach(function(li,i){li.classList.toggle('on',i+1===n);li.classList.toggle('done',i+1<n);});
  err('');
  var q=render();
  if(n===STEPS){
    if(!bid)bid=bookingId();
    var s=summary(q);
    $('bk-sum').textContent=s;
    $('bk-h-id').value=bid;$('bk-h-total').value=q.total;$('bk-h-sum').value=s;$('bk-h-lang').value=L();
    $('bk-h-from').value=t('pl-'+q.from.id);$('bk-h-to').value=t('pl-'+q.to.id);
    var c=contents().map(function(k){return t('m-c-'+k);});if($('bk-otros').value.trim())c.push($('bk-otros').value.trim());
    $('bk-h-cont').value=c.join(', ');
    $('bk-h-jp').value=jpLabel(q);
    lastSteps=steps(q);
    $('bk-h-ins').value=lastSteps.map(function(x,i){return (i+1)+'. '+x;}).join('\n');
    $('bk-h-fx').value=fxText(q.total)?fxText(q.total)+' ('+$('bk-cur').value+')':'';
  }
  var top=$('reserva');if(top&&top.getBoundingClientRect().top<0)top.scrollIntoView({behavior:'smooth',block:'start'});
}

function submit(){
  var q=current(),btn=$('bk-pay');btn.disabled=true;err('');
  var body=new URLSearchParams(new FormData(form)).toString();
  fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:body})
    .then(function(r){if(!r.ok)throw new Error(r.status);
      if(CFG.payURL&&!q.isQuote){
        var u=CFG.payURL+(CFG.payURL.indexOf('?')<0?'?':'&')+'client_reference_id='+encodeURIComponent(bid)+'&prefilled_email='+encodeURIComponent($('bk-email').value.trim());
        location.href=u;return;
      }
      form.hidden=true;$('bk-ok-id').textContent=bid;$('bk-ok').hidden=false;
      var ol=$('bk-next-list');ol.innerHTML='';lastSteps.forEach(function(x){var li=document.createElement('li');li.textContent=x;ol.appendChild(li);});
      var wa=$('bk-wabtn');
      if(CFG.whatsapp){wa.href='https://wa.me/'+CFG.whatsapp.replace(/\D/g,'')+'?text='+encodeURIComponent(t('m-wa-msg').replace('{id}',bid));wa.hidden=false;}else wa.hidden=true;
      document.querySelectorAll('.bk-steps li').forEach(function(li){li.classList.add('done');li.classList.remove('on');});
    })
    .catch(function(){err(t('f-err'));})
    .then(function(){btn.disabled=false;});
}

function setPlaces(from,to){
  if(from&&place(from))$('bk-from').value=from;
  if(to&&place(to))$('bk-to').value=to;
  syncDates();render();
}

function init(){
  form=$('bk-form');if(!form)return;
  ORDER.forEach(function(k){
    var inp=$('bk-n-'+k);
    $('bk-m-'+k).addEventListener('click',function(){inp.value=Math.max(0,(parseInt(inp.value,10)||0)-1);render();});
    $('bk-p-'+k).addEventListener('click',function(){inp.value=Math.min(CFG.maxBags,(parseInt(inp.value,10)||0)+1);render();});
    inp.addEventListener('input',function(){var n=parseInt(inp.value,10);inp.value=isNaN(n)?0:Math.max(0,Math.min(CFG.maxBags,n));render();});
  });
  ['bk-from','bk-to'].forEach(function(id){$(id).addEventListener('change',function(){syncDates();render();});});
  ['pk-type','dl-type'].forEach(function(id){$(id).addEventListener('change',render);});
  $('bk-d1').addEventListener('change',function(){syncDates();render();});
  $('bk-d2').addEventListener('change',render);
  $('bk-next1').addEventListener('click',function(){var e=check1();if(e)return err(e);go(2);});
  $('bk-next2').addEventListener('click',function(){var e=check1()||check2();if(e)return err(e);go(3);});
  $('bk-next3').addEventListener('click',function(){var e=check3();if(e)return err(e);go(4);});
  $('bk-back2').addEventListener('click',function(){go(1);});
  $('bk-back3').addEventListener('click',function(){go(2);});
  $('bk-back4').addEventListener('click',function(){go(3);});
  form.addEventListener('submit',function(e){e.preventDefault();var e1=check1()||check2()||check3();if(e1){err(e1);return;}submit();});
  /* Moneda para el precio aproximado */
  var cs=$('bk-cur');FX_LIST.forEach(function(c){var o=document.createElement('option');o.value=c;o.textContent=c;cs.appendChild(o);});
  cs.value=fxDefault();cs.addEventListener('change',function(){try{localStorage.setItem('sc_cur',cs.value);}catch(e){}render();});
  fxLoad(render);
  $('bk-copy').addEventListener('click',function(){
    var b=this,txt=(L()==='en'?'Booking ':'Reserva ')+bid+'\n'+lastSteps.map(function(x,i){return (i+1)+'. '+x;}).join('\n');
    var ok=function(){b.textContent=t('m-copied');setTimeout(function(){b.textContent=t('m-copy');},2000);};
    if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(txt).then(ok,function(){});
  });
  $('bk-new').addEventListener('click',function(){bid='';form.reset();form.hidden=false;$('bk-ok').hidden=true;syncDates();go(1);});
  /* Tarjetas de rutas populares */
  document.querySelectorAll('[data-route]').forEach(function(a){a.addEventListener('click',function(e){
    e.preventDefault();var p=a.getAttribute('data-route').split('>');setPlaces(p[0],p[1]);go(1);
    $('reserva').scrollIntoView({behavior:'smooth',block:'start'});setTimeout(function(){$('bk-d1').focus({preventScroll:true});},400);
  });});
  /* Pestañas de casos de uso */
  document.querySelectorAll('.tabs [role=tab]').forEach(function(b){b.addEventListener('click',function(){
    var box=b.closest('.tabs-box');
    box.querySelectorAll('[role=tab]').forEach(function(x){var on=x===b;x.setAttribute('aria-selected',on);x.tabIndex=on?0:-1;});
    box.querySelectorAll('[role=tabpanel]').forEach(function(p){p.hidden=p.id!==b.getAttribute('aria-controls');});
  });});
  /* Enlaces del tipo maletas.html?from=tokyo&to=kyoto */
  var p=new URLSearchParams(location.search);
  setPlaces(p.get('from'),p.get('to'));
  syncDates();render();
  if(S().onApply)S().onApply.push(render);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})(typeof window!=='undefined'?window:this);
