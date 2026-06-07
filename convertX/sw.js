const CACHE_NAME = 'convertx-v5';
const ASSETS = [
  './',
  './index.html',
  './favicon.ico',
  './manifest.json',
  './css/main.css',
  './css/layout.css',
  './css/components.css',
  './css/animations.css',
  './js/utils.js',
  './js/units.js',
  './js/currency.js',
  './js/settings.js',
  './js/history.js',
  './js/favorites.js',
  './js/converter.js',
  './js/ui.js',
  './js/app.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  // We don't want to cache API calls, only static assets
  if (event.request.url.includes('api.frankfurter.app') || event.request.url.includes('open.er-api.com') || event.request.url.includes('geojs.io')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return cachedResponse || fetch(event.request);
    })
  );
});
