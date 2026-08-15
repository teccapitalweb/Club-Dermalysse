const CACHE_VERSION = 'dermalysse-shell-v5';
const APP_SHELL = [
  './',
  './index.html',
  './access-policy.js',
  './manifest.webmanifest',
  './data/dermalysse-courses.js',
  './data/dermalysse-course-guides.js',
  './img/logo.png',
  './img/logo-dermalysse.png',
  './img/fashion/fashion-login-bg-v2.png',
  './img/fashion/fashion-login-model-v2.png',
  './img/icons/icon-192.png',
  './img/icons/icon-512.png',
  './img/icons/maskable-512.png',
  './img/icons/apple-touch-icon.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_VERSION).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_VERSION).then(cache => cache.put('./index.html', copy));
          return response;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(response => {
        if (response.ok && ['image', 'style', 'script', 'font'].includes(request.destination)) {
          const copy = response.clone();
          caches.open(CACHE_VERSION).then(cache => cache.put(request, copy));
        }
        return response;
      });
    })
  );
});
