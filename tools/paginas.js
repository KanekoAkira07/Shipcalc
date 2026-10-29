/* =====================================================================
   ShipCalc · páginas, títulos y descripciones para Google
   ---------------------------------------------------------------------
   Lo usa tools/build.js al publicar. Para cambiar el título o la
   descripción que sale en Google, cambia el texto aquí.
   Los textos entre llaves ({from}) se rellenan con los precios de data/maletas.js.
   Títulos: idealmente menos de 60 caracteres. Descripciones: menos de 160.
   ===================================================================== */
module.exports = {
  /* Se usa solo si Netlify no da la dirección del sitio (por ejemplo, al probar en local) */
  defaultSite: 'https://shipcalc.live',
  /* Clave pública de IndexNow (Bing, Yandex, Seznam…). Si la cambias, cambia también el nombre del archivo que se genera. */
  indexNowKey: 'e3c85bcb5143cccc6c952425ac0b171b',
  pages: [
    {
      file: 'index.html', dict: 'site', ld: 'home',
      es: { title: 'ShipCalc — Envío de maletas en Japón y calculadora de envíos',
            desc: 'Envía tu maleta de hotel a hotel en Japón desde {from}, calcula gratis lo que cuesta enviar desde Japón, Corea o China, o deja que enviemos tus compras por ti.',
            ogt: 'ShipCalc — Envíos y maletas en Japón, sin complicaciones',
            ogd: 'Maletas a tu hotel · Calculadora de envíos gratis · Enviamos tus compras por ti. En español.' },
      en: { title: 'ShipCalc — Luggage delivery in Japan and shipping calculator',
            desc: 'Send your suitcase hotel to hotel in Japan from {from}, calculate the real cost of shipping from Japan, Korea or China for free, or let us ship your purchases.',
            ogt: 'ShipCalc — Shipping and luggage in Japan, made simple',
            ogd: 'Luggage to your hotel · Free shipping calculator · We ship your purchases for you.' }
    },
    {
      file: 'maletas.html', dict: 'site', ld: 'bags', crumb: 'nav-bags',
      faq: [['m-q1','m-a1'],['m-q2','m-a2'],['m-q3','m-a3'],['m-q4','m-a4'],['m-q5','m-a5'],['m-q6','m-a6'],['m-q7','m-a7'],['m-q8','m-a8']],
      es: { title: 'Envío de maletas en Japón de hotel a hotel desde {from} — ShipCalc',
            desc: 'Envía tu maleta entre hoteles, casas y aeropuertos de Japón: Tokio, Kioto, Osaka y más. Precio al instante desde {from}, normalmente al día siguiente.',
            ogt: 'Viaja por Japón sin cargar maletas — ShipCalc',
            ogd: 'De hotel a hotel o al aeropuerto. Desde {from} por maleta, normalmente al día siguiente.' },
      en: { title: 'Luggage delivery in Japan, hotel to hotel from {from} — ShipCalc',
            desc: 'Send your suitcase between hotels, homes and airports in Japan: Tokyo, Kyoto, Osaka and more. Instant price from {from}, usually next day.',
            ogt: 'Travel around Japan without carrying your luggage — ShipCalc',
            ogd: 'Hotel to hotel or to the airport. From {from} per bag, usually next day.' }
    },
    {
      file: 'calculadora.html', dict: 'calc', ld: 'calc', crumb: 'nav-calc',
      faq: [['cf-q1','cf-a1'],['cf-q2','cf-a2'],['cf-q3','cf-a3']],
      es: { title: 'Calculadora de envíos e importación desde Japón, Corea y China — ShipCalc',
            desc: 'Calcula el coste real de enviar e importar desde Japón, Corea o China: tarifas oficiales de Japan Post, Korea Post, China Post, DHL, FedEx y SF, aduana, IVA y comisiones.',
            ogt: 'ShipCalc — ¿Cuánto cuesta realmente importar desde Japón, Corea o China?',
            ogd: 'Tarifas oficiales de envío + aduana + impuestos + comisión de reventa. 21 países de destino. Gratis.' },
      en: { title: 'Shipping and import cost calculator: Japan, Korea, China — ShipCalc',
            desc: 'Calculate the real cost of shipping and importing from Japan, Korea or China: official Japan Post, Korea Post, China Post, DHL, FedEx and SF rates, customs and VAT.',
            ogt: 'ShipCalc — What does importing from Japan, Korea or China really cost?',
            ogd: 'Official shipping rates + customs + taxes + resale fees. 21 destination countries. Free.' }
    },
    {
      file: 'envio.html', dict: 'site', ld: 'ship', crumb: 'nav-ship',
      faq: [['sq1','sa1'],['sq2','sa2'],['sq3','sa3']],
      es: { title: 'Enviamos tus compras de Japón a tu país — ShipCalc',
            desc: '¿Compraste figuras, videojuegos o cartas en Japón? Recogemos tu paquete, lo revisamos contigo, lo embalamos y lo enviamos a tu país. Calcula antes el coste gratis.',
            ogt: '¿Compraste en Japón? Lo enviamos por ti — ShipCalc',
            ogd: 'Revisamos tu paquete contigo, lo embalamos y lo enviamos a tu país.' },
      en: { title: 'We ship your purchases from Japan to your country — ShipCalc',
            desc: 'Bought figures, video games or cards in Japan? We collect your package, check it with you, pack it and ship it home. Calculate the cost first for free.',
            ogt: 'Bought something in Japan? We ship it for you — ShipCalc',
            ogd: 'We check your package with you, pack it and ship it home.' }
    },
    {
      file: 'consigna.html', dict: 'site', ld: 'store', crumb: 'nav-store',
      es: { title: 'Guarda tu maleta en Tokio: consigna próximamente — ShipCalc',
            desc: 'Muy pronto: consigna de maletas en Tokio por horas o por días, con atención en español. Apúntate y te avisamos primero, con descuento de lanzamiento.',
            ogt: 'Guarda tu maleta en Tokio — ShipCalc',
            ogd: 'Consigna de maletas en Tokio por horas o días. Muy pronto.' },
      en: { title: 'Luggage storage in Tokyo: coming soon — ShipCalc',
            desc: 'Coming soon: luggage storage in Tokyo by the hour or by the day. Join the list and we will tell you first, with a launch discount.',
            ogt: 'Store your luggage in Tokyo — ShipCalc',
            ogd: 'Luggage storage in Tokyo by the hour or day. Coming soon.' }
    },
    {
      file: 'guia-enviar-maletas-japon.html', dict: 'site', ld: 'guide', crumb: 'bc-guides', published: '2026-10-29', type: 'article',
      faq: [['gq1','ga1'],['gq2','ga2'],['gq3','ga3'],['gq4','ga4']],
      es: { title: 'Enviar maletas en Japón (takkyubin): precios y guía 2026',
            h1: 'Cómo enviar tu maleta en Japón (takkyubin): precios y guía 2026',
            desc: 'Guía para enviar maletas en Japón con takkyubin: precios oficiales de Yamato por tamaño, cómo medir tu maleta, envío al aeropuerto y normas del Shinkansen.',
            ogt: 'Cómo enviar tu maleta en Japón (takkyubin) — ShipCalc',
            ogd: 'Precios oficiales, tamaños, envío al aeropuerto y normas del Shinkansen.' },
      en: { title: 'Sending luggage in Japan (takkyubin): prices and 2026 guide',
            h1: 'How to send your luggage in Japan (takkyubin): prices and 2026 guide',
            desc: 'Guide to sending suitcases in Japan with takkyubin: official Yamato prices by size, how to measure your bag, airport delivery and Shinkansen luggage rules.',
            ogt: 'How to send your luggage in Japan (takkyubin) — ShipCalc',
            ogd: 'Official prices, sizes, airport delivery and Shinkansen luggage rules.' }
    }
  ],
  /* Datos para los "rich results" de Google */
  shipFee: { low: 1500, high: 5000 }
};
