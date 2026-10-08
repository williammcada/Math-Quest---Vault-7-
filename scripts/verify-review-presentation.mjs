import http from 'node:http';
import {readFile,writeFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url),{chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright');
const root=resolve('public');
const server=http.createServer(async(req,res)=>{try{const url=new URL(req.url,'http://local');const path=resolve(root,'.'+(url.pathname==='/'?'/index.html':url.pathname));assert.ok(path.startsWith(root+'/'));const data=await readFile(path);res.setHeader('content-type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.mp3':'audio/mpeg'})[extname(path)]||'application/octet-stream');res.end(data);}catch{res.writeHead(404);res.end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const local=`http://127.0.0.1:${server.address().port}/`,base=process.env.REVIEW_BASE||local;
const browser=await chromium.launch({executablePath:process.env.SHOOTER_BROWSER||'/tmp/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage'],...(process.env.REVIEW_BASE&&process.env.HTTPS_PROXY?{proxy:{server:process.env.HTTPS_PROXY,bypass:'127.0.0.1,localhost'}}:{})});
const helper=(await readFile('public/review-presentation.js','utf8')).replaceAll('export function','function');
const style=await readFile('public/review-presentation.css','utf8');
for(const file of ['Ironbreak-v0.1.0.html','BLACKLINE-v0.2.0.html']){const html=await readFile('public/reviews/'+file,'utf8');assert.ok(html.includes(helper));assert.ok(html.includes(style));}
const results=[];
try{
 for(const viewport of [{width:1280,height:800},{width:393,height:852},{width:1024,height:768}]){
 const page=await browser.newPage({viewport});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const route of ['reviews/Ironbreak-v0.1.0.html','reviews/BLACKLINE-v0.2.0.html','coastal-escape-preview.html','false-haven-preview.html']){
 await page.goto(base+route);await page.locator('.mission-instructions').waitFor();
 if(route.includes('reviews/')){
 const decoded=await page.evaluate(async()=>{const out=[];for(const [key,art] of Object.entries(MQ_STORY_ART)){const img=new Image();img.src=art.src;await img.decode();out.push({key,width:img.naturalWidth,webp:art.src.startsWith('data:image/webp;base64,')});}return out;});
 assert.equal(decoded.length,4);assert.ok(decoded.every(x=>x.width>=1280&&x.webp)); // all raster scenes decode
 }

 assert.equal(await page.locator('img').first().evaluate(async img=>{await img.decode();return img.naturalWidth>0;}),true,route+' artwork');
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,route+' overflow');
 if(viewport.width===1280&&route.includes('BLACKLINE'))await page.screenshot({path:'/tmp/blackline-painted.png',fullPage:true});
 if(viewport.width===1280&&route.includes('Ironbreak'))await page.screenshot({path:'/tmp/ironbreak-painted.png',fullPage:true});
 if(route.includes('Ironbreak')){assert.equal(await page.locator('.review-cover').getAttribute('alt'),'Mara prepares a remote maintenance machine beside the flooded foundry');await page.locator('[data-do="briefing.ready"]').click();await page.locator('#review-answer').waitFor();}
 else{await page.locator('#next').click();await page.locator('#next').click();await page.locator('[data-choice]').first().click();await page.locator('#next').click();await page.locator('#next').click();assert.equal(await page.locator('input[type=checkbox]').count(),3);await page.locator('input[type=checkbox]').first().check();assert.equal(await page.locator('input:checked').count(),1);await page.locator('#skip').click();await page.locator('[data-choice]').first().click();await page.locator('#endings').waitFor();}
 results.push({route,viewport,artDecoded:true,instructions:true,navigation:true});
 }
 assert.deepEqual(errors,[]);await page.close();
 }
 const dev=await browser.newPage();for(const file of ['Ironbreak-v0.1.0.html','BLACKLINE-v0.2.0.html']){await dev.goto(base+'reviews/'+file+'?dev=action');await dev.locator('canvas').first().waitFor();results.push({file,devCanvas:true});}await dev.close();
 console.log(JSON.stringify({browser:browser.version(),results,physicalIOS:'Not run'},null,2));
}finally{await browser.close();await new Promise(r=>server.close(r));}
