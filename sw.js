/* Notebook: caches the page shell and fonts only. Your data is never cached here. */
const V='nb-v1';
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil((async()=>{
 for(const k of await caches.keys())if(k!==V)await caches.delete(k);
 await self.clients.claim();
})()));
self.addEventListener('fetch',e=>{
 const r=e.request;if(r.method!=='GET')return;
 const u=new URL(r.url);
 const font=u.hostname==='fonts.googleapis.com'||u.hostname==='fonts.gstatic.com';
 if(u.origin!==location.origin&&!font)return;           // never touch api.github.com
 e.respondWith((async()=>{
  const c=await caches.open(V),hit=await c.match(r);
  if(font&&hit)return hit;                              // fonts: cache first
  const net=fetch(r).then(res=>{if(res.ok||res.type==='opaque')c.put(r,res.clone());return res});
  net.catch(()=>{});
  if(!hit)return net;
  // page: always the newest copy when the network answers, cached copy if it is slow or offline
  return Promise.race([net,new Promise((_,rej)=>setTimeout(rej,2500))]).catch(()=>hit);
 })());
});
