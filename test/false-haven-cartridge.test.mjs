import test from 'node:test';
import assert from 'node:assert/strict';
import {QuestSession} from './authenticated-session.mjs';
import {createHaven} from '../public/games/nightfall/false-haven-adapter.js';
import {HAVEN_TASKS,havenTick} from '../public/games/nightfall/false-haven-world.js';
import {completeTask} from '../public/games/nightfall/simulation.js';
import {FALSE_HAVEN as c,havenScene} from '../public/cartridges/false-haven.js';
import {validateHaven} from '../src/cartridges/false-haven/validation.js';
const ctx=()=>{const data=new Map();return {storage:{get:async k=>structuredClone(data.get(k)),put:async(k,v)=>data.set(k,structuredClone(v)),setAlarm:async()=>{}},blockConcurrencyWhile:fn=>fn()};};
async function call(r,path,body){const res=await r.fetch(new Request(`https://test${path}`,body?{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)}:{}));return {...await res.json(),status:res.status};}
const cmd=(r,type,extra={})=>call(r,'/command',{type,commandId:crypto.randomUUID(),...extra});
async function setup(gates=3,route='shelter'){
 const context=ctx(),r=new QuestSession(context);await call(r,'/init',{code:'HAVEN2',teacherKey:'teacher',config:{engineVersion:'0.9.4',cartridgeId:c.id,gateCount:gates,teamNames:['Crew'],modules:[{id:'number.gcf',itemCount:gates,band:'beginner'}]}});
 for(const id of ['a','b'])await cmd(r,'student.join',{deviceId:id,alias:id,teamPin:r.state.teams['team-1'].pin});await cmd(r,'teacher.start',{teacherKey:'teacher'});for(const id of ['a','b'])await cmd(r,'briefing.ready',{deviceId:id});
 const t=r.state.teams['team-1'];
 for(let i=0;i<gates;i++){
  for(const id of ['a','b']){await call(r,`/state?deviceId=${id}`);const v=await cmd(r,'math.submit',{deviceId:id,answer:r.state.students[id].currentItem.answer});assert.equal(v.feedback?.correct,true);}
  if(i===0){await vote(r,route);assert.equal(t.stage,'gate','Chapter 2 must not insert Chapter 1 rescue');}
 }
 for(const id of ['a','b']){assert.equal((await cmd(r,'market.propose',{deviceId:id,items:['vest']})).status,200);await cmd(r,'market.ready',{deviceId:id});}
 const lead=r.members(t.id)[t.leadIndex%2].id;await cmd(r,'market.commit',{deviceId:lead});assert.equal((await cmd(r,'market.continue',{deviceId:lead})).status,200);assert.equal(t.stage,'minigame');assert.ok(Math.abs(t.finaleDeadline-Date.now()-300000)<2000);
 return {r,t,context};
}
async function vote(r,choice){for(const id of ['a','b'])await cmd(r,'choice.vote',{deviceId:id,choice});const t=r.state.teams['team-1'];assert.equal((await cmd(r,'choice.resolve',{deviceId:r.members(t.id)[t.leadIndex%2].id})).status,200);}
function finish(s,mode='action'){
 for(const task of HAVEN_TASKS){if(task.id==='passage_drained'){s.haven.drainStarted=-6;havenTick(s,0);}else if(task.id==='trolley_parked'){s.tasks.trolley_parked=true;s.haven.trolleyProgress=1;}else completeTask(s,task.id);}
 if(mode==='assisted')s.outcome='assisted_completed';return s;
}
async function submit(r,t,id,outcome){const run=t.runs[id],mode=outcome==='assisted_completed'?'assisted':'action';const payload={deviceId:id,runId:run.runId,configRevision:run.configRevision};assert.equal((await cmd(r,'minigame.start',{...payload,mode})).status,200);let snapshot=createHaven(run);if(outcome==='lost'){snapshot.health=0;snapshot.outcome='lost';}else finish(snapshot,mode);const v=await cmd(r,'minigame.complete',{...payload,seq:1,activeElapsedMs:0,outcome,snapshot});assert.equal(v.status,200,v.error);}
test('False Haven authenticated 3/4/5 gate journeys, both leads/routes, all endings and separate evidence',async()=>{
 for(const [i,gates] of [3,4,5].entries()){
  const {r,t,context}=await setup(gates,i===1?'dispatch':'shelter'),before=r.state.students.a.firstAttemptCorrect;
  await submit(r,t,'a',i===1?'assisted_completed':'success');await submit(r,t,'b','lost');assert.equal(t.stage,'finale');await vote(r,c.choices[i].id);assert.equal(t.stage,'victory');assert.equal(r.state.students.a.firstAttemptCorrect,before);assert.equal(r.report().gameplayEvidence.length,2);assert.equal(r.report().rescueEvidence.length,0);assert.equal(r.report().session.cartridge,c.title);
  const reloaded=new QuestSession(context);await reloaded.ready;assert.equal(reloaded.state.teams[t.id].finalAction,c.choices[i].id);
  assert.ok(havenScene(c,t,r.state.config.gateNames,r.members(t.id)).paragraphs.length>=3);
 }
});
test('False Haven team deadline is authoritative, alarm closes absent players and pause extends it',async()=>{
 const {r,t}=await setup();const deadline=t.finaleDeadline;await cmd(r,'teacher.pause',{teacherKey:'teacher'});r.state.pausedAt-=20000;await cmd(r,'teacher.pause',{teacherKey:'teacher'});assert.ok(t.finaleDeadline>=deadline+20000);
 t.finaleDeadline=Date.now()-1;await r.alarm();assert.equal(t.stage,'finale');assert.ok(Object.values(t.runs).every(x=>x.outcome==='timed_out'));const scene=havenScene(c,t,r.state.config.gateNames,r.members(t.id));assert.match(scene.paragraphs[0],/No completed escape/);
 const other=await setup();await cmd(other.r,'teacher.advanceFinale',{teacherKey:'teacher',teamId:other.t.id});assert.ok(Object.values(other.t.runs).every(x=>x.outcome==='teacher_advanced'));
});
test('False Haven ownership and server envelope reject forged config, machinery, resources, enemies and mode',async()=>{
 const {r,t}=await setup(),run=t.runs.a;const base={deviceId:'a',runId:run.runId,configRevision:run.configRevision};await cmd(r,'minigame.start',{...base,mode:'action'});
 assert.equal((await cmd(r,'minigame.start',{...base,runId:t.runs.b.runId,mode:'action'})).status,400);
 const s=createHaven(run),input={type:'minigame.progress',snapshot:s,activeElapsedMs:0};assert.equal(validateHaven(run,input),null);
 for(const mutate of [s=>s.ammo=50,s=>s.tasks.escape=true,s=>s.enemies.pop(),s=>s.revision=c.revision,s=>s.vest=3,s=>s.route='clinic',s=>s.time=10]){const copy=structuredClone(s);mutate(copy);assert.ok(validateHaven(run,{...input,snapshot:copy}));}
 const assisted=finish(structuredClone(s),'assisted');assert.ok(validateHaven(run,{type:'minigame.complete',snapshot:assisted,outcome:'assisted_completed',activeElapsedMs:0}));
 const timed=structuredClone(s);timed.outcome='timed_out';timed.time=300;assert.equal(validateHaven(run,{type:'minigame.complete',snapshot:timed,outcome:'timed_out',activeElapsedMs:300000}),null);
});
test('False Haven reload retains ammunition, mode and monotonic gameplay counters',()=>{
 const run={runId:'restore',loadout:['vest','carbine'],route:'dispatch',threat:1,mode:'assisted'},s=createHaven(run);Object.assign(s,{shots:2,ammo:10,hits:1,health:2,blocks:1,vest:1,doorUses:3,doorsBroken:1,distractionsUsed:1,heals:1,time:12});
 const restored=createHaven({...run,snapshot:s});for(const k of ['shots','ammo','hits','health','blocks','vest','doorUses','doorsBroken','distractionsUsed','heals','time','mode','route'])assert.equal(restored[k],s[k],k);
 const prior={...run,snapshot:s};assert.equal(validateHaven(prior,{type:'minigame.progress',snapshot:restored,activeElapsedMs:12000}),null);
});
