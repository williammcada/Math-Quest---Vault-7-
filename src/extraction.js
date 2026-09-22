import { REVISION, RULES } from '../public/stealth-core.js';
export const OUTCOMES=['extracted','captured','timeout','fallback_extracted','advanced'];
export const outcomeLabel=r=>!r||r.status==='not_started'?'Not started':r.status==='active'?(r.fallbackUsed?'Accessible extraction':'Active'):({extracted:'Extracted',captured:'Captured',timeout:'Timed out',fallback_extracted:'Accessible extraction complete',advanced:'Advanced by teacher'})[r.outcome];
const fresh=()=>({status:'not_started',outcome:null,checkpoint:null,activeElapsedMs:0,detections:0,integrityRemaining:3,fallbackUsed:false,fallbackStep:0,resourcesUsed:[],objectives:{panel:false,card:false},jams:[],startedAt:null,completedAt:null,clientBuild:'0.9.2',mapRevision:REVISION});
export function beginExtraction(room,team){
  const now=Date.now();team.stage='extraction';team.extraction={version:'1.0.0',stageEnteredAt:now,deadlineAt:now+RULES.teamWindow,route:team.route||'corridor',equipment:team.inventory[0]||null,loadout:[...team.inventory],adverseCount:team.adverseEvents.length,finalChoiceId:team.finalAction,rosterStudentIds:room.members(team.id).map(s=>s.id),resultsByStudentId:{},completedAt:null,completionReason:null};
  for(const id of team.extraction.rosterStudentIds)team.extraction.resultsByStudentId[id]=fresh();
  room.addEvent('extraction-opened',`${team.name} began individual extraction`,team.id);
}
export function settleExtractions(room,now=Date.now()){
  let changed=false;
  for(const team of Object.values(room.state.teams)){
    const e=team.extraction;if(team.stage!=='extraction'||!e)continue;
    // An explicit teacher pause freezes the phase deadline too.
    if(!room.state.paused&&now>=e.deadlineAt){for(const r of Object.values(e.resultsByStudentId))if(r.status!=='terminal'){Object.assign(r,{status:'terminal',outcome:'advanced',completedAt:new Date(now).toISOString()});changed=true;}e.completionReason='shared-window-closed';}
    if(Object.values(e.resultsByStudentId).every(r=>r.status==='terminal')){team.stage='victory';team.completedAt=new Date(now).toISOString();e.completedAt=team.completedAt;e.completionReason||='all-terminal';room.addEvent('extraction-closed',`${team.name}: ${e.completionReason}`,team.id);changed=true;}
  }if(changed)room.bump();return changed;
}
export function finishExtractions(room,teamId){
  for(const t of Object.values(room.state.teams)){if(teamId&&t.id!==teamId||t.stage!=='extraction')continue;for(const[id,r]of Object.entries(t.extraction.resultsByStudentId))if(r.status!=='terminal'){Object.assign(r,{status:'terminal',outcome:'advanced',completedAt:new Date().toISOString()});room.addEvent('extraction-advanced','Teacher ended extraction',t.id,id);}t.extraction.completionReason='teacher';}settleExtractions(room);
}
export function extractionCommand(room,student,input){
  const team=room.teamFor(student),e=team.extraction,r=e?.resultsByStudentId[student.id],type=input.type;
  if(!r)return{error:'No extraction run is assigned to this student.',status:404};
  if(r.status==='terminal')return room.snapshot({deviceId:student.id});
  if(team.stage!=='extraction')return{error:'Extraction is not open.',status:409};
  if(type==='extraction.start'){
    if(input.mapRevision!==REVISION)return{error:'Reload the v0.9 page to start this run.',status:422};
    if(r.status==='not_started'){r.status='active';r.startedAt=new Date().toISOString();room.addEvent('extraction-started','Individual run started',team.id,student.id);}
  }else if(type==='extraction.switchFallback'){
    r.fallbackUsed=true;r.fallbackStep=Math.max(r.fallbackStep,Math.min(2,[null,'A','B','C'].indexOf(r.checkpoint)));r.status='active';r.startedAt||=new Date().toISOString();room.addEvent('extraction-fallback','Accessible extraction selected',team.id,student.id);
  }else if(['extraction.checkpoint','extraction.detected','extraction.complete','extraction.heartbeat'].includes(type)){
    if(r.status!=='active')return{error:'Start extraction first.',status:409};
    const p=input,cp=p.checkpoint??null,levels=[null,'A','B','C'];
    if(p.mapRevision!==REVISION||!levels.includes(cp)||!Number.isInteger(p.activeElapsedMs)||p.activeElapsedMs<0||p.activeElapsedMs>180000||!Number.isInteger(p.detections)||p.detections<0||p.detections>3||p.integrityRemaining!==3-p.detections)return{error:'Invalid extraction summary.',status:422};
    if(p.activeElapsedMs<r.activeElapsedMs||p.detections<r.detections||levels.indexOf(cp)<levels.indexOf(r.checkpoint))return{error:'Stale extraction summary. Restoring the latest checkpoint.',status:409};
    if(['route','equipment','adverseCount'].some(k=>k in p&&p[k]!==e[k]))return{error:'Extraction conditions cannot change during a run.',status:422};
    if(p.fallbackUsed!==undefined&&p.fallbackUsed!==r.fallbackUsed)return{error:'Switch to accessible extraction before reporting its result.',status:422};
    if(p.resourcesUsed&&!Array.isArray(p.resourcesUsed)||p.resourcesUsed?.some(id=>!(e.loadout||[e.equipment]).includes(id)))return{error:'Invalid resource effect.',status:422};
    const step=p.fallbackStep??r.fallbackStep;if(!Number.isInteger(step)||step<r.fallbackStep||step>3)return{error:'Invalid accessible extraction progress.',status:422};
    if(p.jams&&(!Array.isArray(p.jams)||p.jams.length>4||new Set(p.jams).size!==p.jams.length||p.jams.some(k=>!['start','A','B','C'].includes(k))||!(e.loadout||[e.equipment]).includes('toolkit')&&p.jams.length))return{error:'Invalid toolkit charges.',status:422};
    if(r.jams?.some(k=>!p.jams?.includes(k)))return{error:'Toolkit charges cannot recharge.',status:422};
    if(p.cloakUsed!==undefined&&typeof p.cloakUsed!=='boolean'||p.cloakUsed&&!(e.loadout||[e.equipment]).includes('cloak')||r.cloakUsed&&!p.cloakUsed)return{error:'Invalid cloak usage. A cloak cannot recharge.',status:422};
    if(p.objectives&&(r.objectives?.panel&&!p.objectives.panel||r.objectives?.card&&!p.objectives.card||p.objectives.card&&!p.objectives.panel))return{error:'Objective progress cannot go backwards.',status:422};
    if(type==='extraction.complete'){
      if(!OUTCOMES.includes(p.outcome)||p.outcome==='advanced')return{error:'Invalid extraction outcome.',status:422};
      if(p.outcome==='extracted'&&(r.fallbackUsed||cp!=='C'||p.activeElapsedMs<1000))return{error:'Reach the final checkpoint before extraction.',status:422};
      if(p.outcome==='captured'&&p.detections!==3)return{error:'Capture requires three detections.',status:422};
      if(p.outcome==='timeout'&&p.activeElapsedMs!==180000)return{error:'The individual timer has not expired.',status:422};
      if(p.outcome==='fallback_extracted'&&(!r.fallbackUsed||step!==3))return{error:'Complete all three accessible scenes.',status:422};
    }
    Object.assign(r,{checkpoint:cp,activeElapsedMs:p.activeElapsedMs,detections:p.detections,integrityRemaining:p.integrityRemaining,fallbackStep:step,resourcesUsed:[...(p.resourcesUsed||r.resourcesUsed||[])]});
    r.cloakUsed=!!p.cloakUsed;
    r.objectives=p.objectives||{panel:levels.indexOf(cp)>=1,card:cp==='C'};r.jams=p.jams||r.jams;r.alert=p.alert||null;
    if(type==='extraction.complete')Object.assign(r,{status:'terminal',outcome:p.outcome,completedAt:new Date().toISOString()});
    if(type!=='extraction.heartbeat')room.addEvent(type,`${p.outcome||cp||'run'} · ${r.detections} detections`,team.id,student.id);
  }else return{error:'Unknown extraction command.',status:422};
  room.bump();settleExtractions(room);return room.snapshot({deviceId:student.id});
}
export function extractionProjection(e,teacher,studentId){
  if(!e)return null;const{resultsByStudentId,rosterStudentIds,...safe}=e;
  return{...safe,rosterCount:rosterStudentIds.length,completedCount:Object.values(resultsByStudentId).filter(r=>r.status==='terminal').length,...(teacher?{resultsByStudentId}:{result:resultsByStudentId[studentId]||null})};
}
export function extractionSummary(e){if(!e)return null;const rows=Object.values(e.resultsByStudentId),times=rows.filter(r=>r.startedAt).map(r=>r.activeElapsedMs).sort((a,b)=>a-b),mid=Math.floor(times.length/2);return{rosterCount:rows.length,startedCount:rows.filter(r=>r.startedAt).length,counts:Object.fromEntries(OUTCOMES.map(o=>[o,rows.filter(r=>r.outcome===o).length])),medianActiveMs:times.length?(times.length%2?times[mid]:(times[mid-1]+times[mid])/2):0,totalDetections:rows.reduce((a,r)=>a+r.detections,0),completionReason:e.completionReason};}
