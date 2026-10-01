import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {Window} from 'happy-dom';

function harness(){
  const window=new Window({width:1000,height:600,url:'http://localhost/practice-shooter-standalone.html',settings:{enableJavaScriptEvaluation:true}});
  const html=readFileSync(new URL('../public/practice-shooter-standalone.html',import.meta.url),'utf8'),script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
  window.HTMLCanvasElement.prototype.getContext=()=>new Proxy({},{get:()=>()=>{},set:()=>true});
  window.requestAnimationFrame=()=>1;window.document.write(html.replace(/<script>[\s\S]*?<\/script>/,''));window.eval(script);
  const $=s=>window.document.querySelector(s);return {window,$,close:()=>window.happyDOM.abort()};
}
function pointer(h,target,type,id,x=90,y=50,extra={}){target.dispatchEvent(new h.window.PointerEvent(type,{bubbles:true,cancelable:true,pointerId:id,pointerType:'touch',buttons:type==='pointerup'?0:1,clientX:x,clientY:y,...extra}));}
function nativeEnd(h,type,targets){const e=new h.window.Event(type,{bubbles:true});Object.defineProperty(e,'touches',{value:targets.map(target=>({target}))});h.window.dispatchEvent(e);}
async function playing(){const h=harness();await h.$('#start').onclick();h.$('#pad').getBoundingClientRect=()=>({x:0,y:0,width:100,height:100});return h;}
test('standalone setup, start, pause, restart cancellation and confirmed reset',async()=>{
  const h=harness();try{
    assert.match(h.$('#overlay-title').textContent,/Industrial Shooter/);
    h.$('input[value=armor]').checked=true;await h.$('#start').onclick();assert.equal(h.$('#overlay').hidden,true);assert.match(h.$('#health').textContent,/● ● ● ●/);
    h.$('#pause').click();assert.equal(h.$('#overlay').hidden,false);assert.ok(h.$('#resume'));h.$('#resume').click();assert.equal(h.$('#overlay').hidden,true);
    h.$('#restart').click();assert.ok(h.$('#cancel-restart'));h.$('#cancel-restart').click();assert.ok(h.$('#resume'));h.$('#resume').click();assert.equal(h.$('#overlay').hidden,true);
    h.$('#restart').click();h.$('#confirm-restart').click();assert.ok(h.$('#start'));assert.match(h.$('#overlay-title').textContent,/Industrial Shooter/);
  }finally{await h.close();}
});

test('capture failure, outside release and lost capture always release the correct control',async()=>{
  const h=await playing();try{const p=h.$('#pad'),j=h.$('#jump');p.setPointerCapture=()=>{throw Error('capture unavailable');};
    pointer(h,p,'pointerdown',1);assert.equal(p.dataset.x,'1');pointer(h,h.window,'pointermove',1,50,10);assert.equal(p.dataset.y,'-1');
    pointer(h,h.window,'pointermove',1,250,50);assert.equal(p.dataset.x,'0');pointer(h,h.window,'pointermove',1);assert.equal(p.dataset.x,'1');
    pointer(h,j,'pointerdown',2);pointer(h,h.window,'pointerup',1);assert.equal(p.dataset.x,'0');assert.match(j.className,/held/);
    pointer(h,h.window,'lostpointercapture',2);assert.doesNotMatch(j.className,/held/);
    pointer(h,p,'pointerdown',3);pointer(h,h.window,'pointermove',3,90,50,{buttons:0});assert.equal(p.dataset.x,'0');
  }finally{await h.close();}
});
test('native touch reconciliation repairs a missing pointer release in both thumb release orders',async()=>{
  const h=await playing();try{const p=h.$('#pad'),j=h.$('#jump');
    for(const first of ['pad','jump']){pointer(h,p,'pointerdown',11);pointer(h,j,'pointerdown',12);
      nativeEnd(h,'touchend',[first==='pad'?j:p]);assert.equal(p.dataset.x,first==='pad'?'0':'1');assert.equal(j.classList.contains('held'),first==='pad');
      nativeEnd(h,'touchend',[]);assert.equal(p.dataset.x,'0');assert.equal(j.classList.contains('held'),false);
    }
    pointer(h,p,'pointerdown',21);pointer(h,j,'pointerdown',22);nativeEnd(h,'touchcancel',[]);assert.equal(p.dataset.x,'0');assert.equal(j.classList.contains('held'),false);
    pointer(h,p,'pointerdown',31);assert.equal(p.dataset.x,'1');pointer(h,h.window,'pointerup',31);assert.equal(p.dataset.x,'0');
  }finally{await h.close();}
});
test('rapid slides/taps, interruption and fresh input do not retain old contacts',async()=>{
  const h=await playing();try{const p=h.$('#pad'),j=h.$('#jump');
    for(let n=1;n<=20;n++){pointer(h,p,'pointerdown',n);pointer(h,h.window,'pointermove',n,80,20);assert.equal(p.dataset.y,'-1');pointer(h,h.window,n%2?'pointercancel':'pointerup',n);assert.equal(p.dataset.x,'0');assert.equal(p.dataset.y,'0');}
    for(const type of ['blur','pagehide','orientationchange','resize']){pointer(h,p,'pointerdown',41);pointer(h,j,'pointerdown',42);h.window.dispatchEvent(new h.window.Event(type));assert.equal(p.dataset.x,'0');assert.equal(j.classList.contains('held'),false);assert.ok(h.$('#resume'));h.$('#resume').click();pointer(h,p,'pointerdown',51);assert.equal(p.dataset.x,'1');pointer(h,h.window,'pointerup',51);}
    h.window.dispatchEvent(new h.window.KeyboardEvent('keydown',{key:'ArrowRight'}));h.window.dispatchEvent(new h.window.KeyboardEvent('keydown',{key:'d'}));h.window.dispatchEvent(new h.window.KeyboardEvent('keyup',{key:'d'}));assert.equal(p.dataset.x,'1');h.window.dispatchEvent(new h.window.KeyboardEvent('keyup',{key:'ArrowRight'}));assert.equal(p.dataset.x,'0');
  }finally{await h.close();}
});
test('keyboard input, help/resume, fire toggle, and blur pause work in the packaged HTML',async()=>{
  const h=harness();try{
    await h.$('#start').onclick();h.window.dispatchEvent(new h.window.KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));assert.equal(h.$('#pad').dataset.x,'1');
    h.window.dispatchEvent(new h.window.KeyboardEvent('keyup',{key:'ArrowRight',bubbles:true}));assert.equal(h.$('#pad').dataset.x,'0');
    h.$('#fire').click();assert.equal(h.$('#fire').getAttribute('aria-pressed'),'false');h.$('#help').click();assert.ok(h.$('#help-back'));h.$('#help-back').click();assert.equal(h.$('#overlay').hidden,true);
    h.window.dispatchEvent(new h.window.Event('blur'));assert.ok(h.$('#resume'));assert.equal(h.$('#pad').dataset.x,'0');
  }finally{await h.close();}
});
