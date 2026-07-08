const CACHE_NAME = 'npc-translator-v7';

const CORE_ASSETS = [
  './',
  './index.html',
  './youtube-live.html',
  './youtube-subtitles-ocr.html',
  './diagnostics.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;

  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Non mettere in cache richieste esterne: CDN/API traduzione restano online-only.
  if (url.origin !== self.location.origin) {
    event.respondWith(
      fetch(request).catch(() => new Response('Offline', {
        status: 503,
        statusText: 'Offline',
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      }))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;

      return fetch(request)
        .then(response => {
          if (!response || response.status !== 200) return response;

          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, copy).catch(() => {});
          });

          return response;
        })
        .catch(() => {
          if (request.mode === 'navigate') {
            return caches.match('./index.html');
          }

          return new Response('Offline', {
            status: 503,
            statusText: 'Offline',
            headers: { 'Content-Type': 'text/plain; charset=utf-8' }
          });
        });
    })
  );
});
