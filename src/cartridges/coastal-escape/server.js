import {createFlightWindow,issueFlight,acceptFlightCommand,closeFlightWindow} from '../../games/aerial-shooter.js';
import {readyToLeave} from '../../engine/equipment.js';
function sync(t){for(const r of Object.values(t.flightWindow?.runs||{})){r.activeElapsedMs=Math.round(r.snapshot.tick*1000/60);r.mode=r.snapshot.mode;r.loadout=r.config.loadout;r.configRevision=r.config.configRevision;r.engineVersion='0.9.5';r.validation='client-reported; server-validated envelope';t.runs[r.studentId]=r;}}
export function settleCoastal(room,forceTeam,outcome='teacher_advanced'){
 if(room.state.config?.cartridgeId!=='coastal-escape')return false;let changed=false;
 for(const t of Object.values(room.state.teams)){
  if(t.stage!=='minigame'||!t.flightWindow)continue;
  const force=forceTeam==='*'||forceTeam===t.id;
  if(force||!room.state.paused&&Date.now()>=t.finaleDeadline){closeFlightWindow(t.flightWindow,force?outcome:'window_closed');changed=true;}
  sync(t);
  if(Object.values(t.runs).length&&Object.values(t.runs).every(r=>r.status==='terminal')){t.stage='finale';t.actionCompletedAt=new Date().toISOString();room.addEvent('field-records-complete',`${t.name}: escort records complete; final decision open`,t.id);changed=true;}
 }
 if(changed)room.bump();return changed;
}
export function coastalCommand(room,student,input){
 const t=room.teamFor(student),reply=()=>{room.bump();return room.snapshot({deviceId:student.id});};
 if(input.type==='market.continue'){
  if(t.stage!=='market'||!room.isLead(student,t)||!readyToLeave(room,t))return {error:'The Event Lead must confirm all earned equipment first.'};
  const now=Date.now();t.stage='minigame';t.finaleDeadline=now+300000;t.runs={};t.flightWindow=createFlightWindow({phaseId:crypto.randomUUID(),now,teamId:t.id});
  for(const m of room.members(t.id))issueFlight(t.flightWindow,{studentId:m.id,runId:crypto.randomUUID(),loadout:t.inventory,seed:1942},now);
  sync(t);t.leadIndex=(t.leadIndex+1)%room.members(t.id).length;
  room.addEvent('coastal-flight-opened',`${t.name}: five-minute escort window opened`,t.id,student.id);return reply();
 }
 if(input.type.startsWith('aerial.')){
  if(!t.flightWindow)return {error:'No flight has been issued.'};
  const prior=t.flightWindow.runs[input.runId];
  if(!prior||prior.studentId!==student.id)return {error:'This flight belongs to another student.'};
  if(prior.status==='terminal')return reply();
  if(t.stage!=='minigame')return {error:'The flight stage is closed.'};
  // The existing teacher pause handler moves the authoritative deadline once.
  t.flightWindow.openedAt=t.finaleDeadline-300000;
  try{acceptFlightCommand(t.flightWindow,{studentId:student.id,teamId:t.id,authenticated:true,phaseId:t.flightWindow.phaseId},input,Date.now());}
  catch(e){return {error:e.message};}
  sync(t);if(t.runs[student.id].status==='terminal')room.addEvent('minigame-complete',`${student.alias}: ${t.runs[student.id].outcome}`,t.id,student.id);
  settleCoastal(room);return reply();
 }
 if(input.type.startsWith('minigame.')||input.type.startsWith('rescue.'))return {error:'This command does not belong to Coastal Escape.'};
 return null;
}
export function coastalProjection(room,t,teacher,viewer,base){
 const mine=viewer?.teamId===t.id;return {...base,supply:base.supply||{count:null},threat:undefined,rescue:null,finale:teacher||mine?{deadline:t.finaleDeadline,serverNow:Date.now(),run:mine?t.runs?.[viewer.id]:undefined,results:teacher?room.members(t.id).map(m=>({alias:m.alias,...t.runs?.[m.id]})):undefined}:null};
}
