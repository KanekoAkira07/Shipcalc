/* =====================================================================
   ShipCalc · textos e interacción de portada, maletas, envío y consigna
   (la calculadora usa data/app.js)
   ===================================================================== */
(function(){
'use strict';
var T={
es:{
 'nav-bags':'Maletas a tu hotel','nav-calc':'Calculadora','nav-ship':'Lo enviamos por ti','nav-store':'Guardar maleta',
 'h-title':'Envíos y maletas en Japón, sin complicaciones',
 'h-sub':'Calcula cuánto cuesta enviar tus compras, deja que las enviemos por ti o viaja sin maletas. Todo en español.',
 'c-bags-t':'Enviamos tu maleta a tu próximo hotel','c-bags-d':'Recogemos tu maleta y la llevamos a tu siguiente hotel, Airbnb o aeropuerto. Tú viajas ligero.','c-bags-go':'Reservar →',
 'c-calc-t':'Calculadora de envíos','c-calc-d':'¿Cuánto te cuesta de verdad enviar o importar desde Japón, Corea o China? Envío oficial + aduana + impuestos.','c-calc-go':'Calcular gratis →',
 'c-ship-t':'Enviamos tu paquete por ti','c-ship-d':'¿Compraste figuras, juegos o cartas en Japón? Lo revisamos contigo, lo embalamos y lo enviamos a tu país.','c-ship-go':'Solicitar →',
 'c-store-t':'Guarda tu maleta','c-store-d':'Deja tu maleta unas horas o unos días en Tokio y pasea sin peso. Pago por día.','c-store-go':'Avísame cuando abra →',
 'free':'Gratis','soon':'Próximamente',
 'tr1':'Atención en español','tr2':'Envíos con Yamato y Japan Post','tr3':'Tarifas oficiales verificadas','tr4':'Sin registro',
 /* Maletas */
 'b-title':'Viaja por Japón sin cargar maletas',
 'b-lead':'Recogemos tu maleta en tu hotel, Airbnb o aeropuerto y la llevamos a tu próximo destino. Normalmente llega al día siguiente.',
 'b-s1':'Haz tu solicitud','b-s1d':'Dinos desde dónde, hasta dónde, qué día y cuántas maletas. Tarda 2 minutos.',
 'b-s2':'Te confirmamos precio y hora','b-s2d':'Te escribimos por email o WhatsApp con el precio exacto antes de pagar. Sin compromiso.',
 'b-s3':'Entregas la maleta y listo','b-s3d':'La recogemos o la dejas en el punto acordado, y llega a tu siguiente alojamiento.',
 'b-info':'Bueno saber','b-i1':'Plazo habitual: al día siguiente en la mayoría de rutas (Tokio ↔ Osaka, Kioto…). Rutas largas como Hokkaido u Okinawa: 2 días o más.',
 'b-i2':'Reserva con al menos 1 día de antelación. Tu hotel debe aceptar recibir la maleta (casi todos lo hacen).',
 'b-i3':'No se pueden enviar: baterías de litio sueltas, objetos de valor, dinero, aerosoles ni líquidos inflamables.',
 'b-f-title':'Solicita el envío de tu maleta','b-f-sub':'Te respondemos con el precio exacto, normalmente en menos de 24 h.',
 'b-from':'Recogida (ciudad + hotel, Airbnb o aeropuerto) *','b-to':'Entrega (ciudad + hotel, Airbnb o aeropuerto) *',
 'b-date1':'Día de recogida *','b-date2':'Día que la necesitas *','b-n':'Número de maletas',
 'b-small':'Pequeñas','b-med':'Medianas','b-large':'Grandes','b-sizes':'Pequeña: hasta ~55 cm · Mediana: hasta ~70 cm · Grande: más de 70 cm',
 /* Envío */
 's-title':'¿Compraste en Japón? Lo enviamos por ti',
 's-lead':'Recogemos tu paquete, revisamos el contenido contigo, lo embalamos y gestionamos todo el envío internacional. Tú sigues disfrutando del viaje.',
 's-s1':'Calcula el coste del envío','s-s1d':'Usa nuestra calculadora gratis para ver cuánto cuesta el envío, la aduana y los impuestos a tu país.',
 's-s2':'Solicita el servicio','s-s2d':'Rellena el formulario. Si vienes de la calculadora, el cálculo se adjunta solo.',
 's-s3':'Revisamos, embalamos y enviamos','s-s3d':'Revisamos el contenido contigo, lo enviamos y te pasamos el número de seguimiento.',
 's-calc':'Primero, calcula el coste →','s-fee':'Tarifa de gestión (se suma al coste del envío)',
 's-fee-n':'Pagas el envío al precio oficial del operador (Japan Post, DHL, FedEx…) + nuestra tarifa de gestión según el peso.',
 's-rules':'Importante','s-r1':'Revisamos el contenido contigo en persona antes de enviarlo.',
 's-r2':'No aceptamos artículos prohibidos, réplicas de marcas, baterías de litio sueltas ni mercancía sin declarar.',
 's-r3':'Los aranceles e impuestos de tu país los pagas tú al recibirlo (o por adelantado si tu país lo exige).',
 's-f-title':'Solicita el envío de tu paquete','s-f-sub':'Te escribimos en menos de 24 h para confirmar los detalles.',
 's-dest':'País de destino *','s-city':'Ciudad donde estás (Japón)','s-w':'Peso estimado (kg)','s-date':'Fecha aproximada de envío',
 's-notes':'Qué contiene (lo pide la aduana)','s-calc-att':'Cálculo adjunto de la calculadora:',
 /* Consigna */
 'st-title':'Guarda tu maleta en Tokio','st-lead':'Muy pronto abriremos nuestra consigna: deja tu maleta unas horas o varios días y paga solo por los días que la uses.',
 'st-ex':'Por ejemplo','st-e1':'Tu hotel te pide salir a las 11:00 pero tu vuelo sale a las 22:00: deja la maleta y pasea todo el día.',
 'st-e2':'Te vas 3 días a Osaka: deja la maleta grande en Tokio y viaja solo con una mochila.',
 'st-f-title':'Avísame cuando abra','st-f-sub':'Déjanos tu email y te avisamos primero (con descuento de lanzamiento).',
 'st-city':'¿En qué ciudad la necesitarías?','st-when':'¿Cuándo viajas?',
 /* Comunes */
 'f-name':'Nombre completo *','f-email':'Email *','f-wa':'WhatsApp (opcional, con prefijo del país)','f-notes':'Comentarios',
 'f-privacy':'Usaremos tus datos solo para responder a esta solicitud.',
 'f-send':'Enviar solicitud','f-wait':'Apuntarme','f-ok':'¡Solicitud recibida!','f-ok-sub':'Te escribiremos por email en menos de 24 horas.',
 'f-req':'Rellena los campos obligatorios (*).','f-err':'No se pudo enviar. Revisa tu conexión e inténtalo de nuevo.',
 'faq':'Preguntas frecuentes',
 'q1':'¿Cuánto cuesta?','a1':'Depende de la ruta, el tamaño y el número de maletas. Te enviamos el precio exacto antes de pagar, sin compromiso.',
 'q2':'¿Y si mi maleta se daña o se pierde?','a2':'Viaja asegurada por el transportista. Antes de reservar te explicamos la cobertura.',
 'q3':'¿Puedo enviar la maleta al aeropuerto?','a3':'Sí, a los principales aeropuertos (Narita, Haneda, Kansai…). Suele hacer falta enviarla con 2 días de antelación al vuelo.',
 footer:'ShipCalc · Envíos y logística para viajeros en Japón',
 privacy:'Privacidad: los datos de los formularios se usan solo para responderte.'
},
en:{
 'nav-bags':'Luggage to your hotel','nav-calc':'Calculator','nav-ship':'We ship it for you','nav-store':'Luggage storage',
 'h-title':'Shipping and luggage in Japan, made simple',
 'h-sub':'See what it really costs to ship your purchases, let us ship them for you, or travel without your suitcase.',
 'c-bags-t':'We send your suitcase to your next hotel','c-bags-d':'We pick up your suitcase and take it to your next hotel, Airbnb or airport. You travel light.','c-bags-go':'Book →',
 'c-calc-t':'Shipping calculator','c-calc-d':'What does it really cost to ship or import from Japan, Korea or China? Official shipping + customs + taxes.','c-calc-go':'Calculate for free →',
 'c-ship-t':'We ship your package for you','c-ship-d':'Bought figures, games or cards in Japan? We check them with you, pack them and ship them home.','c-ship-go':'Request →',
 'c-store-t':'Store your luggage','c-store-d':'Leave your suitcase for a few hours or days in Tokyo and explore hands-free. Pay per day.','c-store-go':'Tell me when it opens →',
 'free':'Free','soon':'Coming soon',
 'tr1':'Support in Spanish and English','tr2':'Shipped with Yamato and Japan Post','tr3':'Verified official rates','tr4':'No sign-up',
 'b-title':'Travel around Japan without carrying your luggage',
 'b-lead':'We pick up your suitcase at your hotel, Airbnb or airport and take it to your next stop. It usually arrives the next day.',
 'b-s1':'Send your request','b-s1d':'Tell us from where, to where, which day and how many bags. Takes 2 minutes.',
 'b-s2':'We confirm price and time','b-s2d':'We email or WhatsApp you the exact price before you pay. No commitment.',
 'b-s3':'Hand over your bag','b-s3d':'We collect it or you drop it at the agreed point, and it arrives at your next stay.',
 'b-info':'Good to know','b-i1':'Usual timing: next day on most routes (Tokyo ↔ Osaka, Kyoto…). Long routes such as Hokkaido or Okinawa: 2 days or more.',
 'b-i2':'Book at least 1 day ahead. Your hotel must accept the delivery (almost all do).',
 'b-i3':'Not allowed: loose lithium batteries, valuables, cash, aerosols or flammable liquids.',
 'b-f-title':'Request your luggage delivery','b-f-sub':'We reply with the exact price, usually within 24 h.',
 'b-from':'Pickup (city + hotel, Airbnb or airport) *','b-to':'Delivery (city + hotel, Airbnb or airport) *',
 'b-date1':'Pickup day *','b-date2':'Day you need it *','b-n':'Number of bags',
 'b-small':'Small','b-med':'Medium','b-large':'Large','b-sizes':'Small: up to ~55 cm · Medium: up to ~70 cm · Large: over 70 cm',
 's-title':'Bought something in Japan? We ship it for you',
 's-lead':'We pick up your package, check the contents with you, pack it and handle the whole international shipment. You keep enjoying your trip.',
 's-s1':'Calculate the shipping cost','s-s1d':'Use our free calculator to see shipping, customs and taxes to your country.',
 's-s2':'Request the service','s-s2d':'Fill in the form. If you come from the calculator, your calculation is attached automatically.',
 's-s3':'We check, pack and ship','s-s3d':'We check the contents with you, ship it and send you the tracking number.',
 's-calc':'First, calculate the cost →','s-fee':'Handling fee (added to the shipping cost)',
 's-fee-n':'You pay shipping at the carrier\'s official price (Japan Post, DHL, FedEx…) + our handling fee by weight.',
 's-rules':'Important','s-r1':'We check the contents with you in person before shipping.',
 's-r2':'We do not accept prohibited items, brand replicas, loose lithium batteries or undeclared goods.',
 's-r3':'Your country\'s duties and taxes are paid by you on arrival (or in advance if your country requires it).',
 's-f-title':'Request shipping for your package','s-f-sub':'We will email you within 24 h to confirm the details.',
 's-dest':'Destination country *','s-city':'City where you are (Japan)','s-w':'Estimated weight (kg)','s-date':'Approximate shipping date',
 's-notes':'Contents (required by customs)','s-calc-att':'Attached calculation:',
 'st-title':'Store your luggage in Tokyo','st-lead':'Our luggage storage opens soon: leave your suitcase for a few hours or several days and pay only for the days you use.',
 'st-ex':'For example','st-e1':'Your hotel checkout is at 11:00 but your flight leaves at 22:00: leave your bag and enjoy the day.',
 'st-e2':'Going to Osaka for 3 days: leave your big suitcase in Tokyo and travel with just a backpack.',
 'st-f-title':'Tell me when it opens','st-f-sub':'Leave your email and we will tell you first (with a launch discount).',
 'st-city':'Which city would you need it in?','st-when':'When are you travelling?',
 'f-name':'Full name *','f-email':'Email *','f-wa':'WhatsApp (optional, with country code)','f-notes':'Comments',
 'f-privacy':'We will only use your data to reply to this request.',
 'f-send':'Send request','f-wait':'Notify me','f-ok':'Request received!','f-ok-sub':'We will email you within 24 hours.',
 'f-req':'Fill in the required fields (*).','f-err':'It could not be sent. Check your connection and try again.',
 'faq':'FAQ',
 'q1':'How much does it cost?','a1':'It depends on the route, size and number of bags. We send you the exact price before you pay, no commitment.',
 'q2':'What if my suitcase is damaged or lost?','a2':'It is insured by the carrier. We explain the coverage before you book.',
 'q3':'Can I send my suitcase to the airport?','a3':'Yes, to the main airports (Narita, Haneda, Kansai…). It usually needs to be sent 2 days before your flight.',
 footer:'ShipCalc · Shipping and logistics for travellers in Japan',
 privacy:'Privacy: form data is only used to reply to you.'
}};
var lang='es';
function $(id){return document.getElementById(id);}
function t(k){return (T[lang]&&T[lang][k])||T.es[k]||'';}
function apply(){
  document.documentElement.lang=lang;
  document.querySelectorAll('[data-i]').forEach(function(el){el.textContent=t(el.getAttribute('data-i'));});
  document.querySelectorAll('[data-ph]').forEach(function(el){el.placeholder=t(el.getAttribute('data-ph'));});
  document.querySelectorAll('.lang button').forEach(function(b){b.classList.toggle('on',b.getAttribute('data-lang')===lang);});
  var y=$('year');if(y)y.textContent=new Date().getFullYear();
}
function setLang(l){lang=(l==='en')?'en':'es';try{localStorage.setItem('sc_lang',lang);}catch(e){}apply();}
function validEmail(v){return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);}
function wire(form){
  var msg=form.querySelector('.msg'),ok=document.getElementById(form.getAttribute('data-ok'));
  form.addEventListener('submit',function(e){
    e.preventDefault();msg.style.display='none';
    var req=form.querySelectorAll('[required]');
    for(var i=0;i<req.length;i++){var el=req[i];var bad=(el.type==='checkbox')?!el.checked:(!el.value.trim()||(el.type==='email'&&!validEmail(el.value.trim())));
      if(bad){msg.textContent=t('f-req');msg.className='msg err';msg.style.display='block';el.focus();return;}}
    var btn=form.querySelector('button[type=submit]');btn.disabled=true;
    fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(new FormData(form)).toString()})
      .then(function(r){if(!r.ok)throw new Error(r.status);form.style.display='none';if(ok)ok.style.display='block';})
      .catch(function(){msg.textContent=t('f-err');msg.className='msg err';msg.style.display='block';})
      .then(function(){btn.disabled=false;});
  });
}
/* Rellenar el formulario de envío con los datos que vienen de la calculadora */
function prefill(){
  var p=new URLSearchParams(location.search);
  var map={dest:'s-dest-in',kg:'s-w-in'};
  for(var k in map){var v=p.get(k),el=$(map[k]);if(v&&el)el.value=v.slice(0,80);}
  var c=p.get('calc'),box=$('calc-box'),hid=$('calc-hidden');
  if(c&&box&&hid){c=c.slice(0,900);hid.value=c;box.style.display='block';$('calc-text').textContent=c;}
}
function init(){
  var l=null;try{l=localStorage.getItem('sc_lang');}catch(e){}
  if(!l){var nl=(navigator.languages&&navigator.languages[0])||navigator.language||'es';l=/^en/i.test(nl)?'en':'es';}
  lang=(l==='en')?'en':'es';
  document.querySelectorAll('.lang button').forEach(function(b){b.addEventListener('click',function(){setLang(b.getAttribute('data-lang'));});});
  document.querySelectorAll('form[data-netlify]').forEach(wire);
  document.querySelectorAll('input[type=date]').forEach(function(d){d.min=new Date().toISOString().slice(0,10);});
  prefill();apply();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
