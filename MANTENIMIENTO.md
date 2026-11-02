# ShipCalc — Guía de mantenimiento

Datos verificados: **29-10-2026**. Para actualizar, se cambian **solo números, fechas y textos**, nunca la estructura.

## Cómo se publica (automático)

Netlify ejecuta `tools/build.js` en cada despliegue (está en `netlify.toml`, no hay que tocar nada en la web de Netlify). El script genera la carpeta `dist/`, que es lo que se publica:

- Páginas en español (`/`) y en inglés (`/en/`), con el texto ya escrito en el HTML para que Google lo lea.
- Título, descripción, canonical, hreflang, Open Graph y datos estructurados de cada página.
- `sitemap.xml` y `robots.txt` con el dominio del sitio. En despliegues de prueba, `robots.txt` bloquea a Google.
- Versión `?v=` de CSS y JS automática: **ya no hay que subir números de versión a mano**.
- Si falta un texto, un enlace está roto o una página no tiene título, **el despliegue se detiene** y la web publicada sigue como estaba. El motivo aparece en Netlify → *Deploys* → el despliegue fallido → *Deploy log*.

## Dominio

El dominio sale solo de Netlify. Al comprar el dominio:

1. Netlify → tu sitio → *Domain management* → *Add a domain* → escribe el dominio.
2. Sigue los pasos de DNS que te da Netlify (en el panel de donde compraste el dominio).
3. Márcalo como *Primary domain*.
4. *Deploys* → *Trigger deploy* → *Deploy site*. Canonical, sitemap, robots, datos para Google y enlaces para compartir pasan al dominio nuevo.

Si quieres pasar `shipcalc.live` del proyecto antiguo (shipcalcco) al nuevo (shipcalc1), primero quítalo del antiguo.

## Google y Bing (hacer una vez, con el dominio ya activo)

1. **Google Search Console** (search.google.com/search-console) → *Añadir propiedad* → *Dominio* → verifica con el registro TXT de DNS. Alternativa: tipo *Prefijo de URL* → método *Etiqueta HTML* → copia solo el código del `content="…"` y ponlo en Netlify → *Site configuration* → *Environment variables* → `GOOGLE_SITE_VERIFICATION` → vuelve a desplegar.
2. En Search Console → *Sitemaps* → escribe `sitemap.xml` → *Enviar*.
3. **Bing Webmaster Tools** (bing.com/webmasters) → *Importar desde Google Search Console*. (Si prefieres etiqueta: variable `BING_SITE_VERIFICATION`.)
4. **IndexNow** (Bing, Yandex…) ya funciona solo: después de cada despliegue en producción con dominio propio, el plugin `plugins/indexnow` avisa de las páginas que han cambiado. Google no usa IndexNow: Google lee el sitemap.

## Archivos

| Archivo | Qué contiene |
|---|---|
| `data/maletas.js` | **Precios del envío de maletas** (objeto `CFG`) y la reserva |
| `data/sitio.js` | Textos ES/EN de portada, maletas, envío, consigna y guía |
| `data/app.js` | Textos e interfaz de la calculadora (solo tocar textos) |
| `data/japon.js` | Japan Post, DHL Japón, FedEx Japón, UPS (solo enlace) |
| `data/corea.js` | Korea Post, DHL Corea, FedEx Corea, UPS (solo enlace) |
| `data/china.js` | China Post pequeño paquete, SF Express, FedEx China; EMS, paquetes, e邮宝, DHL y UPS solo con enlace |
| `data/destinos.js` | Aduana e impuestos de los 21 países + comisiones de plataformas |
| `data/motor.js` | Lógica de cálculo (no tocar) |
| `data/sitio.css` | Estilos de las páginas (menos la calculadora, que lleva los suyos) |
| `tools/paginas.js` | **Títulos y descripciones para Google** de cada página, en ES y EN |
| `tools/build.js` | Script de publicación (no tocar) |
| `plugins/indexnow/` | Aviso automático a Bing/Yandex (no tocar) |

## Precios de maletas (`data/maletas.js` → `CFG`)

- `sizes`: precio por maleta en rutas principales. Ahora: Pequeña ¥2.090 · Mediana ¥3.070 · Grande ¥4.939 · Especial ¥4.939.
- `tierFee`: suplemento por maleta en rutas largas (¥1.000 / ¥2.000). Qué ruta lleva cuál: tabla `TIER` en el mismo archivo.
- `airFee`: suplemento por maleta si la entrega es en un aeropuerto (¥700; Yamato cobra ¥660).
- `whatsapp`: tu número de WhatsApp con prefijo (por ejemplo `819012345678`). Si lo pones, al terminar la reserva sale el botón «Escríbenos por WhatsApp» con el número de reserva ya escrito. Vacío = no sale.
- Precio en la moneda del cliente: se muestra «≈ 57,37 € aprox.» con el tipo de cambio en vivo (o el de respaldo `FX_FALLBACK_USD`). Siempre se cobra en yenes.
- `payURL`: cuando tengas un enlace de pago (por ejemplo un *Payment Link* de Stripe), pégalo aquí. El botón pasa de «Reservar» a «Pagar» y, tras guardar la reserva, lleva al cliente al pago con su número de reserva. Vacío = el cliente reserva y tú le envías el enlace de pago por email.
- Coste de referencia Yamato (tarifa general, Tokio→Osaka): 100 cm ¥1.650 · 140 cm ¥2.780 · 160 cm ¥3.160 · 180 cm ¥4.480. `node tools/test_all.js` comprueba que ningún precio quede por debajo de ese coste: si bajas precios y falla, estás perdiendo dinero en alguna ruta.
- Si Yamato cambia tarifas: actualiza la tabla `Y` de `tools/test_all.js` y los precios de la guía (`guia-enviar-maletas-japon.html`, textos `ga2` de `data/sitio.js`).

## Calendario de revisión

### Cada semana (lunes)
Recargos de combustible. Si no se actualizan, la web lo avisa ("pendiente de actualizar") y usa el último valor.

| Variable | Archivo | Dónde mirar |
|---|---|---|
| `SC.fuel.DHL_JP` | japon.js | https://mydhl.express.dhl/jp/ja/ship/surcharges.html |
| `SC.fuel.DHL_KR` | corea.js | https://mydhl.express.dhl/kr/ko/ship/surcharges.html |
| `SC.fuel.FX_CN` | china.js | https://www.fedex.com/zh-cn/shipping/surcharges.html |
| `SC.fuel.SF_CN` | china.js | https://www.sf-express.com/chn/sc/support-more/international_fuel_surcharge_introduction |

Formato: `{from:'AAAA-MM-DD',pct:49.50,until:'AAAA-MM-DD'}`. Añade la semana nueva al final y pon `until` solo en la última.

### Cada mes (primer lunes)
| Variable | Archivo | Dónde mirar |
|---|---|---|
| `SC.fuel.FX_JP` | japon.js | https://www.fedex.com/ja-jp/shipping/rates/monthly-fuel-surcharge.html |
| `SC.fuel.FX_KR` | corea.js | https://www.fedex.com/ko-kr/shipping/rates/monthly-fuel-surcharge.html |
| Recargos por demanda FedEx (`SC.demand.FX_*`) | los 3 | PDFs "fedex-ds-2026-…" en fedex.com |

### Fechas clave ya programadas (no hay que tocar nada)
- **01-02-2027**: Japan Post sube tarifas. Las tablas nuevas ya están cargadas y se activan solas.
- **05-02-2027**: termina el recargo por demanda de DHL (Japón y Corea). Deja de aplicarse solo; revisa si DHL lo prorroga.
- **01-07-2028**: termina el arancel fijo de 3 € de la UE (destinos.js, función `euCustoms`).
- **01-07-2027**: EE.UU. elimina por ley la exención "de minimis" (ya está suspendida; no cambia el cálculo).

### Cada 3 meses
- Disponibilidad de Japan Post por país: https://www.post.japanpost.jp/int/information/overview_en.html → `JP_AVAIL` en japon.js.
- Países que aceptan EMS de Korea Post (lista "접수가능국가" en ems.epost.go.kr) → `KR_EMS_OK` en corea.js.
- Aduanas de Latinoamérica (México, Argentina, Colombia, Chile, Perú, Ecuador, Uruguay): cambian a menudo.
- Aranceles de EE.UU. (Sección 301) y comisiones de plataformas.
- Tarifas de Yamato (precios de maletas y guía).

### Cada año (enero)
Tablas anuales de DHL y FedEx (Japón, Corea, China), K-Packet, EMS Premium y SF Express. Se publican en enero.

## Datos marcados como ESTIMADO
- Impuestos de Venezuela, Paraguay, Bolivia, Rep. Dominicana (>200 USD), Guatemala, Costa Rica y Panamá.
- México por correo (>50 USD), Ecuador categoría C (arancel por producto).
- DHL Corea por encima de 30 kg (la guía no aclara la fórmula).
- Aranceles por categoría en UE, Reino Unido, Canadá, EE.UU. y Argentina (tipo general aproximado).

## Páginas
| Página | Qué es |
|---|---|
| `index.html` | Portada con los 4 servicios y guías |
| `maletas.html` | Reserva de envío de maletas (formulario `shipcalc-maletas`) |
| `calculadora.html` | Calculadora gratuita |
| `envio.html` | "Lo enviamos por ti" (formulario `shipcalc-shipping`; recibe el cálculo desde la calculadora) |
| `consigna.html` | Guardar maleta, próximamente (lista de espera `shipcalc-consigna`) |
| `guia-enviar-maletas-japon.html` | Guía para Google: cómo enviar maletas en Japón (texto ES y EN en el propio archivo) |
| `404.html` | Página de error |

Las versiones en inglés (`/en/…`) se generan solas. Para añadir una página nueva: crea el HTML y añádela a `tools/paginas.js`.

## Formularios
Netlify Forms. En *Forms* verás un formulario por servicio y por idioma (las versiones inglesas acaban en `-en`, por ejemplo `shipcalc-maletas-en`): así sabes qué servicio se pide más. Cada reserva de maletas lleva número (`SC-AAMMDD-XXXX`), total, un resumen en el idioma del cliente y el campo **`etiqueta_yamato`**: los datos de la etiqueta en japonés, listos para copiar (お届け先, 宿泊者名 y número de reserva del hotel, fecha y franja, ご依頼主 con teléfono, 品名, número de bultos y tamaño, y dónde se recoge). Para aeropuerto incluye 搭乗日, 便名 y 出発時刻. También llegan `instrucciones_cliente` (los pasos que vio el cliente al terminar, listos para pegar en WhatsApp) y `precio_aprox_moneda`.

**Cómo se gestiona hoy (sin contrato con Yamato):** llega la reserva → confirmas por WhatsApp o email y mandas el enlace de pago → cuando paga, pides la recogida a Yamato por teléfono (0570-200-000, AI, de 8:00 a 21:00) o en su web de 集荷, usando `etiqueta_yamato` → le pasas al cliente por WhatsApp la hora y, si hay, la etiqueta o el código.

El envío internacional de maletas va por «Lo enviamos por ti» (`envio.html`, campo `tipo_envio`: compras, maleta o ambos), no por la reserva de maletas.

Reglas de Yamato que ya aplica el formulario (comprobadas en su web y en su formulario oficial de 集荷 https://shuka.kuronekoyamato.co.jp/shuka_req/TopAction_doInit.action):
- Hotel: nombre, dirección, nombre de la reserva y **fecha de entrada (宿泊日, obligatoria en el formulario de Yamato «宿泊施設に送る»)**; teléfono y número de reserva opcionales.
- Airbnb o apartamento sin recepción: Yamato **no recoge ni entrega** allí. El cliente deja la maleta en una tienda 7-Eleven o FamilyMart o en una oficina de Yamato, y para recibirla se envía a la oficina de Yamato más cercana (営業所止め). No se puede poner una tienda de conveniencia como dirección de entrega.
- Casa particular: dirección con código postal, teléfono, nombre de quien la recibe y franja de recogida (13時まで, 14–16, 16–18, 17–18:30).
- Aeropuerto: solo terminales con mostrador de Yamato (lista `TERMINALS` en data/maletas.js, copiada del formulario oficial). Naha no está en esa lista. Se pide terminal, aerolínea y número de vuelo, y hora de salida. Sin franja horaria. No se puede recoger fuera del horario del mostrador.
- Máximo **10 bultos por solicitud de recogida** (`maxTotal`).
- Tramos en avión (全国⇔沖縄 y 北海道⇔中国・四国・九州): no aerosoles, perfumes u otros líquidos, mecheros ni baterías de litio. El formulario lo avisa.
- Franjas de entrega de Yamato: 午前中, 14–16, 16–18, 18–20, 19–21.
- Cuidado especial (máx. 2 en Yamato): ワレモノ y 精密機械.
- Para pedir tú la recogida en la web de Yamato hace falta: nombre en kanji/letras **y en katakana**, código postal, dirección, teléfono japonés (máx. 13 caracteres) y email. El nombre en katakana del cliente lo tienes que escribir tú.
- Contenido concreto obligatorio (Yamato puede retrasar o no entregar si pone solo «artículos varios»). Primera vez: *Site configuration → Forms → Enable form detection* y vuelve a desplegar. Para recibir avisos por email: *Forms → Form notifications*.

## Pruebas antes de publicar
Con Node instalado: `node tools/test_all.js` (debe terminar con `fails 0`) y `node tools/build.js` (debe terminar con ✓).
