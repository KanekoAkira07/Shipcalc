/* =====================================================================
   ShipCalc · aviso IndexNow (Bing, Yandex, Seznam, Naver…)
   Después de cada despliegue en producción, envía a IndexNow las
   direcciones que han cambiado desde el despliegue anterior.
   Nunca hace fallar el despliegue: si algo va mal, solo lo anota en el log.
   Google no usa IndexNow: para Google está el sitemap (Search Console).
   ===================================================================== */
const fs = require('fs'), path = require('path');
const STATE_DIR = '.indexnow-state';
const STATE = path.join(STATE_DIR, 'last.json');

module.exports = {
  async onSuccess({ utils }) {
    try {
      const meta = JSON.parse(fs.readFileSync(path.join('.build-meta', 'indexnow.json'), 'utf8'));
      if (meta.context !== 'production') return console.log('IndexNow: despliegue de prueba, no se avisa.');
      if (/\.netlify\.app$/.test(meta.host)) return console.log('IndexNow: el sitio aún no tiene dominio propio, no se avisa.');
      if (typeof fetch !== 'function') return console.log('IndexNow: esta versión de Node no tiene fetch.');
      let prev = {};
      try { await utils.cache.restore(STATE_DIR); prev = JSON.parse(fs.readFileSync(STATE, 'utf8')); } catch (e) { prev = {}; }
      const sameHost = prev.host === meta.host;
      const urls = Object.keys(meta.pages).filter(u => !sameHost || prev.pages?.[u] !== meta.pages[u]);
      if (urls.length) {
        const res = await fetch('https://api.indexnow.org/indexnow', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          body: JSON.stringify({ host: meta.host, key: meta.key, keyLocation: meta.site + '/' + meta.key + '.txt', urlList: urls })
        });
        console.log(`IndexNow: ${urls.length} página(s) enviadas → HTTP ${res.status}`);
        if (res.status >= 300) return; /* no guardamos el estado: se reintenta en el próximo despliegue */
      } else console.log('IndexNow: ninguna página ha cambiado.');
      fs.mkdirSync(STATE_DIR, { recursive: true });
      fs.writeFileSync(STATE, JSON.stringify({ host: meta.host, pages: meta.pages }));
      await utils.cache.save(STATE_DIR);
    } catch (e) {
      console.log('IndexNow: no se pudo avisar (' + (e && e.message) + '). La web está publicada igualmente.');
    }
  }
};
