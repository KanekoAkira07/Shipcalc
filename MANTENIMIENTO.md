# ShipCalc — Guía de mantenimiento

Datos verificados: **29-10-2026**. Todo lo que cambia está en la carpeta `data/`. Para actualizar, se cambian **solo números y fechas**, nunca la estructura. Después de cualquier cambio, sube el número de versión `?v=20261029` en las 6 líneas `<script src="data/...">` del final de `index.html` (por ejemplo `?v=20261105`) para que los navegadores carguen la versión nueva.

## Archivos

| Archivo | Qué contiene |
|---|---|
| `data/japon.js` | Japan Post (EMS, paquete aéreo, marítimo, Small Packet, Air Packet, SAL suspendido), DHL Japón, FedEx Japón, UPS (solo enlace) |
| `data/corea.js` | Korea Post (EMS, EMS Premium, paquete aéreo y marítimo, pequeño paquete, K-Packet), DHL Corea, FedEx Corea, UPS (solo enlace) |
| `data/china.js` | China Post pequeño paquete (normal y certificado), SF Express, FedEx China; EMS, paquetes, e邮宝, DHL y UPS solo con enlace |
| `data/destinos.js` | Aduana e impuestos de los 21 países + comisiones de plataformas de venta |
| `data/motor.js` | Lógica de cálculo (no tocar) |
| `data/app.js` | Textos e interfaz (solo tocar textos) |

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
| `index.html` | Portada con los 4 servicios |
| `maletas.html` | Envío de maletas entre hoteles/aeropuertos (formulario `shipcalc-maletas`) |
| `calculadora.html` | Calculadora gratuita |
| `envio.html` | "Lo enviamos por ti" (formulario `shipcalc-shipping`; recibe el cálculo adjunto desde la calculadora) |
| `consigna.html` | Guardar maleta, próximamente (lista de espera `shipcalc-consigna`) |

Textos de portada y servicios: `data/sitio.js` · estilos: `data/sitio.css`. Si los cambias, sube el `?v=` en las 4 páginas.

## Formularios
Los formularios (maletas, envío, consigna y PRO) usan **Netlify Forms**. En *Forms* verás cuántas solicitudes llegan de cada servicio: así sabrás cuál es el producto estrella. En Netlify: *Site configuration → Forms → Enable form detection* y vuelve a desplegar. Las solicitudes aparecen en *Forms* y se puede activar aviso por email.

## Pruebas antes de publicar
Con Node instalado: `node tools/test_all.js` (debe terminar con `fails 0`).
