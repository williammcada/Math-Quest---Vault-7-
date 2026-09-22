import test from 'node:test';
import assert from 'node:assert/strict';
import {Window} from 'happy-dom';
import {StealthRuntime,fallbackScene} from '../public/stealth.js';
const win=new Window({url:'http://localhost',settings:{disableCSSFileLoading:true,disableJavaScriptFileLoading:true}});
for(const key of ['window','document','localStorage','Image','matchMedia'])Object.defineProperty(globalThis,key,{configurable:true,value:key==='window'?win:key==='matchMedia'?win.matchMedia.bind(win):win[key]});
Object.defineProperty(document,'hidden',{configurable:true,value:false});
Object.defineProperty(globalThis,'requestAnimationFrame',{configurable:true,value:()=>1});Object.defineProperty(globalThis,'cancelAnimationFrame',{configurable:true,value:()=>{}});
const drawing=new Proxy({},{get:()=>()=>{},set:()=>true});win.HTMLCanvasElement.prototype.getContext=()=>drawing;
const terminal=['extracted','captured','timeout','fallback_extracted','advanced'];
function fixture(equipment='scanner'){
  const result={status:'not_started',outcome:null,checkpoint:null,activeElapsedMs:0,detections:0,integrityRemaining:3,fallbackUsed:false,fallbackStep:0,resourcesUsed:[]};
  const ex={stageEnteredAt:Date.now()+Math.random(),deadlineAt:Date.now()+300000,route:'shaft',equipment,adverseCount:0,result,rosterCount:2,completedCount:0};
  const team={id:'t',stage:'extraction',finalAction:'copy',extraction:ex};const sent=[];let offline=false;
  globalThis.fetch=async(url,options)=>{if(offline)throw Error('Network offline');const payload=JSON.parse(options.body);sent.push(payload);assert.match(payload.type,/^extraction\./);
    if(payload.type==='extraction.start')result.status='active';else if(payload.type==='extraction.switchFallback'){result.fallbackUsed=true;result.status='active';}
    else Object.assign(result,payload,{status:payload.type==='extraction.complete'?'terminal':'active'});
    if(terminal.includes(result.outcome))ex.completedCount=1;
    return new Response(JSON.stringify({teams:[team],paused:false,revision:sent.length}));
  };
  const root=document.createElement('div');document.body.append(root);
  const runtime=new StealthRuntime(root,{session:crypto.randomUUID(),studentId:'student',deviceId:'student',endpoint:'/command',team,paused:false,onState(){}});
  return{root,runtime,team,sent,setOffline:value=>offline=value,cleanup(){runtime.destroy();root.remove();}};
}
const drain=async runtime=>{for(let i=0;i<30;i++){await new Promise(r=>setTimeout(r,1));if(!runtime.flushing&&!runtime.queue.length)break;}};
test('live runtime keeps canvas and input node identity across polling, pause and checkpoint save',async()=>{
  const f=fixture();try{
    const canvas=f.root.querySelector('canvas'),control=f.root.querySelector('[data-game-key=right]');f.root.querySelector('[data-run=start]').click();await drain(f.runtime);
    f.runtime.update(f.team,false);assert.equal(canvas,f.root.querySelector('canvas'));assert.equal(control,f.root.querySelector('[data-game-key=right]'));
    f.runtime.input.right=true;f.runtime.update(f.team,true);assert.equal(f.runtime.input.right,undefined);assert.match(f.root.querySelector('.stealth-overlay').textContent,/Mission paused/);
    f.runtime.update(f.team,false);f.runtime.sim.checkpoint='B';f.runtime.enqueue('checkpoint',{type:'checkpoint'});await drain(f.runtime);assert.equal(f.sent.at(-1).type,'extraction.checkpoint');assert.equal(f.team.extraction.result.checkpoint,'B');
  }finally{f.cleanup();}
});
test('accessible extraction supports confirmation, toolkit payoff and terminal evidence',async()=>{
  const f=fixture('toolkit');try{
    f.runtime.switchFallback();await drain(f.runtime);assert.equal(f.runtime.fallback,true);assert.equal(f.team.extraction.result.fallbackUsed,true);
    const first=fallbackScene('shaft',0,'toolkit',0);f.root.querySelector(`[data-fallback-choice="${first.correct}"]`).click();f.root.querySelector('[data-run=confirm-choice]').click();await drain(f.runtime);assert.equal(f.runtime.fallbackStep,1);
    f.root.querySelector('[data-run=next-scene]').click();await drain(f.runtime);assert.equal(f.runtime.fallbackStep,2);assert.match(f.root.querySelector('.fallback-feedback').textContent,/Toolkit/);
    f.root.querySelector('[data-run=next-scene]').click();const last=fallbackScene('shaft',2,'toolkit',0);f.root.querySelector(`[data-fallback-choice="${last.correct}"]`).click();
    const confirm=f.root.querySelector('[data-run=hold-final]');confirm.dispatchEvent(new win.PointerEvent('pointerdown',{bubbles:true}));await new Promise(r=>setTimeout(r,640));await drain(f.runtime);
    assert.equal(f.team.extraction.result.outcome,'fallback_extracted');assert.equal(f.team.extraction.result.fallbackStep,3);assert.equal(f.runtime.sim.state,'terminal');
  }finally{f.cleanup();}
});
test('offline queue is stored and recovery preserves detections without resetting to full integrity',async()=>{
  const f=fixture();try{
    f.runtime.start();await drain(f.runtime);f.setOffline(true);f.runtime.sim.checkpoint='B';f.runtime.sim.detections=1;f.runtime.sim.integrity=2;f.runtime.enqueue('detected');await drain(f.runtime);
    f.runtime.lastContact=Date.now()-31000;f.runtime.checkConnection();assert.equal(f.runtime.networkPaused,true);const stored=JSON.parse(localStorage.getItem(f.runtime.key));assert.equal(stored.summary.checkpoint,'B');assert.equal(stored.queue.length,1);
    f.setOffline(false);await f.runtime.flush();assert.equal(f.team.extraction.result.detections,1);assert.equal(f.team.extraction.result.integrityRemaining,2);assert.equal(f.runtime.localPaused,true);assert.equal(f.runtime.queue.length,0);
  }finally{f.cleanup();}
});
test('a missing canvas context still allows the full accessible route entry',async()=>{
  win.HTMLCanvasElement.prototype.getContext=()=>null;const f=fixture();try{assert.equal(f.runtime.fallback,true);f.runtime.start();await drain(f.runtime);assert.equal(f.root.querySelector('.stealth-fallback').hidden,false);assert.ok(f.root.querySelector('[data-fallback-choice]'));}finally{f.cleanup();win.HTMLCanvasElement.prototype.getContext=()=>drawing;}
});
test.after(()=>win.happyDOM.abort());

test('touch release outside a button and opposite direction clear stale movement',async()=>{
 const f=fixture();try{
  f.runtime.start();await drain(f.runtime);
  const right=f.root.querySelector('[data-game-key=right]'),left=f.root.querySelector('[data-game-key=left]');
  right.dispatchEvent(new win.PointerEvent('pointerdown',{bubbles:true,pointerId:1,buttons:1}));assert.equal(f.runtime.input.right,true);
  left.dispatchEvent(new win.PointerEvent('pointerdown',{bubbles:true,pointerId:2,buttons:1}));assert.equal(f.runtime.input.right,true);assert.equal(f.runtime.input.left,true);
  win.dispatchEvent(new win.PointerEvent('pointerup',{pointerId:2,buttons:0}));win.dispatchEvent(new win.PointerEvent('pointerup',{pointerId:1,buttons:0}));assert.ok(!f.runtime.input.left);
  right.dispatchEvent(new win.PointerEvent('pointerdown',{bubbles:true,pointerId:3,buttons:1}));win.dispatchEvent(new win.PointerEvent('pointermove',{pointerId:3,buttons:0}));assert.ok(!f.runtime.input.right);
  f.runtime.input.right=true;f.root.querySelector('[data-run=reset-input]').click();assert.deepEqual(f.runtime.input,{});assert.equal(f.runtime.localPaused,true);
 }finally{f.cleanup();}
});
test('developer practice completes without network commands or network pause',async()=>{
 const f=fixture();try{
  f.runtime.options.developerMode=true;f.runtime.start();f.runtime.sim.state='terminal';f.runtime.sim.outcome='extracted';f.runtime.enqueue('complete');await drain(f.runtime);
  assert.equal(f.sent.length,0);assert.equal(f.runtime.queue.length,0);
  f.runtime.sim.state='playing';f.runtime.lastContact=0;f.runtime.checkConnection();assert.equal(f.runtime.networkPaused,false);
 }finally{f.cleanup();}
});
test('sound switch resumes audio within its interaction and plays a preview',async()=>{
 let resumes=0,starts=0;
 win.AudioContext=class{constructor(){this.state='suspended';this.currentTime=0;this.destination={};}async resume(){resumes++;this.state='running';}createOscillator(){return{frequency:{},connect(node){return node;},start(){starts++;},stop(){}};}createGain(){return{gain:{setValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){}};}close(){}};
 const f=fixture();try{const box=f.root.querySelector('[data-option=sound]');box.checked=true;box.dispatchEvent(new win.Event('change',{bubbles:true}));await Promise.resolve();assert.equal(resumes,1);assert.equal(starts,1);}finally{f.cleanup();delete win.AudioContext;}
});
