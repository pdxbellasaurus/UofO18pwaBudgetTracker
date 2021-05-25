const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/assets/css/styles.css',
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
  
  const PRECACHE = 'precache-v1';
  const RUNTIME = 'runtime-cache';
  
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
    const currentCaches = [PRECACHE, RUNTIME_CACHE];
    event.waitUntil(
      caches
        .keys()
        .then((cacheNames) => {
          return cacheNames.filter((cacheName) => !currentCaches.includes(cacheName));
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
  
// The activate handler takes care of cleaning up old caches.
self.addEventListener('activate', (event) => {
  const currentCaches = [PRECACHE, RUNTIME];
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return cacheNames.filter((cacheName) => !currentCaches.includes(cacheName));
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
  if (event.req.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.req).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return caches.open(RUNTIME).then((cache) => {
          return fetch(event.req).then((res) => {
            return cache.put(event.req, res.clone()).then(() => {
              return res;
            });
          });
        });
      })
    );
  }
});


/*
  self.addEventListener('fetch', event => {
    // non GET requests are not cached and requests to other origins are not cached
    if (
      event.req.method !== 'GET' ||
      !event.req.url.startsWith(self.location.origin)
    ) {
      event.respondWith(fetch(event.req));
      return;
    }
  
    // handle runtime GET requests for data from /api routes
    if (event.req.url.includes('/api/transaction')) {
      // make network request and fallback to cache if network request fails (offline)
      event.respondWith(
        caches.open(RUNTIME_CACHE).then(cache => {
          return fetch(event.req)
            .then(res => {
              cache.put(event.req, res.clone());
              return res;
            })
            .catch(() => caches.match(event.req));
        })
      );
      return;
    }
  
    // use cache first for all other requests for performance
    event.respondWith(
      caches.match(event.req).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
  
        // request is not in cache. make network request and cache the res
        return caches.open(RUNTIME_CACHE).then(cache => {
          return fetch(event.req).then(res => {
            return cache.put(event.req, res.clone()).then(() => {
              return res;
            });
          });
        });
      })
    );
  });
  */