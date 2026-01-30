(function () {

cacheNames = {
    thirdparty: "thirdparty-v2",
    static: "static-v2",
    dynamic: "dynamic-v1"
};

// Fetch content with a timeout
const fetchWithTimeout = (request, timeoutMs = 1000) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(
        new DOMException("Fetch timeout for " + request.url, "TimeoutError")), timeoutMs);

    return fetch(request, { signal: controller.signal })
        .finally(() => clearTimeout(timeoutId));
};

// Delete caches not in the list of names
self.addEventListener('activate', e => {
    cacheIds = Object.keys(cacheNames).map(key => cacheNames[key]);
    e.waitUntil(
        caches.keys()
        .then(names => names.filter(name => !cacheIds.includes(name)))
        .then(names => Promise.all(names.map(name => caches.delete(name))))
        .then(() => self.clients.claim())
    );
});

// Cache logic implementation on fetch
self.addEventListener('fetch', e => {
    const url = new URL(e.request.url);

    // Process a cache result or fetch and cache if not found
    // Used in the below caching strategies as a common logic
    const cacheFirstLogic = cache => cache.match(e.request.url)
        .then(cachedResponse =>
            cachedResponse ||
            fetch(e.request)
            .then(response => {
                cache.put(e.request, response.clone());
                return response;
            })
        );

    // This caching logic serves first from cache, then falls back to net (or main browser cache)
    const cacheFirst = cacheName => caches.open(cacheName).then(cacheFirstLogic);

    // This caching logic serves first from net (or main browser cache), then falls back to cache
    const netFirst = cacheName => caches.open(cacheName)
        .then(cache => {
            // Abort the request if the network call hangs longer than 1s
            return fetchWithTimeout(e.request, 1000)
                .then(response => {
                    cache.put(e.request, response.clone());
                    return response;
                })
                .catch(error => error.name === 'TimeoutError' || error.name === 'AbortError' ?
                    cacheFirstLogic(cache) :       // Try cache, then retry without timeout
                    cache.match(e.request.url));   // Just try cache then maybe fail
        });

    // Requests for huroutes resources
    if (url.origin == self.location.origin)
    {
        // Cache huroutes images to the static cache and serve cache-first
        if (e.request.destination === 'image')
            return e.respondWith(cacheFirst(cacheNames.static));

        // Cache other huroutes stuff to the dynamic cache and serve net-first
        return e.respondWith(netFirst(cacheNames.dynamic));
    }

    // Cache CDN stuff to the thirdparty cache and serve cache-first
    if (url.hostname == "cdn.jsdelivr.net")
        return e.respondWith(cacheFirst(cacheNames.thirdparty));
});

})();