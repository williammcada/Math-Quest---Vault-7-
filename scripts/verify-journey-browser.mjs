// Local browser integration harness. Uses production BrawlRun and JourneyHost,
// with in-memory Durable Object storage and a Node ws bridge, NOT Cloudflare.
// JOURNEY_CHROMIUM=/path/chromium JOURNEY_WS_PACKAGE=/path/ws/index.js node scripts/verify-journey-browser.mjs
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {spawn} from 'node:child_process';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
import {BrawlRun} from '../src/cartridges/journey/durable-object.js';
import {enterStage,levelStep} from '../src/cartridges/journey/encounters.js';

const wsModule=await import(pathToFileURL(process.env.JOURNEY_WS_PACKAGE));
const WebSocketServer=wsModule.WebSocketServer || wsModule.default.WebSocketServer || wsModule.default.Server;
const store=new Map(),sockets=[],results=[];
const ctx={storage:{get:async k=>structuredClone(store.get(k)),put:async(k,v)=>store.set(k,structuredClone(v)),deleteAll:async()=>store.clear(),deleteAlarm:async()=>{},setAlarm:async()=>{}},getWebSockets:()=>sockets,blockConcurrencyWhile:fn=>fn(),waitUntil:p=>p.catch(()=>{})};
const run=new BrawlRun(ctx,{SESSIONS:{idFromName:x=>x,get:()=>({fetch:async req=>{results.push(await req.json());return new Response('{}');}})}});
async function post(route,data){const res=await run.fetch(new Request('http://object'+route,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(data)}));const body=await res.json();if(!res.ok)throw Error(body.error);return body;}
await post('/init',{runId:'browser-test',roomCode:'LOCAL1',teamId:'team',expiresAt:Date.now()+600000,resultKey:'local-test',members:Array.from({length:5},(_,i)=>({id:'p'+i,alias:'Agent '+i}))});
const publicRoot=path.resolve('public');let port;
const server=http.createServer(async(req,res)=>{try{
 const url=new URL(req.url,'http://local');
 if(url.pathname==='/fixture'){
  res.setHeader('content-type','text/html');return res.end(`<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0;background:#142a2c}</style></head><body><main id="root"></main><script type="module">import {JourneyHost} from '/games/journey/host.js';const id=new URL(location).searchParams.get('id');const send=async(type,data={})=>{const r=await fetch('/command',{method:'POST',body:JSON.stringify({id,type,...data})});if(!r.ok)throw Error(await r.text());return r.json();};const state=await send('state');window.host=new JourneyHost(document.querySelector('#root'),{state,send});</script></body></html>`);
 }
 if(url.pathname==='/command'){
  let raw='';for await(const chunk of req)raw+=chunk;const data=JSON.parse(raw);
  let connection;if(data.type==='journey.connect'){const ticket=await post('/ticket',{studentId:data.id});connection={ticket:ticket.ticket,url:'ws://127.0.0.1:'+port+'/socket'};}
  if(data.type==='journey.ready')await post('/ready',{studentId:data.id,upgrades:data.upgrades});
  res.setHeader('content-type','application/json');return res.end(JSON.stringify({student:{id:data.id},teams:[{journey:{runId:'browser-test',snapshot:run.model.snapshot(Date.now()),optional:{earned:1}}}],...(connection?{combatConnection:connection}:{})}));
 }
 const file=path.resolve(publicRoot,'.'+url.pathname);if(!file.startsWith(publicRoot+path.sep))throw Error('Invalid path');
 const body=await fs.readFile(file);res.setHeader('content-type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.png')?'image/png':'text/plain');res.end(body);
 }catch(e){res.statusCode=400;res.end(e.message);}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));port=server.address().port;
const wss=new WebSocketServer({server});wss.on('connection',socket=>{socket.serializeAttachment=a=>socket.attachment=a;sockets.push(socket);socket.on('message',m=>run.webSocketMessage(socket,m.toString()));socket.on('close',()=>run.webSocketClose(socket));});
const profile=await fs.mkdtemp(path.join(os.tmpdir(),'journey-browser-'));
const chrome=spawn(process.env.JOURNEY_CHROMIUM,['--headless','--no-sandbox','--disable-dev-shm-usage','--remote-debugging-port=0','--user-data-dir='+profile],{stdio:['ignore','ignore','pipe']});
let diagnostic='';const endpoint=await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('Chromium startup timeout: '+diagnostic)),15000);chrome.stderr.on('data',b=>{diagnostic+=b;const m=diagnostic.match(/DevTools listening on (ws:\/\/\S+)/);if(m){clearTimeout(timer);resolve(m[1]);}});chrome.on('error',reject);});
const browser=new WebSocket(endpoint);await new Promise((r,j)=>{browser.onopen=r;browser.onerror=j;});
let sequence=0;const pending=new Map(),errors=[];
browser.onmessage=e=>{const m=JSON.parse(e.data);if(m.id){const p=pending.get(m.id);pending.delete(m.id);m.error?p?.reject(Error(JSON.stringify(m.error))):p?.resolve(m.result);}else if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.text);};
function call(method,params={},sessionId){return new Promise((resolve,reject)=>{const id=++sequence;pending.set(id,{resolve,reject});browser.send(JSON.stringify({id,method,params,...(sessionId?{sessionId}:{})}));});}
async function evaluate(sessionId,expression){const r=await call('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true},sessionId);if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value;}
async function until(fn,label){const limit=Date.now()+10000;while(Date.now()<limit){if(await fn())return;await new Promise(r=>setTimeout(r,100));}throw Error('Timeout: '+label);}
const clients=[];
try{
 for(let i=0;i<5;i++){const {targetId}=await call('Target.createTarget',{url:'about:blank'});const {sessionId}=await call('Target.attachToTarget',{targetId,flatten:true});clients.push(sessionId);await call('Runtime.enable',{},sessionId);await call('Emulation.setDeviceMetricsOverride',{width:844,height:390,deviceScaleFactor:1,mobile:true},sessionId);await call('Page.navigate',{url:`http://127.0.0.1:${port}/fixture?id=p${i}`},sessionId);}
 await until(async()=> (await Promise.all(clients.map(s=>evaluate(s,'Boolean(window.host?.connected)')))).every(Boolean),'five connections');
 const heroes=['wukong','bajie','wujing','tang','prince'];
 for(let i=0;i<5;i++)await evaluate(clients[i],`host.wsSend({type:'reserveHero',hero:'${heroes[i]}'})`);
 await until(()=>Promise.resolve(Object.values(run.model.s.players).every(p=>p.hero)),'reservations');
 for(const s of clients)await evaluate(s,"host.action('journey.ready',{upgrades:[]})");
 await until(async()=> (await Promise.all(clients.map(s=>evaluate(s,"host.snap?.phase==='running'")))).every(Boolean),'launch');
 const s=clients[0],before=run.model.player('p0').x;
 await evaluate(s,"window.dispatchEvent(new KeyboardEvent('keydown',{key:'d',code:'KeyD',bubbles:true}))");
 await until(()=>Promise.resolve(run.model.player('p0').x>before+5),'movement');
 await evaluate(s,"window.dispatchEvent(new KeyboardEvent('keyup',{key:'d',code:'KeyD',bubbles:true}))");
 await until(()=>Promise.resolve(run.model.player('p0').input.x===0),'release');
 await evaluate(s,"window.dispatchEvent(new KeyboardEvent('keydown',{key:'l',code:'KeyL',bubbles:true}));window.dispatchEvent(new Event('blur'))");
 assert.equal(await evaluate(s,'host.edges.magic'),false);assert.equal(await evaluate(s,'host.helpOpen'),true);
 await evaluate(s,"document.querySelector('.j-help').click();window.dispatchEvent(new Event('focus'))");
 await post('/control',{action:'pause',paused:true});await until(()=>evaluate(s,'host.snap.paused'),'teacher pause');
 const elapsed=run.model.s.activeMs;await new Promise(r=>setTimeout(r,200));assert.equal(run.model.s.activeMs,elapsed);
 await post('/control',{action:'pause',paused:false});await until(()=>evaluate(s,'!host.snap.paused'),'teacher resume');
 await evaluate(s,'host.socket.close()');await until(()=>evaluate(s,'host.connected && host.epoch===2'),'reconnect');assert.equal(run.sockets.size,5);
 await until(()=>evaluate(s,'host.renderer.images.hero.complete && host.renderer.images.hero.naturalWidth>0'),'artwork');
 // Controlled stage fixtures exercise production transport and rendering, not balance.
 const stageChecks=[];
 await call('Emulation.setDeviceMetricsOverride',{width:1024,height:768,deviceScaleFactor:1,mobile:false},s);
 for(let stage=0;stage<5;stage++){
  await run.enqueue(async()=>{
   for(const p of Object.values(run.model.s.players))p.protectionMs=1e6;
   if(stage)enterStage(run.model,stage);
   for(let i=0;i<8;i++)levelStep(run.model,900);
   if(stage===4){const e=run.model.s.enemies[0];e.phase='windup';e.move='rush';e.timer=900;e.laneY=e.y;e.aim={x:200,y:e.y};}
   await run.after(true);
  });
  await until(async()=> (await Promise.all(clients.map(s=>evaluate(s,`host.snap?.level?.stage===${stage}`)))).every(Boolean),'stage '+stage+' synchronized');
  await evaluate(s,'new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))');
  const shot=await call('Page.captureScreenshot',{format:'png',captureBeyondViewport:false},s);
  await fs.writeFile(`docs/verification/journey-stage5-scene-${stage}.png`,Buffer.from(shot.data,'base64'));
  stageChecks.push({stage,clients:5,enemies:run.model.s.enemies.length});
 }
 console.log(JSON.stringify({stageChecks,fixtureOnly:true}));
 const layouts=[];
 for(const [width,height] of [[844,390],[667,375],[568,320],[390,844],[1024,768]]){
  await call('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:true},s);
  await evaluate(s,'new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))');
  const geometry=await evaluate(s,`(()=>{const rect=q=>{const r=document.querySelector(q).getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom}};return {viewport:{width:innerWidth,height:innerHeight},controls:['.j-dpad','[data-jkey="attack"]','[data-jkey="jump"]','[data-jkey="magic"]','.j-clear','.j-help'].map(rect),stage:rect('.j-stage'),hud:rect('.j-hud'),canvasFit:getComputedStyle(document.querySelector('canvas')).objectFit,keys:host.keys}})()`);
  assert.equal(geometry.viewport.width,width);assert.equal(geometry.viewport.height,height);
  for(const r of geometry.controls){assert.ok(r.x>=0&&r.y>=0&&r.right<=width+1&&r.bottom<=height+1,JSON.stringify({width,height,r}));assert.ok(r.width>=44&&r.height>=44);}
  for(let i=0;i<geometry.controls.length;i++)for(let j=i+1;j<geometry.controls.length;j++){const a=geometry.controls[i],b=geometry.controls[j];assert.ok(a.right<=b.x||b.right<=a.x||a.bottom<=b.y||b.bottom<=a.y,'Controls overlap: '+JSON.stringify({width,height,i,j}));}
  assert.ok(geometry.stage.height>=80,JSON.stringify(geometry));assert.ok(geometry.stage.bottom<=geometry.controls[0].y+1);assert.equal(geometry.canvasFit,'contain');assert.equal(geometry.keys.x,0);
  const shot=await call('Page.captureScreenshot',{format:'png',captureBeyondViewport:false},s);await fs.mkdir('docs/verification',{recursive:true});await fs.writeFile(`docs/verification/journey-stage5-landscape-${width}x${height}.png`,Buffer.from(shot.data,'base64'));
  layouts.push({width,height,battlefieldHeight:geometry.stage.height});
 }
 // Actual browser touch dispatch uses the rendered hit areas after resize.
 await evaluate(s,"host.helpOpen=false;window.dispatchEvent(new Event('focus'))");
 const pad=await evaluate(s,"(()=>{const r=document.querySelector('.j-dpad').getBoundingClientRect();return {x:r.x+r.width*.8,y:r.y+r.height*.5}})()");
 await call('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{...pad,id:1}]},s);
 await until(()=>evaluate(s,'host.keys.x>0'),'fresh touch after resize');
 await call('Emulation.setDeviceMetricsOverride',{width:844,height:390,deviceScaleFactor:1,mobile:true},s);
 await until(()=>evaluate(s,'host.keys.x===0'),'resize neutralizes held touch');
 await call('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]},s);
 await evaluate(s,"document.querySelector('.j-help').click()");
 const help=await evaluate(s,"(()=>{const r=document.querySelector('.j-message').getBoundingClientRect();return {bottom:r.bottom,height:innerHeight,text:document.querySelector('.j-message').textContent}})()");assert.ok(help.text.includes('Move:'));assert.ok(help.bottom<=help.height);
 console.log(JSON.stringify({layouts}));
 await post('/control',{action:'end'});await until(()=>Promise.resolve(results.length===1),'result');assert.equal(errors.length,0,errors.join('\n'));
 console.log(JSON.stringify({passed:true,clients:5,browser:'Chromium',viewport:'844x390 emulation',checks:['real WebSocket bridge to production BrawlRun','unique heroes','all-ready launch','authoritative movement/release','blur clears queued magic','teacher pause/resume','reconnect retains five players','artwork loads','one result'],limitations:['Node bridge and in-memory storage; not Cloudflare workerd','not physical iOS','not school network','not full QuestSession browser flow']}));
}finally{for(const s of clients)try{await evaluate(s,'host?.destroy()');}catch{}browser.close();chrome.kill();await run.purge();for(const socket of wss.clients)socket.terminate();await new Promise(r=>wss.close(r));await new Promise(r=>server.close(r));}
