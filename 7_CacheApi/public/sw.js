const CACHE_NAME = 'cache-v1';
const FILES_TO_CACHE = [
  '/',
  '/style.css',
  '/main.js'
];

self.addEventListener('install', event => {
  console.log('Realizando Cache.....');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache realizado correctamente');
        return cache.addAll(FILES_TO_CACHE);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
