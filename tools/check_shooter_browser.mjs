// Optional review harness. Requires Playwright and a Chromium executable.
// Serves public/ temporarily; SHOOTER_URL and SHOOTER_BROWSER may override defaults.
import {createRequire} from 'node:module';
import {mkdirSync,writeFileSync,readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {createServer} from 'node:http';
import {once} from 'node:events';
import {resolve,extname} from 'node:path';
import assert from 'node:assert/strict';
import {BUILD} from '../public/games/shooter/config.js';
const require=createRequire(import.meta.url);
const {chromium}=process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES?require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright'):require('playwright');
const browser=await chromium.launch({headless:true,...(process.env.SHOOTER_BROWSER?{executablePath:process.env.SHOOTER_BROWSER}:{}),args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu']});
let server,base=process.env.SHOOTER_URL;
if(!base){const root=fileURLToPath(new URL('../public/',import.meta.url));server=createServer((req,res)=>{try{const path=resolve(root,'.'+new URL(req.url,'http://localhost').pathname);if(!path.startsWith(root))throw Error('path');const data=readFileSync(path),mime={'.html':'text/html','.js':'text/javascript','.css':'text/css'}[extname(path)]||'application/octet-stream';res.writeHead(200,{'Content-Type':mime});res.end(data);}catch{res.writeHead(404);res.end();}});server.listen(0,'127.0.0.1');await once(server,'listening');base='http://127.0.0.1:'+server.address().port;}
const output=fileURLToPath(new URL(`../docs/checkpoints/${BUILD}-browser/`,import.meta.url));mkdirSync(output,{recursive:true});
const report={build:BUILD,browser:await browser.version(),scope:'Headless Chromium desktop and touch emulation; not real Safari',checks:[]};
try{
  for(const [name,viewport,mobile] of [['desktop',{width:1280,height:800},false],['phone',{width:852,height:393},true],['tablet',{width:1024,height:768},true]]){
    const context=await browser.newContext({viewport,hasTouch:mobile,isMobile:mobile,deviceScaleFactor:1});
    await context.addInitScript(()=>{const Native=window.AudioContext||window.webkitAudioContext;window.__audio=[];window.AudioContext=class extends Native{constructor(...args){super(...args);window.__audio.push(this);}};});
    const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
    if(process.env.SHOOTER_INPUT_TRACE)await page.addInitScript(()=>{window.__pointerTrace=[];for(const name of ['pointerdown','pointerup','pointercancel','touchstart','touchend','touchcancel'])window.addEventListener(name,e=>window.__pointerTrace.push({type:e.type,id:e.pointerId,target:e.target.id,touches:Array.from(e.touches||[]).map(t=>({id:t.identifier,target:t.target.id}))}),true);});
    const failed=[];page.on('response',r=>{if(r.status()>=400)failed.push(r.url());});
    await page.goto(base+'/practice-shooter.html');await page.locator('#start').waitFor();
    await page.screenshot({path:output+name+'-setup.png'});await page.locator('#start').click();await page.waitForTimeout(250);
    assert.equal(await page.locator('#overlay').isVisible(),false);assert.equal(await page.locator('#health').textContent(),'Health ● ● ●');
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
    if(mobile){
      const pad=await page.locator('#pad').boundingBox(),jump=await page.locator('#jump').boundingBox(),cdp=await context.newCDPSession(page);
      const a={x:pad.x+pad.width*.85,y:pad.y+pad.height*.5,id:1},b={x:jump.x+jump.width/2,y:jump.y+jump.height/2,id:2};
      await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[a]});await page.waitForTimeout(100);assert.equal(await page.locator('#pad').getAttribute('data-x'),'1');
      await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[a,b]});assert.match(await page.locator('#jump').getAttribute('class'),/held/);
      a.y=pad.y+pad.height*.20;a.x=pad.x+pad.width*.80;await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[a,b]});assert.equal(await page.locator('#pad').getAttribute('data-y'),'-1');
      await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});assert.equal(await page.locator('#pad').getAttribute('data-x'),'0');
      a.x=pad.x+pad.width*.85;a.y=pad.y+pad.height*.5;
      for(const remaining of [[b],[a]]){
        await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[a,b]});
        // CDP touchEnd names the released contacts; native TouchEvent.touches names those remaining.
        await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:remaining[0]===a?[b]:[a]});
        if(process.env.SHOOTER_INPUT_TRACE)console.log(await page.evaluate(()=>window.__pointerTrace));
        assert.equal(await page.locator('#pad').getAttribute('data-x'),remaining[0]===a?'1':'0');
        assert.equal(await page.locator('#jump').evaluate(e=>e.classList.contains('held')),remaining[0]===b);
        await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
      }
      await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[a,b]});
      await cdp.send('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]});
      assert.equal(await page.locator('#pad').getAttribute('data-x'),'0');assert.equal(await page.locator('#jump').evaluate(e=>e.classList.contains('held')),false);
      await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[a]});
      await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{...a,x:pad.x+pad.width*2}]});assert.equal(await page.locator('#pad').getAttribute('data-x'),'0');
      await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
    }else{await page.keyboard.down('ArrowRight');await page.waitForTimeout(250);assert.equal(await page.locator('#pad').getAttribute('data-x'),'1');await page.keyboard.up('ArrowRight');}
    await page.screenshot({path:output+name+'-play.png'});
    await page.locator('#pause').click();assert.equal(await page.locator('#resume').isVisible(),true);
    await page.evaluate(()=>{const original=Date.now;Date.now=()=>original()+10000;});await page.waitForTimeout(150);assert.match(await page.locator('#clock').textContent(),/^4:/);
    await page.locator('#resume').click();await page.locator('#restart').click();await page.locator('#cancel-restart').click();await page.locator('#resume').click();
    await page.waitForFunction(()=>window.__audio[0]?.state==='running',{},{timeout:3000});
    const audio=await page.evaluate(()=>window.__audio.map(a=>a.state));assert.equal(audio.length,1);assert.equal(audio[0],'running');
    if(name==='phone'){
      await page.setViewportSize({width:393,height:852});await page.waitForTimeout(150);assert.equal(await page.locator('#rotate').isVisible(),true);await page.screenshot({path:output+'phone-portrait.png'});
      await page.setViewportSize(viewport);await page.waitForTimeout(100);assert.equal(await page.locator('#rotate').isVisible(),false);await page.locator('#resume').click();
    }
    await page.evaluate(()=>{const original=Date.now;Date.now=()=>original()+300000;});await page.waitForTimeout(150);assert.equal(await page.locator('#overlay-title').textContent(),'Time window closed');
    assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);report.checks.push({name,passed:true,viewport,audioContext:'one running context before expiry'});await context.close();
  }
  const page=await browser.newPage({viewport:{width:1280,height:800}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'/practice-shooter-standalone.html');await page.locator('#launch').selectOption('BOSS');await page.locator('#start').click();await page.keyboard.down('ArrowRight');await page.waitForTimeout(2300);await page.keyboard.up('ArrowRight');
  await page.screenshot({path:output+'standalone-boss.png'});assert.equal(await page.locator('#checkpoint').textContent(),'BOSS');assert.deepEqual(errors,[]);report.checks.push({name:'standalone package start at boss',passed:true});
  await page.close();
}finally{writeFileSync(output+'report.json',JSON.stringify(report,null,2)+'\n');await browser.close();server?.close();}
console.log(JSON.stringify(report,null,2));
