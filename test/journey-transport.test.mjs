import test from 'node:test';
import assert from 'node:assert/strict';
import {BrawlRun} from '../src/cartridges/journey/durable-object.js';
import {PROTOCOL,JOURNEY_BUILD} from '../public/games/journey/config.js';

// Simulated Durable Object storage/socket harness, not a deployed Cloudflare test.
async function fixture(){
 const store=new Map(),sockets=[],deliveries=[];
 const ctx={storage:{get:async k=>structuredClone(store.get(k)),put:async(k,v)=>store.set(k,structuredClone(v)),deleteAll:async()=>store.clear(),setAlarm:async()=>{},deleteAlarm:async()=>{}},blockConcurrencyWhile:fn=>fn(),getWebSockets:()=>sockets,waitUntil:p=>p.catch(()=>{})};
 const run=new BrawlRun(ctx,{SESSIONS:{idFromName:x=>x,get:()=>({fetch:async r=>{deliveries.push(await r.json());return new Response('{}');}})}});
 async function post(path,body){const res=await run.fetch(new Request('https://brawl'+path,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)}));return {status:res.status,body:await res.json()};}
 await post('/init',{runId:'run',roomCode:'CLASS1',teamId:'team',expiresAt:Date.now()+600000,resultKey:'internal-test-key',members:Array.from({length:5},(_,i)=>({id:'p'+i,alias:'Agent '+i}))});
 function socket(){const s={messages:[],send(raw){this.messages.push(JSON.parse(raw));},close(code,reason){this.closed={code,reason};},serializeAttachment(a){this.attachment=a;}};sockets.push(s);return s;}
 async function authenticate(id,ticket){const s=socket();ticket??=(await post('/ticket',{studentId:id})).body.ticket;await run.webSocketMessage(s,JSON.stringify({type:'authenticate',ticket,protocol:PROTOCOL,build:JOURNEY_BUILD}));return s;}
 const message=(s,body)=>run.webSocketMessage(s,JSON.stringify({runId:'run',epoch:s.attachment?.epoch,...body}));
 return {run,post,socket,authenticate,message,deliveries,store,close:()=>run.purge()};
}
test('five authenticated clients receive the same authoritative run and movement',async()=>{
 const f=await fixture();try{const heroes=['wukong','bajie','wujing','tang','prince'],clients=[];
 for(let i=0;i<5;i++){const s=await f.authenticate('p'+i);clients.push(s);await f.message(s,{type:'reserveHero',hero:heroes[i]});await f.post('/ready',{studentId:'p'+i,upgrades:[]});}
 assert.equal(f.run.model.s.phase,'launch');assert.equal(f.run.model.s.starters.length,5);
 f.run.model.s.launchMs=0;f.run.model.advance(Date.now()+1);f.run.model.s.enemies=[];
 const before=f.run.model.player('p0').x;await f.message(clients[0],{type:'input',seq:1,x:1,y:0,attack:false});f.run.model.advance(Date.now()+100);await f.run.after(true);
 const snapshots=clients.map(s=>s.messages.filter(m=>m.type==='snapshot').at(-1).snapshot);
 assert.equal(snapshots[0].players.length,5);assert.ok(snapshots[0].players.find(p=>p.id==='p0').x>before);for(const s of snapshots)assert.deepEqual(s,snapshots[0]);
 }finally{await f.close();}
});
test('tickets are single-use; unauthenticated, wrong-run input cannot control a player',async()=>{
 const f=await fixture();try{const ticket=(await f.post('/ticket',{studentId:'p0'})).body.ticket;
 const a=await f.authenticate('p0',ticket),b=await f.authenticate('p0',ticket);assert.equal(b.closed.code,4003);
 const unauth=f.socket();await f.message(unauth,{type:'input',x:1,seq:1});assert.equal(unauth.closed.code,4003);
 await f.message(a,{type:'reserveHero',runId:'wrong',hero:'wukong'});assert.equal(f.run.model.player('p0').hero,null);
 assert.equal(a.messages.at(-1).type,'error');assert.ok(a.messages.some(m=>m.type==='error'));
 }finally{await f.close();}
});
test('reconnect replaces controller; old socket close cannot disconnect the replacement',async()=>{
 const f=await fixture();try{const a=await f.authenticate('p0');const b=await f.authenticate('p0');assert.equal(a.closed.code,4009);assert.notEqual(a.attachment.epoch,b.attachment.epoch);
 await f.run.webSocketClose(a);assert.equal(f.run.model.player('p0').connected,true);assert.equal(f.run.sockets.size,1);
 await f.message(b,{type:'reserveHero',hero:'wukong'});assert.equal(f.run.model.player('p0').hero,'wukong');
 }finally{await f.close();}
});
test('teacher termination delivers one result and purge closes all five sockets',async()=>{
 const f=await fixture();try{const clients=[];for(let i=0;i<5;i++)clients.push(await f.authenticate('p'+i));
 await f.post('/control',{action:'pause',paused:true});assert.equal(f.run.model.paused,true);await f.post('/control',{action:'end'});await new Promise(r=>setImmediate(r));await f.run.after(true);
 assert.equal(f.deliveries.length,1);assert.equal(f.deliveries[0].result.outcome,'interrupted');await f.close();for(const s of clients)assert.equal(s.closed.code,4004);assert.equal(f.store.size,0);
 }finally{await f.close();}
});
