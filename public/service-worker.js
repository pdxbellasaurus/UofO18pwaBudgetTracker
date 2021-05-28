const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/assets/css/styles.css',
  '/assets/js/index.js',
  '/assets/js/db.js',
  '/dist/manifest.json',
  '/dist/bundle.js',
  '/dist/icon_72x72.png',
  '/dist/icon_96x96.png',
  '/dist/icon_128x128.png',
  '/dist/icon_144x144.png',
  '/dist/icon_152x152.png',
  '/dist/icon_192x192.png',
  '/dist/icon_384x384.png',
  '/dist/icon_512x512.png',
];

const PRECACHE = 'cache-v1';
const DATA_CACHE = 'data-cache-v1';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(PRECACHE)
      .then((cache) => cache.addAll(FILES_TO_CACHE))
      .then(self.skipWaiting())
  );
});

// The activate handler takes care of cleaning up old caches.
self.addEventListener('activate', (event) => {
  const currentCaches = [PRECACHE, DATA_CACHE];
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return cacheNames.filter(
          (cacheName) => !currentCaches.includes(cacheName)
        );
      })
      .then((cachesToDelete) => {
        return Promise.all(
          cachesToDelete.map((cacheToDelete) => {
            return caches.delete(cacheToDelete);
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  
  // handle runtime GET requests for data from /api routes
  if (event.request.url.includes('/api/transaction')) {
    // make network request and fallback to cache if network request fails (offline)
    event.respondWith(
      caches.open(DATA_CACHE).then((cache) => {
        return fetch(event.request)
          .then((response) => {
            cache.put(event.request, response.clone());
            return response;
          })
          .catch(() => caches.match(event.request));
      })
    );
    return;
  }

  // use cache first for all other requests for performance
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      } else if (event.request.headers.get('accept').includes('text/html')) {
        return catches.match('/');
      }
      // request is not in cache. make network request and cache the response
      return caches.open(DATA_CACHE).then((cache) => {
        return fetch(event.request).then((response) => {
          return cache.put(event.request, response.clone()).then(() => {
            return response;
          });
        });
      });
    })
  );
});
