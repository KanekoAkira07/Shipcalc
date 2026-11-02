#!/usr/bin/env node
/* =====================================================================
   ShipCalc · script de publicación
   ---------------------------------------------------------------------
   Netlify lo ejecuta en cada despliegue (ver netlify.toml) y genera la
   carpeta dist/ que se publica:
   · Páginas en español (/) y en inglés (/en/) con el texto ya escrito en
     el HTML (Google lo lee sin ejecutar JavaScript).
   · Título, descripción, canonical, hreflang, Open Graph y datos
     estructurados (JSON-LD) de cada página.
   · sitemap.xml y robots.txt con el dominio del sitio.
   · El dominio sale de Netlify (variable URL): al cambiar de dominio en
     Netlify y volver a desplegar, todo se actualiza solo.
   · Versiones ?v= de CSS/JS automáticas (por contenido).
   · Comprueba que no falte ningún texto ni haya enlaces rotos: si algo
     falla, el despliegue se detiene y la web publicada sigue como estaba.
   Probar en local:  node tools/build.js   (genera dist/)
   ===================================================================== */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm'), crypto = require('crypto'), cp = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'dist');
const META = path.join(ROOT, '.build-meta');
const CFG = require('./paginas.js');

const SITE = (String(process.env.URL || '').trim() || CFG.defaultSite).replace(/\/+$/, '');
const HOST = new URL(SITE).host;
const CONTEXT = process.env.CONTEXT || 'production';
const PROD = CONTEXT === 'production';
const TODAY = new Date().toISOString().slice(0, 10);
const LANGS = ['es', 'en'];
const errors = [];
const fail = m => errors.push(m);

/* ---------- utilidades ---------- */
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
function write(rel, content) { const p = path.join(OUT, rel); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, content); }
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escA = s => esc(s).replace(/"/g, '&quot;');
const strip = s => String(s).replace(/<[^>]+>/g, '');
const hash = s => crypto.createHash('md5').update(s).digest('hex').slice(0, 10);
/* Cambia el dominio escrito en los archivos por el del sitio */
function domain(s) {
  const P = '\u0000SITE\u0000';
  return s.split('https://shipcalc.live').join(P).split('shipcalc.live').join(HOST).split(P).join(SITE);
}
function setAttr(tag, name, value) {
  const re = new RegExp('(\\s' + name + '=)"[^"]*"');
  const v = escA(value);
  if (re.test(tag)) return tag.replace(re, '$1"' + v + '"');
  return tag.replace(/\s*(\/?)>$/, ' ' + name + '="' + v + '"$1>');
}
function gitDate(files) {
  try {
    const out = cp.execFileSync('git', ['log', '-1', '--format=%cs', '--'].concat(files), { cwd: ROOT, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
    return /^\d{4}-\d{2}-\d{2}$/.test(out) ? out : TODAY;
  } catch (e) { return TODAY; }
}

/* ---------- textos: se leen de los mismos archivos que usa la web ---------- */
function sandbox(withDoc) {
  const w = {};
  w.window = w; w.self = w; w.console = console; w.URLSearchParams = URLSearchParams;
  w.navigator = { language: 'es', languages: ['es'] };
  w.localStorage = w.sessionStorage = { getItem() { return null; }, setItem() {}, removeItem() {} };
  w.location = { protocol: 'https:', origin: SITE, pathname: '/', search: '', host: HOST };
  if (withDoc) { w.SC = { origins: {}, fuel: {}, demand: {} }; }
  if (withDoc) w.document = { readyState: 'loading', addEventListener() {}, documentElement: { hasAttribute() { return false; } }, querySelectorAll() { return []; }, getElementById() { return null; } };
  return vm.createContext(w);
}
const cs = sandbox(false);
['data/maletas.js', 'data/sitio.js'].forEach(f => vm.runInContext(read(f), cs, { filename: f }));
const cc = sandbox(true);
['data/japon.js', 'data/corea.js', 'data/china.js', 'data/destinos.js', 'data/motor.js', 'data/app.js'].forEach(f => vm.runInContext(read(f), cc, { filename: f }));
const DICT = { site: cs.SC_SITE_T, calc: cc.SC && cc.SC.UI_T };
if (!DICT.site || !DICT.calc) { console.error('No se pudieron leer los textos (sitio.js / app.js).'); process.exit(1); }
const BAGS = cs.SC_BAGS;
const TOK = { es: BAGS.tokens('es'), en: BAGS.tokens('en') };
const tok = (s, lang) => String(s).replace(/\{(\w+)\}/g, (m, k) => Object.prototype.hasOwnProperty.call(TOK[lang], k) ? TOK[lang][k] : m);
function txt(dict, lang, key, where) {
  const d = DICT[dict];
  let v = d[lang] && d[lang][key];
  if (v == null) { fail(`Falta el texto "${key}" en ${lang === 'es' ? 'español' : 'inglés'} (${where})`); v = (d.es && d.es[key]) || ''; }
  return tok(v, lang);
}

/* ---------- direcciones ---------- */
const pageURL = (p, lang) => SITE + '/' + (lang === 'en' ? 'en/' : '') + (p.file === 'index.html' ? '' : p.file);
const homeURL = lang => SITE + '/' + (lang === 'en' ? 'en/' : '');

/* ---------- transformaciones de HTML ---------- */
function langBlocks(html, lang) {
  const re = /<div\b[^>]*\bdata-lang-only="(es|en)"[^>]*>/g;
  let out = '', i = 0, m;
  while ((m = re.exec(html))) {
    const tagRe = /<\/?div\b[^>]*>/g; tagRe.lastIndex = re.lastIndex;
    let depth = 1, t;
    while (depth && (t = tagRe.exec(html))) depth += t[0][1] === '/' ? -1 : 1;
    if (depth) { fail('Bloque data-lang-only sin cerrar'); return html; }
    out += html.slice(i, m.index);
    if (m[1] === lang) out += m[0].replace(/\s+data-lang-only="(es|en)"/, '').replace(/\s+hidden(?=[\s>])/, '') + html.slice(re.lastIndex, tagRe.lastIndex);
    i = tagRe.lastIndex; re.lastIndex = i;
  }
  return out + html.slice(i);
}
function prerender(html, dict, lang, where) {
  html = html.replace(/<([a-zA-Z][a-zA-Z0-9]*)\b([^>]*?\sdata-i="([^"]+)"[^>]*)>([\s\S]*?)<\/\1>/g, (m, tag, attrs, key, inner) => {
    if (new RegExp('<' + tag + '\\b', 'i').test(inner)) fail(`Elemento <${tag} data-i="${key}"> con contenido anidado (${where})`);
    const v = txt(dict, lang, key, where);
    return '<' + tag + attrs + '>' + (/\sdata-html\b/.test(attrs) ? v : esc(v)) + '</' + tag + '>';
  });
  html = html.replace(/<[a-zA-Z][^>]*\sdata-(?:ph|il|ia)="[^"]+"[^>]*>/g, tag => {
    [['data-ph', 'placeholder'], ['data-il', 'label'], ['data-ia', 'aria-label']].forEach(([a, target]) => {
      const m = tag.match(new RegExp('\\s' + a + '="([^"]+)"'));
      if (m) tag = setAttr(tag, target, txt(dict, lang, m[1], where));
    });
    return tag;
  });
  return html;
}
function jsonld(p, lang) {
  const L = p[lang], url = pageURL(p, lang), ORG = SITE + '/#org';
  const g = [{ '@type': 'Organization', '@id': ORG, name: 'ShipCalc', url: SITE + '/', logo: SITE + '/logo.png' }];
  if (p.ld === 'home') g.push({ '@type': 'WebSite', '@id': SITE + '/#website', name: 'ShipCalc', url: SITE + '/', inLanguage: ['es', 'en'], publisher: { '@id': ORG } });
  if (p.crumb) g.push({ '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: txt('site', lang, 'home', p.file), item: homeURL(lang) },
    { '@type': 'ListItem', position: 2, name: strip(txt('site', lang, p.crumb, p.file)), item: url }] });
  if (p.ld === 'bags') g.push({ '@type': 'Service', name: strip(txt('site', lang, 'b-title', p.file)), serviceType: 'Luggage delivery', url,
    description: strip(tok(L.desc, lang)), provider: { '@id': ORG }, areaServed: { '@type': 'Country', name: 'Japan' }, inLanguage: lang,
    offers: { '@type': 'AggregateOffer', priceCurrency: 'JPY', lowPrice: BAGS.lowPrice, highPrice: BAGS.highPrice, offerCount: 4, url: url + '#reserva' } });
  if (p.ld === 'ship') g.push({ '@type': 'Service', name: strip(txt('site', lang, 's-title', p.file)), serviceType: 'Package shipping from Japan', url,
    description: strip(tok(L.desc, lang)), provider: { '@id': ORG }, areaServed: { '@type': 'Country', name: 'Japan' }, inLanguage: lang,
    offers: { '@type': 'AggregateOffer', priceCurrency: 'JPY', lowPrice: CFG.shipFee.low, highPrice: CFG.shipFee.high } });
  if (p.ld === 'calc') g.push({ '@type': 'WebApplication', name: 'ShipCalc', url, description: strip(tok(L.desc, lang)), applicationCategory: 'FinanceApplication',
    operatingSystem: 'Any', inLanguage: lang, isAccessibleForFree: true, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }, publisher: { '@id': ORG } });
  if (p.ld === 'guide') g.push({ '@type': 'Article', headline: L.h1 || L.title, description: strip(tok(L.desc, lang)), inLanguage: lang, url, mainEntityOfPage: url,
    image: SITE + '/og-image.png', datePublished: p.published, dateModified: p.lastmod < p.published ? p.published : p.lastmod, author: { '@id': ORG }, publisher: { '@id': ORG } });
  if (p.faq) g.push({ '@type': 'FAQPage', mainEntity: p.faq.map(([q, a]) => ({ '@type': 'Question', name: strip(txt(p.dict, lang, q, p.file)),
    acceptedAnswer: { '@type': 'Answer', text: strip(txt(p.dict, lang, a, p.file)) } })) });
  return '<script type="application/ld+json">' + JSON.stringify({ '@context': 'https://schema.org', '@graph': g }).replace(/</g, '\\u003c') + '</script>';
}
function head(html, p, lang) {
  const L = p[lang];
  if (!L || !L.title || !L.desc) { fail(`Faltan título o descripción (${lang}) de ${p.file} en tools/paginas.js`); return html; }
  const title = tok(L.title, lang), desc = tok(L.desc, lang);
  if (!/<title>[\s\S]*?<\/title>/.test(html)) fail(`${p.file} no tiene <title>`);
  html = html.replace(/<title>[\s\S]*?<\/title>/, '<title>' + esc(title) + '</title>');
  if (/<meta name="description"/.test(html)) html = html.replace(/<meta name="description" content="[^"]*">/, '<meta name="description" content="' + escA(desc) + '">');
  else html = html.replace('</title>', '</title>\n<meta name="description" content="' + escA(desc) + '">');
  html = html
    .replace(/[ \t]*<link rel="canonical"[^>]*>\n?/g, '')
    .replace(/[ \t]*<link rel="alternate" hreflang[^>]*>\n?/g, '')
    .replace(/<meta property="og:(?:url|title|description|locale|locale:alternate)"[^>]*>/g, '')
    .replace(/<meta name="twitter:(?:title|description)"[^>]*>/g, '')
    .replace(/[ \t]*<meta name="keywords"[^>]*>\n?/g, '')
    .replace(/[ \t]*<meta name="(?:google-site-verification|msvalidate\.01)"[^>]*>\n?/g, '')
    .replace(/[ \t]*<script type="application\/ld\+json">[\s\S]*?<\/script>\n?/g, '')
    .replace(/^[ \t]*\n/gm, '');
  const ogt = tok(L.ogt || L.title, lang), ogd = tok(L.ogd || L.desc, lang);
  const t = [
    '<link rel="canonical" href="' + pageURL(p, lang) + '">',
    '<link rel="alternate" hreflang="es" href="' + pageURL(p, 'es') + '">',
    '<link rel="alternate" hreflang="en" href="' + pageURL(p, 'en') + '">',
    '<link rel="alternate" hreflang="x-default" href="' + pageURL(p, 'es') + '">',
    '<meta property="og:url" content="' + pageURL(p, lang) + '">',
    '<meta property="og:title" content="' + escA(ogt) + '">',
    '<meta property="og:description" content="' + escA(ogd) + '">',
    '<meta property="og:locale" content="' + (lang === 'es' ? 'es_ES' : 'en_US') + '">',
    '<meta property="og:locale:alternate" content="' + (lang === 'es' ? 'en_US' : 'es_ES') + '">',
    '<meta name="twitter:title" content="' + escA(ogt) + '">',
    '<meta name="twitter:description" content="' + escA(ogd) + '">'
  ];
  /* Verificación de Google Search Console y Bing (variables de entorno en Netlify, opcionales) */
  if (p.file === 'index.html') {
    if (process.env.GOOGLE_SITE_VERIFICATION) t.push('<meta name="google-site-verification" content="' + escA(process.env.GOOGLE_SITE_VERIFICATION.trim()) + '">');
    if (process.env.BING_SITE_VERIFICATION) t.push('<meta name="msvalidate.01" content="' + escA(process.env.BING_SITE_VERIFICATION.trim()) + '">');
  }
  t.push(jsonld(p, lang));
  return html.replace('</head>', t.join('\n') + '\n</head>');
}
function langLinks(html, p, lang) {
  const idx = p.file === 'index.html';
  const href = {
    es: lang === 'es' ? (idx ? './' : p.file) : '../' + (idx ? '' : p.file),
    en: lang === 'en' ? (idx ? './' : p.file) : 'en/' + (idx ? '' : p.file)
  };
  return html.replace(/<a\b[^>]*\sdata-lang="(es|en)"[^>]*>/g, (tag, l) => {
    tag = setAttr(tag, 'href', href[l]);
    return l === lang ? setAttr(tag, 'aria-current', 'true') : tag;
  });
}

/* ---------- 1. limpiar y copiar recursos ---------- */
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
const ASSET_HASH = {};
fs.readdirSync(path.join(ROOT, 'data')).filter(f => /\.(js|css)$/.test(f)).forEach(f => {
  const c = domain(read('data/' + f));
  write('data/' + f, c);
  ASSET_HASH['data/' + f] = hash(c);
});
['og-image.png', 'logo.png'].forEach(f => {
  if (!fs.existsSync(path.join(ROOT, f))) return fail('Falta el archivo ' + f);
  fs.copyFileSync(path.join(ROOT, f), path.join(OUT, f));
});
function assets(html, where) {
  return html.replace(/((?:src|href)=")((?:\.\.\/|\/)?)(data\/[\w.-]+\.(?:js|css))(?:\?v=[^"]*)?"/g, (m, a, pre, f) => {
    if (!ASSET_HASH[f]) { fail(`${where} usa ${f}, que no existe`); return m; }
    return a + pre + f + '?v=' + ASSET_HASH[f] + '"';
  });
}

/* ---------- 2. páginas ---------- */
const pagesMeta = {};
const built = [];
CFG.pages.forEach(p => {
  if (!fs.existsSync(path.join(ROOT, p.file))) return fail('Falta la página ' + p.file);
  const src = read(p.file);
  const deps = [p.file, 'tools/paginas.js'].concat(p.dict === 'calc' ? ['data/app.js'] : ['data/sitio.js', 'data/maletas.js']);
  p.lastmod = gitDate(deps);
  if (p.dict === 'site' && !/data\/maletas\.js/.test(src)) {
    const keys = [...src.matchAll(/\sdata-i="([^"]+)"/g)].map(m => m[1]);
    keys.forEach(k => { if (/\{\w+\}/.test(DICT.site.es[k] || '')) fail(`${p.file} usa el texto "${k}" con precios pero no carga data/maletas.js`); });
  }
  LANGS.forEach(lang => {
    const where = (lang === 'en' ? 'en/' : '') + p.file;
    let h = src;
    h = h.replace(/<html\b[^>]*>/, '<html lang="' + lang + '" data-built="1">');
    h = langBlocks(h, lang);
    h = prerender(h, p.dict, lang, where);
    h = head(h, p, lang);
    h = langLinks(h, p, lang);
    h = h.replace(/href="index\.html"/g, 'href="./"');
    if (lang === 'en') {
      h = h.replace(/((?:src|href)=")(data\/)/g, '$1../$2').replace(/href="logo\.png"/g, 'href="../logo.png"');
      h = h.replace(/(<form\b[^>]*\sname=")(shipcalc-[a-z]+)(")/g, '$1$2-en$3').replace(/(name="form-name" value=")(shipcalc-[a-z]+)(")/g, '$1$2-en$3');
    }
    h = assets(domain(h), where);
    write(where, h);
    pagesMeta[pageURL(p, lang)] = hash(h);
    built.push(where);
  });
});
/* 404 (rutas absolutas: sirve para cualquier carpeta) */
write('404.html', assets(domain(read('404.html')), '404.html'));

/* ---------- 3. comprobar enlaces internos ---------- */
built.concat(['404.html']).forEach(rel => {
  const h = fs.readFileSync(path.join(OUT, rel), 'utf8');
  const base = '/' + rel;
  for (const m of h.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    let u = m[1];
    if (/^(https?:|mailto:|tel:|data:|#|javascript:)/i.test(u)) continue;
    u = u.split('#')[0].split('?')[0];
    if (!u) continue;
    let target = new URL(u, 'https://x' + base).pathname;
    if (target.endsWith('/')) target += 'index.html';
    if (!fs.existsSync(path.join(OUT, decodeURIComponent(target)))) fail(`Enlace roto en ${rel}: ${m[1]}`);
  }
  for (const e of h.matchAll(/<[a-z0-9]+\b[^>]*\sdata-i="([^"]+)"[^>]*><\//gi)) fail(`Texto vacío "${e[1]}" en ${rel}`);
  const ids = [...h.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]);
  [...new Set(ids.filter((x, i) => ids.indexOf(x) !== i))].forEach(x => fail(`ID repetido "${x}" en ${rel}`));
});

/* ---------- 4. sitemap, robots, IndexNow ---------- */
let sm = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';
CFG.pages.forEach(p => LANGS.forEach(lang => {
  sm += '  <url>\n    <loc>' + pageURL(p, lang) + '</loc>\n    <lastmod>' + p.lastmod + '</lastmod>\n';
  LANGS.forEach(l => { sm += '    <xhtml:link rel="alternate" hreflang="' + l + '" href="' + pageURL(p, l) + '"/>\n'; });
  sm += '    <xhtml:link rel="alternate" hreflang="x-default" href="' + pageURL(p, 'es') + '"/>\n  </url>\n';
}));
write('sitemap.xml', sm + '</urlset>\n');
write('robots.txt', PROD
  ? 'User-agent: *\nAllow: /\n\nSitemap: ' + SITE + '/sitemap.xml\n'
  : '# Despliegue de prueba (' + CONTEXT + '): no indexar\nUser-agent: *\nDisallow: /\n');
write(CFG.indexNowKey + '.txt', CFG.indexNowKey);
fs.mkdirSync(META, { recursive: true });
fs.writeFileSync(path.join(META, 'indexnow.json'), JSON.stringify({ site: SITE, host: HOST, key: CFG.indexNowKey, context: CONTEXT, pages: pagesMeta }, null, 1));

/* ---------- 5. resultado ---------- */
if (errors.length) {
  console.error('\n✗ ShipCalc: el despliegue se ha detenido. Corrige esto:\n  - ' + [...new Set(errors)].join('\n  - ') + '\n');
  process.exit(1);
}
console.log(`✓ ShipCalc publicado para ${SITE} (${CONTEXT}): ${built.length} páginas, sitemap con ${Object.keys(pagesMeta).length} direcciones.`);
