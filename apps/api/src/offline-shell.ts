import { createHash } from "node:crypto";
export function serviceWorker(html: string, assets: string[]) {
  const version = createHash("sha256")
    .update(html + assets.join("\n"))
    .digest("hex")
    .slice(0, 16);
  return `const CACHE='fieldissue-shell-${version}';const ASSETS=${JSON.stringify(["/offline-shell", ...assets])};
self.addEventListener('install',event=>{event.waitUntil((async()=>{const cache=await caches.open(CACHE);await cache.addAll(ASSETS);await self.skipWaiting();})());});
self.addEventListener('activate',event=>{event.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith('fieldissue-shell-')&&key!==CACHE)await caches.delete(key);await self.clients.claim();})());});
self.addEventListener('fetch',event=>{const r=event.request;const u=new URL(r.url);if(r.method!=='GET'||u.origin!==self.location.origin)return;
if(r.mode==='navigate'&&(u.pathname==='/app'||u.pathname.startsWith('/app/'))){event.respondWith(fetch(r).catch(async()=>{const hit=await caches.match('/offline-shell');return hit||Response.error();}));return;}
if(ASSETS.includes(u.pathname)&&!u.search)event.respondWith((async()=>await caches.match(r)||fetch(r))());});`;
}
