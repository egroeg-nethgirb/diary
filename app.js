const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const pad=n=>String(n).padStart(2,'0');
const ymd=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let TODAY=ymd(new Date());

/* ---------- keyword dictionary ---------- */
const CATS={
 'Food':{icon:'☕',color:'#d6a14b',words:['five star','snaks','puure','sprit','donut','donuts','coffe','biskut','crice','grice','ckrice','mangobar','bdaycake','avilmilk','poree','railtea','beefporota','beefputt','chocobar','chiking','frypotato','panipuri','kothporota','yeppe','gig','peraka','streetfood','bftea','te','vadapav','jileby','jalebi','popcon','popcorn','dabba','benidosa','rotti','cafelate','galaxyfig','fivestar','annapurna','onne','onnee','feast','soya','banna','bannana','center fresh','tea','chaya','coffee','cafe','cafetea','cafeteria','canteen','lunch','dinner','breakfast','bf','meal','meals','food','snack','snacks','snak','juice','shake','milkshake','sprite','7up','drink','soda','lassi','water','toddy','refreshment','treat',
  'idli','idly','dosa','dosai','idiyappam','idiyapam','idyapam','appam','putt','puttu','pathiri','poori','pooree','poore','puree','pure','pori','porota','porotta','protta','prota','porta','potta','parotta','chapati','chapathi','roti','kothu','koth','noodle','noodles','biryani','biriyani','briyani','biriyai','cb','vp','fryrice','fry','fried','curry','gravy','sambar','sapad','thali','mandi','manthi','alfam','alfaham','grill','grilled','shavarma','sharma','shawarma','shavai','kunafa','roll','rol','meatroll','sandwich','burger','pizza','kfc','momo','momoes','momos','sev','dal','baji','bajji','kadi','kadala','samosa','puff','puffs','pubs','vada','pav','puri','pulav','omlet','omelette','eggcurry',
  'chicken','chiken','chick','chik','chikrice','chikushake','beef','beaf','mutton','motton','fish','pork','prawn','kebab',
  'biscuit','biscuits','biscut','bisct','bisect','biscuitss','bun','cake','icecream','ice cream','cone','kulfi','chocolate','choco','sweet','sweets','laddu','peda','candy','canty','bingo','lays','chips','cips','payasam','payam','payampori','payampoli','fig','galaxy','galxy','glaxy','kpk','kstory','vk','yippee','yeepee','yeppee','maggie','dilkush','cheese','kuliki','laban','soup',
  'banana','mango','apple','orange','grape','grapes','fruit','fruits','lime','watermelon','water melon','sugar cane','avil milk','banana milk','egg rol','egg roll','beef fry','sprouts']},
 'Groceries':{icon:'🛒',color:'#8fb86a',words:['d mart','grocery','groceries','grocry','grcry','gcry','grcy','grcty','grocy','dmart','supermarket','market','kpn','veg','vegi','vegitable','vegetable','vegetables','onion','tomato','cabage','cabbage','cauliflower','beetroot','garlic','potato','carrot','coconut','egg','eggs','curd','yogurt','yoghurt','milk','bread','jam','butter','oil','sugar','salt','atta','aata','arisi','rice','oats','honey','tea powder']},
 'Transportation':{icon:'🚗',color:'#5b8fd1',words:['ambernath','thalkal','metro card','bus','busmetro','auto','autos','metro','train','suburban','suburbantrain','cab','taxi','uber','ola','petrol','diesel','fuel','jeep','ticket','tickets','tatkal','ferry','flight','bike','rickshaw','parking','toll','travel','ride','to room','metro recharge']},
 'Stay':{icon:'🏠',color:'#c98a5a',words:['room','rent','hostel','homestay','homestayrent','hotel','lodge','oxotel','stay']},
 'Bills & Utilities':{icon:'💡',color:'#9a86d6',words:['haritha','meter','vi','electricity','electric','bill','recharge','reacharge','sim','broadband','wifi','internet','hotspot','insurance','gas','cylinder','tax','emi','subscription','postpaid','prepaid']},
 'Education':{icon:'🎓',color:'#6aa8c9',words:['pen','exam','fee','fees','tuition','project','report','print','printout','xerox','photostat','copy','cv','book','books','stationery','course','certificate']},
 'Personal Care':{icon:'🧴',color:'#b97fc4',words:['shambo','haircut','hair','hiarcut','soap','shampoo','conditioner','trimmer','moisturiser','moisturizer','paste','toothpaste','brush','facewash','razor','perfume','deodorant','salon','lotion']},
 'Fun':{icon:'🎬',color:'#d77f9c',words:['isl','pvrmovie','movie','movies','pvr','cinema','theatre','theater','netflix','spotify','game','games','concert','museum','treasure','waterfall','interstellar','kanthara','emputan','minecraft','dhurandhar','jailer','onam fund','onam funds','onam program','farewell fund','freshers fund']},
 'Shopping':{icon:'🛍️',color:'#4fae98',words:['white mund','mundu','shirt','tshirt','t-shirt','zudio','pant','pants','shorts','dress','saree','shoe','shoes','chappel','chappal','slippers','belt','bag','umbrella','watch','gloves','banian','blazzer','blazer','jacket','towel','gift','mall','shopping','shoping','purchase','puchase','amazon','flipkart','flip','myntra','uniform','stitching','chair','table','mouse','speaker','laptop','earphones','charger','mirror','utensils','spoon']},
 'Health':{icon:'💊',color:'#d2695c',words:['medicine','medicines','medical','doctor','pharmacy','hospital','hospl','clinic','dentist','xray','x-ray','homeopathy','homiyo','vitamin','gym','tablet','tablets','scan','injection','checkup']},
 'Other':{icon:'📦',color:'#8c94a8',words:[]}
};
/* when a line matches more than one category, the first in this list wins (so "train food" is Food, "bus to room" is Transportation) */
const PRIO=['Health','Bills & Utilities','Education','Personal Care','Fun','Shopping','Stay','Food','Transportation','Groceries'];
const TIMEWORDS=/\b(mrg|morning|noon|eve|evening|ev|ngt|night|aft|afternoon)\b/gi;
/* older saved data used "Food & Drink" */
const normCat=c=>c==='Food & Drink'?'Food':c;
const PALETTE=['#8fb86a','#c98a5a','#6aa8c9','#b59a6a','#5bb3b3','#a98fd1','#d08a8a','#8d9aa8'];
const SD=()=>store.set.data;
function allCats(){
 const o={...CATS};
 // a category you added yourself earlier with the same name as a built-in one keeps its icon but uses the built-in words
 (SD().custom||[]).forEach((c,i)=>{o[c.name]=CATS[c.name]?{...CATS[c.name],icon:c.icon||CATS[c.name].icon}:{icon:c.icon||'🏷️',color:PALETTE[i%PALETTE.length],words:[]}});
 return o;
}
const catInfo=n=>allCats()[normCat(n)]||{icon:'📦',color:'#8c94a8'};
const _rx=new Map();
const rx=w=>{let r=_rx.get(w);if(!r)_rx.set(w,r=new RegExp('\\b'+w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&').replace(/ /g,'\\s+')+'\\b','i'));return r};
function categorize(t){
 const ac=allCats(),uw=SD().words||{};
 // 1) words you added in Settings always win
 for(const [n0,ws] of Object.entries(uw)){const n=normCat(n0);if(ac[n])for(const w of ws)if(rx(w).test(t))return n}
 // 2) built-in words. Leave out mrg/eve/ngt/noon so "eve auto" is read as "auto"
 const clean=t.replace(TIMEWORDS,' ').replace(/\s+/g,' ').trim(),timed=clean!==t.trim().replace(/\s+/g,' ');
 if(!clean)return timed&&ac.Food?'Food':'Other';
 const order=[...PRIO,...Object.keys(ac).filter(n=>!PRIO.includes(n)&&n!=='Other')].filter(n=>ac[n]);
 for(const phrase of [true,false])for(const n of order)for(const w of ac[n].words)if(w.includes(' ')===phrase&&rx(w).test(clean))return(timed&&n==='Groceries'&&ac.Food)?'Food':n; // "noon rice" is a meal, "rice" is a grocery
 return timed?'Food':'Other'; // a meal-time word with nothing else is almost always a meal
}
function toNum(t){
 return /^-?\d{1,3}(,\d{3})+(\.\d+)?$/.test(t)?parseFloat(t.replace(/,/g,'')):parseFloat(t.replace(',','.'));
}
function parseLine(line){
 const m=line.match(/(-?\d+(?:,\d{3})*(?:[.,]\d+)?)(?!.*\d)/);
 if(!m) return null;
 const amount=toNum(m[1]);
 let text=(line.slice(0,m.index)+line.slice(m.index+m[0].length)).replace(/[$₹€£]/g,'').trim()||'Expense';
 let forced=null;const shorts=SD().shorts||[];
 text=text.split(/\s+/).map(w=>{const x=shorts.find(q=>q.k===w.toLowerCase());if(x){if(x.cat&&x.cat!=='auto')forced=normCat(x.cat);return x.text}return w}).join(' ');
 return {text,amount,cat:forced&&allCats()[forced]?forced:categorize(text)};
}

/* ---------- config + encrypted GitHub storage ---------- */
const REPO={owner:'egroeg-nethgirb',repo:'egro-egneth-girb',branch:'main'};
let cfg=JSON.parse(localStorage.getItem('nb_cfg')||'{}'); delete cfg.tok; delete cfg.cur; Object.assign(cfg,REPO);
const saveCfgLocal=()=>{try{const {tok,...rest}=cfg;localStorage.setItem('nb_cfg',JSON.stringify(rest))}catch(e){}};
const cur=()=>'₹';
const money=n=>cur()+(Math.round(n*100)/100).toLocaleString('en-IN',{minimumFractionDigits:0,maximumFractionDigits:2});
const FILES={set:'data/settings.enc.json'};
/* Diary, expenses and credits are stored as one encrypted file per year, so a save only uploads the current year. */
const LEGACY={diary:'data/diary.enc.json',exp:'data/expenses.enc.json',cr:'data/credits.enc.json'};
const DIRS={diary:'data/diary',exp:'data/expenses',cr:'data/credits'};
const KINDS=['diary','exp','cr'];
const shardPath=(k,y)=>`${DIRS[k]}/${y}.enc.json`;
const emptyOf=k=>k==='diary'?{}:[];
const yearOf=d=>/^\d{4}/.test(d)?d.slice(0,4):'0000';
const mkUnit=(kind,path,data)=>({kind,path,data,sha:null,salt:null,key:null,base:null});
const fresh=()=>({diary:{data:{},units:{}},exp:{data:[],units:{}},cr:{data:[],units:{}},set:mkUnit('set',FILES.set,{custom:[],words:{},shorts:[]})});
let store=fresh();
let loaded=false;

const toB64=u=>{let r='';u.forEach(x=>r+=String.fromCharCode(x));return btoa(r)};
const fromB64=s=>Uint8Array.from(atob(s.replace(/\n/g,'')),c=>c.charCodeAt(0));
const b64enc=s=>toB64(new TextEncoder().encode(s));
const b64dec=s=>new TextDecoder().decode(fromB64(s));

async function deriveKey(pw,salt){
 const km=await crypto.subtle.importKey('raw',new TextEncoder().encode(pw),'PBKDF2',false,['deriveKey']);
 return crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations:600000,hash:'SHA-256'},km,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);
}
let keyCache=new Map(),shared=null;
function keyFor(pw,b64,salt){if(!keyCache.has(b64))keyCache.set(b64,deriveKey(pw,salt));return keyCache.get(b64)}
async function encryptObj(st){
 const iv=crypto.getRandomValues(new Uint8Array(12));
 const ct=await crypto.subtle.encrypt({name:'AES-GCM',iv},st.key,new TextEncoder().encode(JSON.stringify(st.data)));
 return JSON.stringify({v:1,kdf:'PBKDF2-SHA256-600000',salt:toB64(st.salt),iv:toB64(iv),data:toB64(new Uint8Array(ct))});
}

function ready(){return cfg.owner&&cfg.repo&&cfg.tok}
let T_GET=20000,T_PUT=30000; // a stalled phone connection is treated as offline after this long
async function gh(path,opt={}){
 const url=`https://api.github.com/repos/${cfg.owner}/${cfg.repo}/contents/${path}`+(opt.method&&opt.method!=='GET'?'':`?ref=${encodeURIComponent(cfg.branch||'main')}`);
 const ctl=new AbortController(),tm=setTimeout(()=>ctl.abort(),opt.method==='PUT'?T_PUT:T_GET);
 try{return await fetch(url,{cache:'no-store',...opt,signal:ctl.signal,headers:{Authorization:'Bearer '+cfg.tok,Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28'}})}
 catch(e){const x=new Error('No internet connection.');x.net=true;throw x}
 finally{clearTimeout(tm)}
}
const tokenErr=r=>r.status===401||r.status===403?'Token rejected. Check its repo access and Contents permission.':'GitHub error '+r.status;
/* returns true if the file already existed */
async function pull(u,pw){
 const r=await gh(u.path);
 if(r.status===404){
  u.sha=null;u.salt=crypto.getRandomValues(new Uint8Array(16));u.key=null;u.base=JSON.stringify(u.data);return false;
 }
 if(!r.ok) throw new Error(tokenErr(r));
 const j=await r.json(), env=JSON.parse(b64dec(j.content));
 u.salt=fromB64(env.salt);u.key=await keyFor(pw,env.salt,u.salt);
 try{
  const pt=await crypto.subtle.decrypt({name:'AES-GCM',iv:fromB64(env.iv)},u.key,fromB64(env.data));
  u.data=JSON.parse(new TextDecoder().decode(pt));u.sha=j.sha;u.base=JSON.stringify(u.data);
 }catch(e){throw new Error('WRONG_PW')}
 return true;
}
async function listYears(kind){
 const r=await gh(DIRS[kind]);
 if(r.status===404)return [];
 if(!r.ok)throw new Error(tokenErr(r));
 const j=await r.json();
 return Array.isArray(j)?j.map(f=>(String(f.name).match(/^(\d{4})\.enc\.json$/)||[])[1]).filter(Boolean):[];
}
function partition(kind,data){
 const out={};
 if(kind==='diary'){for(const k in data){const y=yearOf(k);(out[y]=out[y]||{})[k]=data[k]}}
 else data.forEach(x=>{const y=yearOf(x.date);(out[y]=out[y]||[]).push(x)});
 return out;
}
function compose(kind){
 const us=store[kind].units,ys=Object.keys(us).sort();
 return kind==='diary'?Object.assign({},...ys.map(y=>us[y].data)):[].concat(...ys.map(y=>us[y].data));
}
/* Load one kind. A file from before the yearly split is read once and rewritten as yearly files (see migrate). */
async function loadKind(kind,pw,sharded){
 const K=store[kind],legacy=mkUnit(kind,LEGACY[kind],emptyOf(kind));
 const [hadLegacy,years]=await Promise.all([pull(legacy,pw),listYears(kind)]);
 const migrating=hadLegacy&&!sharded,units={},mk=y=>mkUnit(kind,shardPath(kind,y),emptyOf(kind));
 if(migrating){
  const parts=partition(kind,legacy.data);
  await Promise.all([...new Set([...Object.keys(parts),...years])].map(async y=>{
   const u=mk(y);
   if(years.includes(y))await pull(u,pw); // keep its sha so a half-finished upgrade is simply overwritten
   u.data=parts[y]||emptyOf(kind);u.base=null;units[y]=u;
  }));
 }else await Promise.all(years.map(async y=>{const u=mk(y);await pull(u,pw);units[y]=u}));
 K.units=units;K.legacy=hadLegacy?legacy:null;K.migrate=migrating;K.data=compose(kind);
 return hadLegacy||years.length>0;
}
let _q=Promise.resolve();
const enqueue=fn=>{const p=_q.then(fn);_q=p.catch(()=>{});return p};
function push(key,msg){return enqueue(async()=>{
 try{await(key==='set'?pushNow(store.set,msg):pushKind(key,msg));saveLocalSoon()}
 catch(e){
  if(isNetErr(e)&&localOn()){pendingSync=true;saveLocalSoon();updateNet();return} // offline: kept on this device, uploaded later
  throw e;
 }
})}
/* save only the years whose data changed */
async function pushKind(kind,msg){
 const K=store[kind],parts=partition(kind,K.data),dirty=[],done=new Set();let merged=false;
 for(const y of new Set([...Object.keys(parts),...Object.keys(K.units)])){
  let u=K.units[y];
  if(!u){u=K.units[y]=mkUnit(kind,shardPath(kind,y),emptyOf(kind));u.base=JSON.stringify(u.data)}
  const data=parts[y]||emptyOf(kind);
  if(JSON.stringify(data)===u.base)continue;
  dirty.push([u,u.data,y]);u.data=data;u.merged=false;
 }
 try{for(const [u,,y] of dirty){await pushNow(u,msg+' '+y);done.add(u);if(u.merged)merged=true}}
 catch(e){if(!isNetErr(e))for(const [u,prev] of dirty)if(!done.has(u))u.data=prev;throw e}
 if(merged)K.data=compose(kind);
}
function mergeData(kind,local,base,remote){
 if(kind==='exp'||kind==='cr'){
  const bm=new Map(base.map(x=>[x.id,JSON.stringify(x)])),lm=new Map(local.map(x=>[x.id,x])),out=[],seen=new Set();
  for(const x of remote){
   if(!lm.has(x.id)&&bm.has(x.id))continue; // deleted here
   const l=lm.get(x.id);out.push(l&&JSON.stringify(l)!==bm.get(x.id)?l:x);seen.add(x.id);
  }
  for(const x of local)if(!seen.has(x.id)&&!bm.has(x.id))out.push(x); // added here
  return out;
 }
 if(kind==='diary'){
  const out={...remote};
  for(const k of new Set([...Object.keys(local),...Object.keys(base)])){
   if(local[k]===base[k])continue;
   if(k in local)out[k]=local[k];else delete out[k];
  }
  return out;
 }
 return JSON.stringify(local)!==JSON.stringify(base)?local:remote;
}
/* re-fetch the latest file, merge our unsaved change into it; true if merged */
async function mergeRemote(u,skipSame){
 const r=await gh(u.path);
 if(!r.ok)return false;
 const j=await r.json();
 if(skipSame&&j.sha===u.sha)return false;
 const env=JSON.parse(b64dec(j.content));
 const rk=keyCache.get(env.salt);if(!rk)return false;
 let remote;
 try{remote=JSON.parse(new TextDecoder().decode(await crypto.subtle.decrypt({name:'AES-GCM',iv:fromB64(env.iv)},await rk,fromB64(env.data))))}catch(e){return false}
 const base=u.base?JSON.parse(u.base):emptyOf(u.kind==='set'?'diary':u.kind);
 u.data=mergeData(u.kind,u.data,base,remote);u.sha=j.sha;u.base=JSON.stringify(remote);u.merged=true;
 return true;
}
async function pushNow(u,msg){
 if(!ready()||!loaded) throw new Error('Locked. Log in again.');
 if(shared&&u.salt!==shared.salt){u.salt=shared.salt;u.key=shared.key} // migrate to the shared key
 for(let attempt=0;attempt<3;attempt++){
  const body={message:msg,content:b64enc(await encryptObj(u)),branch:cfg.branch||'main'};
  if(u.sha) body.sha=u.sha;
  const json=JSON.stringify(body);
  // browsers reject keepalive bodies over 64 KB, so only use it for small saves
  const r=await gh(u.path,{method:'PUT',body:json,keepalive:json.length<60000});
  if(r.status===409||r.status===422){
   if(attempt<2&&await mergeRemote(u))continue;
   throw new Error('The file changed elsewhere and could not be merged. Lock, log in again to load the latest, then retry.');
  }
  if(r.status===404) throw new Error('Repo not found. Check the name and that the token can access it.');
  if(!r.ok) throw new Error(tokenErr(r));
  u.sha=(await r.json()).content.sha;u.base=JSON.stringify(u.data);return;
 }
}
/* one-time: write the old single files as yearly files, then mark the upgrade done (old files are left untouched) */
async function migrate(){
 const todo=KINDS.filter(k=>store[k].migrate);
 if(!todo.length)return;
 $('#lockErr').textContent='Upgrading your storage (one time)…';
 for(const k of todo)await enqueue(()=>pushKind(k,'Upgrade '+k+' storage'));
 store.set.data.sharded=true;
 await enqueue(()=>pushNow(store.set,'Mark storage upgraded'));
 todo.forEach(k=>store[k].migrate=false);
}


/* ---------- offline copy + sync ---------- */
const isNetErr=e=>!!(e&&e.net);
let offlineMode=false,pendingSync=false,syncing=false,saveT=null,syncBackoff=0,syncFails=0;
const localOn=()=>{try{return localStorage.getItem('nb_offline')!=='0'}catch(e){return true}};
function readCache(){try{return JSON.parse(localStorage.getItem('nb_cache')||'null')}catch(e){return null}}
function buildPayload(){
 const p={v:1};
 for(const k of KINDS){
  const K=store[k],parts=partition(k,K.data);p[k]={};
  for(const y of new Set([...Object.keys(parts),...Object.keys(K.units)])){
   const u=K.units[y];
   p[k][y]={data:parts[y]||emptyOf(k),base:u?u.base:JSON.stringify(emptyOf(k)),sha:u?u.sha:null};
  }
 }
 p.set={data:store.set.data,base:store.set.base,sha:store.set.sha};
 p.tok=cfg.tok||''; // lets the next sign-in on this device ask for the password only
 return JSON.stringify(p);
}
async function writeCache(json,sh){
 const iv=crypto.getRandomValues(new Uint8Array(12));
 const ct=await crypto.subtle.encrypt({name:'AES-GCM',iv},sh.key,new TextEncoder().encode(json));
 try{localStorage.setItem('nb_cache',JSON.stringify({v:1,salt:toB64(sh.salt),iv:toB64(iv),data:toB64(new Uint8Array(ct))}))}
 catch(e){/* storage full or blocked: the offline copy is just skipped */}
}
function saveLocalNow(){clearTimeout(saveT);if(!localOn()||!loaded||!shared)return Promise.resolve();return writeCache(buildPayload(),shared)}
function saveLocalSoon(){if(!localOn()||!loaded||!shared)return;clearTimeout(saveT);saveT=setTimeout(saveLocalNow,400)}
async function openCache(pw){
 const c=readCache();if(!c)return null;
 try{
  const salt=fromB64(c.salt),key=await keyFor(pw,c.salt,salt);
  const p=JSON.parse(new TextDecoder().decode(await crypto.subtle.decrypt({name:'AES-GCM',iv:fromB64(c.iv)},key,fromB64(c.data))));
  return {p,salt,key};
 }catch(e){return 'wrong'}
}
function restoreFrom(p){
 store=fresh();
 for(const k of KINDS){
  for(const [y,c] of Object.entries(p[k]||{})){
   const u=mkUnit(k,shardPath(k,y),c.data);u.base=c.base;u.sha=c.sha;u.salt=shared.salt;u.key=shared.key;store[k].units[y]=u;
  }
  store[k].data=compose(k);store[k].migrate=false;store[k].legacy=null;
 }
 const s=store.set;if(p.set&&p.set.data)s.data=p.set.data;s.base=p.set?p.set.base:null;s.sha=p.set?p.set.sha:null;s.salt=shared.salt;s.key=shared.key;
}
/* no internet at login: open the encrypted copy kept on this device */
async function offlineUnlock(pw){
 const o=await openCache(pw);
 if(!o)return 'none';if(o==='wrong')return 'wrong';
 shared={salt:o.salt,key:o.key};restoreFrom(o.p);loaded=true;offlineMode=true;pendingSync=true;
 return 'ok';
}
/* online login: bring in changes that were made offline and never uploaded */
async function recoverPending(pw){
 if(!localOn())return false;
 const o=await openCache(pw);if(!o||o==='wrong')return false;
 const p=o.p;let n=0;
 for(const k of KINDS){
  if(store[k].migrate)continue;
  for(const [y,c0] of Object.entries(p[k]||{})){
   if(JSON.stringify(c0.data)===c0.base)continue;
   let u=store[k].units[y];
   if(!u){u=mkUnit(k,shardPath(k,y),emptyOf(k));u.base=JSON.stringify(emptyOf(k));u.salt=shared.salt;u.key=shared.key;store[k].units[y]=u}
   u.data=mergeData(k,c0.data,c0.base?JSON.parse(c0.base):emptyOf(k),u.data);n++;
  }
  store[k].data=compose(k);
 }
 if(p.set&&p.set.data&&p.set.base&&JSON.stringify(p.set.data)!==p.set.base){store.set.data=mergeData('set',p.set.data,JSON.parse(p.set.base),store.set.data);n++}
 return n>0;
}
/* back online: merge what others changed, then upload what we changed */
function syncAll(force,quiet){
 if(syncing||!loaded||!cfg.tok||(!force&&Date.now()<syncBackoff))return Promise.resolve();
 syncing=true;updateNet();
 return enqueue(async()=>{
  for(const k of KINDS){
   const K=store[k],years=await listYears(k);
   for(const y of years){
    const u=K.units[y];
    if(u)await mergeRemote(u,true);
    else{const n=mkUnit(k,shardPath(k,y),emptyOf(k));try{await pull(n,'');K.units[y]=n}catch(e){if(isNetErr(e))throw e}}
   }
   K.data=compose(k);
   await pushKind(k,'Sync '+k);
  }
  await mergeRemote(store.set,true);
  if(JSON.stringify(store.set.data)!==store.set.base)await pushNow(store.set,'Sync settings');
 }).then(()=>{offlineMode=false;pendingSync=false;syncBackoff=0;syncFails=0;saveLocalSoon();render();if(!quiet)toast('Everything is uploaded and up to date.')})
  .catch(e=>{if(!isNetErr(e)){syncBackoff=Date.now()+120000;toast('Upload problem: '+e.message,1)}if(navigator.onLine!==false)syncFails++})
  .finally(()=>{syncing=false;updateNet()});
}
/* the sync pill stays hidden unless syncing has failed twice in a row while online */
function updateNet(){
 const el=$('#net');if(!el)return;
 const bad=loaded&&syncFails>=2&&navigator.onLine!==false;
 el.classList.toggle('hide',!bad);
 el.title='Tap to try again';
 if(bad)el.innerHTML='⚠ Not synced<span class="x"> · tap to retry</span>';
}
const trySync=()=>{if(loaded&&(pendingSync||offlineMode)&&navigator.onLine!==false)syncAll()};
addEventListener('online',()=>{updateNet();trySync()});
addEventListener('offline',updateNet);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)trySync()});
addEventListener('focus',trySync);addEventListener('pageshow',trySync);
if(navigator.connection&&navigator.connection.addEventListener)navigator.connection.addEventListener('change',trySync);
setInterval(trySync,10000);
$('#net').onclick=()=>{if(navigator.onLine===false){toast('Still offline. It will upload by itself when you are back online.');return}syncBackoff=0;syncAll(true)};
addEventListener('pagehide',()=>{saveLocalNow()});

/* ---------- ui helpers ---------- */
let tt;
function toast(m,err){const t=$('#toast');t.textContent=m;t.className='show'+(err?' err':'');clearTimeout(tt);tt=setTimeout(()=>t.className='',3500)}
function show(v){flushNote();flushExp();$('#catPop').classList.add('hide');if(v==='dash')_cnt=new WeakMap();
 ['diary','exp','dash','ask','set'].forEach(k=>$('#v-'+k).classList.toggle('hide',k!==v));
 $$('nav button').forEach(b=>b.classList.toggle('on',b.dataset.v===v));
 render();
}
document.addEventListener('click',e=>{const b=e.target.closest('[data-v]');if(b)show(b.dataset.v)});

/* ---------- calendars ---------- */
function drawCal(grid,label,md,sel,has){
 label.textContent=md.toLocaleDateString(undefined,{month:'long',year:'numeric'});
 const y=md.getFullYear(),m=md.getMonth(),first=new Date(y,m,1).getDay(),days=new Date(y,m+1,0).getDate();
 let h=['S','M','T','W','T','F','S'].map(x=>`<span class="dow">${x}</span>`).join('')+'<span></span>'.repeat(first);
 for(let i=1;i<=days;i++){const k=`${y}-${pad(m+1)}-${pad(i)}`;h+=`<button type="button" data-d="${k}" class="${k===TODAY?'today ':''}${k===sel?'sel ':''}${has(k)?'has':''}">${i}</button>`}
 grid.innerHTML=h;
}
/* click the month/year title: pick from years that have data, then a month */
function togglePicker(panel,keysFn,getM,apply){
 if(!panel.classList.contains('hide')){panel.classList.add('hide');return}
 const keys=keysFn();
 const years=[...new Set([...keys.map(k=>k.slice(0,4)),String(new Date().getFullYear())])].sort().reverse();
 let sy=null;
 const showYears=()=>{sy=null;panel.innerHTML=years.map(y=>`<button type="button" data-y="${y}"${+y===getM().getFullYear()?' class="on"':''}>${y}</button>`).join('')};
 const showMonths=y=>{
  sy=y;
  const withData=new Set(keys.filter(k=>k.startsWith(y+'-')).map(k=>+k.slice(5,7)-1));
  panel.innerHTML=`<button type="button" class="back" data-back="1">‹ ${y}</button>`+Array.from({length:12},(_,i)=>`<button type="button" data-m="${i}" class="${withData.has(i)?'has':''}">${new Date(2000,i,1).toLocaleDateString(undefined,{month:'short'})}</button>`).join('');
 };
 panel.onclick=e=>{
  const b=e.target.closest('button');if(!b)return;
  if(b.dataset.y)showMonths(b.dataset.y);
  else if(b.dataset.back)showYears();
  else if(b.dataset.m!==undefined){apply(new Date(+sy,+b.dataset.m,1));panel.classList.add('hide')}
 };
 showYears();panel.classList.remove('hide');
}
const firstOfMonth=()=>{const d=new Date();d.setDate(1);return d};
const shiftMonth=(d,n)=>d.setMonth(d.getMonth()+n);
const prettyDay=k=>new Date(k+'T00:00').toLocaleDateString(undefined,{weekday:'long',day:'numeric',month:'long',year:'numeric'});
const toView=el=>{if(innerWidth<=760)el.scrollIntoView({behavior:'smooth',block:'start'})};
/* small motion helpers (transform/opacity only; instant when the device asks for reduced motion) */
const RM=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
let _cnt=new WeakMap();
function countTo(el,to){
 const from=_cnt.has(el)?_cnt.get(el):0;_cnt.set(el,to);cancelAnimationFrame(el._raf);
 if(RM()||from===to){el.textContent=money(to);return}
 const t0=performance.now(),dur=550;
 const step=t=>{const k=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-k,3);el.textContent=k<1?money(Math.round(from+(to-from)*e)):money(to);if(k<1)el._raf=requestAnimationFrame(step)};
 el._raf=requestAnimationFrame(step);
}
function popSel(g){const b=g.querySelector('.sel');if(b){b.classList.remove('pop');void b.offsetWidth;b.classList.add('pop')}}
function slide(g,c){g.classList.remove('slideL','slideR','swL','swR');void g.offsetWidth;g.classList.add(c)}
/* swipe left or right on an element (touch only; mouse users get the arrow buttons) */
function onSwipe(el,left,right){
 let x0=0,y0=0,t0=0,ok=false;
 el.addEventListener('touchstart',e=>{if(e.touches.length!==1){ok=false;return}const t=e.touches[0];x0=t.clientX;y0=t.clientY;t0=Date.now();ok=true},{passive:true});
 el.addEventListener('touchcancel',()=>{ok=false},{passive:true});
 el.addEventListener('touchend',e=>{
  if(!ok)return;ok=false;
  const t=e.changedTouches[0],dx=t.clientX-x0,dy=t.clientY-y0;
  if(Math.abs(dx)<60||Math.abs(dx)<Math.abs(dy)*1.6||Date.now()-t0>900)return;
  const a=document.activeElement;if(a&&a.tagName==='TEXTAREA'&&a.selectionStart!==a.selectionEnd)return; // selecting text, not swiping
  dx<0?left():right();
 },{passive:true});
}
const stepDay=(k,n)=>{const d=new Date(k+'T00:00');d.setDate(d.getDate()+n);return ymd(d)};

/* ---------- diary (auto-saves) ---------- */
let selDay=TODAY,month=firstOfMonth(),noteDirty=false,noteTimer,bannerOff=false,pendingDay=null;
const hasNote=(d,k)=>!!(d[k]&&d[k].trim());
/* most recent day in the last 7 (before today) with no note, once the diary has started */
function findPending(){
 const d=store.diary.data,keys=Object.keys(d).filter(k=>hasNote(d,k)).sort();
 if(!keys.length)return null;
 for(let i=1;i<=7;i++){
  const dt=new Date(TODAY+'T00:00');dt.setDate(dt.getDate()-i);const k=ymd(dt);
  if(k<keys[0])break;
  if(!hasNote(d,k))return k;
 }
 return null;
}
function renderDiary(){
 const d=store.diary.data;
 pendingDay=findPending();
 $('#banner').classList.toggle('hide',bannerOff||!pendingDay);
 if(pendingDay)$('#bannerGo').textContent='You haven’t written your note for '+new Date(pendingDay+'T00:00').toLocaleDateString(undefined,{day:'numeric',month:'short'})+' yet!';
 drawCal($('#cal'),$('#mlabel'),month,selDay,k=>hasNote(d,k));
 $('#dlabel').textContent=prettyDay(selDay);
 $('#dNextDay').disabled=selDay>=TODAY;
 if(!noteDirty){$('#note').value=d[selDay]||'';$('#noteSt').textContent=''}
}
async function saveNote(day,text){
 clearTimeout(noteTimer);
 const d=store.diary.data,prev=d[day]||'';
 if(text.trim())d[day]=text;else delete d[day];
 $('#noteSt').textContent='Saving…';
 try{await push('diary','Diary '+day);const same=day===selDay&&$('#note').value===text;if(same)noteDirty=false;renderDiary();if(same)$('#noteSt').textContent=pendingSync?'Saved on this device':'Saved ✓'}
 catch(e){if(day===selDay)noteDirty=true;$('#noteSt').textContent='Not saved yet';toast(e.message,1)}
}
function flushNote(){if(noteDirty&&loaded){noteDirty=false;saveNote(selDay,$('#note').value)}}
$('#note').oninput=()=>{noteDirty=true;$('#noteSt').textContent='Typing…';clearTimeout(noteTimer);noteTimer=setTimeout(flushNote,5000)};
$('#note').onblur=flushNote;
$('#saveNote').onclick=()=>{noteDirty=false;saveNote(selDay,$('#note').value)};
$('#cal').onclick=e=>{const b=e.target.closest('[data-d]');if(b){flushNote();selDay=b.dataset.d;renderDiary();popSel($('#cal'));toView($('#dlabel'))}};
function moveDiary(n){
 const k=stepDay(selDay,n);if(k>TODAY)return; // never into the future
 flushNote();selDay=k;month=new Date(+k.slice(0,4),+k.slice(5,7)-1,1);
 renderDiary();slide($('#noteCard'),n>0?'swL':'swR');
}
$('#dPrevDay').onclick=()=>moveDiary(-1);$('#dNextDay').onclick=()=>moveDiary(1);
onSwipe($('#noteCard'),()=>moveDiary(1),()=>moveDiary(-1));
$('#prev').onclick=()=>{shiftMonth(month,-1);renderDiary();slide($('#cal'),'slideR')};
$('#next').onclick=()=>{shiftMonth(month,1);renderDiary();slide($('#cal'),'slideL')};
$('#mlabel').onclick=()=>togglePicker($('#dpk'),()=>Object.keys(store.diary.data).filter(k=>hasNote(store.diary.data,k)),()=>month,d=>{month=d;renderDiary()});
$('#bannerX').onclick=()=>{bannerOff=true;renderDiary()};
$('#bannerGo').onclick=()=>{if(!pendingDay)return;flushNote();selDay=pendingDay;month=new Date(+pendingDay.slice(0,4),+pendingDay.slice(5,7)-1,1);renderDiary();$('#note').focus()};
document.addEventListener('visibilitychange',()=>{if(document.hidden){flushNote();flushExp()}});
addEventListener('pagehide',()=>{flushNote();flushExp()});

/* ---------- expenses ---------- */
let expDay=TODAY,emonth=firstOfMonth(),expDirty=false,expTimer,expBad=[];
const sumA=a=>a.reduce((t,x)=>t+x.amount,0);
const rawOf=x=>x.raw||`${x.text} ${x.amount}`;
const CRRX=/^\s*credit(?!\s*card)\b/i;
const crRaw=x=>x.raw||`credit<>${x.text}<>${x.amount}`;
function parseCreditLine(line){
 if(!line.includes('<>'))return parseCredit(line.replace(/^\s*credit\s*[:,-]?\s*/i,''));
 const rest=line.split('<>').slice(1).map(x=>x.trim());
 if(rest.length===1)return parseCredit(rest[0]);
 const amount=parseFloat((rest[rest.length-1]||'').replace(/[^0-9.\-]/g,''));
 if(isNaN(amount))return null;
 return {amount,text:rest.slice(0,-1).join(' ')||'Credit'};
}
const _ix=new WeakMap();
function idx(arr){let c=_ix.get(arr);if(!c||c.n!==arr.length){c={n:arr.length,m:new Map()};for(const x of arr){let a=c.m.get(x.date);if(!a)c.m.set(x.date,a=[]);a.push(x)}_ix.set(arr,c)}return c.m}
const dayItems=day=>[...(idx(store.cr.data).get(day)||[]).map(x=>({...x,_cr:1})),...(idx(store.exp.data).get(day)||[])];
/* one line of the day box: credits first, then expenses, each as it was typed */
const boxLine=x=>x._cr?(x.raw&&!x.raw.includes('<>')?x.raw:`credit ${x.text} ${x.amount}`):rawOf(x);
let _nn=0;const nid=()=>Date.now().toString(36)+(_nn++).toString(36)+Math.random().toString(36).slice(2,5);
function renderExp(force){
 const days=new Set([...idx(store.exp.data).keys(),...idx(store.cr.data).keys()]);
 drawCal($('#ecal'),$('#emlabel'),emonth,expDay,k=>days.has(k));
 $('#elabel').textContent=prettyDay(expDay);
 $('#eNextDay').disabled=expDay>=TODAY;
 const items=dayItems(expDay),sp=sumA(items.filter(x=>!x._cr)),gt=sumA(items.filter(x=>x._cr));
 countTo($('#eSpent'),sp);countTo($('#eCredit'),gt);
 $('#eDayCap').textContent='Totals for '+new Date(expDay+'T00:00').toLocaleDateString(undefined,{weekday:'long',day:'numeric',month:'long'});
 const box=$('#expIn');
 if(force||(!expDirty&&document.activeElement!==box)){
  box.value=items.map(boxLine).concat(expBad).join('\n');
  if(force)$('#expSt').textContent='';
 }
}
/* Saves the day exactly as written in the box: unchanged lines stay as they are, new or edited lines are read again, removed lines are deleted. */
async function saveExp(day,text){
 clearTimeout(expTimer);
 const lines=text.split('\n').map(x=>x.trim()).filter(Boolean);
 const pool=[...(idx(store.cr.data).get(day)||[]).map(x=>({k:'cr',x,key:boxLine({...x,_cr:1})})),...(idx(store.exp.data).get(day)||[]).map(x=>({k:'exp',x,key:boxLine(x)}))];
 const outE=[],outC=[],bad=[],unk=new Set(),fresh=new Set();let chE=false,chC=false;
 for(const l0 of lines){
  const i=pool.findIndex(p=>p.key===l0);
  if(i>=0){const p=pool.splice(i,1)[0];(p.k==='cr'?outC:outE).push(p.x);continue}
  let l=l0,forced=null;const tm=l.match(/\s@([^@]+)$/);
  if(tm&&!CRRX.test(l)){forced=normCat(tm[1].trim());l=l.slice(0,tm.index).trim()}
  if(CRRX.test(l)){const c=parseCreditLine(l);if(c){const it={id:nid(),date:day,raw:l,...c};outC.push(it);chC=true}else bad.push(l0);continue}
  const p=parseLine(l);if(!p){bad.push(l0);continue}
  if(forced){if(allCats()[forced])p.cat=forced;else unk.add(forced)}
  const it={id:nid(),date:day,raw:l,...p};outE.push(it);fresh.add(it.id);chE=true;
 }
 for(const p of pool){if(p.k==='cr')chC=true;else chE=true}
 const badMsg=bad.length?`${bad.length} line${bad.length>1?'s need':' needs'} an amount at the end, so ${bad.length>1?'they are':'it is'} not saved yet`:'';
 if(day===expDay)expBad=bad;
 if(!chE&&!chC){
  if(day===expDay){expDirty=expDirty&&$('#expIn').value!==text;$('#expSt').textContent=badMsg||(pendingSync?'Saved on this device':'Saved ✓');renderExp()}
  return;
 }
 const be=store.exp.data,bc=store.cr.data;
 const rmE=new Set((idx(be).get(day)||[]).map(x=>x.id)),rmC=new Set((idx(bc).get(day)||[]).map(x=>x.id));
 if(chE)store.exp.data=be.filter(x=>!rmE.has(x.id)).concat(outE);
 if(chC)store.cr.data=bc.filter(x=>!rmC.has(x.id)).concat(outC);
 if(day===expDay)$('#expSt').textContent='Saving…';
 let err=null;
 try{if(chE)await push('exp','Expenses '+day)}catch(e){store.exp.data=be;store.cr.data=bc;err=e}
 if(!err){try{if(chC)await push('cr','Credit '+day)}catch(e){store.cr.data=bc;err=e}}
 if(err){if(day===expDay){expDirty=true;$('#expSt').textContent='Not saved yet'}toast(err.message,1);return}
 if(day===expDay){
  if($('#expIn').value===text)expDirty=false;
  $('#expSt').textContent=badMsg||(unk.size?'Category not found: '+[...unk].join(', ')+'. It was sorted automatically.':(pendingSync?'Saved on this device':'Saved ✓'));
  const o=outE.filter(x=>fresh.has(x.id)&&x.cat==='Other').length;
  if(o)toast(`${o} went to Other. Add @Category at the end of the line to change it.`);
 }
 renderExp();
}
function flushExp(){if(expDirty&&loaded){expDirty=false;saveExp(expDay,$('#expIn').value)}}
function selectExpDay(k,dir){
 flushExp();expDay=k;expBad=[];expDirty=false;
 emonth=new Date(+k.slice(0,4),+k.slice(5,7)-1,1);
 renderExp(true);if(dir)slide($('#expCard'),dir>0?'swL':'swR');
}
function moveExp(n){const k=stepDay(expDay,n);if(k>TODAY)return;selectExpDay(k,n)}
$('#ePrevDay').onclick=()=>moveExp(-1);$('#eNextDay').onclick=()=>moveExp(1);
onSwipe($('#expCard'),()=>moveExp(1),()=>moveExp(-1));
$('#expIn').oninput=()=>{expDirty=true;$('#expSt').textContent='Typing…';clearTimeout(expTimer);expTimer=setTimeout(flushExp,4000)};
$('#expIn').onblur=flushExp;
$('#addExp').onclick=async()=>{expDirty=false;await saveExp(expDay,$('#expIn').value);if(!expDirty){const st=$('#expSt').textContent;renderExp(true);$('#expSt').textContent=st}};
$('#ecal').onclick=e=>{
 const b=e.target.closest('[data-d]');if(!b)return;
 if(b.dataset.d!==expDay)selectExpDay(b.dataset.d,0);
 popSel($('#ecal'));toView($('#expCard'));
};
$('#eprev').onclick=()=>{shiftMonth(emonth,-1);renderExp();slide($('#ecal'),'slideR')};
$('#enext').onclick=()=>{shiftMonth(emonth,1);renderExp();slide($('#ecal'),'slideL')};
$('#emlabel').onclick=()=>togglePicker($('#epk'),()=>[...idx(store.exp.data).keys(),...idx(store.cr.data).keys()],()=>emonth,d=>{emonth=d;renderExp()});

/* ---------- dashboard ---------- */
let dmode='month',dref=new Date(),brkLimit=7;
const pk=()=>dmode==='day'?ymd(dref):dmode==='month'?ymd(dref).slice(0,7):String(dref.getFullYear());
function stepDash(n){
 if(dmode==='day')dref.setDate(dref.getDate()+n);
 else if(dmode==='month'){dref.setDate(1);dref.setMonth(dref.getMonth()+n)}
 else dref.setFullYear(dref.getFullYear()+n);
 brkLimit=7;renderDash();
}
function parseCredit(line){
 const m=line.match(/(-?\d+(?:,\d{3})*(?:[.,]\d+)?)(?!.*\d)/);if(!m)return null;
 return {amount:toNum(m[1]),text:(line.slice(0,m.index)+line.slice(m.index+m[0].length)).replace(/[$₹€£]/g,'').trim()||'Credit'};
}
function renderDash(){
 const P=pk(),ex=store.exp.data.filter(x=>x.date.startsWith(P)),cr=store.cr.data.filter(x=>x.date.startsWith(P));
 $$('#seg button').forEach(b=>b.classList.toggle('on',b.dataset.m===dmode));
 $('#dlab').textContent=dmode==='day'?prettyDay(P):dmode==='month'?dref.toLocaleDateString(undefined,{month:'long',year:'numeric'}):P;
 const spent=sumA(ex),got=sumA(cr);
 countTo($('#sSpent'),spent);countTo($('#sCredit'),got);
 // per-day (month view) or per-month (year view) totals
 const bk={};
 if(dmode==='month')ex.forEach(x=>bk[x.date]=(bk[x.date]||0)+x.amount);
 if(dmode==='year')ex.forEach(x=>{const m=x.date.slice(0,7);bk[m]=(bk[m]||0)+x.amount});
 $('#brkH').textContent=dmode==='day'?'This day':dmode==='month'?'Spent per day':'Spent per month';
 let keys=Object.keys(bk).sort();
 if(dmode==='month')keys.reverse(); // latest days first
 const total=keys.length;
 if(dmode==='month')keys=keys.slice(0,brkLimit);
 $('#brk').innerHTML=dmode==='day'
  ?(ex.length||cr.length?cr.map(x=>`<tr><td>💰 ${esc(crRaw(x))}</td></tr>`).join('')+ex.map(x=>`<tr><td>${catInfo(x.cat).icon} ${esc(rawOf(x))}</td></tr>`).join(''):'<tr><td class="mute">Nothing spent this day.</td></tr>')
  :(keys.length?keys.map(k=>`<tr><td>${dmode==='month'?new Date(k+'T00:00').toLocaleDateString(undefined,{weekday:'short',day:'numeric',month:'short'}):new Date(k+'-01T00:00').toLocaleDateString(undefined,{month:'long'})}</td><td class="n">${money(bk[k])}</td></tr>`).join(''):'<tr><td class="mute">Nothing spent in this period.</td></tr>');
 const more=$('#brkMore');
 if(dmode==='month'&&total>7){more.classList.remove('hide');more.textContent=brkLimit<total?'More days':'Show less'}
 else more.classList.add('hide');
 // pie
 const by={};ex.forEach(x=>{const c=normCat(x.cat);by[c]=(by[c]||0)+x.amount});
 const ent=Object.entries(by).filter(e=>e[1]>0).sort((p,q)=>q[1]-p[1]);let acc=0;const tot=ent.reduce((t,e)=>t+e[1],0);
 const stops=ent.map(([c,v])=>{const st=acc/tot*100;acc+=v;return `${catInfo(c).color} ${st}% ${acc/tot*100}%`});
 $('#pie').style.background=ent.length?`conic-gradient(${stops.join(',')})`:'var(--line)';
 $('#pie').classList.toggle('has',ent.length>0);dashEx=ex;pieEnt=ent;
 $('#leg').innerHTML=ent.length?ent.map(([c,v])=>`<li data-cat="${encodeURIComponent(c)}" tabindex="0" role="button" aria-label="Show what is in ${esc(c)}"><s style="background:${catInfo(c).color}"></s>${catInfo(c).icon} ${esc(c)}: ${money(v)} <span class="mute">(${Math.round(v/tot*100)}%)</span></li>`).join(''):'<li class="mute">No data for this period.</li>';
 renderBars();setPage(dpage);
}
$('#seg').onclick=e=>{const b=e.target.closest('[data-m]');if(b){dmode=b.dataset.m;brkLimit=7;renderDash()}};
$('#dprev').onclick=()=>stepDash(-1);$('#dnext').onclick=()=>stepDash(1);
$('#brkMore').onclick=()=>{
 const total=new Set(store.exp.data.filter(x=>x.date.startsWith(pk())).map(x=>x.date)).size;
 brkLimit=brkLimit<total?brkLimit+7:7;renderDash();
};

/* ---------- dashboard charts: swipe between the pie and the bar chart ---------- */
let dpage=0,barShow={s:true,c:true},barKey=null,barSig='',barGeo={n:0};
function fitPager(){const s=$$('#track .slide')[dpage],pg=$('#pager');if(s&&pg&&s.offsetHeight)pg.style.height=s.offsetHeight+'px'}
function setPage(p){
 dpage=p;
 $('#track').style.transform=`translateX(${-p*100}%)`;
 $$('#chartDots button').forEach((b,i)=>{b.classList.toggle('on',i===p);b.setAttribute('aria-current',i===p?'true':'false')});
 $$('#track .slide').forEach((el,i)=>{el.toggleAttribute('inert',i!==p);el.setAttribute('aria-hidden',i!==p?'true':'false')});
 $('#chartH').textContent=p===0?'By category':(dmode==='year'?'Spent and credit per month':'Spent and credit per day');
 fitPager();
}
$('#chartDots').onclick=e=>{const b=e.target.closest('[data-p]');if(b)setPage(+b.dataset.p)};
(function(){
 const pg=$('#pager'),tr=$('#track');let sx=0,sy=0,dx=0,id=null,mode=null,t0=0;
 pg.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button!==0)return;id=e.pointerId;sx=e.clientX;sy=e.clientY;dx=0;mode=null;t0=Date.now()});
 pg.addEventListener('pointermove',e=>{
  if(e.pointerId!==id)return;
  const x=e.clientX-sx,y=e.clientY-sy;
  if(mode===null){
   if(Math.abs(x)>8&&Math.abs(x)>Math.abs(y)*1.2){mode='h';try{pg.setPointerCapture(id)}catch(_){}tr.classList.add('drag')}
   else if(Math.abs(y)>8)mode='v';
  }
  if(mode!=='h')return;
  dx=x;let off=dx;
  if((dpage===0&&dx>0)||(dpage===1&&dx<0))off=dx*.3; // resist at the ends
  tr.style.transform=`translateX(${-dpage*pg.clientWidth+off}px)`;
 });
 const end=e=>{
  if(e.pointerId!==id)return;id=null;tr.classList.remove('drag');
  if(mode==='h'){
   const w=pg.clientWidth,fast=Date.now()-t0<300&&Math.abs(dx)>30;let p=dpage;
   if(dx<-w*.2||(fast&&dx<0))p=Math.min(1,dpage+1);else if(dx>w*.2||(fast&&dx>0))p=Math.max(0,dpage-1);
   setPage(p);
  }
  mode=null;
 };
 pg.addEventListener('pointerup',end);pg.addEventListener('pointercancel',end);
})();
function renderBars(){
 const svg=$('#bars'),year=dmode==='year',P=pk(),pre=year?P:P.slice(0,7);
 const keys=[],labs=[];
 if(year)for(let m=1;m<=12;m++){keys.push(P+'-'+pad(m));labs.push(new Date(2000,m-1,1).toLocaleDateString(undefined,{month:'short'}))}
 else{const y=+pre.slice(0,4),m=+pre.slice(5,7),n=new Date(y,m,0).getDate();for(let d=1;d<=n;d++){keys.push(pre+'-'+pad(d));labs.push(String(d))}}
 const sumBy=arr=>{const o={};arr.forEach(x=>{if(!x.date.startsWith(pre))return;const k=year?x.date.slice(0,7):x.date;o[k]=(o[k]||0)+x.amount});return o};
 const es=sumBy(store.exp.data),cs=sumBy(store.cr.data);
 const S=keys.map(k=>es[k]||0),C=keys.map(k=>cs[k]||0);
 if(dmode==='day')barKey=P;
 else if(!keys.includes(barKey))barKey=null;
 $$('#bchips button').forEach(b=>b.setAttribute('aria-pressed',String(barShow[b.dataset.s])));
 const maxV=Math.max(0,...(barShow.s?S:[0]),...(barShow.c?C:[0]));
 const W=Math.max(240,Math.floor(svg.parentNode.clientWidth||320)),H=220,L=34,R=4,T=8,B=22,iw=W-L-R,ih=H-T-B,n=keys.length,gw=iw/n;
 const sig=[dmode,pre,barShow.s,barShow.c,W].join('|'),animate=sig!==barSig;barSig=sig;
 svg.classList.toggle('animate',animate);
 svg.setAttribute('viewBox',`0 0 ${W} ${H}`);
 const nice=v=>{const e=Math.pow(10,Math.floor(Math.log10(v))),f=v/e;return(f<=1?1:f<=2?2:f<=2.5?2.5:f<=5?5:10)*e};
 const tk=v=>v>=1e5?(Math.round(v/1e4)/10)+'L':v>=1e3?(Math.round(v/100)/10)+'k':String(Math.round(v*10)/10);
 const step=maxV?nice(maxV/4):1,top=maxV?step*Math.ceil(maxV/step-1e-9):4;
 let h='';
 for(let v=0;v<=top+1e-9;v+=step){const y=T+ih-v/top*ih;h+=`<line class="gl" x1="${L}" x2="${W-R}" y1="${y}" y2="${y}"/><text x="${L-6}" y="${y+3.5}" text-anchor="end">${tk(v)}</text>`}
 const bi=keys.indexOf(barKey);
 if(bi>=0)h+=`<rect class="hl" x="${L+gw*bi}" y="${T}" width="${gw}" height="${ih}" rx="5"/>`;
 const ns=(barShow.s?1:0)+(barShow.c?1:0),bw=Math.max(2,Math.min(16,gw*.66/ns)),gap=ns===2?1.5:0;
 keys.forEach((k,i)=>{
  const cx=L+gw*(i+.5);let x=cx-(ns*bw+gap*(ns-1))/2;
  const bar=(v,cls)=>{if(v>0){const bh=Math.max(1.5,v/top*ih);h+=`<rect class="bar ${cls}" x="${x}" y="${T+ih-bh}" width="${bw}" height="${bh}" rx="${Math.min(3,bw/2)}"/>`}x+=bw+gap};
  if(barShow.s)bar(S[i],'bs');
  if(barShow.c)bar(C[i],'bc');
  if(year||i===0||(i+1)%5===0||i===n-1&&n-1-i>=0&&(i+1)%5>2)h+=`<text x="${cx}" y="${H-6}" text-anchor="middle">${labs[i]}</text>`;
 });
 svg.innerHTML=h;
 barGeo={n,gw,L,W,keys};
 const info=$('#barInfo');
 if(bi>=0){
  const lab=year?new Date(barKey+'-01T00:00').toLocaleDateString(undefined,{month:'long',year:'numeric'}):new Date(barKey+'T00:00').toLocaleDateString(undefined,{weekday:'short',day:'numeric',month:'short'});
  info.textContent=lab+(barShow.s?' · Spent '+money(S[bi]):'')+(barShow.c?' · Credit '+money(C[bi]):'');
 }else info.textContent=maxV?'Tap a bar to see its value.':'No data for this period.';
}
$('#bars').addEventListener('click',e=>{
 if(!barGeo.n)return;
 const r=e.currentTarget.getBoundingClientRect(),x=(e.clientX-r.left)*(barGeo.W/r.width)-barGeo.L,i=Math.floor(x/barGeo.gw);
 if(i<0||i>=barGeo.n)return;
 barKey=barGeo.keys[i];renderBars();
});
$('#bchips').onclick=e=>{
 const b=e.target.closest('[data-s]');if(!b)return;const k=b.dataset.s;
 barShow[k]=!barShow[k];if(!barShow.s&&!barShow.c)barShow[k==='s'?'c':'s']=true;
 renderBars();
};
{let rz;addEventListener('resize',()=>{cancelAnimationFrame(rz);rz=requestAnimationFrame(()=>{if(!$('#v-dash').classList.contains('hide')){renderBars();fitPager()}})})}

/* ---------- click a category: small popup with every item name and its total ---------- */
let dashEx=[],pieEnt=[];
function openCat(cat){
 const rows=new Map();let tot=0;
 dashEx.forEach(x=>{
  if(normCat(x.cat)!==cat)return;
  let k=(x.text||'').replace(TIMEWORDS,' ').replace(/\s+/g,' ').trim().toLowerCase()||'meal';
  let r=rows.get(k);if(!r)rows.set(k,r={name:k,sum:0,n:0});
  r.sum+=x.amount;r.n++;tot+=x.amount;
 });
 const list=[...rows.values()].sort((a,b)=>b.sum-a.sum),max=list.length?list[0].sum:1,info=catInfo(cat);
 $('#cpT').textContent=info.icon+' '+cat+' · '+money(tot);
 $('#cpS').textContent=$('#dlab').textContent+' · '+list.length+' item'+(list.length===1?'':'s');
 $('#cpL').innerHTML=list.map(r=>`<li><div class="r"><span>${esc(r.name.charAt(0).toUpperCase()+r.name.slice(1))}${r.n>1?` <span class="n">×${r.n}</span>`:''}</span><b>${money(r.sum)}</b></div><div class="bar" style="--c:${info.color}"><i style="width:${Math.max(3,r.sum/max*100)}%"></i></div></li>`).join('')||'<li class="mute">Nothing here.</li>';
 $('#cpL').scrollTop=0;
 $('#catPop').classList.remove('hide');
 $('#cpX').focus();
}
function closeCat(){$('#catPop').classList.add('hide')}
$('#cpX').onclick=closeCat;
$('#catPop').addEventListener('click',e=>{if(e.target.id==='catPop')closeCat()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#catPop').classList.contains('hide'))closeCat()});
$('#leg').addEventListener('click',e=>{const li=e.target.closest('[data-cat]');if(li)openCat(decodeURIComponent(li.dataset.cat))});
$('#leg').addEventListener('keydown',e=>{if(e.key!=='Enter'&&e.key!==' ')return;const li=e.target.closest('[data-cat]');if(li){e.preventDefault();openCat(decodeURIComponent(li.dataset.cat))}});
/* tapping a slice of the ring: work out which slice from the angle (the hole in the middle does nothing) */
$('#pie').addEventListener('click',e=>{
 if(!pieEnt.length)return;
 const r=e.currentTarget.getBoundingClientRect(),dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2),rad=Math.hypot(dx,dy)/(r.width/2);
 if(rad>1||rad<.58)return;
 let a=Math.atan2(dx,-dy)/(2*Math.PI);if(a<0)a+=1; // 0 at the top, clockwise, like conic-gradient
 const tot=pieEnt.reduce((t,x)=>t+x[1],0);let acc=0;
 for(const [c,v] of pieEnt){acc+=v/tot;if(a<=acc+1e-9){openCat(c);return}}
 openCat(pieEnt[pieEnt.length-1][0]);
});

/* ASK-START */
/* ---------- Ask: questions about your own entries, answered on this device ----------
   askParse(question) turns words into a plain query object; askRun(query, ...) does the maths on your data.
   Nothing is sent anywhere. The query object is also the seam where an AI could be plugged in later. */
const ASK_CATS={food:'Food',eating:'Food',meals:'Food',grocery:'Groceries',groceries:'Groceries',transport:'Transportation',transportation:'Transportation',travel:'Transportation',stay:'Stay',accommodation:'Stay',bills:'Bills & Utilities',utilities:'Bills & Utilities',education:'Education',study:'Education',care:'Personal Care',fun:'Fun',entertainment:'Fun',shopping:'Shopping',health:'Health',medical:'Health',other:'Other'};
const ASK_STOP=new Set('a an the i me my we is are was were do does did how much many what whats which show give tell find get have has had of on in for at to by with and or all any total totals sum summary spend spending paid pay cost costs expense expenses money rs rupees inr amount please can you could would should list entries entry items item during since from about per than that this these those it its'.split(' '));
const ASK_CREDIT=new Set(['credit','credits','received','receive','income','earned','earnings','got']);
const ASK_SPENT=new Set(['spent','spend','spending','paid','cost','costs','expense','expenses']);
const ASK_MON={jan:0,feb:1,mar:2,apr:3,may:4,jun:5,jul:6,aug:7,sep:8,oct:9,nov:10,dec:11};
const ASK_ALL={from:'0000-01-01',to:'9999-12-31',label:'all time',kind:'all'};
const ASK_PER=/\b(today|yesterday|this week|last week|this month|last month|this year|last year|(?:last|past)\s+(\d+)\s+(day|week|month|year)s?|all time|overall|(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|june?|july?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)(?:\s+(20\d\d))?|(20\d\d))\b/g;
const askMk=(y,m,d)=>new Date(y,m,d);
const askMonthName=(y,m)=>askMk(y,m,1).toLocaleDateString(undefined,{month:'long',year:'numeric'});
function askMonthRange(y,m){return {from:ymd(askMk(y,m,1)),to:ymd(askMk(y,m+1,0)),label:askMonthName(y,m),kind:'month',y,m}}
function askYearRange(y){return {from:y+'-01-01',to:y+'-12-31',label:String(y),kind:'year',y}}
function askResolve(m,today){
 const T=new Date(today+'T00:00'),y=T.getFullYear(),mo=T.getMonth(),d=T.getDate(),w=m[1];
 if(m[6])return askYearRange(+m[6]);
 if(m[4]){const mi=ASK_MON[m[4].slice(0,3)];let yy=m[5]?+m[5]:y;if(!m[5]&&mi>mo)yy--;return askMonthRange(yy,mi)}
 if(w==='today')return {from:today,to:today,label:'today',kind:'day'};
 if(w==='yesterday'){const t=ymd(askMk(y,mo,d-1));return {from:t,to:t,label:'yesterday',kind:'day'}}
 if(w==='this week'||w==='last week'){const dow=(T.getDay()+6)%7,off=w==='this week'?0:7,a=askMk(y,mo,d-dow-off),b=askMk(y,mo,d-dow-off+6);return {from:ymd(a),to:ymd(b),label:w,kind:'week'}}
 if(w==='this month')return {...askMonthRange(y,mo),label:'this month ('+askMonthName(y,mo)+')'};
 if(w==='last month'){const r=askMonthRange(y,mo-1);return {...r,label:'last month ('+r.label+')'}}
 if(w==='this year')return {...askYearRange(y),label:'this year ('+y+')'};
 if(w==='last year')return {...askYearRange(y-1),label:'last year ('+(y-1)+')'};
 if(w==='all time'||w==='overall')return ASK_ALL;
 const n=+m[2],u=m[3],a=new Date(T);
 if(u==='day')a.setDate(a.getDate()-n+1);else if(u==='week')a.setDate(a.getDate()-n*7+1);else if(u==='month'){a.setMonth(a.getMonth()-n);a.setDate(a.getDate()+1)}else{a.setFullYear(a.getFullYear()-n);a.setDate(a.getDate()+1)}
 return {from:ymd(a),to:today,label:'last '+n+' '+u+(n>1?'s':''),kind:'days'};
}
function askPrev(p){ // the period just before this one
 if(p.kind==='month')return askMonthRange(p.y,p.m-1);
 if(p.kind==='year')return askYearRange(p.y-1);
 const a=new Date(p.from+'T00:00'),b=new Date(p.to+'T00:00'),n=Math.round((b-a)/864e5)+1,e=new Date(a);e.setDate(e.getDate()-1);const s=new Date(e);s.setDate(s.getDate()-n+1);
 return {from:ymd(s),to:ymd(e),label:'the '+n+' day'+(n>1?'s':'')+' before',kind:p.kind};
}
function askParse(q,today){
 let s=' '+String(q||'').toLowerCase().replace(/[₹$,?!"“”]/g,' ').replace(/\s+/g,' ')+' ';
 const intents=new Set(),periods=[];
 const flag=(re,name)=>{s=s.replace(re,()=>{intents.add(name);return ' '})};
 flag(/\b(?:vs\.?|versus|compared? (?:to|with)|against|compare)\b/g,'compare');
 flag(/\b(?:(?:per|by|each|every) month|monthly|month by month)\b/g,'bymonth');
 flag(/\b(?:per day|daily|average|avg|mean)\b/g,'avg');
 flag(/\b(?:top|biggest|largest|highest|most expensive|costliest|most)\b/g,'top');
 flag(/\b(?:how many(?: times)?|count|number of|times)\b/g,'count');
 s=s.replace(ASK_PER,(...m)=>{periods.push(askResolve(m,today));return ' '});
 const cats=allCats(),lower={};Object.keys(cats).forEach(n=>lower[n.toLowerCase()]=n);
 let cat=null;
 for(const n of Object.keys(lower))if(n.includes(' ')&&s.includes(' '+n+' ')){cat=lower[n];s=s.replace(' '+n+' ',' ')}
 let mode='auto';const subj=[];
 for(const t of s.split(/[^a-z0-9&'+-]+/).filter(Boolean)){
  if(ASK_CREDIT.has(t)){mode='credit';continue}
  if(ASK_SPENT.has(t)){if(mode!=='credit')mode='spent';continue}
  if(ASK_STOP.has(t))continue;
  if(!cat&&(ASK_CATS[t]||lower[t])){cat=ASK_CATS[t]||lower[t];if(!cats[cat])cat=lower[t]||null;if(cat)continue}
  subj.push(t);
 }
 if(periods.length>1)intents.add('compare');
 return {q:String(q||'').trim(),mode,intents:[...intents],periods,cat,subj};
}
const askNorm=t=>(t||'').toLowerCase().replace(TIMEWORDS,' ').replace(/\s+/g,' ').trim();
function askMatch(x,subj){
 if(!subj.length)return true;
 const words=askNorm(x.text).split(/[^a-z0-9&'+-]+/).filter(Boolean);
 return subj.every(t=>(t.length>3?[t,t.replace(/(?:es|s)$/,'')]:[t]).some(v=>words.some(w=>w===v||(v.length>=3&&w.startsWith(v)))));
}
function askSlice(p,exp,cr,per){
 const inR=x=>x.date>=per.from&&x.date<=per.to;
 let E=exp.filter(x=>inR(x)&&(!p.cat||normCat(x.cat)===p.cat)&&askMatch(x,p.subj));
 let C=p.cat?[]:cr.filter(x=>inR(x)&&askMatch(x,p.subj));
 if(p.mode==='credit')E=[];
 if(p.mode==='spent')C=[];
 return {E,C};
}
const askSum=a=>a.reduce((t,x)=>t+x.amount,0);
function askGroup(list){
 const m=new Map();
 for(const x of list){const k=askNorm(x.text)||'meal';let r=m.get(k);if(!r)m.set(k,r={name:k,sum:0,n:0});r.sum+=x.amount;r.n++}
 return [...m.values()].sort((a,b)=>b.sum-a.sum);
}
function askRun(p,exp,cr,today){
 if(p.intents.includes('compare')&&!p.periods.length&&p.subj.length===2&&!p.cat){ // "tea vs coffee": two things over all time
  const one=t=>{const q={...p,subj:[t]},{E,C}=askSlice(q,exp,cr,ASK_ALL);return {name:t,spent:askSum(E),n:E.length,got:askSum(C)}};
  return {versus:true,A:one(p.subj[0]),B:one(p.subj[1])};
 }
 if(p.intents.includes('compare')){
  let [A,B]=p.periods;
  if(!A){const t=new Date(today+'T00:00');A=askMonthRange(t.getFullYear(),t.getMonth());B=askMonthRange(t.getFullYear(),t.getMonth()-1)}
  else if(!B)B=askPrev(A);
  const a=askSlice(p,exp,cr,A),b=askSlice(p,exp,cr,B),res={compare:true,A:{per:A,spent:askSum(a.E),got:askSum(a.C),n:a.E.length+a.C.length},B:{per:B,spent:askSum(b.E),got:askSum(b.C),n:b.E.length+b.C.length},cats:[]};
  if(!p.cat&&!p.subj.length&&p.mode!=='credit'){
   const by={};a.E.forEach(x=>{const c=normCat(x.cat);(by[c]=by[c]||{a:0,b:0}).a+=x.amount});b.E.forEach(x=>{const c=normCat(x.cat);(by[c]=by[c]||{a:0,b:0}).b+=x.amount});
   res.cats=Object.entries(by).map(([c,v])=>({c,a:v.a,b:v.b})).sort((x,y)=>Math.max(y.a,y.b)-Math.max(x.a,x.b));
  }
  return res;
 }
 const per=p.periods[0]||ASK_ALL,{E,C}=askSlice(p,exp,cr,per);
 const res={per,E,C,spent:askSum(E),got:askSum(C),nE:E.length,nC:C.length};
 res.items=askGroup(E);res.creditItems=askGroup(C);
 res.biggest=[...E].sort((x,y)=>y.amount-x.amount).slice(0,5);
 res.recent=[...E.map(x=>({...x,_k:'s'})),...C.map(x=>({...x,_k:'c'}))].sort((x,y)=>y.date<x.date?-1:y.date>x.date?1:0).slice(0,8);
 // totals per month (or per year when the range is long)
 const keys=[...E,...C].map(x=>x.date);
 if(keys.length){
  const lo=keys.reduce((a,b)=>a<b?a:b),hi=keys.reduce((a,b)=>a>b?a:b),months=(+hi.slice(0,4)-+lo.slice(0,4))*12+(+hi.slice(5,7)-+lo.slice(5,7))+1,len=months>24?4:7;
  const b={};E.forEach(x=>{const k=x.date.slice(0,len);(b[k]=b[k]||{s:0,c:0}).s+=x.amount});C.forEach(x=>{const k=x.date.slice(0,len);(b[k]=b[k]||{s:0,c:0}).c+=x.amount});
  res.buckets=Object.keys(b).sort().map(k=>({k,s:b[k].s,c:b[k].c}));res.bucketLen=len;
  const first=lo,last=per.to<today?per.to:today,from=per.from>first?per.from:first,days=Math.max(1,Math.round((new Date((last<hi?hi:last)+'T00:00')-new Date(from+'T00:00'))/864e5)+1);
  res.days=days;res.months=months;
 }
 return res;
}
/* ASK-END */

function askMoney(n){return money(n)}
const askCap=t=>t.charAt(0).toUpperCase()+t.slice(1);
function askRows(list,n,max){return list.slice(0,n).map(r=>`<div class="lr"><span>${esc(askCap(r.name))}${r.n>1?` <span class="n">×${r.n}</span>`:''}</span><b>${askMoney(r.sum)}</b></div>`).join('')}
function askLabel(p){
 const bits=[];if(p.cat)bits.push(catInfo(p.cat).icon+' '+p.cat);if(p.subj.length)bits.push('“'+p.subj.join(' ')+'”');
 return bits.join(' · ');
}
function askView(q){
 const p=askParse(q,TODAY),r=askRun(p,store.exp.data,store.cr.data,TODAY),what=askLabel(p);
 if(r.versus){
  const f=x=>`<div><span class="mute">${esc(askCap(x.name))}</span><b>${askMoney(x.spent)}</b><span class="mute">${x.n} time${x.n===1?'':'s'}</span></div>`;
  const d=r.A.spent-r.B.spent,w=d>=0?r.A:r.B;
  return `<span class="mute sub">All time</span><div class="cmp">${f(r.A)}${f(r.B)}</div>`+(r.A.n+r.B.n?`<p class="delta">${esc(askCap(w.name))} is higher by <b>${askMoney(Math.abs(d))}</b>.</p>`:'<p class="mute">Nothing found for either.</p>');
 }
 if(r.compare){
  const f=x=>`<div><span class="mute">${esc(x.per.label)}</span><b>${askMoney(x.spent)}</b>${x.got?`<span class="mute">credit ${askMoney(x.got)}</span>`:`<span class="mute">${x.n} entr${x.n===1?'y':'ies'}</span>`}</div>`;
  const d=r.A.spent-r.B.spent;
  let h=`<span class="mute sub">${esc(what||'All spending')}</span><div class="cmp">${f(r.A)}${f(r.B)}</div>`;
  if(r.A.spent||r.B.spent)h+=`<p class="delta">${d===0?'The same.':`${esc(askCap(r.A.per.label.replace(/ \(.*\)/,'')))} is <b>${askMoney(Math.abs(d))}</b> ${d>0?'more':'less'}${r.B.spent?` (${Math.round(Math.abs(d)/r.B.spent*100)}%)`:''}.`}</p>`;
  if(r.cats.length){h+='<h4>By category</h4>'+r.cats.slice(0,8).map(x=>`<div class="lr"><span>${catInfo(x.c).icon} ${esc(x.c)}</span><b>${askMoney(x.a)} <span class="n">vs ${askMoney(x.b)}</span></b></div>`).join('')}
  return h;
 }
 const credit=p.mode==='credit',both=!credit&&p.mode==='auto'&&r.nC>0&&r.nE>0;
 if(!r.nE&&!r.nC)return `<span class="mute sub">${esc(r.per.label)}${what?' · '+esc(what):''}</span><p>Nothing found. Try another word, or a different period such as <i>this month</i> or <i>2025</i>.</p>`;
 let h=`<span class="mute sub">${esc(askCap(r.per.label))}${what?' · '+esc(what):''}</span>`;
 if(credit)h+=`<div class="big c">${askMoney(r.got)}</div><span class="mute">${r.nC} credit${r.nC===1?'':'s'}</span>`;
 else h+=`<div class="big">${askMoney(r.spent)}</div><span class="mute">${r.nE} entr${r.nE===1?'y':'ies'}${r.nE?` · avg ${askMoney(r.spent/r.nE)} each`:''}</span>`+(both?`<p class="delta">Credits matching: <b>${askMoney(r.got)}</b> (${r.nC})</p>`:'');
 const I=p.intents;
 if(!credit&&r.nE&&r.days>1&&(I.includes('avg')||r.per.kind==='month'||r.per.kind==='year')){
  const perDay=r.spent/r.days,perMonth=r.months>1?r.spent/r.months:0;
  h+=`<p class="delta">About <b>${askMoney(perDay)}</b> a day${perMonth?` · <b>${askMoney(perMonth)}</b> a month`:''}.</p>`;
 }
 if(!credit&&r.nE){
  if(I.includes('count')||(p.subj.length&&r.nE))h+=`<p class="delta">Bought <b>${r.nE}</b> time${r.nE===1?'':'s'} on ${new Set(r.E.map(x=>x.date)).size} day${new Set(r.E.map(x=>x.date)).size===1?'':'s'}.</p>`;
  if(r.items.length>1||!p.subj.length)h+='<h4>'+(p.cat||p.subj.length?'Items':'Biggest items')+'</h4>'+askRows(r.items,6);
  if(I.includes('top')||r.nE>3){h+='<h4>Single biggest</h4>'+r.biggest.slice(0,3).map(x=>`<div class="lr"><span>${esc(askCap(askNorm(x.text)||'meal'))} <span class="n">${esc(fmtDate(x.date))}</span></span><b>${askMoney(x.amount)}</b></div>`).join('')}
 }
 if(credit&&r.creditItems.length)h+='<h4>From</h4>'+askRows(r.creditItems,8);
 if(r.buckets&&r.buckets.length>1&&(I.includes('bymonth')||r.per.kind==='year'||r.per.kind==='all'||r.per.kind==='days')){
  const key=credit?'c':'s',mx=Math.max(...r.buckets.map(b=>b[key]),1);
  h+='<h4>'+(r.bucketLen===4?'By year':'By month')+'</h4>'+r.buckets.map(b=>{const lab=r.bucketLen===4?b.k:new Date(b.k+'-01T00:00').toLocaleDateString(undefined,{month:'short',year:'2-digit'});return `<div class="mb"><em>${lab}</em><span><i style="width:${Math.max(2,b[key]/mx*100)}%"></i></span><b>${askMoney(b[key])}</b></div>`}).join('');
 }
 return h;
}
function fmtDate(d){return new Date(d+'T00:00').toLocaleDateString(undefined,{day:'numeric',month:'short',year:'numeric'})}
function askGo(q){
 q=(q||'').trim();if(!q)return;
 const out=$('#askOut');out.classList.remove('hide');
 try{out.innerHTML=askView(q)}catch(e){out.innerHTML='<p>Sorry, I could not work that one out.</p>'}
}
function renderAsk(){
 const ex=$('#askEx');
 if(!ex.children.length){
  ex.innerHTML=['Spent this month','This month vs last month','Biggest expenses last year','Tea vs coffee','Credits this year','Groceries by month this year'].map(t=>`<li><button type="button">${t}</button></li>`).join('');
 }
}
$('#askForm').onsubmit=e=>{e.preventDefault();askGo($('#askIn').value);$('#askIn').blur()};
$('#askEx').addEventListener('click',e=>{const b=e.target.closest('button');if(b){$('#askIn').value=b.textContent;askGo(b.textContent)}});

/* ---------- settings: categories, keywords, short forms ---------- */
function renderSetLists(){
 const ac=allCats(),sd=SD(),names=Object.keys(ac),custom=sd.custom||[];
 const opts=names.map(n=>`<option>${esc(n)}</option>`).join('');
 $('#kwCat').innerHTML=opts;$('#shCat').innerHTML='<option value="auto">Auto</option>'+opts;
 $('#catList').innerHTML=names.map(n=>`<li>${ac[n].icon} ${esc(n)}${custom.some(c=>c.name===n)&&!CATS[n]?`<button data-delcat="${esc(n)}" aria-label="Remove ${esc(n)}">✕</button>`:''}</li>`).join('');
 $('#kwList').innerHTML=Object.entries(sd.words||{}).flatMap(([c,ws])=>ws.map(w=>`<li>${esc(w)} → ${esc(normCat(c))}<button data-delkw="${encodeURIComponent(c)}|${encodeURIComponent(w)}" aria-label="Remove">✕</button></li>`)).join('')||'<li class="mute">None yet</li>';
 $('#shList').innerHTML=(sd.shorts||[]).map(x=>`<li><b>${esc(x.k)}</b>&nbsp;→ ${esc(x.text)}${x.cat&&x.cat!=='auto'?' ('+esc(normCat(x.cat))+')':''}<button data-delsh="${esc(x.k)}" aria-label="Remove">✕</button></li>`).join('')||'<li class="mute">None yet</li>';
}
async function saveSet(fn){
 const snap=JSON.stringify(SD());fn();renderSetLists();
 try{await push('set','Settings');toast('Saved')}catch(e){store.set.data=JSON.parse(snap);toast(e.message,1);renderSetLists()}
}
$('#addCat').onclick=()=>{
 const n=$('#catName').value.trim();
 if(!n||allCats()[n]){toast(n?'That category already exists.':'Type a category name.',1);return}
 const ic=$('#catIcon').value.trim()||'🏷️';
 saveSet(()=>{(SD().custom=SD().custom||[]).push({name:n,icon:ic})});$('#catName').value='';$('#catIcon').value='';
};
$('#addKw').onclick=()=>{
 const w=$('#kwWord').value.trim().toLowerCase(),c=$('#kwCat').value;if(!w)return;
 saveSet(()=>{const W=SD().words=SD().words||{};W[c]=W[c]||[];if(!W[c].includes(w))W[c].push(w)});$('#kwWord').value='';
};
$('#addSh').onclick=()=>{
 const k=$('#shKey').value.trim().toLowerCase(),t=$('#shText').value.trim();
 if(!k||!t||/\s/.test(k)){toast('The short form must be one word, with its full text.',1);return}
 saveSet(()=>{const L=(SD().shorts||[]).filter(x=>x.k!==k);L.push({k,text:t,cat:$('#shCat').value});SD().shorts=L});$('#shKey').value='';$('#shText').value='';
};
$('#v-set').addEventListener('click',e=>{
 const b=e.target.closest('button'),D=b&&b.dataset;if(!D)return;
 if(D.tog){$('#'+D.tog).classList.toggle('hide');return}
 if(D.delcat)saveSet(()=>{SD().custom=SD().custom.filter(c=>c.name!==D.delcat);if(SD().words)delete SD().words[D.delcat]});
 else if(D.delkw){const [c,w]=D.delkw.split('|').map(decodeURIComponent);saveSet(()=>{SD().words[c]=SD().words[c].filter(x=>x!==w)})}
 else if(D.delsh)saveSet(()=>{SD().shorts=SD().shorts.filter(x=>x.k!==D.delsh)});
});

/* ---------- one-time import ---------- */
const MON=['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
function parseDateStr(t,order){
 t=t.trim().replace(/^#+\s*/,'').replace(/[:,]$/,'').replace(/^(mon|tue|wed|thu|fri|sat|sun)[a-z]*,?\s+/i,'');
 let y,m,d,x;
 if(x=t.match(/^(\d{4})[-\/.](\d{1,2})[-\/.](\d{1,2})$/)){y=+x[1];m=+x[2];d=+x[3]}
 else if(x=t.match(/^(\d{1,2})[-\/.](\d{1,2})[-\/.](\d{2}|\d{4})$/)){y=+x[3];if(y<100)y+=2000;if(order==='md'){m=+x[1];d=+x[2]}else{d=+x[1];m=+x[2]}}
 else if(x=t.match(/^(\d{1,2})(?:st|nd|rd|th)?\s+([A-Za-z]{3,9})\.?,?\s+(\d{4})$/)){d=+x[1];m=MON.indexOf(x[2].slice(0,3).toLowerCase())+1;y=+x[3]}
 else if(x=t.match(/^([A-Za-z]{3,9})\.?\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})$/)){m=MON.indexOf(x[1].slice(0,3).toLowerCase())+1;d=+x[2];y=+x[3]}
 else return null;
 if(!(m>=1&&m<=12&&d>=1&&d<=new Date(y,m,0).getDate()))return null;
 return `${y}-${pad(m)}-${pad(d)}`;
}
function splitDays(text,order){
 const days=[];let cur=null,orphan=0;
 text.split('\n').forEach(raw=>{
  const l=raw.trim(),dt=l&&parseDateStr(l,order);
  if(dt){cur={date:dt,lines:[],raw:[]};days.push(cur)}
  else if(cur){cur.raw.push(raw.trimEnd());if(l)cur.lines.push(l)}
  else if(l)orphan++;
 });
 return {days,orphan};
}
function impAnalyze(){
 // dates like 05/01/2026 are read day first (5 January)
 const type=$('#impType').value,{days,orphan}=splitDays($('#impText').value,'dm');
 const r={type,days,orphan,items:[],crs:[],bad:[],notes:{},unk:{}};let n=0;
 const nid=()=>Date.now().toString(36)+(n++).toString(36)+Math.random().toString(36).slice(2,5);
 days.forEach(dy=>{
  if(type==='diary'){const t=dy.raw.join('\n').trim();if(t)r.notes[dy.date]=(r.notes[dy.date]?r.notes[dy.date]+'\n\n':'')+t;return}
  dy.lines.forEach(l=>{
   if(/^nil$/i.test(l))return; // "nil" = nothing that day
   let forced=null;const tm=l.match(/\s@([^@]+)$/);
   if(tm&&!CRRX.test(l)){forced=normCat(tm[1].trim());l=l.slice(0,tm.index).trim()}
   if(CRRX.test(l)){const c=parseCreditLine(l);c?r.crs.push({id:nid(),date:dy.date,raw:l,...c}):r.bad.push(dy.date+': '+l);return}
   const p=parseLine(l);
   if(!p){r.bad.push(dy.date+': '+l);return}
   if(forced){if(allCats()[forced])p.cat=forced;else r.unk[forced]=(r.unk[forced]||0)+1}
   r.items.push({id:nid(),date:dy.date,raw:l,...p});
  });
 });
 return r;
}
function impSummary(r){
 if(!r.days.length)return 'No dates found. Put each date on its own line, like 05/01/2026.';
 const ds=r.days.map(d=>d.date).sort(),span=ds[0]+' to '+ds[ds.length-1];
 let t=r.type==='diary'?`${Object.keys(r.notes).length} diary day(s), ${span}.`
  :`${r.items.length} expense(s) totalling ${money(sumA(r.items))} and ${r.crs.length} credit(s) totalling ${money(sumA(r.crs))}, over ${r.days.length} day(s), ${span}.`;
 if(r.orphan)t+=` ${r.orphan} line(s) before the first date will be ignored.`;
 const uk=Object.keys(r.unk||{});if(uk.length)t+=` Category not found, so auto-sorted instead (add it in Settings first): ${uk.map(k=>k+' ×'+r.unk[k]).join(', ')}.`;
 if(r.bad.length)t+=` ${r.bad.length} line(s) have no amount and will be skipped: `+r.bad.slice(0,5).join(' | ')+(r.bad.length>5?' …':'');
 return t;
}
$('#impGo').onclick=async()=>{
 const r=impAnalyze(),has=r.type==='diary'?Object.keys(r.notes).length:r.items.length+r.crs.length;
 if(!has){$('#impSt').textContent=impSummary(r);toast('Nothing to import.',1);return}
 if(!confirm('Import now?\n\n'+impSummary(r)))return;
 const btn=$('#impGo');btn.disabled=true;$('#impSt').textContent='Importing…';
 const sE=store.exp.data.slice(),sC=store.cr.data.slice(),sD=JSON.stringify(store.diary.data);let expOk=false;
 try{
  if(r.type==='diary'){
   const d=store.diary.data;Object.entries(r.notes).forEach(([k,t])=>{d[k]=d[k]&&d[k].trim()?d[k]+'\n\n'+t:t});
   try{await push('diary','Import diary')}catch(e){store.diary.data=JSON.parse(sD);throw e}
  }else{
   if(r.items.length){store.exp.data=sE.concat(r.items);try{await push('exp','Import expenses')}catch(e){store.exp.data=sE;throw e}expOk=true}
   if(r.crs.length){store.cr.data=sC.concat(r.crs);try{await push('cr','Import credits')}catch(e){store.cr.data=sC;throw e}}
  }
  $('#impText').value='';$('#impSt').textContent='Imported. '+impSummary(r);toast('Import done');
 }catch(e){
  $('#impSt').textContent=(expOk?'Expenses were saved but credits failed. Remove the expense lines and import only the credit lines again. ':'Nothing was kept. ')+e.message;toast(e.message,1);
 }
 btn.disabled=false;
};

/* ---------- login, lock, theme ---------- */
const IDLE_MS=30*60e3,QR_MS=10*60e3;
let idleT,lastAct=Date.now();
function idle(){clearTimeout(idleT);lastAct=Date.now();idleT=setTimeout(()=>{lock();$('#lockErr').textContent='Locked after 30 minutes of inactivity.'},IDLE_MS)}
['click','pointerdown','touchstart','keydown','input','scroll','wheel'].forEach(ev=>document.addEventListener(ev,()=>{if(!loaded||Date.now()-lastAct<1000)return;idle();qrTouch()},{passive:true,capture:true}));
/* phones pause timers while asleep, so check again when the page comes back */
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&loaded&&Date.now()-lastAct>IDLE_MS){lock();$('#lockErr').textContent='Locked after 30 minutes of inactivity.'}});

/* ---------- quick return: after an accidental close, come back without typing for 10 minutes ----------
   The password is NOT kept. What is kept is the already-worked-out key to the encrypted copy on this device (a non-extractable key)
   and the token (encrypted). It stops working 10 minutes after your last activity, and locking by hand, or after 30 idle minutes, deletes it. */
const qrOpen=()=>new Promise((res,rej)=>{const r=indexedDB.open('nb_resume',1);r.onupgradeneeded=()=>r.result.createObjectStore('k');r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)});
async function qrTx(mode,fn){const db=await qrOpen();return new Promise((res,rej)=>{const t=db.transaction('k',mode),q=fn(t.objectStore('k'));t.oncomplete=()=>{db.close();res(q&&q.result)};t.onerror=t.onabort=()=>{db.close();rej(t.error)}})}
function qrTouch(){try{localStorage.setItem('nb_qr_exp',String(Date.now()+QR_MS))}catch(e){}}
function qrClear(){try{localStorage.removeItem('nb_qr_exp')}catch(e){}try{qrTx('readwrite',s=>s.clear()).catch(()=>{})}catch(e){}}
async function qrSave(){
 try{
  if(!shared||!cfg.tok||!localOn())return;
  await saveLocalNow(); // the saved copy that the quick return will open
  const sh=shared,key=await crypto.subtle.generateKey({name:'AES-GCM',length:256},false,['encrypt','decrypt']),iv=crypto.getRandomValues(new Uint8Array(12));
  const ct=await crypto.subtle.encrypt({name:'AES-GCM',iv},key,new TextEncoder().encode(JSON.stringify({tok:cfg.tok})));
  await qrTx('readwrite',x=>x.put({v:2,key,iv,ct,dk:sh.key,salt:toB64(sh.salt)},'s'));
  if(loaded)qrTouch();else qrClear(); // locked while this was saving
 }catch(e){}
}
/* open the saved copy with the kept key: no password check, so it is instant */
async function resumeFast(rec){
 const c=readCache();
 if(rec.v!==2||!rec.dk||!c||c.salt!==rec.salt)throw new Error('no quick return');
 const dec=(k,iv,d)=>crypto.subtle.decrypt({name:'AES-GCM',iv},k,d).then(b=>JSON.parse(new TextDecoder().decode(b)));
 const o=await dec(rec.key,rec.iv,rec.ct),p=await dec(rec.dk,fromB64(c.iv),fromB64(c.data));
 keyCache=new Map([[c.salt,Promise.resolve(rec.dk)]]);
 Object.assign(cfg,REPO);cfg.tok=o.tok;
 store=fresh();shared={salt:fromB64(c.salt),key:rec.dk};restoreFrom(p);loaded=true;pendingSync=true;
 enter();saveLocalSoon();qrTouch();syncAll(true,true);
}
async function autoResume(){
 try{
  const exp=+localStorage.getItem('nb_qr_exp')||0;
  if(exp&&Date.now()>exp)qrClear();
  else if(exp){
   const rec=await qrTx('readonly',s=>s.get('s'));
   if(rec)await resumeFast(rec);
  }
 }catch(e){}
 if(document.body.classList.contains('locked')){ // did not get in: show the normal login form
  qrClear();['#fTok','#fPw'].forEach(i=>$(i).value='');$('#lockErr').textContent='';
  document.documentElement.classList.remove('resuming');
 }
}
function lock(){
 qrClear();
 const lp=loaded&&shared&&localOn()?buildPayload():null,lsh=shared;
 if(lp)writeCache(lp,lsh);
 clearTimeout(idleT);noteDirty=false;store=fresh();keyCache=new Map();shared=null;cfg.tok='';loaded=false;offlineMode=false;pendingSync=false;syncFails=0;updateNet();
 document.body.classList.add('locked');$('#lock').classList.remove('hide');
 ['#fTok','#fPw','#fCfm'].forEach(i=>$(i).value='');
 $('#cfmWrap').classList.add('hide');$('#lockErr').textContent='';
}

function enter(){
 const L=$('#lock');
 const R=document.documentElement.classList;
 if(R.contains('resuming')&&!RM()){L.classList.add('leave');setTimeout(()=>{L.classList.add('hide');L.classList.remove('leave');R.remove('resuming')},330)} // fade out, keeping only the logo on screen meanwhile
 else{L.classList.add('hide');R.remove('resuming')}
 document.body.classList.remove('locked');
 ['#fTok','#fPw','#fCfm'].forEach(i=>$(i).value='');
 show('diary');idle();updateNet();
}
$('#lockForm').onsubmit=async e=>{
 e.preventDefault();
 const err=$('#lockErr'),btn=$('#unlockBtn'),pw=$('#fPw').value;
 err.textContent='';keyCache=new Map();shared=null;
 Object.assign(cfg,REPO);cfg.tok=$('#fTok').value.trim();
 if(!pw||(!cfg.tok&&!(localOn()&&readCache()))){err.textContent='Enter your username and password.';return}
 saveCfgLocal();btn.disabled=true;btn.textContent='Unlocking…';
 try{
  store=fresh();
  /* fast path: this device already has an encrypted copy. If the password opens it, show it now and bring the latest in behind the scenes */
  if(localOn()&&readCache()){
   const o=await openCache(pw);
   if(o&&o!=='wrong'&&(cfg.tok||o.p.tok)){
    if(!cfg.tok)cfg.tok=o.p.tok;
    shared={salt:o.salt,key:o.key};restoreFrom(o.p);loaded=true;pendingSync=true;
    enter();saveLocalSoon();qrSave();syncAll(true,true);
    btn.disabled=false;btn.textContent='Unlock';return;
   }
   if(!cfg.tok){err.textContent=o==='wrong'?'Wrong password.':'Enter your username too.';btn.disabled=false;btn.textContent='Unlock';return}
  }
  await pull(store.set,pw);
  const ex=await Promise.all(KINDS.map(k=>loadKind(k,pw,!!store.set.data.sharded)));
  const cfm=$('#fCfm').value, cfmShown=!$('#cfmWrap').classList.contains('hide');
  if(!ex[0]&&!ex[1]&&cfm!==pw){
   $('#cfmWrap').classList.remove('hide');$('#fCfm').focus();
   err.textContent=cfmShown&&cfm?'Passwords do not match.':'No saved data found. If this is your first time, confirm your password to create it. It cannot be recovered if you forget it.';
  }else{
   const all=[store.set,...KINDS.flatMap(k=>[...Object.values(store[k].units),store[k].legacy])].filter(Boolean);
   const pick=all.find(u=>u.sha);
   if(pick)shared={salt:pick.salt,key:pick.key};
   else{const salt=crypto.getRandomValues(new Uint8Array(16));shared={salt,key:await keyFor(pw,toB64(salt),salt)}}
   for(const u of all)if(!u.sha){u.salt=shared.salt;u.key=shared.key}
   const rec=await recoverPending(pw);
   loaded=true;
   try{await migrate()}
   catch(e){lock();$('#lockErr').textContent='Storage upgrade did not finish. Nothing was lost, please try again. ('+e.message+')';btn.disabled=false;btn.textContent='Unlock';return}
   enter();saveLocalSoon();qrSave();
   if(rec){pendingSync=true;updateNet();syncAll()}
  }
 }catch(ex){
  if(isNetErr(ex)){
   const r=await offlineUnlock(pw);
   if(r==='ok'){enter();qrSave();toast('No internet: working from the copy saved on this device.')}
   else if(r==='wrong')err.textContent='Wrong password.';
   else err.textContent='No internet connection, and this device has no offline copy yet. Connect once and log in to set it up.';
  }else err.textContent=ex.message==='WRONG_PW'?'Wrong password.':ex.message;
 }
 btn.disabled=false;btn.textContent='Unlock';
};
function getTheme(){try{return localStorage.getItem('nb_theme')||'auto'}catch(e){return 'auto'}}
const isDark=()=>{const t=getTheme();return t==='dark'||(t==='auto'&&matchMedia('(prefers-color-scheme: dark)').matches)};
function applyTheme(){
 const t=getTheme(),root=document.documentElement;
 if(t==='auto')root.removeAttribute('data-theme');else root.setAttribute('data-theme',t);
 const dark=isDark();
 document.querySelector('meta[name=theme-color]').content=dark?'#090b14':'#f3eee3';
 $('#themeBtn').innerHTML=dark?'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4"/></svg>':'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.2A8 8 0 0 1 9.8 4 8 8 0 1 0 20 14.2z"/></svg>';
 $('#themeBtn').title=dark?'Switch to light mode':'Switch to dark mode';
}
matchMedia('(prefers-color-scheme: dark)').addEventListener('change',applyTheme);
$('#lockBtn').onclick=()=>lock();
$('#themeBtn').onclick=()=>{try{localStorage.setItem('nb_theme',isDark()?'light':'dark')}catch(x){}applyTheme()};
applyTheme();
function renderOffline(){
 $('#offOn').checked=localOn();
 $('#offSt').textContent=!localOn()?'Offline copy is off.':readCache()?'An encrypted copy is saved on this device.':'No offline copy on this device yet.';
}
$('#offOn').onchange=e=>{
 try{localStorage.setItem('nb_offline',e.target.checked?'1':'0')}catch(x){}
 if(e.target.checked)saveLocalNow().then(renderOffline);
 else{try{localStorage.removeItem('nb_cache')}catch(x){}renderOffline()}
};
$('#offClear').onclick=()=>{try{localStorage.removeItem('nb_cache')}catch(x){}renderOffline();toast('Offline copy removed from this device')};
let deferredInstall=null;
addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredInstall=e;if(!$('#v-set').classList.contains('hide'))renderInstall()});
addEventListener('appinstalled',()=>{deferredInstall=null;toast('Notebook is installed.');renderInstall()});
const standalone=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
function renderInstall(){$('#instCard').classList.toggle('hide',standalone()||!deferredInstall)}
$('#instBtn').onclick=async()=>{if(!deferredInstall)return;deferredInstall.prompt();try{await deferredInstall.userChoice}catch(e){}deferredInstall=null;renderInstall()};
function renderSet(){renderSetLists();renderOffline();renderInstall()}

function rollDay(){
 const n=ymd(new Date());if(n===TODAY)return;
 const old=TODAY,om=old.slice(0,7),sameMonth=d=>ymd(d).slice(0,7)===om;
 if(selDay===old)flushNote(); // save any unsaved text to the old day first
 if(expDay===old)flushExp();
 TODAY=n;bannerOff=false;
 if(selDay===old)selDay=n;
 if(expDay===old)expDay=n;
 if(sameMonth(month))month=firstOfMonth();
 if(sameMonth(emonth))emonth=firstOfMonth();
 if(loaded)render();
}
setInterval(rollDay,60000);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)rollDay()});
addEventListener('focus',rollDay);

if('serviceWorker' in navigator&&/^https?:$/.test(location.protocol))addEventListener('load',()=>{navigator.serviceWorker.register('sw.js').catch(()=>{})});

autoResume();
function render(){
 const v=['diary','exp','dash','ask','set'].find(k=>!$('#v-'+k).classList.contains('hide'));
 if(v==='diary')renderDiary();
 if(v==='exp')renderExp();
 if(v==='dash')renderDash();
 if(v==='ask')renderAsk();
 if(v==='set')renderSet();
}

