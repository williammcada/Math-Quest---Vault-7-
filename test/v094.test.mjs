import test from 'node:test';
import assert from 'node:assert/strict';
import {QuestSession} from './authenticated-session.mjs';
import {createRescue,stepRescue,recruit,assistedRescue} from '../public/games/nightfall/rescue.js';
import {rescueWorld,TERMINAL} from '../public/games/nightfall/rescue-world.js';
import {solid,worldFor} from '../public/games/nightfall/world.js';
import {createState,step,triggerDistraction,breakWindow,damage,dist} from '../public/games/nightfall/simulation.js';
import {alarmLight} from '../public/games/nightfall/hardware.js';
const context=()=>{const data=new Map();return {storage:{alarmAt:null,get:async k=>structuredClone(data.get(k)),put:async(k,v)=>data.set(k,structuredClone(v)),async setAlarm(v){this.alarmAt=v;},async deleteAlarm(){this.alarmAt=null;},async deleteAll(){data.clear();}},blockConcurrencyWhile:fn=>fn()};};
async function call(r,path,body){const response=await r.fetch(new Request('https://test'+path,body?{method:'POST',body:JSON.stringify(body)}:{}));return {...await response.json(),http:response.status};}
const cmd=(r,type,extra={})=>call(r,'/command',{type,commandId:crypto.randomUUID(),...extra});
async function fixture(gates=3,route='clinic',size=2,engine='0.9.4'){
 const ctx=context(),r=new QuestSession(ctx);await call(r,'/init',{code:'RESCUE',teacherKey:'teacher',config:{cartridgeId:'nightfall',gateCount:gates,teamNames:['Crew'],modules:[{id:'number.gcf',itemCount:gates,band:'beginner'}]}});
 r.state.config.engineVersion=engine;
 for(let i=0;i<size;i++)await cmd(r,'student.join',{deviceId:'s'+i,alias:'S'+i,teamPin:r.state.teams['team-1'].pin});
 await cmd(r,'teacher.start',{teacherKey:'teacher'});
 for(let i=0;i<size;i++)await cmd(r,'briefing.ready',{deviceId:'s'+i});
 for(let i=0;i<size;i++){const s=r.state.students['s'+i];await call(r,'/state?deviceId='+s.id);assert.equal((await cmd(r,'math.submit',{deviceId:s.id,answer:s.currentItem.answer})).http,200);}
 for(let i=0;i<size;i++)assert.equal((await cmd(r,'choice.vote',{deviceId:'s'+i,choice:route})).http,200);
 const t=r.state.teams['team-1'],lead=r.members(t.id)[t.leadIndex%size];const resolved=await cmd(r,'choice.resolve',{deviceId:lead.id});assert.equal(resolved.http,200,resolved.error);return {r,t,ctx};
}
const runCommand=(r,t,type,extra={},id='s0')=>{const a=t.rescue.runs[id];return cmd(r,'rescue.'+type,{deviceId:id,phaseId:t.rescue.phaseId,runId:a.runId,attemptId:a.attemptId,configRevision:a.configRevision,...extra});};
const progress=(r,t,s,outcome,id='s0')=>runCommand(r,t,outcome?'complete':'progress',{seq:t.rescue.runs[id].seq+1,activeElapsedMs:Math.round(s.time*1000),snapshot:s,...(outcome?{outcome}:{})},id);
async function assistToRescue(r,t,id='s0'){
 await runCommand(r,t,'start',{mode:'assisted'},id);const s=structuredClone(t.rescue.runs[id].snapshot);
 for(let i=0;i<4;i++){assistedRescue(s);const result=await progress(r,t,s,undefined,id);assert.equal(result.http,200,result.error);}
 return s;
}

test('first vote inserts a shared rescue in every gate configuration and closes absent records via the alarm',async()=>{
 const real=Date.now;let now=real();Date.now=()=>now;
 try{for(const gates of [3,4,5])for(const route of ['clinic','depot']){
  const {r,t,ctx}=await fixture(gates,route);assert.equal(t.stage,'rescue');assert.equal(t.gateIndex,0);assert.equal(t.rescue.deadline,now+300000);assert.equal(ctx.storage.alarmAt,t.rescue.deadline);
  const deadline=t.rescue.deadline;await cmd(r,'choice.resolve',{deviceId:'s0'});assert.equal(t.rescue.deadline,deadline);
  now+=300001;await r.alarm();assert.equal(t.stage,'gate');assert.equal(t.gateIndex,1);assert.equal(t.rescue.runs.s0.outcome,'not_started');assert.equal(t.rescue.runs.s0.closureReason,'time_window_closed');assert.match(t.rescue.bridge,new RegExp(route==='clinic'?'Imani':'Tomas'));assert.equal(ctx.storage.alarmAt,r.state.expiresAt);
  assert.equal(r.state.students.s0.itemsCompleted,1);assert.equal(r.state.attempts.length,2);assert.deepEqual(t.inventory,[]);
  const restored=new QuestSession(ctx);await restored.ready;assert.equal(restored.state.teams[t.id].stage,'gate');assert.equal(restored.report().rescueEvidence.length,2);
 }}finally{Date.now=real;}
});

test('teacher pause freezes once; local delay and late starts do not extend; closure beats stale commands',async()=>{
 const real=Date.now;let now=real();Date.now=()=>now;
 try{
  const {r,t,ctx}=await fixture();const deadline=t.rescue.deadline;
  now+=20000;await cmd(r,'teacher.pause',{teacherKey:'teacher'});now+=400000;await r.alarm();assert.equal(t.stage,'rescue');assert.equal(ctx.storage.alarmAt,r.state.expiresAt);
  await cmd(r,'teacher.pause',{teacherKey:'teacher'});assert.equal(t.rescue.deadline,deadline+400000);assert.equal(t.rescue.pausedMs,400000);
  now+=100000;await runCommand(r,t,'start',{mode:'action'});assert.equal(t.rescue.deadline,deadline+400000);
  const a=structuredClone(t.rescue.runs.s0);now=t.rescue.deadline+1;await r.alarm();assert.equal(t.rescue.runs.s0.outcome,'time_window_closed');assert.equal(t.stage,'gate');
  const late=await runCommand(r,t,'retry');assert.equal(late.teams[0].stage,'gate');assert.equal(t.rescue.runs.s0.attemptId,a.attemptId);
  await runCommand(r,t,'start',{mode:'action'});assert.equal(t.stage,'gate');
 }finally{Date.now=real;}
});

test('downed retry restores full start or coherent escort checkpoint; stale attempts cannot mutate it',async()=>{
 const {r,t,ctx}=await fixture();const deadline=t.rescue.deadline;
 await runCommand(r,t,'start',{mode:'action'});const s=structuredClone(t.rescue.runs.s0.snapshot);s.health=0;s.outcome='lost';s.ammo=10;s.shots=5;s.enemies[0].hp=0;
 assert.equal((await progress(r,t,s,'lost')).http,200);
 const stale=structuredClone(t.rescue.runs.s0);assert.equal((await runCommand(r,t,'retry')).http,200);let a=t.rescue.runs.s0;assert.equal(a.snapshot.ammo,15);assert.equal(a.snapshot.enemies[0].hp,2);assert.equal(a.retries,1);assert.equal(t.rescue.deadline,deadline);
 assert.match((await cmd(r,'rescue.progress',{deviceId:'s0',phaseId:stale.phaseId,runId:stale.runId,attemptId:stale.attemptId,configRevision:stale.configRevision,seq:100,snapshot:s})).error,/attempt/);
 assert.match((await runCommand(r,t,'retry')).error,/downed/);
 await runCommand(r,t,'assist');const escort=structuredClone(a.snapshot);escort.ammo=12;escort.shots=3;
 for(let i=0;i<4;i++){assistedRescue(escort);assert.equal((await progress(r,t,escort)).http,200);}
 const checkpoint=structuredClone(a.escortCheckpoint);escort.health=0;escort.outcome='lost';escort.ammo=9;escort.shots=6;escort.enemies[2].hp=0;
 assert.equal((await progress(r,t,escort,'lost')).http,200);await runCommand(r,t,'retry');a=t.rescue.runs.s0;assert.equal(a.snapshot.ammo,checkpoint.ammo);assert.deepEqual(a.snapshot.enemies,checkpoint.enemies);assert.equal(a.snapshot.health,3);assert.equal(a.snapshot.dialogue,false);assert.ok(a.snapshot.follower);assert.equal(a.retries,2);assert.equal(t.rescue.deadline,deadline);
 const restored=new QuestSession(ctx);await restored.ready;assert.deepEqual(restored.state.teams[t.id].rescue.runs.s0,a);assert.equal(r.state.students.s0.firstAttemptCorrect,1);
});

test('personal completion stops replay; shared Gate 2 opens only after all records resolve; teacher closure and reports stay separate',async()=>{
 const {r,t}=await fixture();const s=await assistToRescue(r,t);s.dialogue=false;assistedRescue(s);
 assert.equal((await progress(r,t,s,'success')).http,200);assert.equal(t.stage,'rescue');assert.equal(t.rescue.runs.s0.status,'terminal');await runCommand(r,t,'retry');assert.equal(t.rescue.runs.s0.retries,0);
 const b=await assistToRescue(r,t,'s1');b.dialogue=false;assistedRescue(b);assert.equal((await progress(r,t,b,'success','s1')).http,200);assert.equal(t.stage,'gate');assert.equal(t.gateIndex,1);assert.equal(t.rescue.closeReason,'all_resolved');assert.equal(Object.keys(t.runs||{}).length,0);assert.equal(r.report().rescueEvidence[0].phase,'early-rescue');assert.match(r.reportCsv(),/FIRST RESPONSE/);
 const other=await fixture();const before=other.r.state.students.s0.assignedTotal;
 const extension=await cmd(other.r,'teacher.previewExtension',{teacherKey:'teacher',count:2,placement:'last'});assert.match(extension.error,/No selected students/);assert.equal(other.t.stage,'rescue');assert.equal(other.r.state.students.s0.assignedTotal,before);
 await cmd(other.r,'teacher.closeRescue',{teacherKey:'teacher',teamId:other.t.id});assert.equal(other.t.stage,'gate');assert.equal(other.t.rescue.runs.s1.closureReason,'teacher_closed');
});

test('rescue envelope rejects fabricated supplies, population, equipment, follower wins, wrong IDs and duplicate sequences',async()=>{
 const {r,t}=await fixture();await runCommand(r,t,'start',{mode:'action'});const baseline=structuredClone(t.rescue.runs.s0.snapshot);
 for(const edit of [s=>s.ammo++,s=>s.health=4,s=>s.enemies.push({...s.enemies[0]}),s=>s.enemies[0]=null,s=>s.immune=100,s=>s.enemies[0].hp=3,s=>s.shotgun=true,s=>s.doors.store.closed=false,s=>s.tasks.battery=true,s=>s.outcome='success']){
  const s=structuredClone(baseline);edit(s);assert.equal((await progress(r,t,s,s.outcome||undefined)).http,400);
 }
 assert.equal((await runCommand(r,t,'progress',{phaseId:'other',seq:1,snapshot:baseline})).http,400);
 assert.equal((await progress(r,t,baseline)).http,200);assert.equal((await runCommand(r,t,'progress',{seq:1,snapshot:baseline,activeElapsedMs:0})).http,400);
 const teacher=await call(r,'/state?teacherKey=teacher');const student=await call(r,'/state?deviceId=s0');assert.equal(student.teams[0].rescue.results,undefined);assert.equal(student.teams[0].rescue.run.escortCheckpoint,undefined);assert.equal(teacher.teams[0].rescue.results.length,2);
});

test('existing v0.9.2 rooms preserve the direct Gate 2 transition and credentials after Worker update',async()=>{
 const {r,t,ctx}=await fixture(3,'depot',2,'0.9.2');assert.equal(t.stage,'gate');assert.equal(t.gateIndex,1);assert.equal(t.rescue,undefined);
 const credential=r.state.students.s0.credential,restored=new QuestSession(ctx);await restored.ready;assert.equal(restored.state.students.s0.credential,credential);assert.equal((await call(restored,'/state?deviceId=s0')).http,200);
 await call(restored,'/state?deviceId=s0');assert.equal((await cmd(restored,'math.submit',{deviceId:'s0',answer:restored.state.students.s0.currentItem.answer})).http,200);
});

test('authored inventory and population are exact for both routes; existing final-city defaults remain independent',()=>{
 for(const route of ['clinic','depot']){
  const s=createRescue(route),w=worldFor(s);assert.equal(s.ammo,15);assert.equal(s.health,3);assert.deepEqual(s.loadout,[]);assert.equal(s.enemies.length,20);
  for(const [zone,n] of [['south',5],['north',10],['entrance',5]])assert.equal(s.enemies.filter(e=>e.zone===zone).length,n);
  assert.ok(s.enemies.every(e=>!solid(s,e.x,e.y,10)));assert.equal(w.PICKUPS.length,2);assert.equal(w.DISTRACTIONS.length,2);assert.equal(w.WINDOWS.length,2);assert.equal(w.BUILDINGS[0].name,route==='depot'?'DEPOT GARAGE':'IMANI’S CLINIC');
  const car=w.PROPS[0];assert.equal(alarmLight(car,s).state,'ready');triggerDistraction(s,'rescue-alarm');stepRescue(s,{},1/60);assert.ok(s.enemies.every(e=>e.phase==='alarm'));assert.equal(alarmLight(car,s).state,'active');s.time=13;assert.equal(alarmLight(car,s).state,'spent');
 }
 const city=createState(['vest','ammo-pouch','carbine']);assert.equal(city.ammo,36);assert.equal(city.vest,2);assert.equal(city.damage,2);assert.equal(city.follower,undefined);assert.ok(worldFor(city).PICKUPS.some(p=>p.kind==='shotgun'));
});

function walk(s,x,y){
 for(let i=0;i<4000&&dist(s,{x,y})>4;i++){
  if(s.outcome==='success')return;
  s.angle=Math.atan2(y-s.y,x-s.x);stepRescue(s,{up:true},1/60);
 }
 assert.ok(dist(s,{x,y})<5,`blocked at ${s.x},${s.y} en route to ${x},${y}`);
}
test('collision-only traversal and escort work through both windows, alley turns and terminal without teleporting',()=>{
 for(const route of ['clinic','depot'])for(const side of ['west','east']){
  const s=createRescue(route);for(const e of s.enemies)e.hp=0; // Isolate navigation, not a survival acceptance claim.
  walk(s,816,1200);walk(s,816,616);walk(s,1536,616);
  if(side==='east'){walk(s,2048,616);walk(s,2048,264);}else walk(s,1536,264);
  breakWindow(s,'store-'+side);walk(s,1792,264);recruit(s);s.dialogue=false;
  walk(s,side==='east'?2048:1536,264);walk(s,side==='east'?2048:1536,616);walk(s,816,616);walk(s,816,1200);
  walk(s,1168,1200);assert.equal(s.outcome,'success');assert.ok(dist(s.follower,TERMINAL)<72);assert.equal(s.shots,0);
 }
});

test('health pickup remains at full health; fuel hurts player but not the follower and cannot spawn extra enemies',()=>{
 const s=createRescue();s.enemies.forEach(e=>e.hp=0);s.x=816;s.y=800;stepRescue(s,{},1/60);assert.equal(s.picked.length,0);s.health=2;stepRescue(s,{},1/60);assert.equal(s.health,3);assert.deepEqual(s.picked,['rescue-health']);
 s.x=1008;s.y=1088;recruit(s);s.dialogue=false;triggerDistraction(s,'rescue-gas');s.time=2;stepRescue(s,{},1/60);assert.equal(s.health,1.5);assert.ok(s.follower);assert.equal(s.enemies.length,20);s.immune=0;damage(s,1.5,true);assert.equal(s.outcome,'lost');assert.ok(s.follower);
});
