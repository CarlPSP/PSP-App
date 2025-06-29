
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("solar-lead-tracker").then(cache => {
      return cache.addAll([
        "./index.html",
        "./script.js",
        "./manifest.json"
      ]);
    })
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );
});
