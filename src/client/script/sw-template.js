
console.log('Hello from service-worker.js');

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
  console.log(`cache name of precache is ${workbox.core.cacheNames.precache}`)
  console.log(`cache name of runtime is ${workbox.core.cacheNames.runtime}`)
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}

// precahce and route asserts built by webpack
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

// return app shell for all navigation requests
workbox.routing.registerNavigationRoute('/app-shell');

/* Cache strategies */

// routing for js and css
workbox.routing.registerRoute(
  /\.(?:js|css)$/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'static-cache',
  })
);


// routing for cloud served images
workbox.routing.registerRoute(
  /\.(?:png|gif|jpg|jpeg|webp|svg)$/i,
  new workbox.strategies.CacheFirst({
    cacheName: 'image-cache',
    plugins: [
      new workbox.expiration.Plugin({
        // Only cache requests for a week
        maxAgeSeconds: 7 * 24 * 60 * 60,
        // Only cache 20 requests.
        maxEntries: 20
      }),
      // to handle CORS image requests
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      })
    ]
  })
);

// Cache the underlying font files with a cache-first strategy for 1 year.
workbox.routing.registerRoute(
  /^https:\/\/fonts\.gstatic\.com/,
  new workbox.strategies.CacheFirst({
    cacheName: 'google-fonts-webfonts',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24 * 365,
        maxEntries: 30,
      }),
    ],
  })
);


// routing for api
workbox.routing.registerRoute(
  /\/data$/i,
  new workbox.strategies.CacheFirst({
    cacheName: 'data-cache'
  })
);
