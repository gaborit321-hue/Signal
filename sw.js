// ============================================================
//  Service Worker — Signal PWA
//  👉 Change CACHE_VERSION manuellement à chaque mise à jour
//     pour forcer la purge du cache sur tous les appareils
// ============================================================

const CACHE_VERSION = 'v1.2'; // <-- CHANGE ICI à chaque push

// ============================================================
const CACHE_NAME = `signal-${CACHE_VERSION}`;

const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
];

// ── Installation : mise en cache des assets ──────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// ── Activation : supprime les anciens caches ─────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key.startsWith('signal-') && key !== CACHE_NAME)
          .map(key => {
            console.log(`[SW] Suppression ancien cache : ${key}`);
            return caches.delete(key);
          })
      )
    ).then(() => self.clients.claim())
  );
});

// ── Fetch : Network-first API, Cache-first assets ────────────
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  if (event.request.url.includes('generativelanguage.googleapis.com')) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type === 'opaque') {
          return response;
        }
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      });
    }).catch(() => {
      return caches.match('./index.html');
    })
  );
});
