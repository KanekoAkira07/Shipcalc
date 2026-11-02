/* =====================================================================
   ShipCalc · textos e interacción de portada, maletas, envío, consigna y guías
   (la calculadora usa data/app.js)
   Los textos entre llaves, como {from}, se rellenan con los precios de data/maletas.js
   ===================================================================== */
(function(){
'use strict';
var T={
es:{
 'nav-bags':'Maletas a tu hotel','nav-calc':'Calculadora','nav-ship':'Lo enviamos por ti','nav-store':'Guardar maleta',
 'h-title':'Envíos y maletas en Japón, sin complicaciones',
 'h-sub':'Viaja sin cargar maletas, calcula cuánto cuesta enviar tus compras o deja que las enviemos por ti. Todo en español.',
 'c-bags-t':'Enviamos tu maleta a tu próximo hotel','c-bags-d':'De hotel a hotel o al aeropuerto, normalmente al día siguiente. Desde {from} por maleta.','c-bags-go':'Reservar →',
 'c-calc-t':'Calculadora de envíos','c-calc-d':'¿Cuánto te cuesta de verdad enviar o importar desde Japón, Corea o China? Envío oficial + aduana + impuestos.','c-calc-go':'Calcular gratis →',
 'c-ship-t':'Enviamos tu paquete por ti','c-ship-d':'¿Compraste figuras, juegos o cartas, o vuelves con una maleta de más? Lo revisamos contigo, lo embalamos y lo enviamos a tu país.','c-ship-go':'Solicitar →',
 'c-store-t':'Guarda tu maleta','c-store-d':'Deja tu maleta unas horas o unos días en Tokio y pasea sin peso. Pago por día.','c-store-go':'Avísame cuando abra →',
 'free':'Gratis','soon':'Próximamente',
 'tr1':'Atención en español','tr2':'Envíos con Yamato y Japan Post','tr3':'Tarifas oficiales verificadas','tr4':'Sin registro',
 'g-title':'Guías para tu viaje a Japón','g1-t':'Cómo enviar tu maleta en Japón (takkyubin)','g1-d':'Precios oficiales, tamaños, envío al aeropuerto y normas del Shinkansen para maletas grandes.','g-read':'Leer la guía →',
 'g2-t':'¿Cuánto cuesta traer tus compras de Japón?','g2-d':'Envío, aduana e impuestos de tu país en un solo cálculo, con tarifas oficiales.','g2-go':'Abrir la calculadora →',
 /* ---------- Maletas ---------- */
 'b-title':'Envía tu maleta a tu próximo hotel en Japón',
 'b-lead':'De hotel a hotel o al aeropuerto: Tokio, Kioto, Osaka y más. Desde {from} por maleta y normalmente al día siguiente. Reserva en 2 minutos, en español.',
 'm-t1':'Pagas cuando confirmamos tu reserva','m-t2':'Seguro del transportista hasta ¥300.000 por maleta','m-t3':'Atención en español','m-t4':'Normalmente llega al día siguiente',
 'm-w-title':'Reserva tu envío de maletas','m-st1':'Ruta y maletas','m-st2':'Direcciones','m-st3':'Tus datos','m-st4':'Pago',
 'm-from':'Recogida','m-to':'Entrega','m-choose':'Elige ciudad o aeropuerto','m-g-city':'Ciudades','m-g-air':'Aeropuertos','m-g-other':'Otra',
 'm-next-t':'Qué pasa ahora',
 'm-n1':'Te confirmamos por WhatsApp o email, en menos de 24 h, el precio final y te enviamos el enlace de pago.',
 'm-n2':'Cuando pagas, organizamos la recogida con Yamato y te mandamos la hora y, si hace falta, la etiqueta o el código para tu maleta.',
 'm-n3-hotel':'El {d1}, deja la maleta en la recepción de {hotel} a nombre de {guest}.',
 'm-n3-airbnb':'El {d1}, lleva la maleta a la tienda 7-Eleven o FamilyMart, o a la oficina de Yamato, que te indiquemos.',
 'm-n3-casa':'El {d1}, el repartidor pasa a recogerla por {addr}. Tiene que haber alguien.',
 'm-n3-air':'El {d1}, al llegar, entrega la maleta en el mostrador de Yamato: {term}.',
 'm-n4-hotel':'Tu maleta llega a {hotel} el {d2}. Pídela en recepción a nombre de {guest}.',
 'm-n4-airbnb':'Recógela en la oficina de Yamato que te indiquemos, con tu pasaporte y el número de envío.',
 'm-n4-casa':'Llega a {addr} el {d2}.',
 'm-n4-air':'Recógela el {d2}, día de tu vuelo, dentro del horario del mostrador de Yamato: {term}.',
 'm-wa':'Escríbenos por WhatsApp','m-wa-msg':'Hola, acabo de reservar el envío de maletas {id}.','m-copy':'Copiar instrucciones','m-copied':'Copiado ✓',
 'm-fx':'aprox.','m-fx-n':'Se cobra en yenes. El cambio a tu moneda es orientativo.','m-cur':'Moneda',
 'm-intl':'¿Quieres enviar la maleta a tu país? Lo hacemos en «Lo enviamos por ti» →',
 'm-pick-t':'Dónde dejas la maleta','m-drop-t':'Dónde la recibes','m-ptype':'Tipo de alojamiento',
 'm-t-hotel':'Hotel o ryokan con recepción','m-t-airbnb':'Airbnb o apartamento sin recepción','m-t-home':'Casa particular (con alguien en casa)',
 'm-hotel':'Nombre del hotel *','m-hotel-addr':'Dirección del hotel *','m-hotel-tel':'Teléfono del hotel (opcional)',
 'm-guest':'Nombre de la reserva del hotel *','m-resv':'Número de reserva del hotel (opcional)',
 'm-addr':'Dirección del alojamiento *','m-home-addr':'Dirección completa con código postal *','m-recip':'Nombre de quien la recibe *','m-tel-jp':'Teléfono de esa dirección *',
 'm-slot':'Franja de entrega','m-slot-any':'Sin preferencia','m-slot-am':'Por la mañana',
 'm-term':'Terminal *','m-flight-arr':'Vuelo de llegada (opcional)','m-flight':'Aerolínea y número de vuelo *','m-ftime':'Hora de salida del vuelo *',
 'm-n-pick-hotel':'El día de recogida dejas la maleta en recepción a nombre de tu reserva y el hotel se la entrega al transportista.',
 'm-n-pick-airbnb':'Yamato no recoge en alojamientos sin recepción. Dejarás la maleta en una tienda 7-Eleven o FamilyMart o en una oficina de Yamato cercana: te decimos cuál y cómo.',
 'm-n-pick-home':'El transportista pasa a recogerla por esa dirección el día elegido. Tiene que haber alguien en casa.',
 'm-n-pick-air':'Al llegar, entregas la maleta en el mostrador de envíos del aeropuerto. Te enviamos las instrucciones.',
 'm-n-drop-hotel':'El hotel la recibe a nombre de tu reserva. Si es un alojamiento pequeño, confirma antes que acepta equipaje de huéspedes.',
 'm-n-drop-airbnb':'Yamato no entrega en alojamientos sin recepción: la enviamos a la oficina de Yamato más cercana y la recoges allí con tu pasaporte. Te mandamos la dirección.',
 'm-n-drop-home':'Tiene que haber alguien en casa para recibirla.',
 'm-n-drop-air':'La recoges en el mostrador de Yamato de esa terminal el día del vuelo. Fuera de su horario no se puede recoger: ojo con los vuelos muy temprano o de madrugada. Te enviamos el número de envío y las instrucciones.',
 'm-checkin':'Fecha de entrada en el hotel *','m-pslot':'Franja de recogida','m-pslot-am':'Antes de las 13:00',
 'm-precision':'Lleva aparatos electrónicos delicados',
 'm-n-airroute':'Esta ruta viaja en avión: no se pueden enviar aerosoles, perfumes ni otros líquidos, mecheros ni baterías de litio (power banks).',
 'm-e-max':'Máximo {maxtotal} maletas por reserva. Si son más, haz otra reserva.',
 'm-term-pick':'Elige la terminal',
 'm-cont':'¿Qué llevan las maletas? *','m-cont-n':'El transportista exige indicar el contenido.',
 'm-c-ropa':'Ropa','m-c-calzado':'Calzado','m-c-aseo':'Aseo y cosmética','m-c-libros':'Libros','m-c-souv':'Souvenirs','m-c-elec':'Electrónica','m-c-fig':'Figuras y juguetes','m-c-otros':'Otras cosas (escríbelas)',
 'm-fragil':'Lleva objetos frágiles','m-tel':'Teléfono o WhatsApp, con prefijo del país *',
 'm-e-cont':'Indica qué llevan las maletas.','m-e-tel':'Escribe un teléfono o WhatsApp.','m-e-time':'Escribe la hora de salida del vuelo.',
 'm-d1':'Día de recogida','m-d2':'Día de entrega','m-d2-air':'Día de tu vuelo','m-bags':'Maletas',
 'm-bs':'Pequeña','m-bs-d':'Mochila o bolsa · hasta 5 kg','m-bm':'Mediana','m-bm-d':'Cabina o mediana · hasta 15 kg',
 'm-bl':'Grande','m-bl-d':'Maleta facturada · hasta 25 kg','m-bx':'Especial','m-bx-d':'XL, golf o esquí · hasta 30 kg',
 'm-less':'Quitar una','m-more':'Añadir una',
 'm-ps':'{p_s}','m-pm':'{p_m}','m-pl':'{p_l}','m-px':'{p_x}','m-smax':'{s_max}','m-mmax':'{m_max}','m-lmax':'{l_max}','m-xmax':'{x_max}','nav-aria':'Servicios',
 'm-sur1':'Suplemento por distancia','m-sur-air':'Entrega en aeropuerto','m-total':'Total','m-quote':'Precio a confirmar',
 'm-quote-d':'Para esta ruta te confirmamos el precio exacto por email antes de pagar. Te mostramos el precio mínimo.',
 'm-eta':'Entrega estimada','m-eta-1':'al día siguiente','m-eta-2':'en 1–2 días','m-eta-air':'en el aeropuerto el día antes de tu vuelo','m-eta-q':'a confirmar',
 'm-next':'Continuar','m-back':'← Atrás','m-pay':'Pagar','m-reserve':'Reservar',
 'm-e-place':'Elige la recogida y la entrega.','m-e-addr':'Escribe el hotel o la dirección de recogida y de entrega.','m-e-bags':'Añade al menos una maleta.',
 'm-e-d1':'Elige el día de recogida (como pronto, mañana).','m-e-d2':'El día de entrega tiene que ser posterior al de recogida.',
 'm-e-air':'Al aeropuerto hay que enviarla al menos {airdays} días antes del vuelo.','m-e-acc':'Marca la casilla para continuar.',
 'm-acc':'Confirmo que mi equipaje no lleva artículos prohibidos (baterías de litio sueltas, dinero, objetos de valor, aerosoles ni líquidos inflamables) y que cada maleta vale menos de ¥300.000.',
 'm-sum':'Tu reserva','m-pay-t':'Pago seguro',
 'm-pay-d':'Pagas con tarjeta mediante un enlace de pago seguro que te enviamos al confirmar la recogida. Ahora no se cobra nada.',
 'm-pay-d-link':'Al pulsar «Pagar» irás a la página de pago seguro.',
 'm-ok':'¡Reserva recibida!','m-ok-d':'Tu número de reserva es','m-ok-d2':'Te escribimos por email en menos de 24 h para confirmar la hora de recogida y enviarte el enlace de pago.','m-new':'Hacer otra reserva',
 'm-how':'Cómo funciona',
 'm-h1t':'Reserva online','m-h1d':'Elige ruta, día y maletas. Ves el precio al momento.',
 'm-h2t':'Entrega tu maleta','m-h2d':'Déjala en la recepción de tu hotel. Si te alojas en un Airbnb, la dejas en una tienda o una oficina cercana: te decimos cuál.',
 'm-h3t':'Viaja ligero','m-h3d':'Tu maleta te espera en tu próximo hotel o en el aeropuerto.',
 'm-uc':'Para cada tramo de tu viaje','m-uc1':'Hotel → hotel','m-uc2':'Aeropuerto → hotel','m-uc3':'Hotel → aeropuerto',
 'm-uc1d':'¿Cambias de ciudad? Envía la maleta por la mañana y viaja en Shinkansen solo con una mochila. Normalmente llega al día siguiente a tu próximo alojamiento.',
 'm-uc2d':'Aterriza en Narita, Haneda o Kansai y sal directo a pasear. Te indicamos dónde entregar la maleta en el aeropuerto y llega a tu hotel, normalmente, al día siguiente.',
 'm-uc3d':'Envía tu maleta al aeropuerto de salida y recógela en el mostrador el día del vuelo. Hay que enviarla al menos 2 días antes (3 en algunas zonas).',
 'm-routes':'Rutas populares','m-r-next':'Al día siguiente','m-r-air':'Envíala 2 días antes del vuelo','m-from-p':'Desde {from}','m-from-air':'Desde {from_air}',
 'm-prices':'Precios por maleta','m-p-size':'Tamaño','m-p-ex':'Ejemplos','m-p-max':'Máximo','m-p-price':'Precio',
 'm-p-s-ex':'Mochila, bolsa de viaje','m-p-m-ex':'Maleta de cabina o mediana','m-p-l-ex':'Maleta grande facturada','m-p-x-ex':'Maleta XL, bolsa de golf, esquís, snowboard',
 'm-p-n1':'Precios con impuestos para rutas entre Tokio, Kioto, Osaka, Nagoya y las principales ciudades. Algunas rutas largas (por ejemplo, Tokio ↔ Hiroshima, Fukuoka o Sapporo) tienen un suplemento de {t1} o {t2} por maleta, y la entrega en aeropuerto suma {air} por maleta: lo verás en el total antes de reservar. Okinawa y otras ciudades: precio a confirmar.',
 'm-p-n2':'Medida = largo + ancho + alto. ¿Tu maleta pasa de 30 kg o 180 cm? Escríbenos en la reserva y te damos precio.',
 'm-cmp':'Envíala con ShipCalc o hazlo tú','m-c-us':'ShipCalc','m-c-diy':'Enviarla tú','m-c-carry':'Llevarla contigo',
 'm-c1':'No cargas la maleta por el metro ni en el Shinkansen','m-c2':'Reserva y ayuda en español','m-c3':'Lo organizamos todo por ti: recogida, etiqueta y entrega',
 'm-c4':'Sin el cargo de ¥1.000 del Shinkansen por maleta grande sin reserva','m-c5':'Te ayudamos si hay algún problema con el envío',
 'yes':'Sí','no':'No','na':'No aplica',
 'm-c-note':'En los Shinkansen Tokaido, Sanyo, Kyushu y Nishi-Kyushu, las maletas de 161 a 250 cm (largo + ancho + alto) necesitan un asiento reservado con espacio para equipaje grande; sin reserva se cobran ¥1.000.',
 'm-guide':'¿Prefieres hacerlo tú? Lee nuestra guía para enviar maletas en Japón →',
 'm-q1':'¿Cuánto cuesta enviar una maleta en Japón?','m-a1':'Con ShipCalc, desde {p_s} (pequeña), {p_m} (mediana), {p_l} (grande) y {p_x} (especial) por maleta entre las ciudades principales. Algunas rutas largas tienen suplemento y la entrega en aeropuerto suma {air} por maleta. Ves el total antes de reservar.',
 'm-q2':'¿Cuánto tarda en llegar?','m-a2':'Normalmente al día siguiente entre Tokio, Kioto, Osaka y la mayoría de ciudades de Honshu. Hokkaido y Kyushu: 1–2 días. Al aeropuerto, envíala al menos 2 días antes del vuelo (3 en algunas zonas).',
 'm-q3':'¿Puedo enviarla al aeropuerto?','m-a3':'Sí, a los mostradores de Yamato de Narita, Haneda, Kansai, Itami, Chubu, Fukuoka, New Chitose e Hiroshima. La maleta llega el día antes de tu vuelo y la recoges en el mostrador con tu resguardo. Fuera del horario del mostrador no se puede recoger: ojo con los vuelos muy temprano o de madrugada.',
 'm-q4':'¿Cómo mido mi maleta?','m-a4':'Suma largo + ancho + alto. Por ejemplo, una maleta de cabina de 55 × 40 × 20 cm mide 115 cm (mediana) y una grande de 75 × 50 × 30 cm mide 155 cm (grande).',
 'm-q5':'¿Está asegurada?','m-a5':'Sí. El transportista cubre hasta ¥300.000 por maleta. No envíes dinero, joyas ni objetos de más valor.',
 'm-q6':'¿Cómo y cuándo pago?','m-a6':'Reservas aquí sin pagar nada. Cuando confirmamos la recogida te enviamos un enlace de pago seguro con tarjeta.',
 'm-q7':'¿Qué no se puede enviar?','m-a7':'Baterías de litio sueltas (power banks), dinero, objetos de valor, aerosoles, líquidos inflamables y cualquier mercancía peligrosa.',
 'm-q8':'¿Y si me alojo en un Airbnb?','m-a8':'Yamato no recoge ni entrega en alojamientos sin recepción. Para enviarla, dejas la maleta en una tienda 7-Eleven o FamilyMart o en una oficina de Yamato cercana. Para recibirla, la enviamos a la oficina de Yamato más cercana y la recoges allí. Te enviamos las direcciones exactas.',
 'm-band-t':'Viaja por Japón sin cargar maletas','m-band-btn':'Reservar ahora',
 /* ---------- Lugares ---------- */
 'pl-tokyo':'Tokio','pl-kyoto':'Kioto','pl-osaka':'Osaka','pl-yokohama':'Yokohama','pl-hakone':'Hakone','pl-kawaguchiko':'Kawaguchiko (monte Fuji)','pl-nikko':'Nikko',
 'pl-nara':'Nara','pl-kobe':'Kobe','pl-nagoya':'Nagoya','pl-takayama':'Takayama','pl-kanazawa':'Kanazawa','pl-hiroshima':'Hiroshima',
 'pl-fukuoka':'Fukuoka','pl-sapporo':'Sapporo','pl-okinawa':'Okinawa (Naha)',
 'pl-NRT':'Aeropuerto de Narita (NRT)','pl-HND':'Aeropuerto de Haneda (HND)','pl-KIX':'Aeropuerto de Kansai (KIX)','pl-NGO':'Aeropuerto de Chubu (NGO)',
 'pl-FUK':'Aeropuerto de Fukuoka (FUK)','pl-CTS':'Aeropuerto de New Chitose (CTS)','pl-ITM':'Aeropuerto de Osaka-Itami (ITM)','pl-HIJ':'Aeropuerto de Hiroshima (HIJ)','pl-other':'Otra ciudad (precio a confirmar)',
 /* ---------- Envío ---------- */
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
 's-what':'¿Qué quieres enviar? *','s-w-compras':'Compras (figuras, juegos, cartas…)','s-w-maleta':'Una maleta o equipaje a mi país','s-w-ambos':'Las dos cosas',
 's-w-n':'Por correo (EMS de Japan Post) cada bulto puede pesar hasta 30 kg. Te decimos la mejor opción para tu maleta.',
 's-dest':'País de destino *','s-city':'Ciudad donde estás (Japón)','s-w':'Peso estimado (kg)','s-date':'Fecha aproximada de envío',
 's-notes':'Qué contiene (lo pide la aduana)','s-calc-att':'Cálculo adjunto de la calculadora:',
 'sq1':'¿Cuánto cuesta enviar un paquete desde Japón a mi país?','sa1':'Depende del peso, del servicio y del país. En la calculadora ves el precio oficial de Japan Post, DHL o FedEx con la aduana y los impuestos de tu país. A eso se suma nuestra tarifa de gestión, desde ¥1.500.',
 'sq2':'¿Qué puedo enviar?','sa2':'Figuras, videojuegos, consolas, cartas, ropa, libros, tu maleta y casi cualquier compra hecha en Japón. No aceptamos artículos prohibidos, réplicas de marcas, baterías de litio sueltas ni mercancía sin declarar.',
 'sq3':'¿Quién paga la aduana?','sa3':'Tú, al recibir el paquete (o por adelantado si tu país lo exige). La calculadora te dice cuánto será aproximadamente antes de enviarlo.',
 /* ---------- Consigna ---------- */
 'st-title':'Guarda tu maleta en Tokio','st-lead':'Muy pronto abriremos nuestra consigna: deja tu maleta unas horas o varios días y paga solo por los días que la uses.',
 'st-ex':'Por ejemplo','st-e1':'Tu hotel te pide salir a las 11:00 pero tu vuelo sale a las 22:00: deja la maleta y pasea todo el día.',
 'st-e2':'Te vas 3 días a Osaka: deja la maleta grande en Tokio y viaja solo con una mochila.',
 'st-f-title':'Avísame cuando abra','st-f-sub':'Déjanos tu email y te avisamos primero (con descuento de lanzamiento).',
 'st-city':'¿En qué ciudad la necesitarías?','st-when':'¿Cuándo viajas?','st-alt':'¿Necesitas mover la maleta a otra ciudad? Eso ya lo hacemos →',
 /* ---------- Guía ---------- */
 'home':'Inicio','bc-guides':'Guías','gd-cta-t':'¿Prefieres que lo hagamos por ti?','gd-cta-d':'Reserva online en español, ves el precio al momento y pagas cuando confirmamos. Desde {from} por maleta.','gd-cta-b':'Reservar envío de maletas →',
 'gq1':'¿Qué es el takkyubin?','ga1':'Es el servicio de paquetería puerta a puerta de Japón (宅急便, de Yamato Transport, la empresa del gato negro). Se usa muchísimo para enviar maletas entre hoteles, casas y aeropuertos.',
 'gq2':'¿Cuánto cuesta enviar una maleta con Yamato?','ga2':'Depende del tamaño y de la distancia. De Tokio a Osaka o Kioto, la tarifa general es de ¥2.780 hasta 140 cm y 20 kg, ¥3.160 hasta 160 cm y 25 kg, y ¥4.480 hasta 180 cm y 30 kg (impuestos incluidos, consultado el 29-10-2026).',
 'gq3':'¿Con cuánta antelación hay que enviarla al aeropuerto?','ga3':'Al menos 2 días antes del vuelo (3 en algunas zonas). La maleta llega al aeropuerto el día antes de tu vuelo y la recoges en el mostrador con el resguardo. Yamato suma ¥660 por enviar al aeropuerto.',
 'gq4':'¿Puedo llevar una maleta grande en el Shinkansen?','ga4':'Sí, pero si mide más de 160 cm (largo + ancho + alto), en los Shinkansen Tokaido, Sanyo, Kyushu y Nishi-Kyushu tienes que reservar un asiento con espacio para equipaje grande; si no, cobran ¥1.000. Más de 250 cm no se permite.',
 /* ---------- Comunes ---------- */
 'f-name':'Nombre completo *','f-email':'Email *','f-wa':'WhatsApp (opcional, con prefijo del país)','f-notes':'Comentarios (opcional)',
 'f-privacy':'Usaremos tus datos solo para responder a esta solicitud.',
 'f-send':'Enviar solicitud','f-wait':'Apuntarme','f-ok':'¡Solicitud recibida!','f-ok-sub':'Te escribiremos por email en menos de 24 horas.',
 'f-req':'Rellena los campos obligatorios (*).','f-err':'No se pudo enviar. Revisa tu conexión e inténtalo de nuevo.',
 'faq':'Preguntas frecuentes',
 'fl-guide':'Guía: enviar maletas en Japón','src-h':'Fuentes oficiales',
 footer:'ShipCalc · Envíos y logística para viajeros en Japón',
 privacy:'Privacidad: los datos de los formularios se usan solo para responderte.',
 'alt':'Esta página también está en español','alt-go':'Ver en español →','alt-x':'Cerrar'
},
en:{
 'nav-bags':'Luggage to your hotel','nav-calc':'Calculator','nav-ship':'We ship it for you','nav-store':'Luggage storage',
 'h-title':'Shipping and luggage in Japan, made simple',
 'h-sub':'Travel without carrying your suitcase, see what it really costs to ship your purchases, or let us ship them for you.',
 'c-bags-t':'We send your suitcase to your next hotel','c-bags-d':'Hotel to hotel or to the airport, usually next day. From {from} per bag.','c-bags-go':'Book →',
 'c-calc-t':'Shipping calculator','c-calc-d':'What does it really cost to ship or import from Japan, Korea or China? Official shipping + customs + taxes.','c-calc-go':'Calculate for free →',
 'c-ship-t':'We ship your package for you','c-ship-d':'Bought figures, games or cards, or going home with an extra suitcase? We check it with you, pack it and ship it home.','c-ship-go':'Request →',
 'c-store-t':'Store your luggage','c-store-d':'Leave your suitcase for a few hours or days in Tokyo and explore hands-free. Pay per day.','c-store-go':'Tell me when it opens →',
 'free':'Free','soon':'Coming soon',
 'tr1':'Support in Spanish and English','tr2':'Shipped with Yamato and Japan Post','tr3':'Verified official rates','tr4':'No sign-up',
 'g-title':'Guides for your trip to Japan','g1-t':'How to send your luggage in Japan (takkyubin)','g1-d':'Official prices, sizes, airport delivery and Shinkansen rules for large suitcases.','g-read':'Read the guide →',
 'g2-t':'What does it cost to bring your purchases home?','g2-d':'Shipping, customs and your country\'s taxes in one calculation, with official rates.','g2-go':'Open the calculator →',
 'b-title':'Send your luggage to your next hotel in Japan',
 'b-lead':'Hotel to hotel or to the airport: Tokyo, Kyoto, Osaka and more. From {from} per bag, usually next day. Book in 2 minutes.',
 'm-t1':'You pay once we confirm your booking','m-t2':'Carrier insurance up to ¥300,000 per bag','m-t3':'Support in Spanish and English','m-t4':'Usually arrives the next day',
 'm-w-title':'Book your luggage delivery','m-st1':'Route & bags','m-st2':'Addresses','m-st3':'Your details','m-st4':'Payment',
 'm-from':'Pickup','m-to':'Drop-off','m-choose':'Choose a city or airport','m-g-city':'Cities','m-g-air':'Airports','m-g-other':'Other',
 'm-next-t':'What happens next',
 'm-n1':'We confirm the final price by WhatsApp or email within 24 h and send you the payment link.',
 'm-n2':'Once you pay, we arrange the pickup with Yamato and send you the time and, if needed, the label or code for your bag.',
 'm-n3-hotel':'On {d1}, leave your bag at the reception of {hotel} under the name {guest}.',
 'm-n3-airbnb':'On {d1}, take your bag to the 7-Eleven or FamilyMart store, or the Yamato office, that we tell you.',
 'm-n3-casa':'On {d1}, the driver collects it at {addr}. Someone must be there.',
 'm-n3-air':'On {d1}, when you land, hand your bag over at the Yamato counter: {term}.',
 'm-n4-hotel':'Your bag arrives at {hotel} on {d2}. Ask for it at reception under the name {guest}.',
 'm-n4-airbnb':'Collect it at the Yamato office we tell you, with your passport and the tracking number.',
 'm-n4-casa':'It arrives at {addr} on {d2}.',
 'm-n4-air':'Collect it on {d2}, your flight day, within the opening hours of the Yamato counter: {term}.',
 'm-wa':'Message us on WhatsApp','m-wa-msg':'Hi, I have just booked luggage delivery {id}.','m-copy':'Copy instructions','m-copied':'Copied ✓',
 'm-fx':'approx.','m-fx-n':'You are charged in yen. The conversion to your currency is approximate.','m-cur':'Currency',
 'm-intl':'Want to send your suitcase to your country? We do that in "We ship it for you" →',
 'm-pick-t':'Where you hand over your bag','m-drop-t':'Where you receive it','m-ptype':'Type of accommodation',
 'm-t-hotel':'Hotel or ryokan with reception','m-t-airbnb':'Airbnb or apartment without reception','m-t-home':'Private home (someone at home)',
 'm-hotel':'Hotel name *','m-hotel-addr':'Hotel address *','m-hotel-tel':'Hotel phone (optional)',
 'm-guest':'Name on the hotel booking *','m-resv':'Hotel booking number (optional)',
 'm-addr':'Accommodation address *','m-home-addr':'Full address with postcode *','m-recip':'Name of the person receiving it *','m-tel-jp':'Phone at that address *',
 'm-slot':'Delivery time slot','m-slot-any':'No preference','m-slot-am':'Morning',
 'm-term':'Terminal *','m-flight-arr':'Arrival flight (optional)','m-flight':'Airline and flight number *','m-ftime':'Flight departure time *',
 'm-n-pick-hotel':'On pickup day you leave your bag at reception under your booking name and the hotel hands it to the carrier.',
 'm-n-pick-airbnb':'Yamato does not collect from accommodation without a reception desk. You will drop your bag at a nearby 7-Eleven or FamilyMart store or a Yamato office: we tell you which one and how.',
 'm-n-pick-home':'The carrier collects it from that address on the chosen day. Someone must be at home.',
 'm-n-pick-air':'When you land, you hand your bag over at the airport delivery counter. We send you the instructions.',
 'm-n-drop-hotel':'The hotel receives it under your booking name. If it is a small property, check first that it accepts guests\' luggage.',
 'm-n-drop-airbnb':'Yamato does not deliver to accommodation without a reception desk: we send it to the nearest Yamato office and you collect it there with your passport. We send you the address.',
 'm-n-drop-home':'Someone must be at home to receive it.',
 'm-n-drop-air':'You collect it at the Yamato counter of that terminal on your flight day. It cannot be collected outside its opening hours: careful with very early or late-night flights. We send you the tracking number and instructions.',
 'm-checkin':'Hotel check-in date *','m-pslot':'Pickup time slot','m-pslot-am':'Before 13:00',
 'm-precision':'Contains delicate electronics',
 'm-n-airroute':'This route travels by plane: aerosols, perfume and other liquids, lighters and lithium batteries (power banks) cannot be sent.',
 'm-e-max':'Maximum {maxtotal} bags per booking. For more, make another booking.',
 'm-term-pick':'Choose the terminal',
 'm-cont':'What is in the bags? *','m-cont-n':'The carrier requires the contents to be stated.',
 'm-c-ropa':'Clothes','m-c-calzado':'Shoes','m-c-aseo':'Toiletries and cosmetics','m-c-libros':'Books','m-c-souv':'Souvenirs','m-c-elec':'Electronics','m-c-fig':'Figures and toys','m-c-otros':'Other items (describe them)',
 'm-fragil':'Contains fragile items','m-tel':'Phone or WhatsApp, with country code *',
 'm-e-cont':'Tell us what is in the bags.','m-e-tel':'Enter a phone or WhatsApp number.','m-e-time':'Enter the flight departure time.',
 'm-d1':'Pickup day','m-d2':'Delivery day','m-d2-air':'Flight day','m-bags':'Bags',
 'm-bs':'Small','m-bs-d':'Backpack or bag · up to 5 kg','m-bm':'Medium','m-bm-d':'Cabin or medium · up to 15 kg',
 'm-bl':'Large','m-bl-d':'Checked suitcase · up to 25 kg','m-bx':'Oversized','m-bx-d':'XL, golf or ski · up to 30 kg',
 'm-less':'Remove one','m-more':'Add one',
 'm-ps':'{p_s}','m-pm':'{p_m}','m-pl':'{p_l}','m-px':'{p_x}','m-smax':'{s_max}','m-mmax':'{m_max}','m-lmax':'{l_max}','m-xmax':'{x_max}','nav-aria':'Services',
 'm-sur1':'Long-distance supplement','m-sur-air':'Airport delivery','m-total':'Total','m-quote':'Price to be confirmed',
 'm-quote-d':'For this route we confirm the exact price by email before you pay. The minimum price is shown.',
 'm-eta':'Estimated delivery','m-eta-1':'next day','m-eta-2':'in 1–2 days','m-eta-air':'at the airport the day before your flight','m-eta-q':'to be confirmed',
 'm-next':'Continue','m-back':'← Back','m-pay':'Pay','m-reserve':'Book',
 'm-e-place':'Choose pickup and drop-off.','m-e-addr':'Enter the pickup and drop-off hotel or address.','m-e-bags':'Add at least one bag.',
 'm-e-d1':'Choose the pickup day (tomorrow at the earliest).','m-e-d2':'The delivery day must be after the pickup day.',
 'm-e-air':'For airport delivery, send it at least {airdays} days before your flight.','m-e-acc':'Tick the box to continue.',
 'm-acc':'I confirm my luggage contains no prohibited items (loose lithium batteries, cash, valuables, aerosols or flammable liquids) and that each bag is worth less than ¥300,000.',
 'm-sum':'Your booking','m-pay-t':'Secure payment',
 'm-pay-d':'You pay by card through a secure payment link we send you when we confirm the pickup. Nothing is charged now.',
 'm-pay-d-link':'When you press "Pay" you will go to the secure payment page.',
 'm-ok':'Booking received!','m-ok-d':'Your booking number is','m-ok-d2':'We will email you within 24 h to confirm the pickup time and send you the payment link.','m-new':'Make another booking',
 'm-how':'How it works',
 'm-h1t':'Book online','m-h1d':'Choose route, day and bags. See the price instantly.',
 'm-h2t':'Hand over your bag','m-h2d':'Leave it at your hotel reception. If you stay in an Airbnb, you drop it at a nearby store or office: we tell you which one.',
 'm-h3t':'Travel light','m-h3d':'Your bag is waiting at your next hotel or at the airport.',
 'm-uc':'For every leg of your trip','m-uc1':'Hotel → hotel','m-uc2':'Airport → hotel','m-uc3':'Hotel → airport',
 'm-uc1d':'Changing cities? Send your bag in the morning and ride the Shinkansen with just a backpack. It usually reaches your next stay the next day.',
 'm-uc2d':'Land at Narita, Haneda or Kansai and start exploring right away. We tell you where to hand over your bag at the airport and it usually reaches your hotel the next day.',
 'm-uc3d':'Send your bag to your departure airport and collect it at the counter on your flight day. It must be sent at least 2 days before (3 in some areas).',
 'm-routes':'Popular routes','m-r-next':'Next day','m-r-air':'Send 2 days before your flight','m-from-p':'From {from}','m-from-air':'From {from_air}',
 'm-prices':'Prices per bag','m-p-size':'Size','m-p-ex':'Examples','m-p-max':'Max','m-p-price':'Price',
 'm-p-s-ex':'Backpack, travel bag','m-p-m-ex':'Cabin or medium suitcase','m-p-l-ex':'Large checked suitcase','m-p-x-ex':'XL suitcase, golf bag, skis, snowboard',
 'm-p-n1':'Prices include tax, for routes between Tokyo, Kyoto, Osaka, Nagoya and the main cities. Some long routes (for example Tokyo ↔ Hiroshima, Fukuoka or Sapporo) have a {t1} or {t2} supplement per bag, and airport delivery adds {air} per bag: you will see it in the total before booking. Okinawa and other cities: price to be confirmed.',
 'm-p-n2':'Size = length + width + height. Over 30 kg or 180 cm? Tell us in your booking and we will quote you.',
 'm-cmp':'Ship it with ShipCalc or do it yourself','m-c-us':'ShipCalc','m-c-diy':'Ship it yourself','m-c-carry':'Carry it',
 'm-c1':'No dragging your bag through the metro and the Shinkansen','m-c2':'Booking and help in Spanish','m-c3':'We organise everything for you: pickup, label and delivery',
 'm-c4':'No ¥1,000 Shinkansen fee for a large bag without a reservation','m-c5':'We help if something goes wrong with the delivery',
 'yes':'Yes','no':'No','na':'Not applicable',
 'm-c-note':'On the Tokaido, Sanyo, Kyushu and Nishi-Kyushu Shinkansen, bags of 161 to 250 cm (length + width + height) need a reserved seat with an oversized baggage area; without it there is a ¥1,000 fee.',
 'm-guide':'Prefer to do it yourself? Read our guide to sending luggage in Japan →',
 'm-q1':'How much does it cost to send a suitcase in Japan?','m-a1':'With ShipCalc, from {p_s} (small), {p_m} (medium), {p_l} (large) and {p_x} (oversized) per bag between the main cities. Some long routes have a supplement and airport delivery adds {air} per bag. You see the total before booking.',
 'm-q2':'How long does it take?','m-a2':'Usually next day between Tokyo, Kyoto, Osaka and most cities on Honshu. Hokkaido and Kyushu: 1–2 days. For the airport, send it at least 2 days before your flight (3 in some areas).',
 'm-q3':'Can I send it to the airport?','m-a3':'Yes, to the Yamato counters at Narita, Haneda, Kansai, Itami, Chubu, Fukuoka, New Chitose and Hiroshima. Your bag arrives the day before your flight and you collect it at the counter with your receipt. It cannot be collected outside the counter\'s opening hours: careful with very early or late-night flights.',
 'm-q4':'How do I measure my suitcase?','m-a4':'Add length + width + height. For example, a 55 × 40 × 20 cm cabin bag is 115 cm (medium) and a 75 × 50 × 30 cm large suitcase is 155 cm (large).',
 'm-q5':'Is it insured?','m-a5':'Yes. The carrier covers up to ¥300,000 per bag. Do not send cash, jewellery or more valuable items.',
 'm-q6':'How and when do I pay?','m-a6':'You book here without paying anything. When we confirm the pickup we send you a secure card payment link.',
 'm-q7':'What can\'t I send?','m-a7':'Loose lithium batteries (power banks), cash, valuables, aerosols, flammable liquids and any dangerous goods.',
 'm-q8':'What if I stay in an Airbnb?','m-a8':'Yamato does not collect from or deliver to accommodation without a reception desk. To send it, you drop your bag at a nearby 7-Eleven or FamilyMart store or a Yamato office. To receive it, we send it to the nearest Yamato office and you collect it there. We send you the exact addresses.',
 'm-band-t':'Travel around Japan without carrying your luggage','m-band-btn':'Book now',
 'pl-tokyo':'Tokyo','pl-kyoto':'Kyoto','pl-osaka':'Osaka','pl-yokohama':'Yokohama','pl-hakone':'Hakone','pl-kawaguchiko':'Kawaguchiko (Mt Fuji)','pl-nikko':'Nikko',
 'pl-nara':'Nara','pl-kobe':'Kobe','pl-nagoya':'Nagoya','pl-takayama':'Takayama','pl-kanazawa':'Kanazawa','pl-hiroshima':'Hiroshima',
 'pl-fukuoka':'Fukuoka','pl-sapporo':'Sapporo','pl-okinawa':'Okinawa (Naha)',
 'pl-NRT':'Narita Airport (NRT)','pl-HND':'Haneda Airport (HND)','pl-KIX':'Kansai Airport (KIX)','pl-NGO':'Chubu Airport (NGO)',
 'pl-FUK':'Fukuoka Airport (FUK)','pl-CTS':'New Chitose Airport (CTS)','pl-ITM':'Osaka Itami Airport (ITM)','pl-HIJ':'Hiroshima Airport (HIJ)','pl-other':'Other city (price to be confirmed)',
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
 's-what':'What do you want to send? *','s-w-compras':'Purchases (figures, games, cards…)','s-w-maleta':'A suitcase or luggage to my country','s-w-ambos':'Both',
 's-w-n':'By post (Japan Post EMS) each parcel can weigh up to 30 kg. We tell you the best option for your suitcase.',
 's-dest':'Destination country *','s-city':'City where you are (Japan)','s-w':'Estimated weight (kg)','s-date':'Approximate shipping date',
 's-notes':'Contents (required by customs)','s-calc-att':'Attached calculation:',
 'sq1':'How much does it cost to ship a package from Japan to my country?','sa1':'It depends on weight, service and country. The calculator shows the official Japan Post, DHL or FedEx price with your country\'s customs and taxes. Our handling fee is added on top, from ¥1,500.',
 'sq2':'What can I send?','sa2':'Figures, video games, consoles, cards, clothes, books, your suitcase and almost anything bought in Japan. We do not accept prohibited items, brand replicas, loose lithium batteries or undeclared goods.',
 'sq3':'Who pays customs?','sa3':'You do, when the package arrives (or in advance if your country requires it). The calculator tells you roughly how much before shipping.',
 'st-title':'Store your luggage in Tokyo','st-lead':'Our luggage storage opens soon: leave your suitcase for a few hours or several days and pay only for the days you use.',
 'st-ex':'For example','st-e1':'Your hotel checkout is at 11:00 but your flight leaves at 22:00: leave your bag and enjoy the day.',
 'st-e2':'Going to Osaka for 3 days: leave your big suitcase in Tokyo and travel with just a backpack.',
 'st-f-title':'Tell me when it opens','st-f-sub':'Leave your email and we will tell you first (with a launch discount).',
 'st-city':'Which city would you need it in?','st-when':'When are you travelling?','st-alt':'Need to move your suitcase to another city? We already do that →',
 'home':'Home','bc-guides':'Guides','gd-cta-t':'Would you rather we did it for you?','gd-cta-d':'Book online, see the price instantly and pay once we confirm. From {from} per bag.','gd-cta-b':'Book luggage delivery →',
 'gq1':'What is takkyubin?','ga1':'It is Japan\'s door-to-door parcel service (宅急便, from Yamato Transport, the black cat company). It is widely used to send suitcases between hotels, homes and airports.',
 'gq2':'How much does it cost to send a suitcase with Yamato?','ga2':'It depends on size and distance. From Tokyo to Osaka or Kyoto, the standard rate is ¥2,780 up to 140 cm and 20 kg, ¥3,160 up to 160 cm and 25 kg, and ¥4,480 up to 180 cm and 30 kg (tax included, checked on 29 Oct 2026).',
 'gq3':'How far in advance must I send it to the airport?','ga3':'At least 2 days before your flight (3 in some areas). The bag reaches the airport the day before your flight and you collect it at the counter with your receipt. Yamato adds ¥660 for airport delivery.',
 'gq4':'Can I take a large suitcase on the Shinkansen?','ga4':'Yes, but if it is over 160 cm (length + width + height), on the Tokaido, Sanyo, Kyushu and Nishi-Kyushu Shinkansen you must reserve a seat with an oversized baggage area; otherwise there is a ¥1,000 fee. Over 250 cm is not allowed.',
 'f-name':'Full name *','f-email':'Email *','f-wa':'WhatsApp (optional, with country code)','f-notes':'Comments (optional)',
 'f-privacy':'We will only use your data to reply to this request.',
 'f-send':'Send request','f-wait':'Notify me','f-ok':'Request received!','f-ok-sub':'We will email you within 24 hours.',
 'f-req':'Fill in the required fields (*).','f-err':'It could not be sent. Check your connection and try again.',
 'faq':'FAQ',
 'fl-guide':'Guide: sending luggage in Japan','src-h':'Official sources',
 footer:'ShipCalc · Shipping and logistics for travellers in Japan',
 privacy:'Privacy: form data is only used to reply to you.',
 'alt':'This page is also available in English','alt-go':'View in English →','alt-x':'Close'
}};
/* Para el script de publicación (tools/build.js) */
if(typeof window!=='undefined')window.SC_SITE_T=T;
if(typeof document==='undefined'||!document.documentElement||!document.querySelectorAll)return;

var root=document.documentElement,BUILT=root.hasAttribute('data-built'),lang='es',onApply=[];
function $(id){return document.getElementById(id);}
function tok(s){var B=window.SC_BAGS;if(!B||s.indexOf('{')<0)return s;var o=B.tokens(lang);return s.replace(/\{(\w+)\}/g,function(m,k){return Object.prototype.hasOwnProperty.call(o,k)?o[k]:m;});}
function t(k){return tok((T[lang]&&T[lang][k])||T.es[k]||'');}
window.SCSITE={t:t,lang:function(){return lang;},onApply:onApply};

function apply(){
  root.lang=lang;
  document.querySelectorAll('[data-i]').forEach(function(el){var v=t(el.getAttribute('data-i'));if(el.hasAttribute('data-html'))el.innerHTML=v;else el.textContent=v;});
  document.querySelectorAll('[data-ph]').forEach(function(el){el.placeholder=t(el.getAttribute('data-ph'));});
  document.querySelectorAll('[data-il]').forEach(function(el){el.label=t(el.getAttribute('data-il'));});
  document.querySelectorAll('[data-ia]').forEach(function(el){el.setAttribute('aria-label',t(el.getAttribute('data-ia')));});
  document.querySelectorAll('[data-lang-only]').forEach(function(el){el.hidden=el.getAttribute('data-lang-only')!==lang;});
  document.querySelectorAll('.lang [data-lang]').forEach(function(b){b.classList.toggle('on',b.getAttribute('data-lang')===lang);});
  var y=$('year');if(y)y.textContent=new Date().getFullYear();
  onApply.forEach(function(f){try{f();}catch(e){}});
}
function remember(l){try{localStorage.setItem('sc_lang',l);}catch(e){}}
function setLang(l){lang=(l==='en')?'en':'es';remember(lang);apply();}
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
  var tp=p.get('tipo'),ts=$('s-what-in');if(tp&&ts&&ts.querySelector('option[value="'+tp.replace(/[^a-z]/g,'')+'"]'))ts.value=tp;
  for(var k in map){var v=p.get(k),el=$(map[k]);if(v&&el)el.value=v.slice(0,80);}
  var c=p.get('calc'),box=$('calc-box'),hid=$('calc-hidden');
  if(c&&box&&hid){c=c.slice(0,900);hid.value=c;box.style.display='block';$('calc-text').textContent=c;}
}
/* Aviso discreto si el navegador está en el otro idioma (no redirige: es mejor para Google) */
function altBanner(){
  if(!BUILT)return;
  var other=lang==='es'?'en':'es',a=document.querySelector('.lang [data-lang="'+other+'"]');if(!a)return;
  var nl=((navigator.languages&&navigator.languages[0])||navigator.language||'').toLowerCase();
  if(nl.slice(0,2)!==other)return;
  try{if(localStorage.getItem('sc_lang')===lang||sessionStorage.getItem('sc_alt_x'))return;}catch(e){return;}
  var bar=document.createElement('div');bar.className='altbar';
  var s=document.createElement('span');s.textContent=T[other].alt;
  var go=document.createElement('a');go.href=a.getAttribute('href')+location.search;go.textContent=T[other]['alt-go'];go.addEventListener('click',function(){remember(other);});
  var x=document.createElement('button');x.type='button';x.textContent='×';x.setAttribute('aria-label',T[other]['alt-x']);
  x.addEventListener('click',function(){bar.remove();try{sessionStorage.setItem('sc_alt_x','1');}catch(e){}});
  bar.appendChild(s);bar.appendChild(go);bar.appendChild(x);document.body.insertBefore(bar,document.body.firstChild);
}
function init(){
  if(BUILT){lang=root.lang==='en'?'en':'es';}
  else{
    var l=null;try{l=localStorage.getItem('sc_lang');}catch(e){}
    if(!l){var nl=(navigator.languages&&navigator.languages[0])||navigator.language||'es';l=/^en/i.test(nl)?'en':'es';}
    lang=(l==='en')?'en':'es';
  }
  document.querySelectorAll('.lang [data-lang]').forEach(function(b){b.addEventListener('click',function(e){
    var l=b.getAttribute('data-lang');
    if(BUILT){remember(l);if(b.getAttribute('href')&&location.search)b.setAttribute('href',b.getAttribute('href').split('?')[0]+location.search);return;}
    e.preventDefault();setLang(l);
  });});
  document.querySelectorAll('form[data-netlify]:not([data-own])').forEach(wire);
  document.querySelectorAll('input[type=date]:not([data-own])').forEach(function(d){d.min=new Date().toISOString().slice(0,10);});
  prefill();apply();altBanner();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
