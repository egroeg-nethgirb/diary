/* Notebook: keeps the page shell and fonts so the app opens without internet.
   Your notes are never cached here (they live encrypted in the app's own offline copy). */
const V='nb-v5',SHELL=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>e.waitUntil((async()=>{
 const c=await caches.open(V);
 await Promise.all(SHELL.map(u=>c.add(u).catch(()=>{})));
 await self.skipWaiting();
})()));
self.addEventListener('activate',e=>e.waitUntil((async()=>{
 for(const k of await caches.keys())if(k!==V)await caches.delete(k);
 await self.clients.claim();
})()));
self.addEventListener('fetch',e=>{
 const r=e.request;if(r.method!=='GET')return;
 const u=new URL(r.url);
 const font=u.hostname==='fonts.googleapis.com'||u.hostname==='fonts.gstatic.com';
 if(u.origin!==location.origin&&!font)return;                 // never touch api.github.com
 e.respondWith((async()=>{
  const c=await caches.open(V),nav=r.mode==='navigate';
  let hit=await c.match(r,{ignoreSearch:nav});
  if(!hit&&nav)hit=(await c.match('index.html'))||(await c.match('./'));
  if(font&&hit)return hit;                                      // fonts: cache first
  const net=fetch(r).then(res=>{if(res.ok||res.type==='opaque')c.put(r,res.clone());return res});
  net.catch(()=>{});
  if(!hit)return net;
  // newest copy when the network answers, saved copy if it is slow or offline
  return Promise.race([net,new Promise((_,rej)=>setTimeout(rej,2500))]).catch(()=>hit);
 })());
});
