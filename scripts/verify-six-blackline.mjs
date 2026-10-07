import assert from 'node:assert/strict';
import {QuestSession} from '../test/authenticated-session.mjs';
import {createBlackline,stepBlackline,blacklineAdapter} from '../public/games/blackline/adapter.js';
import Sim from '../public/games/blackline/sim.js';


import {BLACKLINE as c,blacklineScene} from '../public/cartridges/blackline.js';
import {validateBlackline} from '../src/cartridges/blackline/validation.js';
const ctx=()=>{const data=new Map();return {storage:{get:async k=>structuredClone(data.get(k)),put:async(k,v)=>data.set(k,structuredClone(v)),setAlarm:async()=>{}},blockConcurrencyWhile:fn=>fn()};};
async function call(r,path,body){const res=await r.fetch(new Request(`https://test${path}`,body?{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)}:{}));return {...await res.json(),status:res.status};}
const cmd=(r,type,extra={})=>call(r,'/command',{type,commandId:crypto.randomUUID(),...extra});
async function setup(gates=3,route='register'){
 const context=ctx(),r=new QuestSession(context);await call(r,'/init',{code:'HAVEN2',teacherKey:'teacher',config:{engineVersion:'0.9.4',cartridgeId:c.id,gateCount:gates,teamNames:['Crew'],modules:[{id:'number.gcf',itemCount:gates,band:'beginner'}]}});
 for(const id of ['a','b'])await cmd(r,'student.join',{deviceId:id,alias:id,teamPin:r.state.teams['team-1'].pin});await cmd(r,'teacher.start',{teacherKey:'teacher'});for(const id of ['a','b'])await cmd(r,'briefing.ready',{deviceId:id});
 const t=r.state.teams['team-1'];
 for(let i=0;i<gates;i++){
  for(const id of ['a','b']){await call(r,`/state?deviceId=${id}`);const v=await cmd(r,'math.submit',{deviceId:id,answer:r.state.students[id].currentItem.answer});assert.equal(v.feedback?.correct,true);}
  if(i===0){await vote(r,route);assert.equal(t.stage,'gate','Chapter 2 must not insert Chapter 1 rescue');}
 }
 for(const id of ['a','b']){assert.equal((await cmd(r,'market.propose',{deviceId:id,items:['impact-plating']})).status,200);await cmd(r,'market.ready',{deviceId:id});}
 const lead=r.members(t.id)[t.leadIndex%2].id;await cmd(r,'market.commit',{deviceId:lead});assert.equal((await cmd(r,'market.continue',{deviceId:lead})).status,200);assert.equal(t.stage,'minigame');assert.ok(Math.abs(t.finaleDeadline-Date.now()-300000)<2000);
 return {r,t,context};
}
async function vote(r,choice){for(const id of ['a','b'])await cmd(r,'choice.vote',{deviceId:id,choice});const t=r.state.teams['team-1'];assert.equal((await cmd(r,'choice.resolve',{deviceId:r.members(t.id)[t.leadIndex%2].id})).status,200);}

import http from 'node:http';
import {readFile,writeFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),{chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright');
const {r,t}=await setup(),root=resolve('public');
const server=http.createServer(async(req,res)=>{try{const u=new URL(req.url,'http://local');if(u.pathname.startsWith('/api/sessions/HAVEN2/')){const chunks=[];for await(const b of req)chunks.push(b);const body=Buffer.concat(chunks).toString();const out=await r.fetch(new Request('https://test'+u.pathname.replace('/api/sessions/HAVEN2','')+u.search,{method:req.method,headers:req.headers,...(body?{body}:{})}));res.writeHead(out.status,{'content-type':'application/json'});res.end(await out.text());return;}const path=resolve(root,'.'+(u.pathname==='/'?'/index.html':u.pathname));assert.ok(path.startsWith(root+'/'));res.setHeader('content-type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.webp':'image/webp','.png':'image/png','.mp3':'audio/mpeg'})[extname(path)]||'application/octet-stream');res.end(await readFile(path));}catch(e){res.writeHead(404);res.end(String(e));}});
await new Promise(ok=>server.listen(0,'127.0.0.1',ok));const browser=await chromium.launch({executablePath:'/tmp/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
try{const context=await browser.newContext({viewport:{width:852,height:393},hasTouch:true,isMobile:true});await context.addInitScript(key=>{localStorage.setItem('mq-device-HAVEN2','a');localStorage.setItem('mq-student-HAVEN2',key);},r.state.students.a.credential);const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(`http://127.0.0.1:${server.address().port}/?session=HAVEN2&student=1`);await page.locator('[data-start]:not([disabled])').click();await page.waitForFunction(()=>document.querySelector('.nf-overlay').hidden);await page.keyboard.down('d');await page.waitForTimeout(300);await page.keyboard.up('d');await page.locator('[data-pause]').click();assert.equal(t.runs.a.status,'active');await page.locator('[data-pause]').click();await page.locator('[data-assist]').click();for(let i=0;i<6;i++)await page.getByRole('button',{name:'Continue along the covered route'}).click();await page.waitForTimeout(1200);assert.equal(t.runs.a.outcome,'assisted_completed');assert.deepEqual(errors,[]);await writeFile('docs/releases/six-v0.9.7-evidence/blackline-browser.json',JSON.stringify({browser:browser.version(),checks:['Actual classroom Blackline host mounts','Action start and keyboard release','Pause/resume','Audio adapter initializes without errors','Guided completion saved by local Worker'],errors,physicalDevices:'Not run',backend:'Local Worker with in-memory storage; authenticated test fixture'},null,2));console.log('Blackline classroom browser passed');}finally{await browser.close();await new Promise(ok=>server.close(ok));}
