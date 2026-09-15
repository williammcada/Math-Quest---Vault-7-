import {newRun,step,restoreRun,WALLS,WORLD,pickups} from './nightfall-core.js';
import {NIGHTFALL} from './cartridges.js';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export class FinaleHost {
  constructor(root,{run,route,deadline,send,practice=false,paused=false}){
    this.root=root;this.run=run;this.send=send;this.practice=practice;this.deadline=deadline;this.paused=paused;this.input={};this.localPaused=false;this.mode=run.mode||'action';this.started=run.status==='active';this.seq=run.seq||0;this.pending=null;this.sending=false;this.lastSent=0;this.dead=false;this.ac=new AbortController();
    let saved;try{saved=JSON.parse(localStorage.getItem(`mq-finale-${run.runId}`));}catch{}
    if(saved?.seq>this.seq){this.seq=saved.seq;this.mode=saved.mode||this.mode;}
    this.s=restoreRun(saved?.seq>=run.seq?saved.snapshot:run.snapshot,run.loadout||[],route);
    this.render();this.last=performance.now();this.accumulator=0;this.frame=requestAnimationFrame(t=>this.tick(t));
  }
  render(){
    this.root.innerHTML=`<section class="nf-game"><div class="nf-toolbar"><b>LAST BUS OUT</b><button data-pause>Pause</button><button data-sound>Sound off</button><button data-assist>Assisted route</button><button data-reset>Reset controls</button></div><p class="nf-equipment">${this.run.loadout.length?this.run.loadout.map(id=>esc(NIGHTFALL.items.find(i=>i.id===id)?.title)).join(' + '):'Standard kit: 36 rounds, 3 health'}</p><div class="nf-screen"><canvas width="640" height="360" aria-label="Nightfall street crossing: collect the key, then reach the bus"></canvas><div class="nf-overlay"></div></div><div class="nf-hud" aria-live="off"></div><div class="nf-controls"><div class="nf-pad"><button data-key="up" aria-label="Move up">&#8593;</button><button data-key="left" aria-label="Move left">&#8592;</button><button data-key="down" aria-label="Move down">&#8595;</button><button data-key="right" aria-label="Move right">&#8594;</button></div><button class="nf-fire" data-key="fire">FIRE</button></div><p class="nf-status" role="status"></p></section>`;
    this.canvas=this.root.querySelector('canvas');this.ctx=this.canvas.getContext('2d');if(!this.ctx)this.mode='assisted';this.overlay=this.root.querySelector('.nf-overlay');this.hud=this.root.querySelector('.nf-hud');this.status=this.root.querySelector('.nf-status');
    const on=(el,event,fn)=>el.addEventListener(event,fn,{signal:this.ac.signal});
    this.pointers=new Map();const sync=()=>{for(const k of ['up','down','left','right','fire'])this.input[k]=[...this.pointers.values()].includes(k)||this.keys?.has(k);};this.keys=new Set();
    this.root.querySelectorAll('[data-key]').forEach(b=>{on(b,'pointerdown',e=>{e.preventDefault();b.setPointerCapture?.(e.pointerId);this.pointers.set(e.pointerId,b.dataset.key);sync();});for(const event of ['pointerup','pointercancel','lostpointercapture'])on(b,event,e=>{this.pointers.delete(e.pointerId);sync();});});
    for(const event of ['pointerup','pointercancel'])on(window,event,e=>{this.pointers.delete(e.pointerId);sync();});
    const mapping={ArrowUp:'up',w:'up',ArrowDown:'down',s:'down',ArrowLeft:'left',a:'left',ArrowRight:'right',d:'right',' ':'fire'};
    on(window,'keydown',e=>{const k=mapping[e.key];if(k&&!/INPUT|SELECT|TEXTAREA/.test(e.target.tagName)){e.preventDefault();this.keys.add(k);sync();}});
    on(window,'keyup',e=>{const k=mapping[e.key];if(k){this.keys.delete(k);sync();}});
    on(window,'blur',()=>{this.clear();this.persist();});on(document,'visibilitychange',()=>{this.clear();this.persist();});on(window,'pagehide',()=>this.persist());on(window,'orientationchange',()=>this.clear());
    on(this.root.querySelector('[data-reset]'),'click',()=>this.clear());
    on(this.root.querySelector('[data-pause]'),'click',()=>{this.localPaused=!this.localPaused;this.clear();this.showOverlay();});
    on(this.root.querySelector('[data-sound]'),'click',async e=>{try{this.audio ||= new (window.AudioContext||window.webkitAudioContext)();await this.audio.resume();this.sound=!this.sound;e.target.textContent=this.sound?'Sound on':'Sound off';if(this.sound)this.beep('key');}catch{this.status.textContent='Sound unavailable; the mission can continue.';}});
    on(this.root.querySelector('[data-assist]'),'click',async()=>{if(this.s.outcome)return;this.clear();if(this.started&&!this.practice){const result=await this.transmit('minigame.assist');if(!result)return;}this.mode='assisted';this.persist();this.showOverlay();});
    this.showOverlay();
  }
  clear(){this.input={};this.keys?.clear();this.pointers?.clear();}
  async transmit(type,extra={}){
    if(this.practice)return true;
    try{await this.send(type,{runId:this.run.runId,configRevision:this.run.configRevision,...extra});return true;}catch(e){if(!this.dead)this.status.textContent=`Connection interrupted: ${e.message}. Your run is retained on this device.`;return false;}
  }
  async start(){
    if(this.starting)return;this.starting=true;
    const ok=await this.transmit('minigame.start',{mode:this.mode});this.starting=false;
    if(ok){this.started=true;this.showOverlay();}
  }
  pause(){this.localPaused=true;this.clear();this.showOverlay();}
  resume(){this.localPaused=false;this.showOverlay();}
  snapshot(){return structuredClone(this.s);}
  restore(value){this.s=restoreRun(value,this.run.loadout,this.s.route);this.showOverlay();}
  showOverlay(){
    if(this.dead)return;
    this.overlay.hidden=false;
    if(!this.started){this.overlay.innerHTML='<h2>One last crossing</h2><p>Collect the gold key in the north-east. Then reach the green bus in the south-east. Fire auto-aims at the nearest visible target. You can avoid enemies; no kills are required.</p><p>Move: arrows / WASD. Fire: Space. Touch controls are below.</p><button data-start>Start 90-second crossing</button>';this.overlay.querySelector('button').onclick=()=>this.start();}
    else if(this.s.outcome){this.overlay.innerHTML=`<h2>${{success:'You reached the bus',setback:'Sol throws a rescue line',timed_out:'The second pickup finds you',skipped:'Crossing skipped'}[this.s.outcome]}</h2><p>${this.practice?'Practice result only. No classroom evidence is sent.':'Your result is being recorded. The crew’s final decision still stands.'}</p>`;}
    else if(this.paused||this.localPaused){this.overlay.innerHTML=`<h2>${this.paused?'Teacher paused the mission':'Crossing paused'}</h2><p>The team window still applies to a personal pause.</p>`;}
    else if(this.mode==='assisted')this.assisted();
    else this.overlay.hidden=true;
  }
  assisted(){
    const scenes=[['Choose your approach','The open avenue has no cover. The service alley has concrete barriers and a clear path north.',['Use the service alley','Cross the open avenue']],['Pass the crowd','A group blocks the direct road. A side passage behind a parked van is clear.',['Take the clear side passage','Walk through the crowd']],['Open the barrier','You have the override key. The marked green bus is waiting behind the locked barrier.',['Use the key and board the bus','Wait in the security booth']]];
    const n=Math.min(2,this.s.assistStep),[title,text,options]=scenes[n];
    this.overlay.innerHTML=`<h2>${title}</h2><p>${text}</p>${options.map((o,i)=>`<button data-answer="${i}">${o}</button>`).join('')}<p>Equipment remaining: ${this.s.vest} vest blocks, ${this.s.medkit} medical use, ${this.s.ammo} rounds.</p>`;
    this.overlay.querySelectorAll('[data-answer]').forEach(b=>b.onclick=()=>{if(b.dataset.answer==='0'){this.s.assistStep++;if(n===1)this.s.key=true;if(n===2){this.s.outcome='success';this.finish();}else this.assisted();}else{b.disabled=true;b.textContent='Exposed route. Choose the safer passage.';if(this.s.vest){this.s.vest--;this.s.blocks++;}else if(this.s.medkit){this.s.medkit--;this.s.heals++;}this.persist();}});
    if(n===1&&(this.run.loadout.includes('ammo-pouch')||this.run.loadout.includes('carbine'))){
      const cost=this.s.damage===2?3:6,button=document.createElement('button');button.textContent=`Cover the crossing: use ${cost} rounds${this.s.damage===2?' (carbine efficiency)':''}`;button.disabled=this.s.ammo<cost;button.onclick=()=>{this.s.ammo-=cost;this.s.shots+=cost;this.s.assistStep++;this.s.key=true;this.persist();this.assisted();};this.overlay.append(button);
    }
  }
  update(run,paused,deadline){if(paused&&!this.paused)this.clear();this.paused=paused;this.deadline=deadline;if(run?.status==='terminal'){this.s.outcome=run.outcome;this.pending=null;this.finished=true;}if(run?.seq>this.seq)this.seq=run.seq;this.showOverlay();}
  persist(){try{localStorage.setItem(`mq-finale-${this.run.runId}`,JSON.stringify({seq:this.seq,mode:this.mode,snapshot:this.s}));}catch{if(this.status)this.status.textContent='Local recovery storage unavailable. Keep this tab open.';}}
  queue(terminal=false){
    this.seq++;this.pending={type:terminal?'minigame.complete':'minigame.progress',commandId:crypto.randomUUID(),seq:this.seq,activeElapsedMs:Math.min(90000,Math.round(this.s.time*1000)),snapshot:structuredClone(this.s),...(terminal?{outcome:this.s.outcome}:{})};this.persist();this.flush();
  }
  async flush(){
    if(this.sending||!this.pending||this.dead||this.practice)return;
    this.sending=true;const p=this.pending;const {type,...body}=p;const ok=await this.transmit(type,body);this.sending=false;
    if(ok&&this.pending===p){this.pending=null;if(!this.dead)this.status.textContent=p.outcome?'Result recorded. Waiting for the rest of your crew.':'Progress saved.';}
  }
  finish(){if(this.finished)return;this.finished=true;this.clear();this.queue(true);this.showOverlay();}
  tick(now){
    if(this.dead)return;const dt=Math.min(.1,(now-this.last)/1000);this.last=now;
    if(this.started&&!this.paused&&!this.localPaused&&!document.hidden&&!this.s.outcome){
      if(this.mode==='action'){this.accumulator+=dt;while(this.accumulator>=1/60){step(this.s,this.input);for(const event of this.s.events)this.beep(event);this.accumulator-=1/60;}}
      else this.s.time=Math.min(90,this.s.time+dt);
      if(this.s.time>=90&&!this.s.outcome)this.s.outcome='timed_out';
      if(this.s.outcome)this.finish();
    }
    if(this.started&&!this.practice&&now-this.lastSent>5000){this.lastSent=now;if(!this.s.outcome)this.queue();else{if(!this.finished)this.finish();this.flush();}}
    this.draw();this.frame=requestAnimationFrame(t=>this.tick(t));
  }
  beep(event){if(!this.sound||!this.audio||this.audio.state!=='running')return;const now=this.audio.currentTime;if(now<(this.lastBeep||0)+.09)return;this.lastBeep=now;const o=this.audio.createOscillator(),g=this.audio.createGain();o.type=event==='shot'?'square':'sine';o.frequency.value={shot:150,hit:75,shield:550,key:880,pickup:660,success:1100}[event]||330;g.gain.setValueAtTime(.035,now);g.gain.exponentialRampToValueAtTime(.001,now+.12);o.connect(g);g.connect(this.audio.destination);o.start();o.stop(now+.13);}
  draw(){
    if(!this.ctx)return;
    const c=this.ctx,s=this.s,ox=Math.max(0,Math.min(320,s.x-320)),oy=Math.max(0,Math.min(280,s.y-180));
    c.fillStyle='#263d46';c.fillRect(0,0,640,360);c.save();c.translate(-ox,-oy);
    c.fillStyle='#40555c';for(let x=0;x<960;x+=32)for(let y=0;y<640;y+=32){c.fillRect(x+1,y+1,30,30);}
    c.fillStyle='#a0a793';for(let y=112;y<608;y+=64)c.fillRect(124,y,3,28);for(let x=176;x<920;x+=64)c.fillRect(x,494,28,3);
    WALLS.forEach((w,i)=>{c.fillStyle='#172a30';c.fillRect(w.x+7,w.y+9,w.w,w.h);c.fillStyle='#687d83';c.fillRect(w.x,w.y,w.w,w.h);c.fillStyle='#9bafb0';c.fillRect(w.x,w.y,w.w,5);c.fillStyle='#243c45';c.fillRect(w.x+12,w.y+15,w.w-24,w.h-30);c.fillStyle='#e9c577';for(let x=w.x+24;x<w.x+w.w-16;x+=40)c.fillRect(x,w.y+w.h-23,20,9);c.fillStyle='#e5f0e8';c.font='bold 12px system-ui';c.fillText(i===0?(s.route==='clinic'?'CLINIC':'DEPOT'):i===1?'TERMINAL':'NIGHTFALL',w.x+20,w.y+40);});
    for(const p of pickups(s.route))if(!s.picked.includes(p.id)){c.fillStyle=p.kind==='ammo'?'#e6ba66':'#e8f5ec';c.fillRect(p.x-9,p.y-9,18,18);c.fillStyle='#24684d';c.font='bold 15px system-ui';c.fillText(p.kind==='ammo'?'A':'+',p.x-5,p.y+5);}
    c.fillStyle='#319d79';c.fillRect(800,512,64,80);c.fillStyle='#c4e7e1';c.fillRect(807,519,50,16);c.fillStyle='#1a3533';for(let i=0;i<3;i++)c.fillRect(807+i*17,549,11,20);c.fillStyle='#ebfbc5';c.fillRect(803,588,9,5);c.fillRect(852,588,9,5);c.font='bold 11px system-ui';c.fillText('BUS',820,506);
    if(!s.key){c.strokeStyle='#ffdc67';c.lineWidth=4;c.beginPath();c.arc(832,154,8,0,Math.PI*2);c.moveTo(832,162);c.lineTo(832,178);c.lineTo(839,178);c.stroke();c.font='bold 12px system-ui';c.fillStyle='#fff2ae';c.fillText('OVERRIDE KEY',784,133);}
    const actor=(x,y,color,size=12)=>{c.fillStyle='#14292a';c.beginPath();c.ellipse(x,y+10,size,6,0,0,Math.PI*2);c.fill();c.fillStyle=color;c.fillRect(x-size/2,y-5,size,16);c.fillStyle='#d2c5a6';c.beginPath();c.arc(x,y-9,6,0,Math.PI*2);c.fill();const gait=Math.sin(s.time*10)*3;c.fillStyle='#172d32';c.fillRect(x-6,y+10,5,8+gait);c.fillRect(x+1,y+10,5,8-gait);};
    for(const e of s.enemies){if(e.warning>0){c.strokeStyle='#ffba86';c.beginPath();c.arc(e.x,e.y,22,0,Math.PI*2);c.stroke();}else actor(e.x,e.y,e.kind==='runner'?'#dc9877':e.kind==='blocker'?'#c7b167':'#95af72',e.kind==='blocker'?22:14);}
    if(s.immune===0||Math.floor(s.time*12)%2===0)actor(s.x,s.y,'#70d5ed',16);
    c.fillStyle='#ffe393';for(const b of s.bullets)c.fillRect(b.x-2,b.y-2,4,4);
    c.restore();
    // Objective pointer remains visible when the target is outside the camera.
    const target=s.key?WORLD.bus:WORLD.key,tx=Math.max(20,Math.min(620,target.x-ox)),ty=Math.max(25,Math.min(335,target.y-oy));c.strokeStyle=s.key?'#83ffd2':'#ffe393';c.lineWidth=2;c.strokeRect(tx-12,ty-12,24,24);
    this.hud.textContent=`${Math.ceil(90-s.time)}s | Health ${s.health}/3 | Ammo ${s.ammo} | Vest ${s.vest} | Medkit ${s.medkit} | Damage ${s.damage} | ${s.key?'KEY FOUND - TO BUS':'FIND KEY'}`;
  }
  destroy(){this.dead=true;this.persist();cancelAnimationFrame(this.frame);this.ac.abort();this.clear();this.audio?.close();}
}
