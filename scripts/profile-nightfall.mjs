// Reproducible synthetic combat profile. No classroom records or user data.
import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),{chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright');
const root=resolve('public');
const server=http.createServer(async(req,res)=>{try{const p=resolve(root,'.'+new URL(req.url,'http://local').pathname);if(!p.startsWith(root+'/'))throw Error();res.setHeader('content-type',({'.js':'text/javascript','.html':'text/html','.png':'image/png','.webp':'image/webp'})[extname(p)]||'application/octet-stream');res.end(await readFile(p));}catch{res.writeHead(404);res.end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({executablePath:'/tmp/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
try{
const page=await browser.newPage({viewport:{width:1280,height:800}});
await page.goto(`http://127.0.0.1:${server.address().port}/false-haven-preview.html`);
const results=await page.evaluate(async()=>{
 const {createState,step,makeNoise,navigationField}=await import('./games/nightfall/simulation.js');
 const {render,loadArt}=await import('./games/nightfall/renderer.js');
 const {havenSwitch}=await import('./games/nightfall/false-haven-world.js');
 const {solid}=await import('./games/nightfall/world.js');
 const art=await loadArt(),canvas=document.createElement('canvas');canvas.width=1280;canvas.height=720;const ctx=canvas.getContext('2d');ctx.scale(2,2);
 const stats=a=>{a.sort((a,b)=>a-b);return {median:a[Math.floor(a.length*.5)],p95:a[Math.floor(a.length*.95)],max:a.at(-1),over16ms:a.filter(t=>t>16.7).length};};
 const out=[];
 for(const [scenario,x,y,speaker] of [['city',1168,600,false],['false-haven',640,1728,false],['false-haven',1728,650,false],['false-haven',1872,864,true]]){
  const s=createState([], 'clinic',1,scenario);s.x=x;s.y=y;s.immune=999;const sim=[],draw=[],active=[];if(speaker)havenSwitch(s,'speaker');
  const nav=[];for(let i=0;i<6;i++){let t=performance.now();navigationField(s,{x:x+i*32,y});nav.push(performance.now()-t);}
  for(let i=0;i<360;i++){
   const nx=x+Math.sin(i/30)*80;if(!solid(s,nx,y))s.x=nx;
   if(i%24===0)makeNoise(s,s.x,s.y,580,1.2,'shot');
   let t=performance.now();step(s,{},1/60);sim.push(performance.now()-t);active.push(s.activeCount);
   t=performance.now();render(ctx,s,art);draw.push(performance.now()-t);
  }
  out.push({scenario,position:{x,y},speaker,activeMax:Math.max(...active),nav:stats(nav),simulation:stats(sim),drawing:stats(draw)});
 }
 return out;
});
console.log(JSON.stringify({browser:browser.version(),environment:'Linux headless Chromium; synthetic moving-player combat; 360 fixed steps per scenario; 2x canvas. Not physical Windows/iOS FPS.',results},null,2));
}finally{await browser.close();await new Promise(r=>server.close(r));}
