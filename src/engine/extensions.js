import {hashSeed} from '../math.js';
export const assignedCount=(room,s)=>s.assignedTotal??room.state.config.totalQuestions;
export const loadsFor=(room,s)=>s.gateLoads??room.state.config.gateLoads;
export const gateTarget=(room,s)=>room.teamFor(s).extraGate?(s.extraTarget||0):loadsFor(room,s)[room.teamFor(s).gateIndex]||0;
export function extensionPreview(room,input){
  if(room.state.status!=='active')return {error:'Questions can only be added to an active session.'};
  const count=Number(input.count);
  if(!Number.isInteger(count)||count<1||count>20)return {error:'Choose 1–20 questions per student.'};
  if(!['current','next','last'].includes(input.placement))return {error:'Choose a question placement.'};
  const selected=Object.values(room.state.students).filter(s=>!input.studentIds?.length||input.studentIds.includes(s.id));
  const mods=room.state.config.modules.filter(m=>!input.moduleIds?.length||input.moduleIds.includes(m.id));
  if(!mods.length)return {error:'Choose at least one session module.'};
  if(mods.some(m=>m.source==='custom')&&!input.allowReuse)return {error:'All imported items were allocated at setup. Select preset modules or explicitly allow imported-item reuse.'};
  const targets=[],skipped=[];
  for(const s of selected){
    const t=room.teamFor(s);
    if(['rescue','minigame','extraction','victory'].includes(t.stage)||(['nightfall','ironbreak'].includes(room.state.config.cartridgeId)&&t.stage==='finale')){skipped.push(s.alias);continue;}
    if(assignedCount(room,s)+count>400)return {error:`${s.alias} would exceed 400 assigned questions.`};
    if(t.extraGate)return {error:'Finish the current Last Checkpoint before adding another batch to this team.'};
    let gate=t.stage==='briefing'?0:t.stage==='gate'?t.gateIndex:t.gateIndex+1;
    if(input.placement==='next'&&t.stage==='gate')gate++;
    if(input.placement==='last')gate=Math.max(gate,room.state.config.gateCount-1);
    targets.push({studentId:s.id,alias:s.alias,teamId:t.id,gateIndex:input.equipmentPreparation?null:gate<room.state.config.gateCount?gate:null,count,total:assignedCount(room,s)+count});
  }
  if(!targets.length)return {error:'No selected students can receive more work. Their games or endings have started.'};
  return {targets,skipped,modules:mods.map(m=>m.id),count,placement:input.placement,policy:input.policy||'keep',allowReuse:!!input.allowReuse,revision:room.state.revision};
}
export function extendAssignments(room,input){
  if(input.expectedRevision!==room.state.revision)return {error:'The room changed. Preview the extension again.'};
  const preview=extensionPreview(room,input);if(preview.error)return preview;
  if(!['keep','foundation','standard','challenge'].includes(preview.policy))return {error:'Choose a valid difficulty.'};
  const id=crypto.randomUUID(),checkpointTeams=new Set();
  for(const target of preview.targets){
    const s=room.state.students[target.studentId],t=room.teamFor(s);
    if(!s.plan?.length)room.preparePlan(s);
    s.gateLoads=[...loadsFor(room,s)];s.assignedTotal=target.total;
    const assignments=Array.from({length:preview.count},(_,i)=>{
      const m=room.state.config.modules.find(m=>m.id===preview.modules[i%preview.modules.length]);
      return {source:m.source,moduleId:m.id,moduleTitle:m.title,band:preview.policy==='keep'?m.band:({foundation:'beginner',standard:'intermediate',challenge:'advanced'})[preview.policy],difficultyOverride:preview.policy==='keep'?null:preview.policy,itemIndex:m.source==='custom'?i%m.items.length:undefined,seed:hashSeed(`${room.state.code}:${id}:${s.id}:${i}`),extensionBatchId:id};
    });
    if(target.gateIndex===null){if(input.equipmentPreparation)s.plan.splice(s.itemsCompleted,0,...assignments);else s.plan.push(...assignments);s.extraTarget=preview.count;checkpointTeams.add(t.id);}
    else{
      const end=s.gateLoads.slice(0,target.gateIndex+1).reduce((a,b)=>a+b,0);
      s.plan.splice(end,0,...assignments);s.gateLoads[target.gateIndex]+=preview.count;
      if(t.stage==='gate'&&t.gateIndex===target.gateIndex)s.gateComplete=false;
    }
  }
  for(const teamId of checkpointTeams){
    const t=room.state.teams[teamId];t.extraGate={resumeStage:t.stage,openedAt:new Date().toISOString()};t.stage='gate';
    for(const s of room.members(teamId)){s.gateProgress=0;s.gateComplete=!s.extraTarget;s.currentItem=null;}
  }
  (room.state.extensions||=[]).push({id,at:new Date().toISOString(),...preview});
  room.addEvent('questions-extended',`Added ${preview.count} questions to ${preview.targets.length} students. Batch ${id}`);room.bump();
  return room.snapshot({teacherKey:input.teacherKey});
}
export function finishCheckpoint(room,t){
  if(!t.extraGate)return false;
  if(room.members(t.id).every(s=>s.gateComplete)){
    t.stage=t.extraGate.resumeStage;t.extraGate=null;
    for(const s of room.members(t.id)){s.extraTarget=0;s.currentItem=null;}
    room.addEvent('checkpoint-complete',`${t.name} completed the Last Checkpoint`,t.id);
  }
  return true;
}
