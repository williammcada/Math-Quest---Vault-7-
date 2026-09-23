import {createRescue,checkpointFor,rescueComplete,validRescuePoint} from '../../../public/games/nightfall/rescue.js';
import {RESCUE_REVISION,RESCUE_WINDOW_MS,rescueWorld,rescueCaller} from '../../../public/games/nightfall/rescue-world.js';

export function openRescue(room,t){
 if(t.rescue)return false;
 const now=Date.now(),phaseId=crypto.randomUUID(),roster=room.members(t.id).map(m=>m.id);
 t.stage='rescue';t.rescue={phaseId,route:t.route,roster,openedAt:now,deadline:now+RESCUE_WINDOW_MS,pausedMs:0,closedAt:null,runs:{}};
 for(const id of roster)t.rescue.runs[id]={phase:'early-rescue',phaseId,runId:crypto.randomUUID(),attemptId:crypto.randomUUID(),attempt:1,retries:0,seq:0,status:'not_started',mode:'action',route:t.route,loadout:[],threat:1,configRevision:RESCUE_REVISION,engineVersion:'0.9.4',snapshot:createRescue(t.route),activeElapsedMs:0,attempts:[]};
 room.addEvent('rescue-opened',`${t.name}: First Response opened for five minutes`,t.id);
 return true;
}
export function settleRescues(room,forceTeam){
 let changed=false;
 for(const t of Object.values(room.state.teams)){
  const w=t.rescue;if(t.stage!=='rescue'||!w||w.closedAt)continue;
  const force=forceTeam==='*'||forceTeam===t.id,expired=!room.state.paused&&Date.now()>=w.deadline;
  if(force||expired)for(const r of Object.values(w.runs))if(r.status!=='terminal'){
   r.closureReason=force?'teacher_closed':'time_window_closed';r.outcome=r.status==='not_started'?'not_started':r.closureReason;r.status='terminal';r.completedAt=Date.now();changed=true;
  }
  if(Object.values(w.runs).every(r=>r.status==='terminal')){
   w.closedAt=Date.now();w.closeReason=force?'teacher_closed':expired?'time_window_closed':'all_resolved';
   w.bridge=w.closeReason==='all_resolved'?`${rescueCaller(w.route)} is safe at the terminal. Check the repair plan.`:`The rescue window has closed. The crew regroups at the terminal with ${rescueCaller(w.route)}. Your next task is to check the repair plan.`;
   room.openGate(t,1);room.addEvent('rescue-closed',`${t.name}: ${w.closeReason}; Gate 2 open`,t.id);changed=true;
  }
 }
 if(changed)room.bump();return changed;
}
const integer=(n,max)=>Number.isInteger(n)&&n>=0&&n<=max;
export function validateRescueSnapshot(r,s,input){
 const old=r.snapshot,world=rescueWorld(r.route);
 if(!s||typeof s!=='object'||JSON.stringify(s).length>60000)return 'A bounded rescue snapshot is required.';
 for(const key of ['tasks','doors','windows','distractions'])if(!s[key]||typeof s[key]!=='object'||Array.isArray(s[key]))return 'Invalid rescue state structure.';
 if(s.scenario!=='rescue'||s.revision!==RESCUE_REVISION||s.route!==r.route||s.threat!==1||!Array.isArray(s.loadout)||s.loadout.length||s.damage!==1||s.vest!==0||s.medkit!==0||s.shotgun!==false||s.shells!==0||s.weapon!=='primary'||s.hordeTriggered||s.garageHordeTriggered)return 'Invalid rescue equipment or scenario.';
 if(!Number.isFinite(s.time)||s.time<old.time||s.time>(Date.now()-r.attemptStartedAt)/1000+2||input.activeElapsedMs!==Math.round(s.time*1000))return 'Invalid rescue timing.';
 if(!integer(s.health*2,6)||!integer(s.ammo,25))return 'Invalid rescue health or ammunition.';
 for(const [key,max] of [['immune',2],['cooldown',1],['interact',3],['noise',13],['noiseRadius',3000]])if(!Number.isFinite(s[key])||s[key]<0||s[key]>max)return 'Invalid rescue simulation state.';
 if(!Number.isFinite(s.angle)||Math.abs(s.angle)>100000)return 'Invalid rescue facing.';
 if(!s.tasks||Object.keys(s.tasks).some(k=>!['recruit','return'].includes(k)||s.tasks[k]!==true)||Object.keys(old.tasks).some(k=>!s.tasks[k]))return 'Invalid rescue objective history.';
 if(!s.windows||Object.entries(s.windows).some(([id,v])=>!world.WINDOWS.some(w=>w.id===id)||v!==true)||Object.keys(old.windows).some(id=>!s.windows[id]))return 'Invalid rescue windows.';
 if(!s.doors||Object.keys(s.doors).length!==1||s.doors.store?.closed!==true||s.doors.store?.hp!==100)return 'The rescue front door is locked.';
 if(!validRescuePoint(s,s)||s.follower&&!validRescuePoint(s,s.follower))return 'Invalid rescue position.';
 if(!Array.isArray(s.trail)||s.trail.length>1800||s.trail.some(p=>!validRescuePoint(s,p)))return 'Invalid follower path.';
 if(!!s.follower!==!!s.tasks.recruit||typeof s.dialogue!=='boolean')return 'Invalid recruitment state.';
 if(s.tasks.recruit&&!old.tasks.recruit){
  const target=world.TASKS[0];if(Math.hypot(s.x-target.x,s.y-target.y)>68||!Object.keys(s.windows).length||!s.follower||Math.hypot(s.follower.x-s.x,s.follower.y-s.y)>10)return 'Enter the building and speak with the survivor first.';
 }
 if(s.tasks.return&&!rescueComplete(s))return 'Both the living player and survivor must return to the terminal.';
 if(!Array.isArray(s.picked)||new Set(s.picked).size!==s.picked.length||s.picked.some(id=>!world.PICKUPS.some(p=>p.id===id))||old.picked.some(id=>!s.picked.includes(id)))return 'Invalid rescue pickup history.';
 for(const key of ['shots','hits','heals','blocks','shotgunShots','doorUses','doorsBroken','distractionsUsed'])if(!integer(s[key],10000)||s[key]<old[key])return 'Invalid rescue counters.';
 if(s.blocks||s.shotgunShots||s.doorUses||s.doorsBroken)return 'Unavailable rescue equipment or door action.';
 const ammo=s.picked.includes('rescue-ammo')&&!old.picked.includes('rescue-ammo')?10:0,heal=s.picked.includes('rescue-health')&&!old.picked.includes('rescue-health')?1:0;
 if(s.ammo!==old.ammo+ammo-(s.shots-old.shots)||s.health>Math.min(3,old.health+heal)||s.heals!==old.heals+heal)return 'Rescue supplies cannot refill without the specified pickup.';
 if(!Array.isArray(s.enemies)||s.enemies.length!==20||s.enemies.some(e=>!e||typeof e!=='object')||new Set(s.enemies.map(e=>e.id)).size!==20||s.enemies.some(e=>{const a=old.enemies.find(o=>o.id===e.id);return !a||e.kind!==a.kind||e.zone!==a.zone||!!e.storeGuard!==!!a.storeGuard||!integer(e.hp,2)||e.hp>a.hp||!Number.isFinite(e.x)||!Number.isFinite(e.y)||e.x<0||e.x>2560||e.y<0||e.y>1280||e.horde;}))return 'Invalid rescue population.';
 if(!s.distractions||Object.keys(old.distractions).some(id=>!s.distractions[id])||Object.entries(s.distractions).some(([id,d])=>{
  const definition=world.DISTRACTIONS.find(v=>v.id===id),prior=old.distractions[id];
  return !definition||!d||!Number.isFinite(d.started)||d.started<0||d.started>s.time||d.ignitesAt!==d.started+(definition.kind==='barrel'?1.2:0)||Math.abs(d.until-d.ignitesAt-definition.duration)>.00001||prior&&JSON.stringify(prior)!==JSON.stringify(d);
 }))return 'Invalid rescue distraction history.';
 if(!integer(s.assistedStep,5)||s.assistedStep<old.assistedStep||s.assistedStep>old.assistedStep+1||r.mode==='action'&&s.assistedStep!==old.assistedStep)return 'Invalid assisted route state.';
 if(input.type==='rescue.complete'&&input.outcome==='success'&&!rescueComplete(s))return 'Return with the survivor alive before completing.';
 if(input.type==='rescue.complete'&&input.outcome==='lost'&&s.health!==0)return 'Retry requires a downed attempt.';
 if(input.type==='rescue.complete'&&!['success','lost'].includes(input.outcome))return 'Invalid rescue result.';
 if(s.outcome!==null&&s.outcome!==input.outcome)return 'Invalid rescue outcome.';
 return null;
}
export function rescueCommand(room,student,input){
 const t=room.teamFor(student),w=t.rescue,r=w?.runs[student.id],fail=error=>({error});
 settleRescues(room);
 if(!r||input.phaseId!==w.phaseId||input.runId!==r.runId||input.configRevision!==RESCUE_REVISION)return fail('This rescue does not match the issued phase.');
 if(w.closedAt||r.status==='terminal')return room.snapshot({deviceId:student.id});
 if(t.stage!=='rescue'||input.attemptId!==r.attemptId)return fail('This rescue attempt is no longer active.');
 const type=input.type;
 if(type==='rescue.start'){
  if(!['action','assisted'].includes(input.mode))return fail('Choose action or assisted mode.');
  if(r.status==='not_started'){r.status='active';r.startedAt=Date.now();r.attemptStartedAt=Date.now();r.mode=input.mode;r.usedAssisted=input.mode==='assisted';}
 }else if(type==='rescue.retry'){
  if(r.status!=='downed')return fail('Only a recorded downed attempt can retry.');
  r.attempts.push({attempt:r.attempt,outcome:'downed',mode:r.mode,activeElapsedMs:r.activeElapsedMs,at:Date.now()});
  r.retries++;r.attempt++;r.attemptId=crypto.randomUUID();r.seq=0;r.status='active';
  r.snapshot=r.escortCheckpoint?structuredClone(r.escortCheckpoint):createRescue(w.route);r.snapshot.immune=2;
  r.activeElapsedMs=Math.round(r.snapshot.time*1000);r.attemptStartedAt=Date.now()-r.activeElapsedMs;
 }else if(type==='rescue.assist'){
  if(r.status!=='active')return fail('Start the rescue before changing mode.');r.mode='assisted';r.usedAssisted=true;
 }else if(['rescue.progress','rescue.complete'].includes(type)){
  if(r.status!=='active'||!Number.isInteger(input.seq)||input.seq<=r.seq)return fail('Stale or inactive rescue update.');
  const error=validateRescueSnapshot(r,input.snapshot,input);if(error)return fail(error);
  const s=structuredClone(input.snapshot);r.snapshot=s;r.seq=input.seq;r.activeElapsedMs=input.activeElapsedMs;
  if(s.tasks.recruit&&!r.escortCheckpoint)r.escortCheckpoint=checkpointFor(s);
  if(type==='rescue.complete'){
   if(input.outcome==='lost')r.status='downed';
   else{r.status='terminal';r.outcome='success';r.closureReason='completed_escort';r.completedAt=Date.now();}
   r.validation='client-reported; server-validated rescue envelope';settleRescues(room);
  }
 }else return fail('Unknown rescue command.');
 room.bump();return room.snapshot({deviceId:student.id});
}
export function rescueProjection(room,t,teacher,viewer){
 const w=t.rescue;if(!w||!teacher&&viewer?.teamId!==t.id)return null;
 const visible=r=>{if(!r)return r;const {escortCheckpoint,...view}=r;return view;};
 return {phaseId:w.phaseId,route:w.route,deadline:w.deadline,serverNow:Date.now(),pausedAt:room.state.paused?room.state.pausedAt:null,closedAt:w.closedAt,bridge:w.bridge,run:viewer?visible(w.runs[viewer.id]):undefined,results:teacher?w.roster.map(id=>({studentId:id,alias:room.state.students[id]?.alias,...visible(w.runs[id])})):undefined};
}
