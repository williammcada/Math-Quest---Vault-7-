import assert from 'node:assert/strict';
import {QuestSession} from './authenticated-session.mjs';
const context=()=>{const data=new Map();return {storage:{get:async k=>structuredClone(data.get(k)),put:async(k,v)=>data.set(k,structuredClone(v)),async setAlarm(v){this.alarmAt=v;},async deleteAlarm(){this.alarmAt=null;},async deleteAll(){data.clear();}},blockConcurrencyWhile:fn=>fn()};};
export async function call(r,path,body){const response=await r.fetch(new Request('https://test'+path,body?{method:'POST',body:JSON.stringify(body)}:{}));return {...await response.json(),http:response.status};}
export const cmd=(r,type,extra={})=>call(r,'/command',{type,commandId:crypto.randomUUID(),...extra});
export async function fixture({gates=3,route='pumps',size=2,prepare=0}={}){
 const ctx=context(),r=new QuestSession(ctx);await call(r,'/init',{code:'IRON',teacherKey:'teacher',config:{cartridgeId:'ironbreak',gateCount:gates,teamNames:['Crew'],modules:[{id:'number.gcf',itemCount:gates,band:'beginner'}]}});
 const t=r.state.teams['team-1'];for(let i=0;i<size;i++)await cmd(r,'student.join',{deviceId:'s'+i,alias:'S'+i,teamPin:t.pin});
 await cmd(r,'teacher.start',{teacherKey:'teacher'});for(let i=0;i<size;i++)await cmd(r,'briefing.ready',{deviceId:'s'+i});
 const answerGate=async()=>{for(const s of r.members(t.id))while(!s.gateComplete){await call(r,'/state?deviceId='+s.id);const out=await cmd(r,'math.submit',{deviceId:s.id,answer:s.currentItem.answer});assert.equal(out.http,200,out.error);}};
 await answerGate();assert.equal(t.stage,'decision');
 for(const s of r.members(t.id))await cmd(r,'choice.vote',{deviceId:s.id,choice:route});
 const lead=()=>r.members(t.id)[t.leadIndex%size].id;
 assert.equal((await cmd(r,'choice.resolve',{deviceId:lead()})).http,200);
 while(t.stage==='gate')await answerGate();assert.equal(t.stage,'market');
 if(prepare){await cmd(r,'teacher.setSupply',{teacherKey:'teacher',teamId:t.id,count:2,enabled:true,moduleIds:['number.gcf']});for(let n=0;n<prepare;n++){assert.equal((await cmd(r,'equipment.extend',{deviceId:lead()})).http,200);await answerGate();assert.equal(t.stage,'market');}}
 const items=['spread','armor','agility'].slice(0,1+prepare);
 for(const s of r.members(t.id)){await cmd(r,'market.propose',{deviceId:s.id,items});await cmd(r,'market.ready',{deviceId:s.id});}
 assert.equal((await cmd(r,'market.commit',{deviceId:lead()})).http,200);
 assert.equal((await cmd(r,'market.continue',{deviceId:lead()})).http,200);assert.equal(t.stage,'minigame');
 return {r,t,ctx,lead};
}
export const runCmd=(r,t,action,extra={},id='s0')=>{const a=t.runs[id];return cmd(r,'ironbreak.'+action,{deviceId:id,runId:a.runId,attemptId:a.attemptId,phaseId:a.phaseId,configRevision:a.configRevision,...extra});};
export const progress=(r,t,s,id='s0')=>runCmd(r,t,'progress',{seq:t.runs[id].seq+1,activeElapsedMs:Math.round(s.activeTime*1000),snapshot:s},id);

