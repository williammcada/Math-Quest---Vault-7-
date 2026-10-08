import test from 'node:test';import assert from 'node:assert/strict';import {Window} from 'happy-dom';
import {GameHost} from '../public/engine/game-host.js';import {blacklineAdapter} from '../public/games/blackline/adapter.js';
const win=new Window({url:'http://localhost'});for(const k of ['window','document','localStorage','Audio'])Object.defineProperty(globalThis,k,{configurable:true,value:k==='window'?win:win[k]});Object.defineProperty(document,'hidden',{configurable:true,value:false});globalThis.requestAnimationFrame=()=>1;globalThis.cancelAnimationFrame=()=>{};win.HTMLCanvasElement.prototype.getContext=()=>null;
test('BLACKLINE guided host pauses audio, records distinct completion and leaves no preview storage',async()=>{
 const root=document.createElement('div');document.body.append(root);let paused=false,sent=0;
 const audio={enabled:true,start:async()=>[],pause:v=>paused=v,effect(){},alarm(){},music(){},destroy(){}};
 const host=new GameHost(root,{adapter:{...blacklineAdapter,createAudio:()=>audio},practice:true,run:{runId:'preview',route:'register',loadout:[],mode:'action',status:'not_started',seq:0},send:()=>sent++});
 await host.start();root.querySelector('[data-assist]').click();assert.equal(paused,true);
 for(let i=0;i<6;i++)root.querySelector('.nf-overlay button').click();assert.equal(host.s.outcome,'assisted_completed');assert.equal(sent,0);assert.equal(localStorage.length,0);assert.equal(root.querySelector('[data-map]').hidden,true);host.destroy();root.remove();
});
test.after(()=>win.happyDOM.abort());
