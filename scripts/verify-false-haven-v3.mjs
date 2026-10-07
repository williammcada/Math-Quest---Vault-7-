import http from 'node:http';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url),{chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright');
const root=resolve('public'),out=resolve('docs/releases/evidence/false-haven-v0.3.0');await mkdir(out,{recursive:true});
const server=http.createServer(async(req,res)=>{try{const p=resolve(root,'.'+new URL(req.url,'http://local').pathname);assert.ok(p.startsWith(root+'/'));res.setHeader('content-type',({'.js':'text/javascript','.html':'text/html','.css':'text/css','.png':'image/png','.webp':'image/webp','.mp3':'audio/mpeg','.wav':'audio/wav'})[extname(p)]||'application/octet-stream');res.end(await readFile(p));}catch{res.writeHead(404);res.end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const base=process.env.HAVEN_BASE||`http://127.0.0.1:${server.address().port}/`;
const browser=await chromium.launch({executablePath:'/tmp/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage'],...(process.env.HAVEN_BASE&&process.env.HTTPS_PROXY?{proxy:{server:process.env.HTTPS_PROXY,bypass:'127.0.0.1,localhost'}}:{})});
const results=[];
try{
 const page=await browser.newPage({viewport:{width:1280,height:800}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 const art=async()=>{await page.locator('.scene-grid img').evaluate(async im=>{await im.decode();if(!im.naturalWidth)throw Error('Missing scene art');});};
 await page.goto(base+'false-haven-preview.html');await art();assert.match(await page.locator('body').innerText(),/authorities withdrew the guards/);assert.match(await page.locator('body').innerText(),/v0.3.0/);
 await page.screenshot({path:out+'/story-opening.jpg',fullPage:true});
 await page.selectOption('#gates','5');await page.locator('#next').click();await art();await page.locator('#next').click();await page.locator('[data-choice="dispatch"]').click();
 for(let i=0;i<4;i++){await art();await page.locator('#next').click();}
 await art();assert.equal(await page.locator('input[type=checkbox]').count(),3);await page.locator('input[value=carbine]').check();
 await page.locator('#fly').click();await page.locator('[data-start]').waitFor();await page.locator('[data-assist]').click();await page.locator('[data-start]').click();
 for(let i=0;i<10;i++)await page.locator('.nf-overlay button').first().click();
 await page.locator('#story-return').click();await art();
 for(const ending of ['convoy','signal','depart']){await page.locator(`[data-choice="${ending}"]`).click();await art();assert.match(await page.locator('body').innerText(),/guided machinery route/);await page.locator('#endings').click();}
 results.push({story:'5 gates, dispatch route, 3 endings, guided mission, all story art decoded'});
 await page.goto(base+'practice-false-haven.html');await page.waitForFunction(()=>window.falseHaven?.art);await page.locator('[data-start]').click();
 await page.evaluate(()=>{const h=window.falseHaven;h.s.x=1728;h.s.y=650;h.s.immune=999;h.s.ammo=60;h.profile={steps:[],draw:[]};const step=h.adapter.step,render=h.adapter.render;h.adapter={...h.adapter,step(...args){const t=performance.now();const r=step(...args);h.profile.steps.push(performance.now()-t);return r;},render(...args){const t=performance.now();const r=render(...args);h.profile.draw.push(performance.now()-t);return r;}};});
 const before=await page.evaluate(()=>({x:falseHaven.s.x,y:falseHaven.s.y}));await page.keyboard.down('ArrowUp');await page.waitForTimeout(1000);await page.keyboard.up('ArrowUp');
 const after=await page.evaluate(()=>({x:falseHaven.s.x,y:falseHaven.s.y}));assert.ok(Math.hypot(after.x-before.x,after.y-before.y)>20);
 await page.keyboard.down('Space');await page.waitForTimeout(4000);await page.keyboard.up('Space');
 await page.evaluate(async()=>{const {havenSwitch}=await import('./games/nightfall/false-haven-world.js?v=0.9.4-fh3');const h=falseHaven;h.s.x=1872;h.s.y=864;havenSwitch(h.s,'speaker');});await page.waitForTimeout(7000);
 await page.screenshot({path:out+'/combat.jpg',fullPage:true});
 const measured=await page.evaluate(()=>{const h=falseHaven;const stats=a=>{a.sort((a,b)=>a-b);return {count:a.length,p95:a[Math.floor(a.length*.95)],max:a.at(-1)};};return {steps:stats(h.profile.steps),draw:stats(h.profile.draw),shots:h.s.shots,time:h.s.time,active:h.s.activeCount};});
 assert.ok(measured.steps.count>300);assert.ok(measured.shots>0);assert.ok(measured.active>0);
 await page.evaluate(()=>falseHaven.pause());const time=await page.evaluate(()=>falseHaven.s.time);await page.waitForTimeout(300);assert.equal(await page.evaluate(()=>falseHaven.s.time),time);assert.deepEqual(await page.evaluate(()=>falseHaven.input),{});
 await page.waitForTimeout(1100);await page.reload();await page.waitForFunction(()=>window.falseHaven?.art);assert.equal(await page.evaluate(()=>falseHaven.s.time),time);
 results.push({action:'real host movement/fire/speaker; input release; pause clock; saved reload',measured});
 assert.deepEqual(errors,[]);
 for(const viewport of [{width:1024,height:768},{width:844,height:390}]){await page.setViewportSize(viewport);await page.goto(base+'false-haven-preview.html');await art();assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);results.push({viewport,art:true,overflow:false});}
 console.log(JSON.stringify({browser:browser.version(),base,results,errors,physicalWindowsChrome:'Not run; owner replay pending',physicalIOS:'Not run'},null,2));
}finally{await browser.close();await new Promise(r=>server.close(r));}
