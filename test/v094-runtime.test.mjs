import test from 'node:test';
import assert from 'node:assert/strict';
import {Window} from 'happy-dom';
import {QuestSession} from './authenticated-session.mjs';
import {openRescue} from '../src/cartridges/nightfall/rescue-server.js';
import {RescueHost} from '../public/games/nightfall/rescue-host.js';
const win=new Window({url:'https://example.test/public/?session=RUNTIME',settings:{disableCSSFileLoading:true,disableJavaScriptFileLoading:true}});
for(const key of ['window','document','localStorage','Image','location','matchMedia'])Object.defineProperty(globalThis,key,{configurable:true,value:key==='window'?win:key==='matchMedia'?win.matchMedia.bind(win):win[key]});
Object.defineProperty(globalThis,'requestAnimationFrame',{configurable:true,value:()=>1});Object.defineProperty(globalThis,'cancelAnimationFrame',{configurable:true,value:()=>{}});
Object.defineProperty(document,'hidden',{configurable:true,value:false});
win.HTMLCanvasElement.prototype.getContext=()=>null;
async function fixture(){
 const data=new Map(),room=new QuestSession({storage:{get:async k=>structuredClone(data.get(k)),put:async(k,v)=>data.set(k,structuredClone(v))},blockConcurrencyWhile:fn=>fn()});
 const call=async(path,body)=>{const response=await room.fetch(new Request('https://test'+path,body?{method:'POST',body:JSON.stringify(body)}:{}));const result=await response.json();if(!response.ok)throw Error(result.error);return result;};
 await call('/init',{code:'RUNTIME',teacherKey:'teacher',config:{cartridgeId:'nightfall',gateCount:3,teamNames:['Crew'],modules:[{id:'number.gcf',itemCount:3,band:'beginner'}]}});
 const cmd=(type,extra={})=>call('/command',{type,deviceId:'a',commandId:crypto.randomUUID(),...extra});
 for(const id of ['a','b'])await cmd('student.join',{deviceId:id,alias:id,teamPin:room.state.teams['team-1'].pin});await cmd('teacher.start',{teacherKey:'teacher'});
 const t=room.state.teams['team-1'];t.route='clinic';openRescue(room,t);await room.save();
 let offline=false;const root=document.createElement('div');document.body.append(root);
 const mount=async()=>{const state=await call('/state?deviceId=a'),v=state.teams[0].rescue;return new RescueHost(root,{run:v.run,route:v.route,deadline:v.deadline,serverNow:v.serverNow,paused:state.paused,pausedAt:v.pausedAt,send:async(type,extra)=>{if(offline)throw Error('offline');return cmd(type,extra);}});};
 return {room,t,root,cmd,call,mount,setOffline:v=>offline=v};
}
async function flush(h){for(let i=0;i<20&&(h.sending||h.pending);i++){if(h.inFlight)await h.inFlight;await h.flush();}}
test('rescue host records death before enabling retry, preserves canvas and restores issued attempt across reload',async()=>{
 const f=await fixture();let h=await f.mount();try{
  await h.start();const canvas=h.canvas,deadline=f.t.rescue.deadline;h.s.health=0;h.s.outcome='lost';h.s.ammo=11;h.s.shots=4;h.finish();await flush(h);
  assert.equal(f.t.rescue.runs.a.status,'downed',h.status.textContent);assert.equal(f.root.querySelector('[data-retry]').disabled,false);
  await h.retry();assert.equal(h.canvas,canvas);assert.equal(h.s.health,3);assert.equal(h.s.ammo,15);assert.equal(f.t.rescue.runs.a.retries,1);assert.equal(f.t.rescue.deadline,deadline);
  h.s.ammo=13;h.s.shots=2;h.queue();await flush(h);h.destroy();h=await f.mount();assert.equal(h.s.ammo,13);assert.equal(h.run.attempt,2);assert.equal(h.deadline,deadline);
 }finally{h.destroy();f.root.remove();}
});
test('offline reload keeps spent resources; server reconciliation saves them without another Start window',async()=>{
 const f=await fixture();let h=await f.mount();try{
  await h.start();const deadline=h.deadline;f.setOffline(true);h.s.ammo=8;h.s.shots=7;h.queue();await h.inFlight;h.destroy();h=await f.mount();assert.equal(h.s.ammo,8);assert.equal(h.s.shots,7);assert.equal(h.deadline,deadline);
  f.setOffline(false);h.queue();await flush(h);assert.equal(f.t.rescue.runs.a.snapshot.ammo,8,h.status.textContent);assert.equal(f.t.rescue.deadline,deadline);
 }finally{h.destroy();f.root.remove();}
});
test('timer includes delayed Start, local pause and dialogue; teacher pause freezes display and server expiry wins',async()=>{
 const real=Date.now;let now=real();Date.now=()=>now;
 const f=await fixture();let h=await f.mount();try{
  now+=60000;h.draw();assert.match(h.hud.textContent,/Rescue time left: 4:00/);await h.start();h.localPaused=true;now+=30000;h.draw();assert.match(h.hud.textContent,/3:30/);
  await f.cmd('teacher.pause',{teacherKey:'teacher'});let state=await f.call('/state?deviceId=a'),v=state.teams[0].rescue;h.update(v.run,state.paused,v.deadline,v);now+=30000;h.draw();assert.match(h.hud.textContent,/3:30.*Teacher paused/);
  await f.cmd('teacher.pause',{teacherKey:'teacher'});state=await f.call('/state?deviceId=a');v=state.teams[0].rescue;h.update(v.run,state.paused,v.deadline,v);h.s.dialogue=true;h.localPaused=false;h.showOverlay();assert.ok(f.root.querySelector('[data-continue]'));
  now=h.deadline+1;h.tick(performance.now());assert.equal(f.root.querySelector('[data-continue]'),null);assert.equal(f.root.querySelector('[data-retry]'),null);assert.match(h.hud.textContent,/0:00/);await h.start();assert.equal(f.t.rescue.runs.a.attempt,1);
  state=await f.call('/state?deviceId=a');assert.equal(state.teams[0].stage,'gate');assert.equal(state.teams[0].rescue.run.outcome,'time_window_closed');
 }finally{h.destroy();f.root.remove();Date.now=real;}
});
test.after(()=>win.happyDOM.abort());
