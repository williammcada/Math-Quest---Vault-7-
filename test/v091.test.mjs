import test from 'node:test';
import assert from 'node:assert/strict';
import worker,{QuestSession,RETENTION_MS} from '../src/worker.js';
import {StealthSimulation} from '../public/stealth-core.js';
import {createState,step,move,completeTask,breakWindow,restoreState,triggerDistraction,dispatchHorde} from '../public/games/nightfall/simulation.js';
import {WINDOWS,TASKS,DISTRACTIONS,PROPS,solid,lineClear} from '../public/games/nightfall/world.js';

function storage(){const data=new Map();return {data,alarmAt:null,async get(k){return structuredClone(data.get(k));},async put(k,v){data.set(k,structuredClone(v));},async deleteAll(){data.clear();},async setAlarm(at){this.alarmAt=at;},async deleteAlarm(){this.alarmAt=null;},async transaction(fn){return fn(this);}};}
async function fixture(){const store=storage(),ctx={storage:store,blockConcurrencyWhile:fn=>fn()},room=new QuestSession(ctx),teacher=crypto.randomUUID();await call(room,'init',{code:'PRIV91',teacherKey:teacher,config:{teamNames:['Crew']}});return {room,store,ctx,teacher};}
async function call(room,path,body,key){const response=await room.fetch(new Request('https://room/'+path,{method:body?'POST':'GET',headers:key?{authorization:'Bearer '+key}:{},...(body?{body:JSON.stringify(body)}:{})}));return {status:response.status,body:await response.json()};}
async function join(f,id,key=crypto.randomUUID()){const result=await call(f.room,'command',{type:'student.join',commandId:'join-'+id,deviceId:id,alias:'DO NOT STORE REAL NAME',teamPin:f.room.state.teams['team-1'].pin},key);assert.equal(result.status,200);return {key,result};}

test('pilot joins assign unique aliases, ignore supplied names, and never export credentials',async()=>{
 const f=await fixture(),a=await join(f,'public-a'),b=await join(f,'public-b');
 assert.equal(a.result.body.student.alias,'Agent 001');assert.equal(b.result.body.student.alias,'Agent 002');
 assert.ok(!JSON.stringify(f.room.state).includes('DO NOT STORE REAL NAME'));
 for(const data of [a.result.body,b.result.body,f.room.report(),f.room.reportCsv()]){const str=JSON.stringify(data);assert.ok(!str.includes(a.key));assert.ok(!str.includes(b.key));assert.ok(!str.includes(f.teacher));}
 assert.equal((await call(f.room,'state')).body.teams.length,0);
 assert.equal(f.store.alarmAt,Date.parse(f.room.state.createdAt)+RETENTION_MS);
});
test('public IDs cannot impersonate, steal cached replies, or export; valid credentials resume joins',async()=>{
 const f=await fixture(),a=await join(f,'a'),b=await join(f,'b');
 assert.equal((await call(f.room,'state?deviceId=a')).status,403);
 assert.equal((await call(f.room,'state?deviceId=a',null,b.key)).status,403);
 assert.equal((await call(f.room,'command',{type:'student.join',commandId:'join-a',deviceId:'a'},b.key)).status,403);
 assert.equal((await call(f.room,'command',{type:'teacher.start',commandId:'x',teacherKey:'wrong'})).status,403);
 assert.equal((await call(f.room,'report',null,a.key)).status,403);
 assert.equal((await call(f.room,'report?teacherKey='+f.teacher)).status,403);
 assert.equal((await call(f.room,'report',null,f.teacher)).status,200);
 const resumed=await call(f.room,'command',{type:'student.join',commandId:'retry',deviceId:'a',teamPin:f.room.state.teams['team-1'].pin},a.key);assert.equal(resumed.body.student.alias,'Agent 001');assert.equal(Object.keys(f.room.state.students).length,2);
});
test('48-hour expiry is fixed at creation; alarm deletes every chunk without another visit',async()=>{
 const f=await fixture();await join(f,'a');const due=f.room.state.expiresAt;
 await call(f.room,'state',null,f.teacher);assert.equal(f.room.state.expiresAt,due);
 await f.store.put('state.part.0','private history');await f.store.put('state.part.9','stale chunk');
 const now=Date.now;try{Date.now=()=>due;await f.room.alarm();}finally{Date.now=now;}
 assert.deepEqual([...f.store.data.keys()],['state']);assert.deepEqual(await f.store.get('state'),{deleted:true});assert.equal(f.store.alarmAt,null);
 assert.equal((await call(f.room,'report',null,f.teacher)).status,410);
 const restored=new QuestSession(f.ctx);assert.equal((await call(restored,'state')).status,410);
});
test('teacher deletion revokes all access and cannot be undone by queued commands or init',async()=>{
 const f=await fixture(),a=await join(f,'a');const exported=f.room.reportCsv();
 assert.equal((await call(f.room,'delete',{},a.key)).status,403);
 const results=await Promise.all([call(f.room,'delete',{},f.teacher),call(f.room,'command',{type:'teacher.start',commandId:'later'},f.teacher)]);
 assert.equal(results[0].status,200);assert.equal(results[1].status,410);
 assert.equal((await call(f.room,'init',{code:'PRIV91',teacherKey:f.teacher})).status,410);assert.ok(exported.includes('Agent 001'));assert.deepEqual(await f.store.get('state'),{deleted:true});
});
test('expired requests fail closed before replay and public routing cannot initialize a room',async()=>{
 const f=await fixture(),a=await join(f,'a');f.room.state.expiresAt=Date.now()-1;
 assert.equal((await call(f.room,'command',{type:'student.join',commandId:'join-a',deviceId:'a'},a.key)).status,410);
 let touched=false;const response=await worker.fetch(new Request('https://api/api/sessions/ABCDEF/init',{method:'POST',body:'{}'}),{SESSIONS:{idFromName(){touched=true;}}});assert.equal(response.status,404);assert.equal(touched,false);
});
test('cloak lasts five seconds once, blocks sensors, and cannot recharge on checkpoint or recovery',()=>{
 const s=new StealthSimulation({equipment:'cloak'});s.start();s.panel=true;s.checkpoint='A';s.player.x=448;s.player.y=126;s.step({cloak:true});assert.equal(s.detections,0);assert.equal(s.cloakUsed,true);const until=s.cloakUntil;
 s.step({});s.step({cloak:true});assert.equal(s.cloakUntil,until);
 const restored=new StealthSimulation({equipment:'cloak'},s.summary());restored.start();restored.step({cloak:true});assert.equal(restored.cloakUntil,0);
 s.elapsed=until+.01;s.player.x=448;s.player.y=126;s.step({});assert.equal(s.detections,1);
});
test('Interact never spends Toolkit; dedicated Jam does, once per checkpoint',()=>{
 const s=new StealthSimulation({equipment:'toolkit'});s.start();s.panel=true;s.checkpoint='A';s.player.x=300;s.step({interact:true});assert.deepEqual(s.jams,[]);s.step({jam:true});assert.deepEqual(s.jams,['A']);s.step({});s.step({jam:true});assert.deepEqual(s.jams,['A']);
});
test('every Nightfall objective responds to held use with real duration and prerequisites',()=>{
 const s=createState();s.enemies=[];
 for(const id of ['fuse','power','survivor','keys','battery','installed','escape']){const task=TASKS.find(t=>t.id===id);s.x=task.x;s.y=task.y;s.enemies=[];step(s,{});step(s,{interact:true});assert.equal(!!s.tasks[id],false);assert.ok(s.interact>0);for(let i=0;i<Math.ceil(task.duration*60)+1;i++)step(s,{interact:true});assert.equal(s.tasks[id],true,id);}
 assert.equal(s.outcome,'success');
});
test('two windows per room break by hold or shot; actual gaps permit walking and persist',()=>{
 assert.equal(WINDOWS.length,10);
 for(const w of WINDOWS){const s=createState();s.enemies=[];s.x=w.x-22;s.y=w.y+40;s.angle=0;assert.equal(solid(s,w.x+8,w.y+40),true);for(let i=0;i<75;i++)step(s,{interact:true});assert.equal(s.windows[w.id],true);assert.equal(s.noiseRadius,155);assert.equal(solid(s,w.x+8,w.y+40),false);move(s,s,60,0);assert.ok(s.x>w.x+w.w);assert.equal(restoreState(s).windows[w.id],true);}
 const s=createState(),w=WINDOWS[0];s.enemies=[];s.x=w.x-50;s.y=w.y+40;s.angle=0;step(s,{fire:true});for(let i=0;i<8;i++)step(s,{});assert.equal(s.windows[w.id],true);
 const garage=WINDOWS.find(w=>w.room==='garage');breakWindow(s,garage.id);assert.equal(completeTask(s,'battery'),false);
});
test('battery, not keys or rescue, spawns one garage rush with instant closed-door breach',()=>{
 const s=createState();s.enemies=[];completeTask(s,'survivor');completeTask(s,'keys');assert.equal(s.hordeTriggered,false);completeTask(s,'fuse');completeTask(s,'power');s.x=2208;s.y=752;s.doors.garage.closed=true;completeTask(s,'battery');assert.equal(s.enemies.length,8);assert.equal(s.doors.garage.hp,0);assert.ok(s.events.some(e=>e.type==='breach'));assert.ok(s.enemies.every(e=>e.y>1056));
 for(let i=0;i<150;i++)step(s,{});assert.ok(s.enemies.every(e=>e.y<1056));assert.equal(completeTask(s,'battery'),false);const restored=restoreState(s);assert.equal(restored.enemies.filter(e=>e.horde).length,8);
});
test('three GAS barrels warn before ignition, halve player health, kill brutes, and do not recharge',()=>{
 assert.equal(DISTRACTIONS.filter(d=>d.kind==='barrel').length,3);
 const s=createState(['vest']),d=DISTRACTIONS.find(d=>d.id==='barrel');s.x=d.x;s.y=d.y;s.enemies=[{...dispatchHorde()[0],id:'brute',kind:'brute',hp:6,x:d.x+15,y:d.y,phase:'wander'}];triggerDistraction(s,d.id);assert.equal(s.health,3);assert.equal(s.enemies[0].hp,6);s.time=1.19;step(s,{});assert.equal(s.health,1.5);assert.equal(s.vest,2);assert.equal(s.enemies[0].hp,0);step(s,{});assert.equal(s.health,1.5);for(let i=0;i<90;i++)step(s,{});assert.equal(s.health,0);assert.equal(s.outcome,'lost');assert.equal(triggerDistraction(restoreState(s),d.id),false);
});
test('three alarm cars and ordinary cars coexist; distant enemies hear the alarm beyond AI cutoff',()=>{
 const alarms=DISTRACTIONS.filter(d=>d.kind==='alarm');assert.equal(alarms.length,3);assert.ok(PROPS.filter(p=>p.art<=3).length>alarms.length);assert.ok(PROPS.every(p=>p.art!==4));
 const s=createState();s.x=700;s.y=650;const e={...s.enemies[0],x:1280,y:1200,homeX:1280,homeY:1200};s.enemies=[e];triggerDistraction(s,'alarm');assert.ok(Math.hypot(e.x-s.x,e.y-s.y)>650);step(s,{});assert.equal(e.phase,'alarm');
});
