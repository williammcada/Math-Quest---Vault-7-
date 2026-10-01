// Development integration contract. Deliberately not registered in the classroom
// command router until narrative placement and a matched platform release exist.
import {createRun,restore,snapshot,closeRun,enterAssisted} from '../../public/games/aerial-shooter/core.js';
import {UPGRADES,T} from '../../public/games/aerial-shooter/tuning.js';
const clone=v=>structuredClone(v);
const requireValue=(ok,message)=>{if(!ok)throw Error(message);};
export function upgradeQuestionCount(gateCounts,explicit){
 if(explicit!==undefined&&explicit!==null){requireValue(Number.isInteger(explicit)&&explicit>=1&&explicit<=100,'Set Questions for each extra upgrade to a whole number from 1 to 100.');return explicit;}
 requireValue(Array.isArray(gateCounts)&&gateCounts.length&&gateCounts.every(n=>Number.isInteger(n)&&n>0),'Gate question counts are required.');
 requireValue(gateCounts.every(n=>n===gateCounts[0]),'Gate counts differ. The teacher must choose Questions for each extra upgrade.');return upgradeQuestionCount([],gateCounts[0]);
}
export function createUpgradeBlock({id,studentIds,gateCounts,questionsPerUpgrade}){
 const count=upgradeQuestionCount(gateCounts,questionsPerUpgrade);requireValue(typeof id==='string'&&id&&studentIds.length>0&&new Set(studentIds).size===studentIds.length,'Select the participating students.');
 return {id,count,studentIds:[...studentIds],completed:false,correctQuestionIds:Object.fromEntries(studentIds.map(id=>[id,[]]))};
}
export function recordUpgradeAnswer(block,studentId,questionId,correct){
 requireValue(block.studentIds.includes(studentId),'Student is not assigned to this upgrade block.');if(block.completed||!correct)return block.completed;
 requireValue(typeof questionId==='string'&&questionId.length>0,'Question identity is required.');const ids=block.correctQuestionIds[studentId];if(!ids.includes(questionId)&&ids.length<block.count)ids.push(questionId);
 block.completed=block.studentIds.every(id=>block.correctQuestionIds[id].length===block.count);return block.completed;
}
export function validateTeamLoadout({requiredWorkComplete,completedBlocks,loadout}){
 requireValue(requiredWorkComplete,'Complete required mathematics before choosing aircraft equipment.');const slots=Math.min(3,1+completedBlocks.filter(b=>b.completed).length);
 requireValue(Array.isArray(loadout)&&loadout.length<=slots&&new Set(loadout).size===loadout.length&&loadout.every(id=>UPGRADES.some(u=>u.id===id)),'Choose distinct upgrades within the earned slot count.');return [...loadout].sort();
}
export function createFlightWindow({phaseId,now,teamId}){return {phaseId,teamId,openedAt:now,duration:300000,pausedAt:null,pausedTotal:0,closedReason:null,runs:{}};}
export function remainingWindow(window,now){if(window.closedReason)return 0;return Math.max(0,window.duration-((window.pausedAt??now)-window.openedAt-window.pausedTotal));}
export function pauseFlightWindow(window,paused,now){if(window.closedReason)return;if(paused&&window.pausedAt===null)window.pausedAt=now;else if(!paused&&window.pausedAt!==null){window.pausedTotal+=now-window.pausedAt;window.pausedAt=null;}}
export function issueFlight(window,{studentId,runId,loadout,seed=1942},now){
 requireValue(remainingWindow(window,now)>0,'The team flight window has closed.');
 const previous=Object.values(window.runs).find(r=>r.studentId===studentId);if(previous)return clone(previous);
 const config={runId,loadout,seed,mode:'action',phaseId:window.phaseId,configRevision:`aerial-live/2:${window.phaseId}`};
 const state=createRun(config),record={studentId,teamId:window.teamId,runId,config:state.config,status:'ready',started:false,seq:0,revision:0,acceptedCommands:[],snapshot:snapshot(state),outcome:null,lastAcceptedAt:now};window.runs[runId]=record;return clone(record);
}
function neutralClose(record,reason){if(record.status==='terminal')return;const state=clone(record.snapshot);closeRun(state,reason);record.snapshot=snapshot(state);record.status='terminal';record.outcome=reason;record.revision++;}
export function closeFlightWindow(window,reason){requireValue(['window_closed','teacher_advanced','session_ended'].includes(reason),'Unknown classroom closure');window.closedReason=reason;Object.values(window.runs).forEach(r=>neutralClose(r,reason));}
export function readFlight(window,runId,now){if(!window.closedReason&&remainingWindow(window,now)===0)closeFlightWindow(window,'window_closed');return clone(window.runs[runId]);}
export function acceptFlightCommand(window,actor,command,now){
 const r=window.runs[command.runId];requireValue(r&&actor.studentId===r.studentId&&actor.teamId===window.teamId,'This student does not own the flight.');
 requireValue(actor.authenticated===true&&actor.phaseId===window.phaseId,'An authenticated current-stage actor is required.');
 if(!window.closedReason&&remainingWindow(window,now)===0)closeFlightWindow(window,'window_closed');
 if(r.status==='terminal')return clone(r);
 requireValue(command.configRevision===r.config.configRevision,'Flight configuration changed; reconcile before resuming.');
 requireValue(typeof command.commandId==='string'&&command.commandId.length>0&&command.commandId.length<=100,'Command identity is required.');
 if(r.acceptedCommands.includes(command.commandId))return clone(r);
 requireValue(Number.isInteger(command.seq)&&command.seq>r.seq,'Stale flight sequence; reconcile before resuming.');
 requireValue(['aerial.start','aerial.progress','aerial.assist','aerial.complete'].includes(command.type),'Unknown flight command.');
 requireValue(window.pausedAt===null,'Teacher has paused the flight window.');
 const next=restore(r.config,command.snapshot),old=r.snapshot;
 requireValue(next.tick>=old.tick&&next.attempt>=old.attempt&&next.lives<=old.lives,'Time or lives cannot be restored by a client update.');
 requireValue(next.checkpoint>=old.checkpoint,'A secured checkpoint cannot be removed.');
 requireValue(old.collected.every(id=>next.collected.includes(id)),'Spent supplies must remain spent.');
 requireValue(next.tick-old.tick<=Math.ceil((now-r.lastAcceptedAt)/1000*60)+12,'Reported active time exceeds the contact interval.');
 requireValue(next.attempt>old.attempt||next.levelTick>=old.levelTick,'Only life loss can rewind level progress.');
 requireValue(old.mode!=='assisted'||next.mode==='assisted','Assisted flight cannot return to action mode.');
 if(next.attempt===old.attempt){const repairs=next.collected.filter(id=>id.startsWith('REPAIR-')&&!old.collected.includes(id)).length;requireValue(next.health<=old.health+repairs*25,'Health increase requires a repair or life loss.');}
 requireValue(command.type==='aerial.complete'?!!next.outcome:!next.outcome,'Completion must use the terminal command.');
 if(command.type==='aerial.start')requireValue(!r.started&&next.tick===0&&next.attempt===0,'A started flight cannot restart.');else requireValue(r.started,'Start the issued flight first.');
 if(command.type==='aerial.assist')requireValue(next.mode==='assisted','Assisted command must enter guided mode.');
 if(next.outcome==='success')requireValue(next.boss?.core===0,'Boss success requires destroyed core.');
 if(next.outcome==='defeat')requireValue(next.lives===0,'Defeat requires exhausted lives.');
 if(next.outcome==='escape_lesser')requireValue(next.tick===T.limit&&next.lives>0,'Escape requires the active limit.');
 if(next.outcome==='assisted_completed')requireValue(next.mode==='assisted'&&next.assistedStep===3,'Complete all guided steps.');
 requireValue(!['window_closed','teacher_advanced','session_ended'].includes(next.outcome),'Classroom closure is server-owned.');
 r.snapshot=snapshot(next);r.started=true;r.status=next.outcome?'terminal':'active';r.outcome=next.outcome;r.seq=command.seq;r.revision++;r.lastAcceptedAt=now;r.acceptedCommands.push(command.commandId);r.acceptedCommands=r.acceptedCommands.slice(-128);return clone(r);
}
export function flightEvidence(record){return {game:'aerial-shooter',gameVersion:record.config.game,runId:record.runId,studentId:record.studentId,teamId:record.teamId,mode:record.snapshot.mode,started:record.started,outcome:record.outcome,activeElapsedMs:Math.round(record.snapshot.tick*1000/60),levelProgressMs:Math.round(record.snapshot.levelTick*1000/60),livesRemaining:record.snapshot.lives,loadout:clone(record.config.loadout),counters:clone(record.snapshot.counters)};}
