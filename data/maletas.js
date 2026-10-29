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
  /* Enlace de pago (por ejemplo un Stripe Payment Link). Vacío = el cliente
     reserva sin pagar y le envías tú el enlace de pago por email. */
  payURL:''
};

/* Lugares: id, zona, aeropuerto (1).
   Zonas: K Kanto · C Chubu/Hokuriku · W Kansai · G Chugoku · Q Kyushu ·
          H Hokkaido · O Okinawa · X otra ciudad */
var PLACES=[
  ['tokyo','K'],['kyoto','W'],['osaka','W'],['yokohama','K'],['hakone','K'],['kawaguchiko','K'],['nikko','K'],
  ['nara','W'],['kobe','W'],['nagoya','C'],['takayama','C'],['kanazawa','C'],['hiroshima','G'],
  ['fukuoka','Q'],['sapporo','H'],['okinawa','O'],
  ['NRT','K',1],['HND','K',1],['KIX','W',1],['NGO','C',1],['FUK','Q',1],['CTS','H',1],['OKA','O',1],
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
    t1:yen(CFG.tierFee[1],lang),t2:yen(CFG.tierFee[2],lang),airdays:String(CFG.airDays)};
  ORDER.forEach(function(k){o['p_'+k]=yen(S[k].price,lang);o[k+'_max']=S[k].kg+' kg · '+S[k].cm+' cm';});
  return o;
}

w.SC_BAGS={CFG:CFG,PLACES:PLACES,quote:quote,tokens:tokens,yen:yen,place:place,tier:tier,
  lowPrice:Math.min(CFG.sizes.s.price,CFG.sizes.m.price,CFG.sizes.l.price,CFG.sizes.x.price),
  highPrice:Math.max(CFG.sizes.s.price,CFG.sizes.m.price,CFG.sizes.l.price,CFG.sizes.x.price)};

/* ------------------------------------------------------------------ */
/*  Interfaz de reserva (solo en el navegador, en maletas.html)        */
/* ------------------------------------------------------------------ */
if(typeof document==='undefined'||!document.getElementById)return;

/* Japonés para la etiqueta de Yamato (lo recibe ShipCalc en cada reserva) */
var JP_AIR={NRT:'成田空港',HND:'羽田空港',KIX:'関西国際空港',NGO:'中部国際空港',FUK:'福岡空港',CTS:'新千歳空港',OKA:'那覇空港'};
var JP_SLOT={am:'午前中','14-16':'14時～16時','16-18':'16時～18時','18-20':'18時～20時','19-21':'19時～21時'};
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
  var eta='';
  if(q.from&&q.to&&q.n){eta=q.isQuote?t('m-eta-q'):q.toAir?t('m-eta-air'):(q.tier===0?t('m-eta-1'):t('m-eta-2'));}
  $('bk-eta').textContent=eta?(t('m-eta')+': '+eta):'';
  $('bk-d2-l').textContent=q.toAir?t('m-d2-air'):t('m-d2');
  ORDER.forEach(function(k){var n=parseInt($('bk-n-'+k).value,10)||0;$('bk-m-'+k).disabled=n<=0;$('bk-p-'+k).disabled=n>=CFG.maxBags;});
  $('pk-where').textContent=q.from?'· '+t('pl-'+q.from.id)+($('bk-d1').value?' · '+fmtDate($('bk-d1').value):''):'';
  $('dl-where').textContent=q.to?'· '+t('pl-'+q.to.id)+($('bk-d2').value?' · '+fmtDate($('bk-d2').value):''):'';
  groups(q);
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
  var pick=q.from.air?(t('m-term').replace(' *','')+' '+v('pk-term')):
    pt==='hotel'?v('pk-hotel')+', '+v('pk-haddr')+' ('+v('pk-guest')+')':
    pt==='airbnb'?v('pk-baddr')+' — '+t('m-t-airbnb'):v('pk-caddr');
  var drop=q.to.air?(t('m-term').replace(' *','')+' '+v('dl-term')+' · '+v('dl-flight')+' '+v('dl-ftime')):
    dt==='hotel'?v('dl-hotel')+', '+v('dl-haddr')+' ('+v('dl-guest')+')':
    dt==='airbnb'?v('dl-baddr')+' — '+t('m-t-airbnb'):v('dl-recip')+', '+v('dl-caddr');
  r.push(t('m-from')+': '+t('pl-'+q.from.id)+' · '+fmtDate($('bk-d1').value)+'\n  '+pick);
  r.push((q.toAir?t('m-d2-air'):t('m-to'))+': '+t('pl-'+q.to.id)+' · '+fmtDate($('bk-d2').value)+'\n  '+drop);
  q.lines.forEach(function(x){r.push(x.q+' × '+t('m-b'+x.k)+' = '+yen(x.sum,lang));});
  if(q.sur)r.push(t('m-sur1')+': +'+yen(q.sur,lang));
  if(q.air)r.push(t('m-sur-air')+': +'+yen(q.air,lang));
  r.push((q.isQuote?t('m-quote')+' ('+(en?'from ':'desde ')+yen(q.total,lang)+')':t('m-total')+': '+yen(q.total,lang)));
  return r.join('\n');
}

/* Datos de la etiqueta de Yamato, en japonés, listos para copiar */
function jpLabel(q){
  var o=[],name=$('bk-name').value.trim(),tel=$('bk-wa').value.trim();
  var d1=$('bk-d1').value.replace(/-/g,'/'),d2=$('bk-d2').value.replace(/-/g,'/');
  var pt=$('pk-type').value,dt=$('dl-type').value,slot=JP_SLOT[v('dl-hslot')||v('dl-cslot')]||'';
  var cont=contents().map(function(k){return JP_CONT[k];});if($('bk-otros').value.trim())cont.push($('bk-otros').value.trim());
  if(q.to.air){
    o.push('【お届け先】'+JP_AIR[q.to.id]+' '+v('dl-term')+'（空港宅急便）');
    o.push('搭乗日：'+d2+'　便名：'+v('dl-flight')+'　出発時刻：'+v('dl-ftime'));
    o.push('搭乗者名：'+name+' 様');
  }else if(dt==='hotel'){
    o.push('【お届け先】'+v('dl-hotel'));o.push(v('dl-haddr'));if(v('dl-htel'))o.push('TEL '+v('dl-htel'));
    o.push('宿泊者名：'+v('dl-guest')+' 様'+(v('dl-resv')?'（予約番号 '+v('dl-resv')+'）':''));
  }else if(dt==='airbnb'){
    o.push('【お届け先】ヤマト運輸 営業所止め（'+v('dl-baddr')+' の最寄り営業所）');o.push('受取人：'+name+' 様');
  }else{
    o.push('【お届け先】'+v('dl-recip')+' 様');o.push(v('dl-caddr'));o.push('TEL '+v('dl-ctel'));
  }
  if(!q.to.air&&dt!=='airbnb')o.push('【お届け予定日】'+d2+(slot?'　【時間帯】'+slot:''));
  o.push('【ご依頼主】'+name+'　TEL '+tel);
  o.push('【品名】'+cont.join('・')+($('bk-fragil').checked?'　【ワレモノ注意】':''));
  o.push('【個数】'+q.n+'個（'+q.lines.map(function(x){return JP_SIZE[x.k]+'サイズ以内×'+x.q;}).join('、')+'）');
  if(q.from.air)o.push('【受付】'+JP_AIR[q.from.id]+' '+v('pk-term')+' 空港カウンター持込　'+d1+(v('pk-arr')?'　到着便 '+v('pk-arr'):''));
  else if(pt==='hotel')o.push('【集荷】'+v('pk-hotel')+'（'+v('pk-haddr')+'）フロント預け　宿泊者名：'+v('pk-guest')+' 様　'+d1);
  else if(pt==='airbnb')o.push('【持込】'+v('pk-baddr')+' 付近のコンビニまたは営業所　'+d1);
  else o.push('【集荷】'+v('pk-caddr')+'　TEL '+v('pk-ctel')+'　'+d1);
  return o.join('\n');
}

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
