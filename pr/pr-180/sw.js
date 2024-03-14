(function(){cacheNames={thirdparty:"thirdparty-v1",static:"static-v1",dynamic:"dynamic-v1"};self.addEventListener('activate',e=>{cacheIds=Object.keys(cacheNames).map(key=>cacheNames[key]);e.waitUntil(caches.keys().then(names=>names.filter(name=>!cacheIds.includes(name))).then(names=>Promise.all(names.map(name=>caches.delete(name)))).then(()=>self.clients.claim()));});self.addEventListener('fetch',e=>{const url=new URL(e.request.url);const cacheFirst=async cacheName=>caches.open(cacheName).then(cache=>cache.match(e.request.url).then(cachedResponse=>cachedResponse||fetch(e.request).then(response=>{cache.put(e.request,response.clone());return response;})));const netFirst=async cacheName=>caches.open(cacheName).then(cache=>{return fetch(e.request).then(response=>{cache.put(e.request,response.clone());return response;}).catch(()=>cache.match(e.request.url));});if(url.origin==self.location.origin)
{if(e.request.destination==='image')
return e.respondWith(cacheFirst(cacheNames.static));return e.respondWith(netFirst(cacheNames.dynamic));}
if(url.hostname=="cdn.jsdelivr.net")
return e.respondWith(cacheFirst(cacheNames.thirdparty));});})();