(function () {

cacheNames = {
    thirdparty: "thirdparty-v2",
    static: "static-v2",
    dynamic: "dynamic-v1"
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

    // This caching logic serves first from cache, then falls back to net
    const cacheFirst = async cacheName =>
        caches.open(cacheName)
        .then(cache => cache.match(e.request.url)
            .then(cachedResponse => cachedResponse ||
                fetch(e.request)
                .then(response => {
                    cache.put(e.request, response.clone());
                    return response;
                })
            ));

    // This caching logic serves first from net, then falls back to cache
    const netFirst = async cacheName =>
        caches.open(cacheName)
        .then(cache => {
            return fetch(e.request)
                .then(response => {
                    cache.put(e.request, response.clone());
                    return response;
                })
                .catch(() => cache.match(e.request.url));
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