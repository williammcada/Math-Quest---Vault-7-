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
test('standalone setup, start, pause, restart cancellation and confirmed reset',async()=>{
  const h=harness();try{
    assert.match(h.$('#overlay-title').textContent,/Industrial Shooter/);
    h.$('input[value=armor]').checked=true;await h.$('#start').onclick();assert.equal(h.$('#overlay').hidden,true);assert.match(h.$('#health').textContent,/● ● ● ●/);
    h.$('#pause').click();assert.equal(h.$('#overlay').hidden,false);assert.ok(h.$('#resume'));h.$('#resume').click();assert.equal(h.$('#overlay').hidden,true);
    h.$('#restart').click();assert.ok(h.$('#cancel-restart'));h.$('#cancel-restart').click();assert.ok(h.$('#resume'));h.$('#resume').click();assert.equal(h.$('#overlay').hidden,true);
    h.$('#restart').click();h.$('#confirm-restart').click();assert.ok(h.$('#start'));assert.match(h.$('#overlay-title').textContent,/Industrial Shooter/);
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
