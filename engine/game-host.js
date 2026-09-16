import {GameAudio} from './game-audio.js';

const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export class GameHost {
  constructor(root,{adapter,items=[],run,route,deadline,send,practice=false,paused=false}){
    this.adapter=adapter;this.items=items;this.art=null;this.gameAudio=new GameAudio(this.adapter.media);this.root=root;this.run=run;this.send=send;this.practice=practice;this.deadline=deadline;this.paused=paused;this.input={tank:true};this.localPaused=false;this.mode=run.mode||'action';this.started=run.status==='active';this.seq=run.seq||0;this.pending=null;this.sending=false;this.lastSent=0;this.dead=false;this.ac=new AbortController();
    let saved;try{saved=JSON.parse(localStorage.getItem(`mq-finale-${run.runId}`));}catch{}
    if(saved?.seq>this.seq){this.seq=saved.seq;this.mode=saved.mode||this.mode;}
    this.s=this.adapter.create({...run,route,snapshot:saved?.seq>=run.seq?saved.snapshot:run.snapshot});
    this.render();this.adapter.loadArt().then(art=>{if(!this.dead){this.art=art;this.showOverlay();}}).catch(e=>{if(!this.dead){this.status.textContent='Artwork unavailable. Use the assisted route.';this.artError=e.message;this.showOverlay();}});this.last=performance.now();this.accumulator=0;this.frame=requestAnimationFrame(t=>this.tick(t));
  }
  render(){
    this.root.innerHTML=`<section class="nf-game"><div class="nf-toolbar"><b>${esc(this.adapter.title)}</b><button data-pause>Pause</button><button data-sound>Sound off</button><button data-assist>Assisted route</button><button data-reset>Reset controls</button></div><p class="nf-equipment">${this.run.loadout.length?this.run.loadout.map(id=>esc(this.items.find(i=>i.id===id)?.title)).join(' + '):'Standard kit: 12 rounds, 3 health'}</p><div class="nf-screen"><canvas width="640" height="360" aria-label="Search the city, restore power, and repair the evacuation bus"></canvas><div class="nf-overlay"></div></div><div class="nf-hud" aria-live="off"></div><div class="nf-controls"><div class="nf-pad"><button data-key="up" aria-label="Move forward">&#8593;</button><button data-key="left" aria-label="Turn left">&#8592;</button><button data-key="down" aria-label="Reverse">&#8595;</button><button data-key="right" aria-label="Turn right">&#8594;</button></div><button data-key="run">RUN</button><button class="nf-fire" data-key="fire">FIRE</button><button data-key="interact">SEARCH / USE (hold)</button><button data-map>MAP</button></div><p class="nf-status" role="status"></p></section>`;
    this.canvas=this.root.querySelector('canvas');this.ctx=this.canvas.getContext('2d');if(!this.ctx)this.mode='assisted';this.overlay=this.root.querySelector('.nf-overlay');this.hud=this.root.querySelector('.nf-hud');this.status=this.root.querySelector('.nf-status');
    const on=(el,event,fn)=>el.addEventListener(event,fn,{signal:this.ac.signal});
    this.pointers=new Map();const sync=()=>{for(const k of ['up','down','left','right','fire','run','interact'])this.input[k]=[...this.pointers.values()].includes(k)||this.keys?.has(k);};this.keys=new Set();
    this.root.querySelectorAll('[data-key]').forEach(b=>{on(b,'pointerdown',e=>{e.preventDefault();b.setPointerCapture?.(e.pointerId);this.pointers.set(e.pointerId,b.dataset.key);sync();});for(const event of ['pointerup','pointercancel','lostpointercapture'])on(b,event,e=>{this.pointers.delete(e.pointerId);sync();});});
    for(const event of ['pointerup','pointercancel'])on(window,event,e=>{this.pointers.delete(e.pointerId);sync();});
    const mapping={ArrowUp:'up',w:'up',ArrowDown:'down',s:'down',ArrowLeft:'left',a:'left',ArrowRight:'right',d:'right',' ':'fire',Shift:'run',e:'interact'};
    on(window,'keydown',e=>{if(e.key.toLowerCase()==='m'&&!e.repeat&&!/INPUT|SELECT|TEXTAREA/.test(e.target.tagName))this.s.map=!this.s.map;const k=mapping[e.key];if(k&&!/INPUT|SELECT|TEXTAREA/.test(e.target.tagName)){e.preventDefault();this.keys.add(k);sync();}});
    on(window,'keyup',e=>{const k=mapping[e.key];if(k){this.keys.delete(k);sync();}});
    on(window,'blur',()=>{this.clear();this.localPaused=true;this.gameAudio.pause(true);this.persist();this.showOverlay();});on(document,'visibilitychange',()=>{this.clear();this.persist();});on(window,'pagehide',()=>this.persist());on(window,'orientationchange',()=>this.clear());
    on(this.root.querySelector('[data-map]'),'click',()=>this.s.map=!this.s.map);
    on(this.root.querySelector('[data-reset]'),'click',()=>this.clear());
    on(this.root.querySelector('[data-pause]'),'click',()=>{this.localPaused=!this.localPaused;this.gameAudio.pause(this.localPaused||this.paused);this.clear();this.showOverlay();});
    on(this.root.querySelector('[data-sound]'),'click',async e=>{try{await this.gameAudio.toggle();this.sound=this.gameAudio.enabled;e.target.textContent=this.sound?'Sound on':'Sound off';if(this.sound)this.beep('key');}catch{this.status.textContent='Sound unavailable; the mission can continue.';}});
    on(this.root.querySelector('[data-assist]'),'click',async()=>{if(this.s.outcome)return;this.clear();if(this.started&&!this.practice){const result=await this.transmit('minigame.assist');if(!result)return;}this.mode='assisted';this.persist();this.showOverlay();});
    this.showOverlay();
  }
  clear(){this.input={tank:true};this.keys?.clear();this.pointers?.clear();}
  async transmit(type,extra={}){
    if(this.practice)return true;
    try{await this.send(type,{runId:this.run.runId,configRevision:this.run.configRevision,...extra});return true;}catch(e){if(!this.dead)this.status.textContent=`Connection interrupted: ${e.message}. Your run is retained on this device.`;return false;}
  }
  async start(){
    if(this.starting)return;this.starting=true;this.gameAudio.start().then(failed=>{if(this.dead)return;this.root.querySelector('[data-sound]').textContent='Sound on';if(failed.length)this.status.textContent='Some audio could not load: '+failed.join('; ');}).catch(()=>{if(!this.dead)this.status.textContent="Audio unavailable.";});
    const ok=await this.transmit('minigame.start',{mode:this.mode});this.starting=false;
    if(ok){this.started=true;this.showOverlay();}
  }
  pause(){this.localPaused=true;this.clear();this.showOverlay();}
  resume(){this.localPaused=false;this.showOverlay();}
  snapshot(){return structuredClone(this.s);}
  restore(value){this.s=this.adapter.create({...this.run,snapshot:value,route:this.s.route});this.showOverlay();}
  showOverlay(){
    if(this.dead)return;
    this.overlay.hidden=false;
    if(!this.started){this.overlay.innerHTML=`<h2>${esc(this.adapter.title)}</h2><p>${this.adapter.instructions}</p><p>${this.adapter.controls}</p><button data-start ${this.mode==='action'&&!this.art?'disabled':''}>${this.art||this.mode==='assisted'?'Start mission':'Loading artwork…'}</button>`;this.overlay.querySelector('button').onclick=()=>this.start();}
    else if(this.s.outcome){this.overlay.innerHTML=`<h2>${{success:'You reached the bus',setback:'Sol throws a rescue line',timed_out:'The second pickup finds you',skipped:'Crossing skipped'}[this.s.outcome]}</h2><p>${this.practice?'Practice result only. No classroom evidence is sent.':'Your result is being recorded. The crew’s final decision still stands.'}</p>`;}
    else if(this.paused||this.localPaused){this.overlay.innerHTML=`<h2>${this.paused?'Teacher paused the mission':'Crossing paused'}</h2><p>Use Pause again to resume.</p>`;}
    else if(this.mode==='assisted')this.assisted();
    else this.overlay.hidden=true;
  }
  assisted(){this.adapter.assisted(this.s,this.overlay,()=>{this.persist();if(this.s.outcome)this.finish();else this.assisted();});}
  update(run,paused,deadline){if(paused!==this.paused){this.clear();this.gameAudio.pause(paused||this.localPaused);}this.paused=paused;this.deadline=deadline;if(run?.status==='terminal'){this.s.outcome=run.outcome;this.pending=null;this.finished=true;}if(run?.seq>this.seq)this.seq=run.seq;this.showOverlay();}
  persist(){try{localStorage.setItem(`mq-finale-${this.run.runId}`,JSON.stringify({seq:this.seq,mode:this.mode,snapshot:this.s}));}catch{if(this.status)this.status.textContent='Local recovery storage unavailable. Keep this tab open.';}}
  queue(terminal=false){
    this.seq++;this.pending={type:terminal?'minigame.complete':'minigame.progress',commandId:crypto.randomUUID(),seq:this.seq,activeElapsedMs:Math.round(this.s.time*1000),snapshot:structuredClone(this.s),...(terminal?{outcome:this.s.outcome}:{})};this.persist();this.flush();
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
      if(this.mode==='action'&&this.art){this.accumulator+=dt;while(this.accumulator>=1/60){this.adapter.step(this.s,{...this.input,tank:true},1/60);for(const event of this.s.events)this.beep(event);this.accumulator-=1/60;}}
      else if(this.mode==='assisted')this.s.time+=dt;
      this.gameAudio.music(this.s.outcome?'ending':this.s.enemies.some(e=>e.hp>0&&Math.hypot(e.x-this.s.x,e.y-this.s.y)<180)?'danger':'ambient');
      if(this.s.outcome)this.finish();
    }
    if(this.started&&!this.practice&&now-this.lastSent>5000){this.lastSent=now;if(!this.s.outcome)this.queue();else{if(!this.finished)this.finish();this.flush();}}
    this.draw();this.frame=requestAnimationFrame(t=>this.tick(t));
  }
  beep(event){this.gameAudio.effect(event.type||event);}
  draw(){if(this.ctx&&this.art)this.adapter.render(this.ctx,this.s,this.art);this.hud.textContent=this.adapter.hud(this.s)+' | '+this.adapter.objective(this.s)+' | '+(this.s.message||'');}
  destroy(){this.dead=true;this.persist();cancelAnimationFrame(this.frame);this.ac.abort();this.clear();this.gameAudio.destroy();}
}
