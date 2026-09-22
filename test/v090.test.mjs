import test from 'node:test';
import assert from 'node:assert/strict';
import {QuestSession} from './authenticated-session.mjs';
import {createState,step,completeTask,soundDistance,toggleDoor,triggerDistraction,makeNoise,restoreState,damage,move} from '../public/games/nightfall/simulation.js';
import {lineClear,solid,PICKUPS} from '../public/games/nightfall/world.js';
import {THREATS} from '../public/games/nightfall/config.js';
import {StealthSimulation,REVISION} from '../public/stealth-core.js';
const cmd=async(r,type,extra={})=>{const response=await r.fetch(new Request('https://test/command',{method:'POST',body:JSON.stringify({type,commandId:crypto.randomUUID(),...extra})}));return response.json();};
async function room(n=2){const data=new Map(),r=new QuestSession({storage:{get:async k=>data.get(k),put:async(k,v)=>data.set(k,structuredClone(v))},blockConcurrencyWhile:fn=>fn()});await r.fetch(new Request('https://test/init',{method:'POST',body:JSON.stringify({code:'REV09',teacherKey:'teacher',config:{cartridgeId:'nightfall',gateCount:3,teamNames:['Crew'],modules:[{id:'number.gcf',itemCount:3}]}})}));for(let i=0;i<n;i++)await cmd(r,'student.join',{deviceId:`s${i}`,alias:`Agent ${i}`,teamPin:r.state.teams['team-1'].pin});await cmd(r,'teacher.start',{teacherKey:'teacher'});return r;}
async function market(r){const t=r.state.teams['team-1'];Object.assign(t,{stage:'market',gateIndex:2,currency:40,route:'clinic'});for(const m of r.members(t.id)){r.preparePlan(m);m.itemsCompleted=3;m.currentItem=null;}return t;}
async function commit(r,t,items=["carbine"]){for(const m of r.members(t.id)){await cmd(r,'market.propose',{deviceId:m.id,items});await cmd(r,'market.ready',{deviceId:m.id});}const lead=r.members(t.id)[t.leadIndex%r.members(t.id).length];await cmd(r,'market.commit',{deviceId:lead.id});return cmd(r,'market.continue',{deviceId:lead.id});}
test('all five threat presets enforce counts and active caps with no aim assist',()=>{
 for(const tune of THREATS){const s=createState([], 'clinic',tune.id);assert.equal(s.enemies.length,tune.placed+8);const angle=s.angle;step(s,{fire:true});assert.equal(s.angle,angle);assert.ok(s.activeCount<=tune.active+8);}
});
test('walls block sight and force sound around the building; closed doors attenuate sound',()=>{
 const s=createState();const a={x:300,y:100},b={x:300,y:160};assert.equal(lineClear(s,a,b),false);assert.ok(soundDistance(s,a,b)>580);
 const inside={x:452,y:410},outside={x:452,y:520},open=soundDistance(s,inside,outside);s.enemies=[];s.x=450;s.y=500;assert.ok(toggleDoor(s,'maintenance'));assert.equal(lineClear(s,inside,outside),false);assert.ok(soundDistance(s,inside,outside)>open+150);
});
test('running behind a solid wall does not attract an enemy across it',()=>{
 const s=createState();s.x=300;s.y=100;s.enemies=[{...s.enemies[0],x:300,y:165,homeX:300,homeY:165}];makeNoise(s,s.x,s.y,155,.5,'running');step(s,{});assert.equal(s.enemies[0].phase,'wander');
});
test('gunfire draws nearby enemies to the sound position, not hidden player position',()=>{
 const s=createState();s.x=300;s.y=100;s.enemies=[{...s.enemies[0],x:1100,y:1100,homeX:1100,homeY:1100}];makeNoise(s,1160,1120,430,1,'shot');s.x=1160;s.y=1200;const e=s.enemies[0];e.x=1450;e.y=1100; // beyond vision, within sound range
 step(s,{});assert.equal(e.phase,'investigate');assert.deepEqual(e.target,{x:1160,y:1120});
});
test('pursuit expires after evidence is lost and returns toward the patrol anchor',()=>{
 const s=createState();s.x=300;s.y=100;s.enemies=[{...s.enemies[0],x:300,y:200,homeX:400,homeY:220,phase:'chase',memory:.1,target:{x:300,y:200}}];for(let i=0;i<260;i++)step(s,{});assert.ok(['return','wander'].includes(s.enemies[0].phase));
});
test('an informed pursuer can break a closed door; an uninformed wanderer cannot',()=>{
 for(const knows of [false,true]){const s=createState();s.enemies=[];s.x=455;s.y=370;toggleDoor(s,'maintenance');s.enemies=[{...createState().enemies[0],kind:'shambler',x:455,y:506,homeX:455,homeY:506,phase:knows?'investigate':'wander',memory:knows?20:0,target:knows?{x:455,y:400}:null}];for(let i=0;i<850;i++)step(s,{});if(knows)assert.equal(s.doors.maintenance.hp,0);else assert.equal(s.doors.maintenance.hp,100);}
});
test('lures are one-use, barrels spend ammunition and damage enemies locally',()=>{
 const s=createState();s.enemies=[{...s.enemies[0],x:2020,y:1100,hp:6}];assert.ok(triggerDistraction(s,'barrel'));assert.equal(s.enemies[0].hp,6);for(let i=0;i<74;i++)step(s,{});assert.equal(s.enemies[0].hp,0);assert.equal(triggerDistraction(s,'barrel'),false);assert.equal(s.distractionsUsed,1);
 const shooter=createState();shooter.x=2000;shooter.y=1200;shooter.angle=-Math.PI/2;shooter.enemies=[];step(shooter,{fire:true});for(let i=0;i<20;i++)step(shooter,{});assert.equal(shooter.ammo,11);assert.ok(shooter.distractions.barrel);
});
test('collision sliding stays outside real obstacle footprints and fast movement cannot tunnel',()=>{
 const s=createState();s.x=720;s.y=600;move(s,s,200,0);assert.ok(s.x<760);assert.equal(solid(s,s.x,s.y),false);const y=s.y;move(s,s,5,15);assert.ok(s.y>y);assert.equal(solid(s,s.x,s.y),false);
});
test('recovery retains charges, doors, objectives and lures; no purchased medkit',()=>{
 const s=createState(['vest','ammo-pouch','medkit']);damage(s);s.x=450;s.y=500;toggleDoor(s,'maintenance');completeTask(s,'fuse');triggerDistraction(s,'alarm');const restored=restoreState(s,s.loadout,s.route);assert.equal(restored.vest,1);assert.equal(restored.medkit,0);assert.deepEqual(restored.doors,s.doors);assert.deepEqual(restored.tasks,s.tasks);assert.deepEqual(restored.distractions,s.distractions);
});
test('teacher threat is private and freezes for the entire crew on first start',async()=>{
 const r=await room(),t=await market(r);assert.ok(!(await cmd(r,'teacher.setThreat',{teacherKey:'teacher',teamId:t.id,threat:0})).error);await commit(r,t);
 assert.equal(r.snapshot({deviceId:'s0'}).teams[0].threat,undefined);const run=t.runs.s0;
 assert.match((await cmd(r,'minigame.start',{deviceId:'s0',runId:run.runId,configRevision:run.configRevision,mode:'action',threat:1})).error,/changed/);
 assert.ok(!(await cmd(r,'minigame.start',{deviceId:'s0',runId:run.runId,configRevision:run.configRevision,mode:'action',threat:0})).error);
 assert.match((await cmd(r,'teacher.setThreat',{teacherKey:'teacher',teamId:t.id,threat:4})).error,/locked/);assert.equal(t.runs.s1.threat,0);assert.equal(t.frozenConfig.roster.length,2);
});
test('completed supply review unlocks another slot once, independent of credits',async()=>{
 const r=await room(),t=await market(r);await cmd(r,'market.propose',{deviceId:'s0',items:['vest']});
 await cmd(r,'teacher.setSupply',{teacherKey:'teacher',teamId:t.id,enabled:true,count:2});const commandId=crypto.randomUUID();await cmd(r,'supply.start',{deviceId:'s0',commandId});assert.equal(t.stage,'gate');assert.equal(t.marketSelections.s0,'vest');
 for(const m of r.members(t.id)){for(let i=0;i<2;i++){const q=r.ensureItem(m);const result=await cmd(r,'math.submit',{deviceId:m.id,answer:q.answer,commandId:`${m.id}-${i}`});assert.ok(!result.error,result.error);}}
 assert.equal(t.stage,'market');assert.equal(t.equipmentBlocks.length,1);assert.equal(t.currency,40);assert.equal(r.report().extensions.length,1);
 await cmd(r,'math.submit',{deviceId:'s0',answer:'0',commandId:'s0-0'});assert.equal(t.currency,40);
 await commit(r,t,['carbine','ammo-pouch']);assert.equal(t.currency,40);assert.deepEqual(t.inventory,['ammo-pouch','carbine']);
});
test('a corrected optional answer earns completion reward without first-attempt credit; imports require consent',async()=>{
 const r=await room(1),t=await market(r);await cmd(r,'teacher.setSupply',{teacherKey:'teacher',teamId:t.id,enabled:true,count:1});await cmd(r,'supply.start',{deviceId:'s0'});const q=r.ensureItem(r.state.students.s0);await cmd(r,'math.submit',{deviceId:'s0',answer:'-99999'});await cmd(r,'math.submit',{deviceId:'s0',answer:q.answer});assert.equal(t.currency,40);assert.equal(t.supply.earned,0);
 r.state.config.modules=[{id:'custom',source:'custom',items:[{}]}];t.supply=null;assert.match((await cmd(r,'teacher.setSupply',{teacherKey:'teacher',teamId:t.id,enabled:true,count:1})).error,/reuse/);
});
test('one and five student crews advance only after all runs, then vote; lost students participate',async()=>{
 for(const size of [1,5]){const r=await room(size),t=await market(r);await commit(r,t);for(const m of r.members(t.id)){const run=t.runs[m.id];await cmd(r,'minigame.start',{deviceId:m.id,runId:run.runId,configRevision:run.configRevision,mode:'action',threat:1});const snapshot=createState(run.loadout);snapshot.health=0;snapshot.outcome='lost';const response=await cmd(r,'minigame.complete',{deviceId:m.id,runId:run.runId,configRevision:run.configRevision,activeElapsedMs:0,seq:1,snapshot,outcome:'lost'});assert.ok(!response.error,response.error);if(m.id!==`s${size-1}`)assert.equal(t.stage,'minigame');}
 assert.equal(t.stage,'finale');assert.equal(t.completedAt,null);for(const m of r.members(t.id))await cmd(r,'choice.vote',{deviceId:m.id,choice:'depart'});await cmd(r,'choice.resolve',{deviceId:r.members(t.id)[t.leadIndex%size].id});assert.equal(t.stage,'victory');assert.equal(r.fateFor(r.state.students.s0).label,'Did not make it out alive');}
});
test('invalid regen and success without repair cannot be committed; ending a session is neutral',async()=>{
 const r=await room(1),t=await market(r);await commit(r,t);const run=t.runs.s0,args={deviceId:'s0',runId:run.runId,configRevision:run.configRevision};await cmd(r,'minigame.start',{...args,mode:'action'});const snapshot=createState(run.loadout);snapshot.ammo=60;assert.match((await cmd(r,'minigame.progress',{...args,snapshot,seq:1,activeElapsedMs:0})).error,/Ammunition/);snapshot.ammo=12;assert.match((await cmd(r,'minigame.complete',{...args,snapshot,seq:1,activeElapsedMs:0,outcome:'success'})).error,/Repair/);await cmd(r,'teacher.end',{teacherKey:'teacher'});assert.equal(run.outcome,'teacher_advanced');assert.equal(r.state.status,'ended');assert.ok(r.reportCsv().includes('V0.9 GAMEPLAY DETAILS'));assert.equal(r.state.students.s0.firstAttemptCorrect,0);
});
test('Vault panel and card are required; manual toolkit charges do not replenish on recovery',()=>{
 const s=new StealthSimulation({equipment:'toolkit'});s.start();s.player.x=200;for(let i=0;i<40;i++)s.step({interact:true});assert.equal(s.panel,true);assert.equal(s.checkpoint,'A');s.player.x=280;s.step({});s.step({jam:true});assert.deepEqual(s.jams,['A']);assert.ok(s.jamUntil>s.elapsed);const restored=new StealthSimulation({equipment:'toolkit'},s.summary());assert.deepEqual(restored.jams,['A']);s.player.x=980;s.step({interact:true});assert.notEqual(s.outcome,'extracted');assert.ok(s.player.x<=880);s.player.x=848;for(let i=0;i<40;i++)s.step({interact:true});assert.equal(s.card,true);
});
test('old room commands cannot silently migrate gameplay; export and end remain available',async()=>{
 const r=await room();r.state.config.engineVersion='0.8.0';assert.match((await cmd(r,'briefing.ready',{deviceId:'s0'})).error,/older release/);assert.ok(r.report());assert.ok(!(await cmd(r,'teacher.end',{teacherKey:'teacher'})).error);
});
