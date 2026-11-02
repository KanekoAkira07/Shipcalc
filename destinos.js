/* =====================================================================
   ShipCalc · DESTINOS: aduana, impuestos y plataformas de venta
   Verificado: 2026-10-29 (ver "src" de cada país).
   conf:'oficial'  → reglas comprobadas en la fuente oficial del país.
   conf:'estimado' → no hay fuente oficial clara/actualizada: cálculo
                     orientativo, se muestra como ESTIMADO con enlace.
   Cada país tiene una función customs(c) que recibe:
     c.goods  valor de la mercancía (moneda del destino)
     c.ship   coste del envío (moneda del destino)
     c.in(cur,amount) convierte un importe de moneda destino a otra moneda
     c.cat    categoría · c.origin JP/KR/CN · c.channel 'postal'|'courier'
     c.kg     peso real total · c.date 'YYYY-MM-DD'
   y devuelve {lines:[{es,en,amt}], notes:[{es,en}], exempt:bool}
   Para actualizar: cambia números/umbrales; no toques la estructura.
   ===================================================================== */
(function(SC){
'use strict';
function L(es,en,amt){return {es:es,en:en,amt:amt};}
function N(es,en){return {es:es,en:en};}
function pct(x){return (Math.round(x*1000)/10)+'%';}

/* Categorías de producto (para aranceles por tipo de producto) */
SC.CATS=[
 {id:'figures',es:'Figuras / coleccionables',en:'Figures / collectibles'},
 {id:'cards',es:'Cartas coleccionables (TCG)',en:'Trading cards (TCG)'},
 {id:'videogames',es:'Videojuegos / consolas',en:'Video games / consoles'},
 {id:'electronics',es:'Electrónica',en:'Electronics'},
 {id:'clothing',es:'Ropa / moda',en:'Clothing / fashion'},
 {id:'toys',es:'Juguetes',en:'Toys'},
 {id:'music',es:'Música / álbumes K-pop',en:'Music / K-pop albums'},
 {id:'cosmetics',es:'Cosmética / skincare',en:'Cosmetics / skincare'},
 {id:'books',es:'Libros / manga',en:'Books / manga'},
 {id:'other',es:'Otro',en:'Other'}
];

/* Aranceles aproximados por categoría (tipo general de terceros países).
   El tipo exacto depende del código HS y del origen; se muestran como "aprox." */
var DUTY_EU={figures:.047,cards:.027,videogames:0,electronics:.02,clothing:.12,toys:.047,music:.035,cosmetics:0,books:0,other:.035};
var DUTY_GB={figures:0,cards:.02,videogames:0,electronics:.02,clothing:.12,toys:0,music:.02,cosmetics:0,books:0,other:.03};
var DUTY_CA={figures:0,cards:0,videogames:0,electronics:0,clothing:.18,toys:0,music:0,cosmetics:.065,books:0,other:.06};
var DUTY_AR={figures:.20,cards:.20,videogames:.20,electronics:.16,clothing:.35,toys:.20,music:.20,cosmetics:.18,books:0,other:.20};
var DUTY_EC={figures:.20,cards:.20,videogames:.20,electronics:.10,clothing:.30,toys:.20,music:.20,cosmetics:.20,books:0,other:.20};
var DUTY_DO={figures:.20,cards:.20,videogames:.20,electronics:.08,clothing:.20,toys:.20,music:.20,cosmetics:.20,books:0,other:.14};

/* Comisiones de plataformas (vendedor particular). fee=% sobre venta, fixed=fijo en moneda del destino.
   v:true = verificada en la web oficial el 2026-10-29 · v:false = orientativa */
var P={
 wallapop:{name:'Wallapop',fee:0,fixed:0,v:true,note_es:'Vendedor 0 %; el comprador paga la protección',note_en:'Seller 0%; buyer pays protection'},
 vinted:{name:'Vinted',fee:0,fixed:0,v:true,note_es:'Vendedor 0 %; el comprador paga la protección',note_en:'Seller 0%; buyer pays protection'},
 ebay_es:{name:'eBay España (particular)',fee:.1192,fixed:.35,v:true,note_es:'11,5 % + 0,42 % + 0,35 € por pedido',note_en:'11.5% + 0.42% + €0.35 per order'},
 ebay_priv0:{name:'eBay (particular)',fee:0,fixed:0,v:true,note_es:'Vender es gratis para particulares; paga el comprador',note_en:'Free for private sellers; buyer pays'},
 amazon_eu:{name:'Amazon',fee:.15,fixed:.99,v:false,note_es:'~15 % + 0,99 €/unidad (plan Individual)',note_en:'~15% + €0.99/unit (Individual plan)'},
 etsy:{name:'Etsy',fee:.105,fixed:.50,v:false,note_es:'6,5 % + ~4 % pago + anuncio',note_en:'6.5% + ~4% payment + listing'},
 depop:{name:'Depop',fee:.033,fixed:.20,v:false,note_es:'0 % venta + 3,3 % + 0,20 de pago',note_en:'0% selling + 3.3% + 0.20 payment'},
 kleinanzeigen:{name:'Kleinanzeigen',fee:0,fixed:0,v:false,note_es:'Particulares 0 %',note_en:'Private 0%'},
 ebay_us:{name:'eBay USA',fee:.136,fixed:.40,v:true,note_es:'13,6 % + 0,40 $ por pedido',note_en:'13.6% + $0.40 per order'},
 mercari_us:{name:'Mercari USA',fee:.129,fixed:.30,v:false,note_es:'10 % + 2,9 % + 0,30 $',note_en:'10% + 2.9% + $0.30'},
 poshmark:{name:'Poshmark',fee:.20,fixed:0,v:false,note_es:'20 % (ventas ≥ 15)',note_en:'20% (sales ≥ 15)'},
 ebay_other:{name:'eBay',fee:.13,fixed:.40,v:false,note_es:'~13 % + fijo por pedido',note_en:'~13% + fixed per order'},
 ml_mx:{name:'Mercado Libre México',fee:.175,fixed:0,v:false,note_es:'Premium ~17,5 % (Clásica ~13 %) + cargo fijo en artículos baratos',note_en:'Premium ~17.5% (Classic ~13%) + fixed fee on cheap items'},
 ml:{name:'Mercado Libre',fee:.16,fixed:0,v:false,note_es:'~13–17,5 % según categoría y tipo de publicación',note_en:'~13–17.5% by category and listing type'},
 fb:{name:'Facebook Marketplace',fee:0,fixed:0,v:false,note_es:'Venta local 0 %',note_en:'Local sale 0%'},
 direct:{name:'Venta directa / Direct sale',fee:0,fixed:0,v:true,note_es:'Sin comisión',note_en:'No fee'}
};
function plats(ids){return ids.map(function(id){var o={id:id};for(var k in P[id])o[k]=P[id][k];return o;});}

/* ---------- Unión Europea (España, Alemania, Italia) ----------
   · IVA desde el primer euro (base: mercancía + envío + arancel).
   · Envíos de hasta 150 €: desde 01-07-2026 hasta 01-07-2028 arancel fijo de 3 € por cada tipo de
     producto (Reglamento (UE) 2026/382). Antes del 01-07-2026: exentos de arancel.
   · Más de 150 €: arancel según producto sobre mercancía + envío.
   Fuentes: https://commission.europa.eu/news-and-media/news/ensuring-fairness-and-safety-eur3-customs-duty-low-value-parcels-2026-06-29_en
            https://www.correos.es/es/es/atencion-al-cliente/informacion-aduanera/arancel-para-envios-de-bajo-valor-en-la-ue */
function euCustoms(vat,vatName){
 return function(c){
  var lines=[],notes=[],cif=c.goods+c.ship,duty=0,goodsEUR=c.in('EUR',c.goods);
  if(goodsEUR<=150){
   if(c.date>='2026-07-01'&&c.date<'2028-07-01'){
     duty=c.fromEUR(3);
     lines.push(L('Arancel fijo UE (3 € por tipo de producto)','EU flat duty (€3 per product type)',duty));
     notes.push(N('Envío de hasta 150 €: la UE cobra 3 € por cada tipo de producto distinto (calculado para 1 tipo).','Parcel up to €150: the EU charges €3 per distinct product type (calculated for 1 type).'));
   }
  } else {
   var r=DUTY_EU[c.cat]||DUTY_EU.other;duty=cif*r;
   if(duty>0)lines.push(L('Arancel aprox. ('+pct(r)+')','Duty approx. ('+pct(r)+')',duty));
   notes.push(N('Más de 150 €: se paga arancel según el producto. Si el artículo es de origen japonés o coreano con prueba de origen, puede ser 0 %.','Over €150: duty depends on the product. Japanese or Korean-origin goods with proof of origin may be 0%.'));
  }
  lines.push(L(vatName.es+' ('+pct(vat)+')',vatName.en+' ('+pct(vat)+')',(cif+duty)*vat));
  notes.push(N('El IVA se paga desde el primer euro. Si el vendedor ya te cobró el IVA al comprar (IOSS), no lo pagas otra vez.','VAT applies from the first euro. If the seller already charged VAT at checkout (IOSS), you do not pay it again.'));
  notes.push(N('Correos o la empresa de mensajería pueden cobrar además una tasa por gestionar la aduana.','The postal operator or courier may also charge a customs handling fee.'));
  return {lines:lines,notes:notes};
 };
}

SC.dest={
 ES:{name_es:'España',name_en:'Spain',flag:'🇪🇸',cur:'EUR',sym:'€',region:'EU',conf:'oficial',
   customs:euCustoms(.21,{es:'IVA',en:'VAT'}),
   extraNote:N('Calculado para la Península y Baleares (Canarias, Ceuta y Melilla tienen otros impuestos).','Calculated for mainland Spain and the Balearic Islands (Canary Islands, Ceuta and Melilla have other taxes).'),
   src:['https://www.correos.es/es/es/atencion-al-cliente/informacion-aduanera/arancel-para-envios-de-bajo-valor-en-la-ue'],
   platforms:plats(['wallapop','vinted','ebay_es','amazon_eu','etsy','fb','direct'])},
 DE:{name_es:'Alemania',name_en:'Germany',flag:'🇩🇪',cur:'EUR',sym:'€',region:'EU',conf:'oficial',
   customs:euCustoms(.19,{es:'IVA (EUSt)',en:'Import VAT (EUSt)'}),
   src:['https://commission.europa.eu/news-and-media/news/ensuring-fairness-and-safety-eur3-customs-duty-low-value-parcels-2026-06-29_en','https://www.zoll.de'],
   platforms:plats(['kleinanzeigen','vinted','ebay_priv0','amazon_eu','etsy','fb','direct'])},
 IT:{name_es:'Italia',name_en:'Italy',flag:'🇮🇹',cur:'EUR',sym:'€',region:'EU',conf:'oficial',
   customs:euCustoms(.22,{es:'IVA',en:'VAT'}),
   src:['https://commission.europa.eu/news-and-media/news/ensuring-fairness-and-safety-eur3-customs-duty-low-value-parcels-2026-06-29_en','https://www.adm.gov.it'],
   platforms:plats(['vinted','ebay_priv0','amazon_eu','etsy','fb','direct'])},

 /* ---------- Reino Unido ----------
    IVA 20 % siempre (hasta 135 £ lo cobra el vendedor si está registrado; si no, al recibir).
    Arancel solo por encima de 135 £. Fuente: https://www.gov.uk/goods-sent-from-abroad/tax-and-duty */
 GB:{name_es:'Reino Unido',name_en:'United Kingdom',flag:'🇬🇧',cur:'GBP',sym:'£',region:'EU',conf:'oficial',
   customs:function(c){
     var lines=[],notes=[],cif=c.goods+c.ship,duty=0,g=c.in('GBP',c.goods);
     if(g>135){var r=DUTY_GB[c.cat]||DUTY_GB.other;duty=cif*r;if(duty>0)lines.push(L('Arancel aprox. ('+pct(r)+')','Duty approx. ('+pct(r)+')',duty));
       notes.push(N('Más de 135 £: arancel según producto y origen.','Over £135: duty depends on product and origin.'));}
     else notes.push(N('Hasta 135 £ no hay arancel, pero sí IVA.','Up to £135 there is no duty, but VAT applies.'));
     lines.push(L('IVA (20%)','VAT (20%)',(cif+duty)*.20));
     notes.push(N('Royal Mail o la mensajería pueden cobrar una tasa de gestión. Regalos de hasta 39 £ entre particulares: sin IVA.','Royal Mail or the courier may charge a handling fee. Gifts up to £39 between individuals: no VAT.'));
     return {lines:lines,notes:notes};},
   src:['https://www.gov.uk/goods-sent-from-abroad/tax-and-duty'],
   platforms:plats(['ebay_priv0','vinted','depop','amazon_eu','etsy','fb','direct'])},

 /* ---------- Estados Unidos ----------
    Sin exención "de minimis" para ningún envío (correo suspendido indefinidamente desde 24-06-2026;
    la ley OBBBA la elimina del todo el 01-07-2027). Desde 24-07-2026: aranceles Sección 301:
    Japón y Corea pagan como mínimo un 12,5 % en total (si el arancel normal es menor, se completa
    hasta 12,5 %); China paga el arancel normal + 12,5 % (+ los 301 antiguos de algunos productos).
    Libros, música y otros "materiales informativos" quedan fuera. Regalos de hasta 100 $: exentos.
    Fuentes: https://www.federalregister.gov/documents/2026/06/24/2026-12669/indefinite-suspension-of-the-de-minimis-exemption-for-mail-shipments-and-new-postal-informal-entry
             https://taxnews.ey.com/news/2026-1607-ustr-finalizes-section-301-forced-labor-tariffs-on-60-economies-additional-tariffs-of-10-percent-or-125-percent-take-effect-24-july-2026 */
 US:{name_es:'Estados Unidos',name_en:'United States',flag:'🇺🇸',cur:'USD',sym:'$',region:'AM',conf:'oficial',
   customs:function(c){
     var lines=[],notes=[],mfn={figures:0,cards:0,videogames:0,electronics:.01,clothing:.16,toys:0,music:0,cosmetics:0,books:0,other:.03},
         info=(c.cat==='books'||c.cat==='music'),m=mfn[c.cat]||mfn.other,r;
     if(info)r=m;
     else if(c.origin==='CN')r=m+.125+(c.cat==='clothing'?.075:0);
     else r=Math.max(m,.125);
     var duty=c.goods*r;
     if(duty>0)lines.push(L('Aranceles EE.UU. aprox. ('+pct(r)+')','US duties approx. ('+pct(r)+')',duty));
     notes.push(N('EE.UU. ya no tiene envío libre de aranceles. Japón y Corea: mínimo 12,5 % en total; China: arancel normal + 12,5 % (algunos productos chinos pagan más por la Sección 301).','The US no longer has duty-free parcels. Japan and Korea: at least 12.5% in total; China: normal duty + 12.5% (some Chinese products pay more under Section 301).'));
     if(c.channel==='postal'&&c.origin==='JP')notes.push(N('Por correo desde Japón, el remitente paga los aranceles por adelantado (DDP) con una app autorizada y Japan Post solo acepta estos envíos en oficinas designadas.','By post from Japan, the sender prepays duties (DDP) through an approved app and Japan Post only accepts these items at designated offices.'));
     else if(c.channel==='postal')notes.push(N('Por correo, EE.UU. exige que los aranceles se declaren y paguen por adelantado: consulta en la oficina de correos antes de enviar.','By post, the US requires duties to be declared and prepaid: ask at the post office before sending.'));
     else notes.push(N('La mensajería suele cobrar además una tasa de despacho.','Couriers usually add a clearance/brokerage fee.'));
     notes.push(N('No incluye el impuesto estatal sobre ventas, si tu estado lo aplica.','State sales tax, if your state applies it, is not included.'));
     return {lines:lines,notes:notes};},
   src:['https://www.federalregister.gov/documents/2026/06/24/2026-12669/indefinite-suspension-of-the-de-minimis-exemption-for-mail-shipments-and-new-postal-informal-entry','https://www.post.japanpost.jp/service/send/oversea/information/2026/0714_01.html'],
   platforms:plats(['ebay_us','mercari_us','poshmark','fb','direct'])},

 /* ---------- Canadá ----------
    Hasta 20 CAD: sin impuestos. Más: arancel según producto + GST/HST (aquí 13 %, Ontario).
    Canada Post cobra 9,95 CAD por envío con impuestos.
    Fuente: https://www.canadapost-postescanada.ca/cpc/en/support/articles/customs-requirements/customs-duty-taxes-and-exemptions.page */
 CA:{name_es:'Canadá',name_en:'Canada',flag:'🇨🇦',cur:'CAD',sym:'CA$',region:'AM',conf:'oficial',
   customs:function(c){
     var lines=[],notes=[],g=c.in('CAD',c.goods);
     if(g<=20){notes.push(N('Hasta 20 CAD: sin aranceles ni impuestos.','Up to CAD 20: no duty or taxes.'));return {lines:lines,notes:notes,exempt:true};}
     var r=DUTY_CA[c.cat]||DUTY_CA.other,duty=c.goods*r;
     if(duty>0)lines.push(L('Arancel aprox. ('+pct(r)+')','Duty approx. ('+pct(r)+')',duty));
     lines.push(L('GST/HST (13%, Ontario)','GST/HST (13%, Ontario)',(c.goods+duty)*.13));
     if(c.channel==='postal')lines.push(L('Tasa de Canada Post','Canada Post handling fee',c.fromCAD(9.95)));
     else notes.push(N('La mensajería cobra su propia tasa de despacho (varía).','The courier charges its own brokerage fee (varies).'));
     notes.push(N('El impuesto cambia por provincia: 5 % (Alberta) a 15 % (Atlántico).','Sales tax varies by province: 5% (Alberta) to 15% (Atlantic).'));
     return {lines:lines,notes:notes};},
   src:['https://www.canadapost-postescanada.ca/cpc/en/support/articles/customs-requirements/customs-duty-taxes-and-exemptions.page','https://www.cbsa-asfc.gc.ca/import/courier/menu-eng.html'],
   platforms:plats(['ebay_other','poshmark','fb','direct'])},

 /* ---------- Australia ----------
    Hasta 1.000 AUD: sin arancel ni GST en aduana (las tiendas registradas cobran el GST al comprar).
    Más de 1.000 AUD: arancel (5 % general; 0 % con origen JP/KR/CN acreditado) + GST 10 % + tasas de despacho. */
 AU:{name_es:'Australia',name_en:'Australia',flag:'🇦🇺',cur:'AUD',sym:'A$',region:'OC',conf:'oficial',
   customs:function(c){
     var lines=[],notes=[],g=c.in('AUD',c.goods);
     if(g<=1000){notes.push(N('Hasta 1.000 AUD: sin arancel ni GST en aduana. Si compras en una tienda registrada en Australia, el GST (10 %) va incluido en el precio.','Up to AUD 1,000: no duty or GST at the border. If the shop is GST-registered in Australia, the 10% GST is charged at checkout.'));return {lines:lines,notes:notes,exempt:true};}
     var r=(c.cat==='books')?0:.05,duty=c.goods*r;
     if(duty>0)lines.push(L('Arancel aprox. (5%)','Duty approx. (5%)',duty));
     lines.push(L('GST (10%)','GST (10%)',(c.goods+c.ship+duty)*.10));
     notes.push(N('Más de 1.000 AUD hace falta declaración de importación y hay tasas de despacho. Con certificado de origen JP/KR/CN el arancel suele ser 0 %.','Over AUD 1,000 an import declaration and processing charges apply. With JP/KR/CN proof of origin duty is usually 0%.'));
     return {lines:lines,notes:notes};},
   src:['https://www.abf.gov.au/help-and-support-subsite/FactSheets/buying-internet.pdf'],
   platforms:plats(['ebay_other','fb','direct'])},

 /* ---------- México ----------
    Mensajería (DHL, FedEx, UPS, SF): tasa global 33,5 % para mercancía de países sin tratado con México
    vía procedimiento simplificado, hasta 2.500 USD (regla 3.7.35 RGCE, desde 15-08-2025).
    Correo (Correos de México): exento hasta 50 USD; por encima ESTIMAMOS tasa global 19 %. */
 MX:{name_es:'México',name_en:'Mexico',flag:'🇲🇽',cur:'MXN',sym:'MX$',region:'AM',conf:'oficial',
   customs:function(c){
     var lines=[],notes=[],usd=c.in('USD',c.goods);
     if(c.channel==='courier'){
       lines.push(L('Tasa global mensajería (33,5%)','Courier flat import tax (33.5%)',(c.goods+c.ship)*.335));
       notes.push(N('Paquetería desde Asia: tasa global del 33,5 % (incluye arancel e IVA) hasta 2.500 USD. Por encima hace falta agente aduanal.','Courier from Asia: 33.5% flat rate (duty and VAT included) up to USD 2,500. Above that a customs broker is required.'));
       return {lines:lines,notes:notes};}
     if(usd<=50){notes.push(N('Por correo, hasta 50 USD: sin impuestos.','By post, up to USD 50: no taxes.'));return {lines:lines,notes:notes,exempt:true};}
     lines.push(L('Impuestos correo (estimado 19%)','Postal import tax (est. 19%)',(c.goods+c.ship)*.19));
     notes.push(N('Por correo, más de 50 USD: estimación. La aduana puede aplicar arancel según producto + IVA 16 %.','By post, over USD 50: estimate. Customs may apply product duty + 16% VAT.'));
     return {lines:lines,notes:notes,estimate:true};},
   src:['https://www.anam.gob.mx/mensajeria-y-paqueteria/','https://vinculum.mx/2025/07/31/mexico-actualiza-el-impuesto-a-importaciones-por-paqueteria-entra-en-vigor-tasa-del-33-5/'],
   platforms:plats(['ml_mx','fb','direct'])},

 /* ---------- Argentina ----------
    Courier y correo (Decreto 604/2026, RG 5884/2026): hasta 400 USD FOB por envío (5 envíos al año)
    sin derechos ni tasa de estadística; se paga IVA 21 %. El exceso paga derechos según producto
    + tasa de estadística 3 %. Máximo 3.000 USD por envío.
    Fuente: https://www.afip.gob.ar/envios-internacionales/courier/importacion/pequenios-envios.asp */
 AR:{name_es:'Argentina',name_en:'Argentina',flag:'🇦🇷',cur:'ARS',sym:'AR$',region:'AM',conf:'oficial',
   customs:function(c){
     var lines=[],notes=[],usd=c.in('USD',c.goods),cif=c.goods+c.ship,exc=0,duty=0,te=0;
     if(usd>400){exc=c.goods*(usd-400)/usd;var r=DUTY_AR[c.cat]||DUTY_AR.other;duty=exc*r;te=exc*.03;
       if(duty>0)lines.push(L('Derechos sobre el exceso de 400 USD (aprox. '+pct(r)+')','Duty on the amount over USD 400 (approx. '+pct(r)+')',duty));
       lines.push(L('Tasa de estadística (3% del exceso)','Statistics fee (3% of excess)',te));}
     lines.push(L('IVA (21%)','VAT (21%)',(cif+duty+te)*.21));
     notes.push(N('Franquicia de 400 USD por envío, máximo 5 envíos al año por persona (courier y correo juntos). El IVA se paga siempre.','USD 400 allowance per shipment, max 5 shipments per year per person (courier and post combined). VAT always applies.'));
     if(usd>3000)notes.push(N('Más de 3.000 USD no entra en el régimen simplificado: importación general con despachante.','Over USD 3,000 is outside the simplified regime: general import with a broker.'));
     return {lines:lines,notes:notes};},
   src:['https://www.afip.gob.ar/envios-internacionales/courier/importacion/pequenios-envios.asp','https://www.iprofesional.com/impuestos/460193-mas-franquicia-para-importaciones-postales-y-habilitan-exportacion-comercial-por-correo'],
   platforms:plats(['ml','fb','direct'])},

 /* ---------- Colombia ----------
    Tráfico postal y envíos urgentes (hasta 2.000 USD y 50 kg): arancel 10 % si el FOB supera 200 USD;
    IVA 19 % (solo se exime a países con TLC que lo exija, como EE.UU.; no aplica a Asia).
    Fuente: https://www.dian.gov.co/Viajeros-y-Servicios-aduaneros/Paginas/Modalidad-de-trafico-postal-y-envios-urgentes.aspx */
 CO:{name_es:'Colombia',name_en:'Colombia',flag:'🇨🇴',cur:'COP',sym:'COL$',region:'AM',conf:'oficial',
   customs:function(c){
     var lines=[],notes=[],usd=c.in('USD',c.goods),cif=c.goods+c.ship,duty=0;
     if(usd>200){duty=cif*.10;lines.push(L('Arancel (10%)','Duty (10%)',duty));}
     else notes.push(N('Hasta 200 USD FOB: sin arancel.','Up to USD 200 FOB: no duty.'));
     lines.push(L('IVA (19%)','VAT (19%)',(cif+duty)*.19));
     notes.push(N('Desde Japón, Corea o China el IVA se paga desde el primer dólar.','From Japan, Korea or China VAT applies from the first dollar.'));
     if(usd>2000||c.kg>50)notes.push(N('Más de 2.000 USD o 50 kg: importación ordinaria con agencia de aduanas.','Over USD 2,000 or 50 kg: ordinary import through a customs agent.'));
     return {lines:lines,notes:notes};},
   src:['https://www.dian.gov.co/Viajeros-y-Servicios-aduaneros/Paginas/Modalidad-de-trafico-postal-y-envios-urgentes.aspx','https://www.gydconsulting.com/compras-internacionales-iva-usd-200-concepto-dian-1470-2026/'],
   platforms:plats(['ml','fb','direct'])},

 /* ---------- Chile ----------
    Desde el 25-10-2025 no hay franquicia: IVA 19 % y arancel 6 % (las tiendas registradas en el SII
    cobran el IVA al comprar y quedan sin arancel; compras a particulares/tiendas no registradas pagan al llegar).
    Fuente: https://www.aduana.cl/cambios-en-tus-compras-internacionales/aduana/2025-10-15/153938.html */
 CL:{name_es:'Chile',name_en:'Chile',flag:'🇨🇱',cur:'CLP',sym:'CLP$',region:'AM',conf:'oficial',
   customs:function(c){
     var lines=[],notes=[],cif=c.goods+c.ship,duty=cif*.06;
     lines.push(L('Arancel (6%)','Duty (6%)',duty));
     lines.push(L('IVA (19%)','VAT (19%)',(cif+duty)*.19));
     notes.push(N('Sin franquicia desde el 25-10-2025. Si compras en una plataforma registrada en el SII, pagas el IVA al comprar y no hay arancel. Con certificado de origen JP/KR/CN el arancel puede ser 0 %.','No allowance since 25-10-2025. If you buy on an SII-registered platform, VAT is paid at checkout and there is no duty. With JP/KR/CN proof of origin duty may be 0%.'));
     return {lines:lines,notes:notes};},
   src:['https://www.aduana.cl/cambios-en-tus-compras-internacionales/aduana/2025-10-15/153938.html'],
   platforms:plats(['ml','fb','direct'])},

 /* ---------- Perú ----------
    Hasta 200 USD FOB: sin tributos. De 200 a 2.000 USD: 4 % ad valorem + 18 % IGV/IPM.
    Fuente: https://asistenteaduanero.sunat.gob.pe/servicio-postal-nacional-serpost-importa-facil-fob-hasta-2000 */
 PE:{name_es:'Perú',name_en:'Peru',flag:'🇵🇪',cur:'PEN',sym:'S/',region:'AM',conf:'oficial',
   customs:function(c){
     var lines=[],notes=[],usd=c.in('USD',c.goods),cif=c.goods+c.ship;
     if(usd<=200){notes.push(N('Hasta 200 USD FOB: sin aranceles ni IGV.','Up to USD 200 FOB: no duty or VAT.'));return {lines:lines,notes:notes,exempt:true};}
     var duty=cif*.04;lines.push(L('Ad valorem (4%)','Ad valorem duty (4%)',duty));
     lines.push(L('IGV + IPM (18%)','VAT IGV + IPM (18%)',(cif+duty)*.18));
     notes.push(N('De 200 a 2.000 USD. Personas: hasta 3 importaciones al año de máx. 1.000 USD, o 1 de hasta 2.000 USD.','From USD 200 to 2,000. Individuals: up to 3 imports a year of max USD 1,000, or 1 up to USD 2,000.'));
     if(usd>2000)notes.push(N('Más de 2.000 USD: importación general con agente.','Over USD 2,000: general import with an agent.'));
     return {lines:lines,notes:notes};},
   src:['https://asistenteaduanero.sunat.gob.pe/servicio-postal-nacional-serpost-importa-facil-fob-hasta-2000','https://www.infobae.com/peru/2026/10/14/sunat-alista-reglas-unicas-para-que-importadores-accedan-a-rebajas-de-aranceles-afectara-envios-por-temu-o-aliexpress/'],
   platforms:plats(['ml','fb','direct'])},

 /* ---------- Ecuador ----------
    Categoría B (4x4): hasta 4 kg y 400 USD FOB → 20 USD fijos + FODINFA 0,5 % (sin IVA). Cupo 1.600 USD/año.
    Categoría C: hasta 100 kg y 5.000 USD → ad valorem según producto + FODINFA 0,5 % + IVA 15 %.
    Fuente: https://www.aduana.gob.ec/servicio-al-ciudadano/envios-courier-postal/ */
 EC:{name_es:'Ecuador',name_en:'Ecuador',flag:'🇪🇨',cur:'USD',sym:'US$',region:'AM',conf:'oficial',
   customs:function(c){
     var lines=[],notes=[],usd=c.in('USD',c.goods),cif=c.goods+c.ship;
     if(c.kg<=4&&usd<=400){
       lines.push(L('Arancel fijo 4x4','4x4 flat duty',c.fromUSD(20)));
       lines.push(L('FODINFA (0,5%)','FODINFA (0.5%)',cif*.005));
       notes.push(N('Categoría B (4x4): hasta 4 kg y 400 USD. Sin IVA. Cupo máximo 1.600 USD al año por persona.','Category B (4x4): up to 4 kg and USD 400. No VAT. Max USD 1,600 a year per person.'));
       return {lines:lines,notes:notes};}
     var r=DUTY_EC[c.cat]||DUTY_EC.other,duty=cif*r,fod=cif*.005;
     lines.push(L('Ad valorem aprox. ('+pct(r)+')','Duty approx. ('+pct(r)+')',duty));
     lines.push(L('FODINFA (0,5%)','FODINFA (0.5%)',fod));
     lines.push(L('IVA (15%)','VAT (15%)',(cif+duty+fod)*.15));
     notes.push(N('Categoría C (más de 4 kg o 400 USD, hasta 5.000 USD y 100 kg). El ad valorem depende del producto. La ropa y el calzado no entran en esta categoría.','Category C (over 4 kg or USD 400, up to USD 5,000 and 100 kg). Duty depends on the product. Clothing and footwear are not allowed in this category.'));
     return {lines:lines,notes:notes,estimateDuty:true};},
   src:['https://www.aduana.gob.ec/servicio-al-ciudadano/envios-courier-postal/'],
   platforms:plats(['ml','fb','direct'])},

 /* ---------- Uruguay ----------
    Decreto 50/026 (desde mayo 2026): franquicia de 800 USD al año, máx. 3 envíos y 20 kg por envío:
    sin aranceles pero con IVA 22 %. Fuera de franquicia: prestación única del 60 % (mín. 20 USD).
    Fuente: https://www.correo.com.uy/comercio-electronico */
 UY:{name_es:'Uruguay',name_en:'Uruguay',flag:'🇺🇾',cur:'UYU',sym:'$U',region:'AM',conf:'oficial',
   customs:function(c){
     var lines=[],notes=[],usd=c.in('USD',c.goods),total=c.goods+c.ship;
     if(usd<=800&&c.kg<=20){
       lines.push(L('IVA (22%)','VAT (22%)',total*.22));
       notes.push(N('Usando la franquicia (800 USD al año, máx. 3 envíos, 20 kg): sin aranceles, pero con IVA 22 %. Si ya gastaste la franquicia, pagarías el 60 %.','Using the allowance (USD 800 a year, max 3 shipments, 20 kg): no duty, but 22% VAT. If your allowance is used up you would pay 60%.'));
       return {lines:lines,notes:notes};}
     lines.push(L('Prestación única (60%)','Single import charge (60%)',Math.max(total*.60,c.fromUSD(20))));
     notes.push(N('Fuera de franquicia: 60 % sobre el total de la factura (mínimo 20 USD). Envíos de más de 800 USD pueden requerir despachante.','Outside the allowance: 60% of the invoice total (min USD 20). Shipments over USD 800 may require a broker.'));
     return {lines:lines,notes:notes};},
   src:['https://www.correo.com.uy/comercio-electronico','https://cambio-uruguay.com/franquicia-aduana-uruguay'],
   platforms:plats(['ml','fb','direct'])},

 /* ---------- Países con datos ESTIMADOS (sin fuente oficial clara y actualizada) ---------- */
 VE:{name_es:'Venezuela',name_en:'Venezuela',flag:'🇻🇪',cur:'USD',sym:'US$',region:'AM',conf:'estimado',
   customs:function(c){var lines=[],notes=[],usd=c.in('USD',c.goods),cif=c.goods+c.ship;
     if(usd<=100){notes.push(N('Estimado: hasta 100 USD suele entrar sin impuestos.','Estimate: up to USD 100 usually enters tax-free.'));return {lines:lines,notes:notes,exempt:true,estimate:true};}
     var duty=cif*.15;lines.push(L('Arancel (estimado 15%)','Duty (est. 15%)',duty));lines.push(L('IVA (16%)','VAT (16%)',(cif+duty)*.16));
     notes.push(N('Estimación: el arancel real depende del producto. Mostrado en USD.','Estimate: real duty depends on the product. Shown in USD.'));
     return {lines:lines,notes:notes,estimate:true};},
   src:[],platforms:plats(['ml','fb','direct'])},
 PY:{name_es:'Paraguay',name_en:'Paraguay',flag:'🇵🇾',cur:'PYG',sym:'₲',region:'AM',conf:'estimado',
   customs:function(c){var lines=[],notes=[],usd=c.in('USD',c.goods),cif=c.goods+c.ship;
     if(usd<=20){notes.push(N('Estimado: hasta 20 USD sin impuestos.','Estimate: up to USD 20 tax-free.'));return {lines:lines,notes:notes,exempt:true,estimate:true};}
     var duty=cif*.10;lines.push(L('Arancel (estimado 10%)','Duty (est. 10%)',duty));lines.push(L('IVA (10%)','VAT (10%)',(cif+duty)*.10));
     notes.push(N('Estimación orientativa: confirma con la DNIT o tu courier.','Rough estimate: confirm with DNIT or your courier.'));
     return {lines:lines,notes:notes,estimate:true};},
   src:['https://www.dnit.gov.py'],platforms:plats(['fb','direct'])},
 BO:{name_es:'Bolivia',name_en:'Bolivia',flag:'🇧🇴',cur:'BOB',sym:'Bs',region:'AM',conf:'estimado',
   customs:function(c){var lines=[],notes=[],cif=c.goods+c.ship,usd=c.in('USD',c.goods);
     var duty=cif*.10;lines.push(L('Gravamen arancelario (estimado 10%)','Duty (est. 10%)',duty));lines.push(L('IVA (14,94%)','VAT (14.94%)',(cif+duty)*.1494));
     notes.push(N('Estimación. Courier: hasta 1.000 USD y 40 kg por envío (Aduana Nacional, 2025).','Estimate. Courier: up to USD 1,000 and 40 kg per shipment (Aduana Nacional, 2025).'));
     if(usd>1000||c.kg>40)notes.push(N('Por encima: importación general con despachante.','Above that: general import with a broker.'));
     return {lines:lines,notes:notes,estimate:true};},
   src:['https://portal.aduana.gob.bo/aduana7/content/empresas-de-servicio-expreso'],platforms:plats(['fb','direct'])},
 DO:{name_es:'Rep. Dominicana',name_en:'Dominican Rep.',flag:'🇩🇴',cur:'DOP',sym:'RD$',region:'AM',conf:'estimado',
   customs:function(c){var lines=[],notes=[],usd=c.in('USD',c.goods),cif=c.goods+c.ship;
     if(usd<=200){notes.push(N('Hasta 200 USD: sin impuestos (fallo del Tribunal Superior Administrativo).','Up to USD 200: tax-free (Superior Administrative Court ruling).'));return {lines:lines,notes:notes,exempt:true};}
     var r=DUTY_DO[c.cat]||DUTY_DO.other,duty=cif*r;lines.push(L('Arancel (estimado '+pct(r)+')','Duty (est. '+pct(r)+')',duty));lines.push(L('ITBIS (18%)','ITBIS VAT (18%)',(cif+duty)*.18));
     notes.push(N('Más de 200 USD: arancel según producto (estimado) + ITBIS 18 %.','Over USD 200: product duty (estimate) + 18% ITBIS.'));
     return {lines:lines,notes:notes,estimate:true};},
   src:['https://www.diariolibre.com/actualidad/el-tsa-prohbe-a-aduanas-el-cobro-de-impuesto-a-compras-por-internet-menores-de-us200-BKDL752311'],platforms:plats(['fb','direct'])},
 GT:{name_es:'Guatemala',name_en:'Guatemala',flag:'🇬🇹',cur:'GTQ',sym:'Q',region:'AM',conf:'estimado',
   customs:function(c){var lines=[],notes=[],cif=c.goods+c.ship;
     var r=(c.cat==='books')?0:.10,duty=cif*r;if(duty>0)lines.push(L('DAI (estimado 10%)','Duty DAI (est. 10%)',duty));lines.push(L('IVA (12%)','VAT (12%)',(cif+duty)*.12));
     notes.push(N('Estimación: Guatemala no tiene franquicia general; el DAI depende del producto.','Estimate: Guatemala has no general allowance; DAI duty depends on the product.'));
     return {lines:lines,notes:notes,estimate:true};},
   src:[],platforms:plats(['fb','direct'])},
 CR:{name_es:'Costa Rica',name_en:'Costa Rica',flag:'🇨🇷',cur:'CRC',sym:'₡',region:'AM',conf:'estimado',
   customs:function(c){var lines=[],notes=[],usd=c.in('USD',c.goods),cif=c.goods+c.ship;
     if(usd<=50){notes.push(N('Estimado: hasta 50 USD sin impuestos.','Estimate: up to USD 50 tax-free.'));return {lines:lines,notes:notes,exempt:true,estimate:true};}
     var duty=cif*.06;lines.push(L('Arancel (estimado 6%)','Duty (est. 6%)',duty));lines.push(L('IVA (13%)','VAT (13%)',(cif+duty)*.13));
     notes.push(N('Estimación orientativa: confirma con Hacienda o tu courier.','Rough estimate: confirm with Hacienda or your courier.'));
     return {lines:lines,notes:notes,estimate:true};},
   src:['https://www.hacienda.go.cr'],platforms:plats(['fb','direct'])},
 PA:{name_es:'Panamá',name_en:'Panama',flag:'🇵🇦',cur:'USD',sym:'US$',region:'AM',conf:'estimado',
   customs:function(c){var lines=[],notes=[],usd=c.in('USD',c.goods),cif=c.goods+c.ship;
     if(usd<=100){notes.push(N('Hasta 100 USD: sin impuestos.','Up to USD 100: tax-free.'));return {lines:lines,notes:notes,exempt:true,estimate:true};}
     var duty=cif*.10;lines.push(L('Arancel (estimado 10%)','Duty (est. 10%)',duty));lines.push(L('ITBMS (7%)','ITBMS VAT (7%)',(cif+duty)*.07));
     notes.push(N('Más de 100 USD: arancel según producto (estimado) + ITBMS 7 %.','Over USD 100: product duty (estimate) + 7% ITBMS.'));
     return {lines:lines,notes:notes,estimate:true};},
   src:[],platforms:plats(['fb','direct'])}
};
SC.DEST_ORDER={
 'Europa / Europe':['ES','DE','IT','GB'],
 'Norteamérica / North America':['US','CA','MX'],
 'Sudamérica / South America':['AR','CO','CL','PE','EC','UY','VE','PY','BO'],
 'Centroamérica y Caribe / Central America':['DO','GT','CR','PA'],
 'Oceanía / Oceania':['AU']
};
})(window.SC);
