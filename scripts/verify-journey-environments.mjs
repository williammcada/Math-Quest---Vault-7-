// Chromium fixture renders production JourneyRenderer, not live Cloudflare.
// Set JOURNEY_CHROMIUM and JOURNEY_PLAYWRIGHT to installed executable/module.
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
const {chromium}=await import(pathToFileURL(process.env.JOURNEY_PLAYWRIGHT));
const root=path.resolve('public'),output=path.resolve('docs/verification/journey-stage7');
await fs.mkdir(output,{recursive:true});
const server=http.createServer(async(req,res)=>{try{const file=path.resolve(root,'.'+new URL(req.url,'http://local').pathname);if(!file.startsWith(root+path.sep))throw Error('path');res.setHeader('content-type',file.endsWith('.html')?'text/html':file.endsWith('.js')?'text/javascript':file.endsWith('.png')?'image/png':'text/plain');res.end(await fs.readFile(file));}catch{res.statusCode=404;res.end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
let browser;
try{
  browser=await chromium.launch({executablePath:process.env.JOURNEY_CHROMIUM,headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader','--disable-gpu-sandbox']});
  const page=await browser.newPage({viewport:{width:1024,height:700}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(`http://127.0.0.1:${server.address().port}/journey-environment-review.html`);
  await page.waitForFunction(()=>window.review&&Object.values(review.renderer.images).every(i=>i.complete&&i.naturalWidth>0));
  const files=[];
  for(let stage=0;stage<5;stage++){
    await page.evaluate(stage=>{review.set(stage);review.renderer.draw();},stage);
    await page.locator('canvas').screenshot({path:path.join(output,`stage-${stage}.png`)});files.push(`stage-${stage}.png`);
  }
  await page.evaluate(()=>{review.set(2);review.debug(true);});
  await page.locator('canvas').screenshot({path:path.join(output,'movement-bounds.png')});
  await page.setViewportSize({width:667,height:375});
  const fit=await page.locator('canvas').evaluate(c=>c.getBoundingClientRect().width<=innerWidth-32);
  assert.equal(fit,true);assert.deepEqual(errors,[]);
  console.log(JSON.stringify({passed:true,stages:5,files,errors,smallViewportCanvasFits:fit,limits:['static fixture; not human playthrough','physical device and live network not run']}));
}finally{await browser?.close();await new Promise(r=>server.close(r));}
