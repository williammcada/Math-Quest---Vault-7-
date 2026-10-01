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

const server=http.createServer(async(req,res)=>{try{const file=path.resolve('public','.'+new URL(req.url,'http://local').pathname);const data=await fs.readFile(file);res.setHeader('content-type',file.endsWith('.html')?'text/html':file.endsWith('.js')?'text/javascript':file.endsWith('.png')?'image/png':'text/plain');res.end(data);}catch{res.statusCode=404;res.end();}});await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
const profile=await fs.mkdtemp(path.join(os.tmpdir(),'journey-browser-'));
const chrome=spawn(process.env.JOURNEY_CHROMIUM,['--headless','--no-sandbox','--disable-dev-shm-usage','--remote-debugging-port=0','--user-data-dir='+profile],{stdio:['ignore','ignore','pipe']});
let diagnostic='';const endpoint=await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('Chromium startup timeout: '+diagnostic)),15000);chrome.stderr.on('data',b=>{diagnostic+=b;const m=diagnostic.match(/DevTools listening on (ws:\/\/\S+)/);if(m){clearTimeout(timer);resolve(m[1]);}});chrome.on('error',reject);});
const browser=new WebSocket(endpoint);await new Promise((r,j)=>{browser.onopen=r;browser.onerror=j;});
let sequence=0;const pending=new Map(),errors=[];
browser.onmessage=e=>{const m=JSON.parse(e.data);if(m.id){const p=pending.get(m.id);pending.delete(m.id);m.error?p?.reject(Error(JSON.stringify(m.error))):p?.resolve(m.result);}else if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.text);};
function call(method,params={},sessionId){return new Promise((resolve,reject)=>{const id=++sequence;pending.set(id,{resolve,reject});browser.send(JSON.stringify({id,method,params,...(sessionId?{sessionId}:{})}));});}
async function evaluate(sessionId,expression){const r=await call('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true},sessionId);if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value;}
async function until(fn,label){const limit=Date.now()+10000;while(Date.now()<limit){if(await fn())return;await new Promise(r=>setTimeout(r,100));}throw Error('Timeout: '+label);}
try{const {targetId}=await call('Target.createTarget',{url:'about:blank'});const {sessionId:s}=await call('Target.attachToTarget',{targetId,flatten:true});await call('Runtime.enable',{},s);await call('Emulation.setDeviceMetricsOverride',{width:1024,height:768,deviceScaleFactor:1,mobile:false},s);await call('Page.navigate',{url:`http://127.0.0.1:${port}/journey-art-review.html`},s);await until(()=>evaluate(s,"Boolean(window.review)&&Object.values(review.renderer.images).every(i=>i.complete&&i.naturalWidth===1536)"),'all atlases load');
const calls=await evaluate(s,`(()=>{const r=review.renderer,original=r.ctx.drawImage.bind(r.ctx),calls=[];r.ctx.drawImage=(img,...args)=>{calls.push({file:new URL(img.src).pathname,args});original(img,...args);};for(const facing of [1,-1]){if(facing===-1)review.flip();for(const clip of ['idle','walk','attack','jump','air','hurt','down','special','victory']){review.set(clip);const now=performance.now();r.draw(now);for(let t=0;t<1200;t+=80)r.draw(now+t);}}r.ctx.drawImage=original;review.set('idle');return calls;})()`);
for(const hero of ['wukong','bajie','wujing','tang','prince'])assert.ok(calls.some(c=>c.file.includes(hero)),hero);
for(const c of calls){assert.ok(c.args[0]>=0&&c.args[1]>=0&&c.args[0]+c.args[2]<=1536&&c.args[1]+c.args[3]<=1024);}
for(const clip of ['idle','attack','special']){await evaluate(s,`review.set('${clip}');new Promise(r=>setTimeout(r,320))`);const shot=await call('Page.captureScreenshot',{format:'png'},s);await fs.writeFile('/tmp/journey-art-'+clip+'.png',Buffer.from(shot.data,'base64'));}
assert.deepEqual(errors,[]);console.log(JSON.stringify({passed:true,heroes:5,clips:9,facings:2,drawCalls:calls.length,errors,limits:['render inspection; not combat balance','physical-device testing not run']}));
}finally{browser.close();chrome.kill();await new Promise(r=>server.close(r));}
