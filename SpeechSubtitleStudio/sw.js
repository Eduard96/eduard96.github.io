/* Subtitle Studio: оболочка приложения доступна без сети.
   Страница и манифест берутся из сети в первую очередь, чтобы обновления приходили сразу. */
const V = 'ss-v16';
const SHELL = ['./', 'index.html', 'manifest.webmanifest', 'icon-180.png', 'icon-192.png', 'icon-512.png', 'vendor/mp4-muxer.mjs', 'vendor/webm-muxer.mjs'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(V).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== V).map(x => caches.delete(x)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const u = new URL(r.url);
  if (u.origin !== location.origin) return;
  const page = r.mode === 'navigate' || /\/(index\.html)?$/.test(u.pathname) || u.pathname.endsWith('.webmanifest') || u.pathname.endsWith('/sw.js');
  if (page) {
    e.respondWith(
      fetch(r.url, { cache: 'no-cache', credentials: 'same-origin' }).then(res => {
        if (res && res.ok) { const cp = res.clone(); caches.open(V).then(c => c.put(r, cp)); }
        return res;
      }).catch(() => caches.match(r, { ignoreSearch: true }).then(h => h || caches.match('index.html')))
    );
    return;
  }
  e.respondWith(
    caches.match(r, { ignoreSearch: true }).then(hit => {
      const net = fetch(r).then(res => {
        if (res && res.ok) { const cp = res.clone(); caches.open(V).then(c => c.put(r, cp)); }
        return res;
      }).catch(() => hit || caches.match('index.html'));
      return hit || net;
    })
  );
});
