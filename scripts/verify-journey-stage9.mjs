import {createRequire} from 'node:module';
import path from 'node:path';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.JOURNEY_PLAYWRIGHT);
const browser=await chromium.launch({executablePath:process.env.JOURNEY_CHROMIUM,args:['--no-sandbox','--disable-dev-shm-usage','--autoplay-policy=no-user-gesture-required']});
const page=await browser.newPage({viewport:{width:1280,height:800}}),errors=[];
page.on('pageerror',e=>errors.push(e.message));
const out='docs/verification/journey-stage9';await fs.mkdir(out,{recursive:true});
try{
 await page.goto('file://'+path.resolve('deliverables/Journey-Solo-Practice-stage9.html'));
 await page.waitForFunction(()=>!document.querySelector('#start').disabled,{timeout:30000});
 const assets=await page.evaluate(()=>Object.entries(practice.renderer.images).map(([key,i])=>({key,width:i.naturalWidth,height:i.naturalHeight})));
 assert.ok(assets.every(i=>i.width>0));assert.ok(assets.some(i=>i.key==='baozi'));
 await page.click('#start');await page.waitForFunction(()=>practice.model?.s.phase==='running');
 await page.evaluate(()=>{practice.model.player('you').protectionMs=1e8;});
 let before=await page.evaluate(()=>practice.model.player('you').x);
 await page.keyboard.down('d');await page.waitForTimeout(220);await page.keyboard.up('d');
 assert.ok(await page.evaluate(()=>practice.model.player('you').x)>before+10);
 await page.keyboard.press('Space');await page.waitForTimeout(50);assert.ok(await page.evaluate(()=>practice.model.player('you').jumpMs)>0);
 assert.equal(await page.evaluate(()=>practice.model.s.pauses.length),0);
 await page.keyboard.press('z');await page.waitForTimeout(60);assert.ok(await page.evaluate(()=>practice.model.s.events.some(e=>e.type==='attack')));
 await page.keyboard.down('d');await page.keyboard.press('Escape');await page.keyboard.up('d');
 assert.ok(await page.evaluate(()=>practice.model.s.pauses.includes('practice')));
 const x=await page.evaluate(()=>practice.model.player('you').x);await page.waitForTimeout(200);assert.equal(await page.evaluate(()=>practice.model.player('you').x),x);
 await page.keyboard.press('Enter');await page.waitForTimeout(100);assert.equal(await page.evaluate(()=>practice.model.s.pauses.length),0);
 await page.waitForTimeout(750);await page.keyboard.press('c');await page.waitForTimeout(60);assert.equal(await page.evaluate(()=>practice.model.player('you').magic),0);
 // Test the actual crate hit/break event path without changing attack logic.
 await page.evaluate(()=>{const m=practice.model,p=m.player('you'),crate=m.s.props[0];p.x=crate.x-35;p.y=crate.y;p.actionMs=0;p.specialState=null;p.horseMs=0;m.s.enemies=[];m.s.level.queue=[];m.s.level.enteredAt=m.s.activeMs+1e6;});
 await page.keyboard.down('j');await page.waitForTimeout(900);await page.keyboard.up('j');
 assert.ok(await page.evaluate(()=>practice.model.s.events.some(e=>e.type==='propHit')));
 assert.ok(await page.evaluate(()=>practice.model.s.events.some(e=>e.type==='break')));
 // Keep both new pickups visible for visual review; this fixture does not test balance.
 await page.evaluate(()=>{const m=practice.model;m.s.pickups=[{id:'art-health',kind:'health',x:450,y:285},{id:'art-magic',kind:'magic',x:540,y:285}];m.s.props=[{id:'art-crate',x:640,y:290,hp:16}];m.player('you').x=320;m.player('you').y=290;});
 await page.waitForTimeout(80);await page.screenshot({path:out+'/solo-artwork.png'});
 // Force death while a movement key is held; automatic respawn must neutralize it.
 await page.keyboard.down('d');await page.evaluate(()=>{const m=practice.model,p=m.player('you');p.protectionMs=0;p.hurtMs=0;m.hurt(p,1000);});
 await page.waitForTimeout(2150);await page.keyboard.up('d');
 assert.equal(await page.evaluate(()=>practice.model.player('you').input.x),0);
 assert.equal(await page.evaluate(()=>practice.model.player('you').lives),2);
 await page.keyboard.down('a');await page.waitForTimeout(100);await page.keyboard.up('a');
 await page.evaluate(()=>window.dispatchEvent(new Event('blur')));assert.ok(await page.evaluate(()=>practice.model.s.pauses.includes('practice')));
 await page.keyboard.press('Enter');
 // Offline render checks actual Web Audio nodes/envelopes, not merely mock calls.
 const sound=await page.evaluate(async()=>{
  const results=[];
  for(const type of ['attack','jump','propHit','break','hurt']){
   const a=new practice.audio.constructor();a.ctx=new OfflineAudioContext(1,44100,44100);a.fx(type,'wukong');
   const buffer=await a.ctx.startRendering(),data=buffer.getChannelData(0);let peak=0,sum=0,nonzero=0;
   for(const v of data){peak=Math.max(peak,Math.abs(v));sum+=v*v;if(Math.abs(v)>.0001)nonzero++;}
   results.push({type,peak,rms:Math.sqrt(sum/data.length),nonzero});
  }
  return results;
 });
 for(const s of sound){assert.ok(s.peak>.02&&s.peak<1,JSON.stringify(s));assert.ok(s.nonzero>1500,JSON.stringify(s));}
 assert.equal(new Set(sound.map(s=>s.nonzero)).size,5);
 // Responsive standalone view retains controls, including audio buttons.
 for(const [width,height] of [[844,390],[568,320],[390,844]]){
  await page.setViewportSize({width,height});await page.waitForTimeout(50);
  const bounds=await page.locator('[data-jkey],#music,#effects,#pause,#exit').evaluateAll(nodes=>nodes.map(n=>{const r=n.getBoundingClientRect();return {x:r.x,y:r.y,right:r.right,bottom:r.bottom}}));
  for(const r of bounds)assert.ok(r.x>=0&&r.y>=0&&r.right<=width+1&&r.bottom<=height+1,JSON.stringify({width,height,r}));
 }
 assert.deepEqual(errors,[]);
 const report={passed:true,build:'jttw-0.1.0-stage9-feedback',browser:await browser.version(),assets:assets.length,checks:['offline file-open and all artwork','WASD release','Space jump','Z attack','C magic','Escape pause and Enter resume','container hit and break events','death/respawn neutral input','blur pause','three responsive layouts','five actual OfflineAudioContext renders'],sound,limitations:['No human listening acceptance','No physical Windows/iOS or school network test','Visual fixture is not balance acceptance']};
 await fs.writeFile(out+'/solo.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));
}finally{await browser.close();}
