import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
const {chromium}=await import(process.env.AERIAL_PLAYWRIGHT_MODULE||'playwright-core');
const browser=await chromium.launch({executablePath:process.env.AERIAL_BROWSER_EXECUTABLE||undefined,args:['--no-sandbox','--disable-dev-shm-usage'],headless:true});
const page=await browser.newPage({viewport:{width:844,height:300},hasTouch:true});
const errors=[],external=[],checks=[];page.on('pageerror',e=>errors.push(e.message));
const base=process.env.AERIAL_TEST_URL||pathToFileURL(resolve('standalone/MathQuest_Aerial_Shooter_v0.2.0.html')).href;
if(!process.env.AERIAL_TEST_URL)await page.route(/^https?:/,r=>{external.push(r.request().url());r.abort();});
const cdp=await page.context().newCDPSession(page);
let pad;
const p=(id,x,y=84)=>({id,x:pad.x+x,y:pad.y+y,radiusX:4,radiusY:4,force:1});
const touch=(type,touchPoints)=>cdp.send('Input.dispatchTouchEvent',{type,touchPoints});
const neutral=()=>page.waitForFunction(()=>Object.keys(aerialReview.host.input).length===0);
const right=()=>page.waitForFunction(()=>aerialReview.host.input.right===true);
const ensureActive=async()=>{if(await page.evaluate(()=>aerialReview.host.paused))await page.click('[data-resume]');};
try{
 await page.goto(base+(base.includes('?')?'&':'?')+'dev');
 // Exercise versioned recovery without overwriting old flights.
 const legacy='{"preserved":"old-flight-marker"}';await page.evaluate(v=>localStorage.setItem('mq-aerial-practice-run',v),legacy);await page.reload();
 assert.match(await page.locator('#save-error').textContent(),/preserved separately/);
 await page.click('#new-flight');await page.waitForFunction(()=>aerialReview.host.art);
 assert.equal(await page.evaluate(()=>aerialReview.host.adapter.durationSeconds),300);
 assert.equal(await page.locator('[data-time]').textContent(),'5:00');await page.click('[data-start]');
 await page.waitForFunction(()=>aerialReview.host.audio.buffers.ambient);await ensureActive();pad=await page.locator('[data-dpad]').boundingBox();
 const before=await page.evaluate(()=>aerialReview.host.state.player.x);
 await touch('touchStart',[p(1,140)]);await right();await page.waitForFunction(x=>aerialReview.host.state.player.x>x+10,before);
 await page.waitForTimeout(1200);await right();await touch('touchEnd',[]);await neutral();
 let x=await page.evaluate(()=>aerialReview.host.state.player.x);await page.waitForTimeout(120);assert.equal(await page.evaluate(()=>aerialReview.host.state.player.x),x);
 checks.push('Native touch hold remains active; releasing stops movement without a timeout');
 for(const order of [1,2]){
  await touch('touchStart',[p(1,28),p(2,140)]);await page.waitForFunction(()=>aerialReview.host.input.left&&aerialReview.host.input.right);
  await touch('touchEnd',[p(order,order===1?28:140)]);
  await page.waitForFunction(direction=>Object.keys(aerialReview.host.input).length===1&&aerialReview.host.input[direction],order===1?'right':'left');
  await touch('touchEnd',[]);await neutral();
 }
 checks.push('Native multi-touch preserves the remaining finger in both release orders');
 await touch('touchStart',[p(3,140)]);await right();await touch('touchMove',[p(3,190)]);await neutral();await touch('touchMove',[p(3,140)]);await right();await touch('touchCancel',[]);await neutral();
 checks.push('Sliding outside neutralizes movement; reentry and touch cancellation work');
 const hud=await page.locator('.flight-hud').boundingBox();await touch('touchStart',[{id:4,x:hud.x+10,y:hud.y+10}]);await page.waitForTimeout(900);await touch('touchEnd',[]);
 assert.equal(await page.evaluate(()=>getSelection().toString()),'');assert.equal(await page.locator('.flight-hud').evaluate(e=>getComputedStyle(e).userSelect),'none');
 await touch('touchStart',[p(5,140)]);await right();
 const prevented=await page.locator('.flight-hud').evaluate(e=>{const event=new MouseEvent('contextmenu',{bubbles:true,cancelable:true});e.dispatchEvent(event);return event.defaultPrevented;});assert.equal(prevented,true);await neutral();assert.equal(await page.evaluate(()=>aerialReview.host.paused),true);await touch('touchEnd',[]);await ensureActive();
 checks.push('HUD long-press does not select text; native-menu event is prevented and safely pauses');
 await touch('touchStart',[p(6,140)]);await right();await page.evaluate(()=>aerialReview.host.state.health=0);await page.waitForFunction(()=>aerialReview.host.state.lives===2);await neutral();await touch('touchMove',[p(6,140)]);await neutral();await touch('touchEnd',[]);
 await touch('touchStart',[p(7,140)]);await right();await page.evaluate(()=>window.dispatchEvent(new Event('blur')));await neutral();await touch('touchEnd',[]);await ensureActive();
 await touch('touchStart',[p(8,140)]);await right();await page.setViewportSize({width:390,height:844});await neutral();await touch('touchEnd',[]);await page.setViewportSize({width:844,height:300});await page.waitForFunction(()=>!aerialReview.host.tooSmall);await ensureActive();pad=await page.locator('[data-dpad]').boundingBox();await touch('touchStart',[p(9,140)]);await right();await touch('touchEnd',[]);await neutral();
 checks.push('Death, blur, rotation and resume require fresh input and recover normally');
 assert.equal(await page.evaluate(()=>localStorage.getItem('mq-aerial-practice-run')),legacy);
 await page.click('[data-pause]');const tick=await page.evaluate(()=>aerialReview.host.state.tick);await page.reload();await page.click('#resume-flight');await page.waitForFunction(()=>aerialReview.host.art);assert.equal(await page.evaluate(()=>aerialReview.host.state.tick),tick);
 checks.push('Earlier flight remains intact; new five-minute flight saves and resumes');
 await page.click('[data-start]');await page.click('[data-assist]');await page.click('[data-confirm]');for(const i of [0,1,0])await page.click(`[data-choice="${i}"]`);assert.equal(await page.evaluate(()=>aerialReview.host.state.outcome),'assisted_completed');
 checks.push('Assisted alternative still completes');assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
 const dir=resolve('docs/releases/aerial-v0.2.0-evidence');mkdirSync(dir,{recursive:true});const report={browser:await browser.version(),delivery:process.env.AERIAL_TEST_URL?'HTTP modular practice':'Standalone file; external requests blocked',input:'Chromium native touch via CDP plus explicit interruption events',checks,errors,physicalIOS:'Not run; owner iPhone retest required'};writeFileSync(resolve(dir,process.env.AERIAL_TEST_URL?'modular-touch-checks.json':'standalone-touch-checks.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
}finally{await browser.close();}
