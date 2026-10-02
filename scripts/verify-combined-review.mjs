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
const results=[];
try{
 for(const viewport of [{width:1280,height:800},{width:393,height:852},{width:1024,height:768}]){
  const page=await browser.newPage({viewport});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const response=await page.goto(base+'cartridge-review.html');assert.equal(response.status(),200);
  assert.equal(await page.locator('article').count(),3);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  const links=await page.locator('article a').evaluateAll(els=>els.map(e=>e.href));
  for(const link of links){const r=await page.goto(link);assert.equal(r.status(),200);await page.locator('h1').first().waitFor();}
  assert.deepEqual(errors,[]);results.push({check:'Review hub and all three entries',viewport,passed:true});await page.close();
 }
 // Exercise the actual setup UI against an older Worker and against a missing cartridge.
 const page=await browser.newPage();let posts=0,version='0.9.4';
 await page.route('**/api/**',async route=>{if(route.request().method()==='POST')posts++;return route.fulfill({contentType:'application/json',body:JSON.stringify({version,cartridges:[]})});});
 await page.goto(local);await page.locator('#cartridge-select').selectOption('ironbreak');
 for(const v of ['0.9.4','0.9.6']){version=v;const dialog=page.waitForEvent('dialog');await page.locator('#create').click();const d=await dialog;assert.match(d.message(),/requires session engine/);await d.accept();}
 assert.equal(posts,0);results.push({check:'Old backend and missing cartridge block creation before POST',passed:true});await page.close();
 const out={base,browser:browser.version(),results,physicalDevices:'Not run'};
 await writeFile('docs/releases/combined-v0.9.6-evidence/review-browser.json',JSON.stringify(out,null,2));console.log(JSON.stringify(out));
}finally{await browser.close();await new Promise(r=>server.close(r));}
