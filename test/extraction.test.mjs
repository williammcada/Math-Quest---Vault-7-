import test from 'node:test';
import assert from 'node:assert/strict';
import {QuestSession} from './authenticated-session.mjs';
const revision='vault7-stealth-3';
const store=()=>{const data=new Map();return{storage:{async get(k){return structuredClone(data.get(k));},async put(k,v){data.set(k,structuredClone(v));}},blockConcurrencyWhile:fn=>fn()};};
async function request(room,path,body){const response=await room.fetch(new Request(`http://room${path}`,{method:body?'POST':'GET',...(body?{body:JSON.stringify(body)}:{})}));return{status:response.status,body:await response.json()};}
const cmd=(r,type,more={})=>request(r,'/command',{type,commandId:crypto.randomUUID(),...more});
const summary=(more={})=>({mapRevision:revision,checkpoint:'B',activeElapsedMs:24000,detections:1,integrityRemaining:2,...more});
async function roomForExtraction(){
  const ctx=store(),room=new QuestSession(ctx);await request(room,'/init',{code:'TEST06',teacherKey:'teacher',config:{teamNames:['Cipher','Vector'],modules:[{id:'number.integer-operations',itemCount:3}]}});
  for(let i=0;i<6;i++){const pin=Object.values(room.state.teams)[i<3?0:1].pin;await cmd(room,'student.join',{deviceId:`s${i}`,alias:`Agent ${i}`,teamPin:pin});}
  await cmd(room,'teacher.start',{teacherKey:'teacher'});
  for(const t of Object.values(room.state.teams)){t.stage='finale';t.route=t.id==='team-1'?'shaft':'corridor';t.inventory=[t.id==='team-1'?'cloak':'toolkit'];for(const member of room.members(t.id))t.finalVotes[member.id]='isolate';const lead=room.members(t.id)[0];await cmd(room,'finale.resolve',{deviceId:lead.id});}
  return {room,ctx};
}
test('two teams freeze independent conditions and students see only their own results',async()=>{
  const{room}=await roomForExtraction();for(const t of Object.values(room.state.teams)){assert.equal(t.stage,'extraction');assert.equal(t.extraction.rosterStudentIds.length,3);assert.equal(t.extraction.deadlineAt-t.extraction.stageEnteredAt,300000);}
  const s=(await request(room,'/state?deviceId=s0')).body;assert.equal(s.teams.length,1);assert.equal(s.teams[0].extraction.result.status,'not_started');assert.equal(s.teams[0].extraction.resultsByStudentId,undefined);assert.equal(s.teams[0].members[1].difficultyPolicy,undefined);
});
test('command replay produces one result; stale and modified condition payloads are rejected',async()=>{
  const{room}=await roomForExtraction();await cmd(room,'extraction.start',{deviceId:'s0',mapRevision:revision});
  const commandId=crypto.randomUUID(),body={type:'extraction.complete',deviceId:'s0',commandId,...summary({checkpoint:'C',outcome:'extracted'})};
  await request(room,'/command',body);await request(room,'/command',body);assert.equal(room.state.events.filter(e=>e.type==='extraction.complete').length,1);
  await cmd(room,'extraction.start',{deviceId:'s1',mapRevision:revision});assert.equal((await cmd(room,'extraction.checkpoint',{deviceId:'s1',...summary({equipment:'scanner'})})).status,422);
  await cmd(room,'extraction.checkpoint',{deviceId:'s1',...summary({checkpoint:'C'})});assert.equal((await cmd(room,'extraction.checkpoint',{deviceId:'s1',...summary()})).status,409);
});
test('third disconnected teammate receives a neutral shared-window closure and cannot block epilogues',async()=>{
  const{room}=await roomForExtraction();for(const deviceId of ['s0','s1']){await cmd(room,'extraction.start',{deviceId,mapRevision:revision});await cmd(room,'extraction.complete',{deviceId,...summary({checkpoint:'C',outcome:'extracted'})});}
  room.state.teams['team-1'].extraction.deadlineAt=Date.now()-1;await request(room,'/state?deviceId=s0');assert.equal(room.state.teams['team-1'].stage,'victory');assert.equal(room.state.teams['team-1'].extraction.resultsByStudentId.s2.outcome,'advanced');assert.equal(room.state.teams['team-2'].stage,'extraction');
});
test('teacher can pause deadlines, enable accessible route, and advance only unfinished players',async()=>{
  const{room}=await roomForExtraction();const ex=room.state.teams['team-1'].extraction,deadline=ex.deadlineAt;
  await cmd(room,'teacher.pause',{teacherKey:'teacher'});room.state.pausedAt-=10000;await cmd(room,'teacher.pause',{teacherKey:'teacher'});assert.ok(ex.deadlineAt>=deadline+10000);
  await cmd(room,'teacher.extractionFallback',{teacherKey:'teacher',studentId:'s0'});assert.equal(ex.resultsByStudentId.s0.fallbackUsed,true);
  assert.equal((await cmd(room,'extraction.complete',{deviceId:'s0',...summary({fallbackUsed:true,fallbackStep:2,outcome:'fallback_extracted'})})).status,422);
  await cmd(room,'extraction.complete',{deviceId:'s0',...summary({checkpoint:'C',fallbackUsed:true,fallbackStep:3,outcome:'fallback_extracted'})});
  await cmd(room,'teacher.finishExtraction',{teacherKey:'teacher',teamId:'team-1'});assert.equal(ex.resultsByStudentId.s0.outcome,'fallback_extracted');assert.equal(ex.resultsByStudentId.s1.outcome,'advanced');assert.equal(room.state.teams['team-1'].stage,'victory');
  assert.equal((await cmd(room,'teacher.finishExtraction',{deviceId:'s3',teamId:'team-2'})).status,403);
});
test('Durable Object restart retains checkpoint, integrity and report evidence without changing mastery',async()=>{
  const{room,ctx}=await roomForExtraction();await cmd(room,'extraction.start',{deviceId:'s3',mapRevision:revision});await cmd(room,'extraction.detected',{deviceId:'s3',...summary()});const before=room.report().students.map(s=>[s.firstAttemptCorrect,s.masteryStatus]);
  const restarted=new QuestSession(ctx);const response=await request(restarted,'/state?deviceId=s3');assert.equal(response.body.teams[0].extraction.result.checkpoint,'B');assert.equal(response.body.teams[0].extraction.result.integrityRemaining,2);
  await cmd(restarted,'teacher.finishExtraction',{teacherKey:'teacher'});const report=restarted.report();assert.deepEqual(report.students.map(s=>[s.firstAttemptCorrect,s.masteryStatus]),before);assert.equal(report.gameplayEvidence.length,6);assert.ok(report.gameplayEvidence.every(e=>e.evidenceType==='engagement.gameplay'));assert.match(restarted.reportCsv(),/EXTRACTION · ENGAGEMENT EVIDENCE/);
});
test('empty or malformed numeric input never counts as a wrong attempt',async()=>{
  const ctx=store(),room=new QuestSession(ctx);await request(room,'/init',{code:'FORMAT',teacherKey:'t',config:{teamNames:['Solo'],modules:[{id:'exponent.negative',itemCount:3}]}});const pin=room.state.teams['team-1'].pin;
  await cmd(room,'student.join',{deviceId:'s',alias:'Solo',teamPin:pin});await cmd(room,'teacher.start',{teacherKey:'t'});await cmd(room,'briefing.ready',{deviceId:'s'});
  await cmd(room,'math.submit',{deviceId:'s',answer:'1/0'});assert.equal(room.state.attempts.length,0);assert.equal(room.state.students.s.currentItem.attempts,0);
});

test('intensive review snapshots above one storage value restore complete assessment evidence',async()=>{
  const {room,ctx}=await roomForExtraction();
  room.state.attempts=Array.from({length:4600},(_,i)=>({studentId:`s${i%6}`,itemId:`q${i}`,prompt:'A substantial teacher-authored question. '.repeat(18),answer:'4',firstAttempt:true,correct:true,moduleTitle:'Review'}));
  assert.ok(JSON.stringify(room.state).length>2000000);await room.save();assert.equal((await ctx.storage.get('state'))._snapshotFormat,'mathquest-chunks-v1');
  const restored=new QuestSession(ctx);await restored.ready;assert.equal(restored.state.attempts.length,4600);assert.equal(restored.state.attempts[4599].itemId,'q4599');assert.equal(restored.state.teams['team-1'].extraction.rosterStudentIds.length,3);
});
