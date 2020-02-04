let cacheName = 'cashe';

let toBeCached = [
     '/',
      '/index.html',
      '/restaurant.html',
      '/css/styles.css',
      '/js/dbhelper.js',
      '/js/main.js',
      '/js/restaurant_info.js'
];

// install
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(cacheName)
            .then(cache => cache.addAll(toBeCached))
    );
});


// fetch
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }

        return fetch(event.request).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            var responseToCache = response.clone();

            caches.open(cacheName)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});

// activate
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(cacheKeys => Promise.all(
                cacheKeys.map(key => {
                    if(key !== cacheName) {
                        return caches.delete(key);
                    }
                })
            ))
    );
});
