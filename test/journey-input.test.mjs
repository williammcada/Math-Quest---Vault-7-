import test from 'node:test';
import assert from 'node:assert/strict';
import {Window} from 'happy-dom';
import {bindJourneyInput} from '../public/games/journey/input.js';
import {JourneyHost} from '../public/games/journey/host.js';

function fixture(){
 const win=new Window(),root=win.document.createElement('div');win.document.body.append(root);
 root.innerHTML='<div class="j-hud">Lives</div><div data-dpad></div><button data-jkey="attack"></button><button data-jkey="jump"></button><button data-jkey="magic"></button><input>';
 const ac=new win.AbortController();let value,blocked=false;
 const binding=bindJourneyInput(root,v=>value=v,{signal:ac.signal,blocked:()=>blocked});
 const zones=[...root.querySelectorAll('[data-held-input]')];zones.forEach((el,i)=>{el.getBoundingClientRect=()=>({left:i*200,right:i*200+100,top:0,bottom:100,width:100,height:100});el.setPointerCapture=()=>{throw Error('no capture');};});
 const touch=(type,changed,touches)=>{const e=new win.Event(type,{bubbles:true,cancelable:true});Object.assign(e,{changedTouches:changed,touches});(changed[0]?.target||root).dispatchEvent(e);};
 const point=(id,zone=0,x=90,y=50)=>({identifier:id,target:zones[zone],clientX:zone*200+x,clientY:y});
 return {win,root,ac,binding,zones,touch,point,get value(){return value;},set blocked(v){blocked=v;}};
}
test('Journey diagonal pad plus attack preserves each finger through both release orders',()=>{
 for(const first of ['direction','attack']){const f=fixture(),d=f.point(1,0,90,10),a=f.point(2,1,50);
 f.touch('touchstart',[d],[d]);f.touch('touchstart',[a],[d,a]);assert.deepEqual(f.value,{x:1,y:-1,attack:true,jump:false,magic:false});
 const end=first==='direction'?d:a,keep=first==='direction'?a:d;f.touch('touchend',[end],[keep]);assert.equal(f.value.attack,first==='direction');assert.equal(f.value.x,first==='direction'?0:1);
 f.touch('touchend',[keep],[]);assert.deepEqual(f.value,{x:0,y:0,attack:false,jump:false,magic:false});f.ac.abort();}
});
test('Journey pad outside boundary, lost native release and fresh input after interruption',()=>{
 const f=fixture(),d=f.point(1);f.touch('touchstart',[d],[d]);assert.equal(f.value.x,1);
 const outside=f.point(1,0,120);f.touch('touchmove',[outside],[outside]);assert.equal(f.value.x,0);
 f.touch('touchmove',[d],[d]);assert.equal(f.value.x,1);f.touch('touchmove',[],[]);assert.equal(f.value.x,0);
 f.touch('touchstart',[d],[d]);f.win.dispatchEvent(new f.win.Event('resize'));f.touch('touchmove',[d],[d]);assert.equal(f.value.x,0);
 f.touch('touchstart',[d],[d]);assert.equal(f.value.x,1);f.blocked=true;f.binding.poll();assert.equal(f.value.x,0);f.ac.abort();
});
test('Journey HUD menu interruption neutralizes movement; math input retains selection',()=>{
 const f=fixture(),d=f.point(1);f.touch('touchstart',[d],[d]);
 const menu=new f.win.Event('contextmenu',{bubbles:true,cancelable:true});f.root.querySelector('.j-hud').dispatchEvent(menu);assert.equal(menu.defaultPrevented,true);assert.equal(f.value.x,0);
 const edit=new f.win.Event('contextmenu',{bubbles:true,cancelable:true});f.root.querySelector('input').dispatchEvent(edit);assert.equal(edit.defaultPrevented,false);f.ac.abort();
});
test('Journey reset drops queued one-shot actions and transmits a neutral frame',()=>{
 const sent=[],h=Object.create(JourneyHost.prototype);h.input={clear(){}};h.seq=2;h.keys={x:1,magic:true};h.edges={jump:true,magic:true};h.wsSend=m=>sent.push(m);
 h.resetInput();assert.deepEqual(h.edges,{jump:false,magic:false});assert.deepEqual(sent[0],{type:'input',seq:3,x:0,y:0,attack:false,jump:false,magic:false});
});
test('Journey death and respawn snapshots both require fresh input',()=>{
 const h=Object.create(JourneyHost.prototype);let resets=0;h.id='p';h.runId='r';h.renderer={set(){}};h.audio={sync(){}};h.root={querySelector:()=>({})};h.resetInput=()=>resets++;h.renderPrep=h.renderHud=()=>{};
 const snapshot=(lives,respawnMs)=>({runId:'r',phase:'running',paused:false,players:[{id:'p',lives,respawnMs,started:true}]});
 h.snap=snapshot(3,0);h.receive(snapshot(2,2000));assert.equal(resets,1);h.receive(snapshot(2,1900));assert.equal(resets,1);h.receive(snapshot(2,0));assert.equal(resets,2);
});

test('keyboard aliases support simultaneous actions, independent release and editable fields',()=>{
 const f=fixture();const key=(type,k,code,target=f.win)=>target.dispatchEvent(new f.win.KeyboardEvent(type,{key:k,code,bubbles:true,cancelable:true}));
 key('keydown','d','KeyD');key('keydown','z','KeyZ');key('keydown',' ','Space');
 assert.deepEqual(f.value,{x:1,y:0,attack:true,jump:true,magic:false});
 key('keyup',' ','Space');assert.equal(f.value.jump,false);assert.equal(f.value.attack,true);
 key('keydown','c','KeyC');assert.equal(f.value.magic,true);key('keyup','z','KeyZ');assert.equal(f.value.attack,false);assert.equal(f.value.x,1);
 f.win.dispatchEvent(new f.win.Event('blur'));assert.deepEqual(f.value,{x:0,y:0,attack:false,jump:false,magic:false});
 key('keydown','x','KeyX',f.root.querySelector('input'));assert.equal(f.value.jump,false);
 key('keydown','x','KeyX');assert.equal(f.value.jump,true);key('keyup','x','KeyX');assert.equal(f.value.jump,false);f.ac.abort();
});
