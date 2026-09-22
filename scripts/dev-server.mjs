import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import worker,{QuestSession} from '../src/worker.js';
const rooms=new Map(),root=resolve('public'),port=Number(process.env.MQ_PORT||5187);
const env={SESSIONS:{idFromName:x=>x,get(id){if(!rooms.has(id)){const data=new Map();rooms.set(id,new QuestSession({storage:{get:async k=>structuredClone(data.get(k)),put:async(k,v)=>data.set(k,structuredClone(v)),deleteAll:async()=>data.clear(),setAlarm:async at=>{clearTimeout(data.alarmTimer);data.alarmTimer=setTimeout(()=>rooms.get(id)?.alarm(),Math.max(1,at-Date.now()));data.alarmTimer.unref();},deleteAlarm:async()=>clearTimeout(data.alarmTimer)},blockConcurrencyWhile:fn=>fn()}));}return rooms.get(id);}}};
http.createServer(async(req,res)=>{try{
 const url=new URL(req.url,`http://${req.headers.host||'127.0.0.1:'+port}`);
 if(url.pathname.startsWith('/api/')){const chunks=[];for await(const c of req)chunks.push(c);const body=Buffer.concat(chunks);const response=await worker.fetch(new Request(url,{method:req.method,headers:req.headers,...(body.length?{body}:{})}),env);res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));return;}
 const file=resolve(root,'.'+decodeURIComponent(url.pathname.endsWith('/')?url.pathname+'index.html':url.pathname));if(!file.startsWith(root+'/')){res.writeHead(403);res.end();return;}
 const bytes=await readFile(file);res.writeHead(200,{'content-type':({'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.mp3':'audio/mpeg'})[extname(file)]||'application/octet-stream'});res.end(bytes);
 }catch(e){res.writeHead(404);res.end(e.message);}}).listen(port,'127.0.0.1',()=>console.log(`MathQuest local preview: http://127.0.0.1:${port}`));
