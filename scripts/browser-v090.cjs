const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.MQ_CHROMIUM?{executablePath:process.env.MQ_CHROMIUM}:{}),args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu']});
 const failures=[],measurements=[];fs.mkdirSync('qa/v090',{recursive:true});
 try{
  for(const game of ['nightfall','vault'])for(const viewport of [{width:1024,height:768},{width:768,height:1024},{width:390,height:844}]){
   const page=await browser.newPage({viewport,hasTouch:true,deviceScaleFactor:2});page.on('pageerror',e=>failures.push(`${game}: ${e.message}`));
   await page.goto('http://127.0.0.1:5187/'+(game==='nightfall'?'practice-nightfall.html':'dev-extraction.html'));
   await page.locator(game==='nightfall'?'[data-start]':'[data-run=start]').click();
   await page.waitForTimeout(500);
   const sizes=await page.locator('[data-game-key]').evaluateAll(buttons=>buttons.map(b=>{const r=b.getBoundingClientRect();return {label:b.textContent,x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom};}));
   for(const r of sizes){assert.ok(r.width>=55.9&&r.height>=55.9,`${game}: small ${r.label}`);assert.ok(r.x>=0&&r.y>=0&&r.right<=viewport.width+1&&r.bottom<=viewport.height+1,`${game}: out of view ${JSON.stringify(r)} at ${JSON.stringify(viewport)}`);}
   assert.equal(await page.evaluate(()=>document.querySelector('.mq-focus').scrollHeight<=innerHeight+2),true,`${game}: game requires scrolling`);
   await page.locator(game==='nightfall'?'[data-help]':'[data-run=help]').click();assert.match(await page.locator(game==='nightfall'?'.nf-overlay':'.stealth-overlay').innerText(),/one live run/i);
   await page.locator(game==='nightfall'?'[data-pause]':'[data-run=resume]').click();
   if(viewport.width===1024){await page.screenshot({path:`qa/v090/${game}-ipad-landscape.png`});const text=await page.locator(game==='nightfall'?'.nf-status':'.stealth-connection').innerText();assert.ok(!text.includes('could not load'),text);}
   measurements.push({game,viewport,buttons:sizes.length,allControlsInView:true});await page.close();
  }
  // Decode actual bundled tracks/effects in a real browser; no external audio service.
  const audio=await browser.newPage();await audio.goto('http://127.0.0.1:5187/practice-nightfall.html');
  const decoded=await audio.evaluate(async()=>{const ctx=new AudioContext(),paths=['ambient.mp3','danger.mp3','ending.mp3','effects.wav'],result=[];for(const p of paths){const response=await fetch('./assets/nightfall/city/'+p);const b=await ctx.decodeAudioData(await response.arrayBuffer());result.push({file:p,duration:b.duration,channels:b.numberOfChannels});}await ctx.close();return result;});
  assert.ok(decoded.every(a=>a.duration>0));assert.deepEqual(failures,[]);fs.writeFileSync('qa/v090/browser-results.json',JSON.stringify({measurements,decoded,errors:failures,physicalIPad:false},null,2));
  console.log('v0.9 browser QA passed: both games at three touch viewport sizes; controls visible and >=56px; help/pause; four audio decodes; no page exceptions.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
