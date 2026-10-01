// Regression: iPhone browser bars must not turn a landscape viewport into a start lock.
import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
const {chromium}=await import(process.env.AERIAL_PLAYWRIGHT_MODULE||'playwright-core');
const browser=await chromium.launch({executablePath:process.env.AERIAL_BROWSER_EXECUTABLE||undefined,args:['--no-sandbox','--disable-dev-shm-usage'],headless:true});
const evidence=resolve('docs/releases/aerial-v0.2.0-evidence');mkdirSync(evidence,{recursive:true});
const file=process.env.AERIAL_TEST_URL||pathToFileURL(resolve('standalone/MathQuest_Aerial_Shooter_v0.2.0.html')).href;
const checks=[],errors=[],external=[];
async function createPage(size,mock=false){
 const context=await browser.newContext({viewport:size,hasTouch:true});const page=await context.newPage();
 page.on('pageerror',e=>errors.push(e.message));
 if(!process.env.AERIAL_TEST_URL)await page.route(/^https?:/,r=>{external.push(r.request().url());r.abort();});
 if(mock)await page.addInitScript(()=>{const vv=new EventTarget();vv.width=844;vv.height=300;Object.defineProperty(window,'visualViewport',{value:vv});globalThis.resizeVisible=(w,h)=>{vv.width=w;vv.height=h;vv.dispatchEvent(new Event('resize'));};});
 await page.goto(file+(file.includes('?')?'&':'?')+'dev');await page.click('#new-flight');await page.waitForFunction(()=>aerialReview.host.art);
 return {page,context};
}
async function bounds(page,width,height){
 const boxes=await page.locator('.flight-top,.flight-stage,.flight-hud,.flight-objective,[data-dpad],.flight-toolbar button').evaluateAll(es=>es.map(e=>({name:e.className||e.textContent,...e.getBoundingClientRect().toJSON()})));
 for(const b of boxes){assert.ok(b.left>=-.5&&b.top>=-.5&&b.right<=width+.5&&b.bottom<=height+.5,JSON.stringify({size:[width,height],box:b}));}
 const stage=boxes.find(b=>b.name==='flight-stage'),hud=boxes.find(b=>b.name==='flight-hud'),objective=boxes.find(b=>b.name==='flight-objective');
 assert.ok(hud.bottom<=stage.top+.5);assert.ok(stage.bottom<=objective.top+.5);assert.ok(Math.abs(stage.width/stage.height-640/360)<.02);
 const pad=await page.locator('[data-direction=up]').boundingBox();assert.equal(pad.width,56);assert.equal(pad.height,56);
}
async function start(page){
 assert.equal(await page.evaluate(()=>aerialReview.host.tooSmall),false);
 assert.equal(await page.getByText('Turn to landscape',{exact:true}).count(),0);
 const b=page.locator('[data-start]');if(await b.count())await b.click();else await page.click('[data-resume]');
 await page.waitForFunction(()=>aerialReview.host.state.tick>0);
 // Audio startup can stall headless rendering; movement check below resumes explicitly.
 await page.waitForFunction(()=>aerialReview.host.audio.buffers.ambient);
 if(await page.evaluate(()=>aerialReview.host.paused))await page.click('[data-resume]');
 const before=await page.evaluate(()=>aerialReview.host.state.player.x);
 await page.locator('[data-direction=right]').dispatchEvent('pointerdown',{pointerId:1,pointerType:'touch',clientX:(await page.locator('[data-direction=right]').boundingBox()).x+28,clientY:(await page.locator('[data-direction=right]').boundingBox()).y+28,bubbles:true});
 await page.waitForFunction(x=>aerialReview.host.state.player.x>x,before);
 await page.evaluate(()=>window.dispatchEvent(new PointerEvent('pointerup',{pointerId:1})));
}
try{
 for(const size of [{width:844,height:300},{width:667,height:300},{width:812,height:295},{width:568,height:260},{width:667,height:375},{width:1024,height:768}]){
  const {page,context}=await createPage(size);await start(page);await bounds(page,size.width,size.height);
  if(size.width===844)await page.screenshot({path:resolve(evidence,'landscape-browser-bars.png')});
  checks.push(`Start, touch movement, 56px D-pad and contained layout at ${size.width}x${size.height}`);await context.close();
 }
 {
  const {page,context}=await createPage({width:390,height:844});assert.equal(await page.getByText('Turn to landscape',{exact:true}).count(),1);
  await page.setViewportSize({width:844,height:300});await page.waitForFunction(()=>!aerialReview.host.tooSmall);await start(page);await bounds(page,844,300);
  await page.setViewportSize({width:390,height:844});await page.waitForFunction(()=>aerialReview.host.tooSmall);
  const tick=await page.evaluate(()=>aerialReview.host.state.tick);await page.waitForTimeout(150);assert.equal(await page.evaluate(()=>aerialReview.host.state.tick),tick);
  await page.setViewportSize({width:844,height:300});await page.waitForFunction(()=>!aerialReview.host.tooSmall);assert.equal(await page.evaluate(()=>aerialReview.host.state.tick),tick);
  await page.click('[data-resume]');await page.waitForFunction(t=>aerialReview.host.state.tick>t,tick);
  for(const height of [375,295,350,300]){await page.setViewportSize({width:844,height});await page.waitForFunction(h=>Math.abs(document.querySelector('.flight-shell').getBoundingClientRect().height-h)<1,height);await bounds(page,844,height);}
  checks.push('Portrait-to-landscape unlocks start; return to portrait pauses; resume preserves clock; toolbar resizing remains contained');await context.close();
 }
 {
  const {page,context}=await createPage({width:844,height:390},true);await start(page);await bounds(page,844,300);
  await page.evaluate(()=>resizeVisible(844,275));await page.waitForFunction(()=>document.querySelector('.flight-shell').getBoundingClientRect().height===275);await bounds(page,844,275);
  checks.push('Visual viewport resize works independently of window dimensions');await context.close();
 }
 assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
 const report={browser:await browser.version(),environment:'Headless Chromium; simulated phone/tablet viewports. Physical iOS retest pending.',checks,errors,external};
 writeFileSync(resolve(evidence,'viewport-checks.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
}finally{await browser.close();}
