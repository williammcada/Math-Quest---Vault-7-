import http from 'node:http';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import {fixture,cmd} from '../test/ironbreak-fixture.mjs';
import {GUIDED} from '../public/cartridges/ironbreak.js';
const require=createRequire(import.meta.url),{chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright');
const root=resolve('public'),out=resolve('docs/releases/ironbreak-browser');await mkdir(out,{recursive:true});
let current=await fixture(),failProgress=false,errors=[];
const server=http.createServer(async(req,res)=>{try{
 const url=new URL(req.url,'http://localhost');
 if(url.pathname.startsWith('/api/sessions/IRON/')){
  const chunks=[];for await(const chunk of req)chunks.push(chunk);const body=Buffer.concat(chunks).toString();
  if(failProgress&&body.includes('ironbreak.progress')){res.writeHead(503,{'content-type':'application/json'});res.end(JSON.stringify({error:'Simulated offline interval'}));return;}
  const path=url.pathname.replace('/api/sessions/IRON','');
  const result=await current.r.fetch(new Request('https://test'+path+url.search,{method:req.method,headers:req.headers,...(body?{body}:{})}));res.writeHead(result.status,{'content-type':result.headers.get('content-type')||'application/json'});res.end(await result.text());return;
 }
 const path=resolve(root,'.'+(url.pathname==='/'?'/index.html':url.pathname));if(!path.startsWith(root+'/'))throw Error('Invalid path');
 const data=await readFile(path);res.writeHead(200,{'content-type':({'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.mp3':'audio/mpeg','.wav':'audio/wav'})[extname(path)]||'application/octet-stream'});res.end(data);
 }catch(e){res.writeHead(404);res.end(String(e));}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const base=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({executablePath:process.env.SHOOTER_BROWSER||'/tmp/mathquest-chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader']});
const results=[];
try{
 for(const [name,viewport,touch]of (process.env.REVIEW_ONLY?[]:[['desktop',{width:1280,height:800},false],['phone',{width:852,height:393},true],['tablet',{width:1024,height:768},true]])){
  current=await fixture();errors=[];const context=await browser.newContext({viewport,hasTouch:touch,isMobile:touch});
  await context.addInitScript(({credential})=>{localStorage.setItem('mq-device-IRON','s0');localStorage.setItem('mq-student-IRON',credential);},{credential:current.r.state.students.s0.credential});
  const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));await page.goto(base+'/?session=IRON&student=1');
  await page.getByRole('button',{name:'Start action run',exact:true}).click();await page.waitForFunction(()=>document.querySelector('.ib-overlay')?.hidden);
  assert.equal(current.t.runs.s0.status,'active');
  const pad=await page.locator('.ib-pad').boundingBox(),jump=await page.locator('.ib-jump').boundingBox();
  if(touch){const cdp=await context.newCDPSession(page);const a={id:1,x:pad.x+pad.width*.8,y:pad.y+pad.height*.5},b={id:2,x:jump.x+jump.width*.5,y:jump.y+jump.height*.5};
   for(const releasePadFirst of [true,false]){await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[a,b]});await page.waitForTimeout(100);await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[releasePadFirst?a:b]});assert.equal(await page.locator('.ib-jump').evaluate(e=>e.classList.contains('held')),releasePadFirst);await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});assert.equal(await page.locator('.ib-jump').evaluate(e=>e.classList.contains('held')),false);}
   await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[a]});await cdp.send('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]});
  }
  await page.keyboard.down('d');await page.waitForTimeout(400);await page.keyboard.up('d');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await page.screenshot({path:out+'/'+name+'-action.png'});
  failProgress=true;await page.waitForTimeout(4500);await page.getByRole('heading',{name:'Crossing paused'}).waitFor();assert.ok(await page.locator('.ib-status').textContent().then(x=>x.includes('Simulated offline')));failProgress=false;
  await page.getByRole('button',{name:'Resume',exact:true}).last().click();await page.waitForFunction(()=>document.querySelector('.ib-overlay')?.hidden);assert.ok(current.t.runs.s0.activeElapsedMs>0);
  const saved=current.t.runs.s0.activeElapsedMs;await page.reload();await page.getByRole('heading',{name:'Crossing paused'}).waitFor();assert.equal(current.t.runs.s0.activeElapsedMs,saved);
  await page.getByRole('button',{name:'Guided play',exact:true}).click();await page.getByRole('button',{name:'Use guided play',exact:true}).click();
  for(const task of GUIDED)await page.getByRole('button',{name:task.options.find(([id])=>id===task.answer)[1],exact:true}).click();
  assert.equal(current.t.runs.s0.outcome,'assisted_success');await page.getByRole('heading',{name:'Operation recorded'}).waitFor();
  await cmd(current.r,'teacher.advanceFinale',{teacherKey:'teacher',teamId:current.t.id});await page.getByRole('button',{name:/Isolate the controller/}).waitFor();
  await page.getByRole('button',{name:/Isolate the controller/}).click();assert.equal(current.t.finalVotes.s0,'isolate');
  await page.screenshot({path:out+'/'+name+'-final-vote.png'});
  assert.deepEqual(errors,[]);results.push({name,viewport,passed:true,checks:['live action start','input release','network failure/retry','reload','guided completion','final vote','no overflow or page errors']});await context.close();
 }
 const page=await browser.newPage({viewport:{width:852,height:393}});await page.goto(base+'/Ironbreak-v0.1.0-practice.html');await page.getByRole('button',{name:'Start practice',exact:true}).click();await page.waitForFunction(()=>document.querySelector('#overlay').hidden);await page.screenshot({path:out+'/standalone.png'});results.push({name:'standalone',passed:true});await page.close();
 const review=await browser.newPage({viewport:{width:852,height:393},hasTouch:true});const reviewErrors=[];review.on('pageerror',e=>reviewErrors.push(e.message));await review.goto(base+'/Ironbreak-v0.1.0-cartridge-review.html');
 await review.waitForTimeout(1000);await review.getByRole('button',{name:'Accept mission',exact:true}).click();
 async function answerReview(){await review.locator('#review-answer').waitFor();const prompt=await review.locator('#review-answer').locator('..').locator('h2').textContent();const ns=prompt.match(/\d+/g).map(Number);let [a,b]=ns.slice(-2);while(b)[a,b]=[b,a%b];await review.locator('#review-answer input').fill(String(a));await review.getByRole('button',{name:'Check answer',exact:true}).click();}
 await answerReview();await review.getByRole('button',{name:/Protect the foundry crew/}).click();await review.getByRole('button',{name:'Confirm crew decision',exact:true}).click();await answerReview();await review.locator('#review-answer').waitFor();await review.waitForTimeout(100);await answerReview();
 await review.getByRole('button',{name:'Answer 2 more questions for another slot',exact:true}).click();await answerReview();await review.waitForTimeout(100);await answerReview();await review.getByRole('heading',{name:'2 equipment slots'}).waitFor();
 await review.getByRole('button',{name:/Spread blaster/}).click();await review.getByRole('button',{name:/Reinforced suit/}).click();await review.getByRole('button',{name:'My plan is ready',exact:true}).click();await review.getByRole('button',{name:'Confirm equipment',exact:true}).click();await review.getByRole('button',{name:'Enter the foundry',exact:true}).click();await review.getByRole('button',{name:'Start guided play',exact:true}).click();
 for(const task of GUIDED)await review.getByRole('button',{name:task.options.find(([id])=>id===task.answer)[1],exact:true}).click();await review.getByRole('button',{name:/Share the designs/}).click();await review.getByRole('button',{name:'Confirm crew decision',exact:true}).click();await review.getByRole('heading',{name:'Personal record',exact:true}).waitFor();assert.deepEqual(reviewErrors,[]);assert.equal(await review.evaluate(()=>Object.keys(localStorage).some(k=>k.startsWith('mq-ironbreak-'))),false);await review.screenshot({path:out+'/cartridge-review-ending.png'});results.push({name:'offline cartridge review',passed:true,checks:['required mathematics','priority vote','extra mathematics for second upgrade','equipment confirmation','guided play','final vote and epilogue']});await review.close();
 await writeFile(out+'/report.json',JSON.stringify({candidate:'ironbreak-0.1.0',browser:browser.version(),results,physicalDevices:'Not run'},null,2));console.log(JSON.stringify(results));
}finally{await browser.close();await new Promise(r=>server.close(r));}
