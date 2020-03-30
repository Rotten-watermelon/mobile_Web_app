

// self.addEventListener('install', function(e) {
//     console.log('install');

//     // waitUntil tells the browser that the install event is not finished until we have
//     // cached all of our files
//     e.waitUntil(
//       // Here we call our cache "myonsenuipwa", but you can name it anything unique
//       caches.open('myonsenuipwa').then(cache => {
//         // If the request for any of these resources fails, _none_ of the resources will be
//         // added to the cache.
//         return cache.addAll([
//           '/',
//           '/index.html',
//           'https://unpkg.com/onsenui/css/onsenui.min.css',
//           'https://unpkg.com/onsenui/css/onsen-css-components.min.css',
//           'https://unpkg.com/onsenui/js/onsenui.min.js'
//         ]);
//       })
//     );
//   });

//   // 2. Intercept requests and return the cached version instead
//   self.addEventListener('fetch', function(e) {
//     e.respondWith(
//       // check if this file exists in the cache
//       caches.match(e.request)
//         // Return the cached file, or else try to get it from the server
//         .then(response => response || fetch(e.request))
//     );
//   });

self.addEventListener('fetch', function (event) {
  event.respondWith(caches.open('cache').then(function (cache) {
    return cache.match(event.request).then(function (response) {
      console.log("cache request: " + event.request.url);
      var fetchPromise = fetch(event.request).then(function (networkResponse) {
        // if we got a response from the cache, update the cache                   
        console.log("fetch completed: " + event.request.url, networkResponse);
        if (networkResponse) {
          console.debug("updated cached page: " + event.request.url, networkResponse);
          cache.put(event.request, networkResponse.clone());
        }
        return networkResponse;
      }, function (event) {
        // rejected promise - just ignore it, we're offline!   
        console.log("Error in fetch()", event);
        event.waitUntil(
          caches.open('cache').then(function (cache) {
            // our cache is named *cache* in the caches.open() above
            return cache.addAll
              ([
                //cache.addAll(), takes a list of URLs, then fetches them from the server
                // and adds the response to the cache.           
                // add your entire site to the cache- as in the code below; for offline access
                // If you have some build process for your site, perhaps that could 
                // generate the list of possible URLs that a user might load.               
                '/index.html',
                'https://unpkg.com/onsenui/css/onsenui.min.css',
                'https://unpkg.com/onsenui/css/onsen-css-components.min.css',
                'https://unpkg.com/onsenui/js/onsenui.min.js'
              ]);
          })
        );
      });
      // respond from the cache, or the network
      return response || fetchPromise;
    });
  }));
});

self.addEventListener('install', function (event) {
  // The promise that skipWaiting() returns can be safely ignored.
  self.skipWaiting();
  console.log("Latest version installed!");
});