(function () {

cacheNames = {
    thirdparty: "thirdparty-v3",
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
    // Check if a response is compatible with the request mode
    const isResponseCompatible = (req, resp) => {
        return resp &&
            // https://developer.mozilla.org/en-US/docs/Web/API/FetchEvent/respondWith
            (resp.type !== 'opaque' || req.mode === 'no-cors') &&        // no-cors => opaque
            (resp.type !== 'opaqueredirect' || req.mode === 'manual') && // manual => opaqueredirect
            (resp.type !== 'cors' || req.mode !== 'same-origin');        // same-origin => !cors
    }

    // Match a request in cache and ensure response compatibility
    const matchCompatibleResponse = (cache, request) =>
        cache.match(request.url).then(response => {
            if (!response) return null;
            if (isResponseCompatible(request, response)) return response;
            return cache.delete(request).then(() => null);
        });

    // Process a cache result or fetch and cache if not found
    // Used in the below caching strategies as a common logic
    const cacheFirstLogic = cache => matchCompatibleResponse(cache, e.request)
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
                .catch(error => error.name === 'TimeoutError' || error.name === 'AbortError'
                    ? cacheFirstLogic(cache)                    // Try cache, then retry without timeout
                    : matchCompatibleResponse(cache, e.request) // Other error, try cache only
                        .then(response => {
                            if (response) return response;
                            throw error;                        // Cache miss, rethrow original error
                        })); // Just try cache then maybe fail
        });

    const url = new URL(e.request.url);

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