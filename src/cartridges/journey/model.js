import {HEROES,UPGRADES,LIMITS,ARENA,JOURNEY_BUILD,PROTOCOL} from '../../../public/games/journey/config.js';

const copy = value => structuredClone(value);
const clamp = (v,a,b) => Math.max(a,Math.min(b,v));
const neutral = () => ({x:0,y:0,attack:false});
const failure = message => {throw new Error(message);};

// Pure authoritative state machine. The browser never supplies positions,
// damage, resources, elapsed time or a result. The DO serializes its callers.
export class BrawlModel {
  constructor(handoff,now=Date.now(),saved=null) {
    if(saved){this.s=copy(saved);return;}
    if(!handoff?.runId || !Array.isArray(handoff.members) || handoff.members.length<1 || handoff.members.length>5)failure('A run needs one to five eligible team members.');
    if(new Set(handoff.members.map(m=>m.id)).size!==handoff.members.length)failure('Duplicate team member.');
    this.s={runId:handoff.runId,teamId:handoff.teamId,roomCode:handoff.roomCode,expiresAt:handoff.expiresAt,build:JOURNEY_BUILD,protocol:PROTOCOL,
      phase:'ready',lastAt:now,readyMs:LIMITS.ready,launchMs:LIMITS.launch,activeMs:0,recoveryMs:LIMITS.recovery,resumePhase:null,
      pauses:[],starters:[],players:{},enemies:[],props:[],pickups:[],events:[],eventSeq:0,result:null,revision:0,critical:0};
    for(const [i,m] of handoff.members.entries())this.s.players[m.id]={id:m.id,alias:m.alias||'Player '+(i+1),hero:null,slots:1,upgrades:[],ready:false,connected:false,available:false,epoch:0,seq:-1,lastInput:0,disconnectedAt:now,started:false,
      x:160+i*55,y:260+i*18,facing:1,hp:100,maxHp:100,lives:3,magic:1,capacity:3,input:neutral(),action:'idle',actionMs:0,combo:0,attackCooldown:0,jumpMs:0,respawnMs:0,protectionMs:0,hurtMs:0,shield:0,shieldMs:0,activeMs:0};
  }
  get paused(){return this.s.pauses.length>0;}
  player(id){return this.s.players[id]||failure('Student is not on this team.');}
  event(type,extra={}){this.s.events.push({id:++this.s.eventSeq,type,...extra});this.s.events=this.s.events.slice(-24);}
  changed(critical=false){this.s.revision++;if(critical)this.s.critical++;}
  connect(id,now){this.advance(now);const p=this.player(id);p.connected=true;p.available=true;p.disconnectedAt=null;p.input=neutral();p.seq=-1;p.epoch++;p.lastInput=now;
    // Re-entry does not refill resources, revive or renew protection.
    if(p.started&&p.lives>0){p.x=clamp(p.x,ARENA.left,ARENA.right);p.y=ARENA.near;}
    this.considerRecovery();if(this.s.phase==='ready'&&Object.values(this.s.players).every(m=>m.ready&&m.connected&&m.available))this.launch();
    this.changed();return p.epoch;}
  disconnect(id,epoch,now){this.advance(now);const p=this.player(id);if(p.epoch!==epoch)return;p.connected=false;p.available=false;p.disconnectedAt=now;p.input=neutral();this.changed();this.considerRecovery();}
  availability(id,epoch,value,now){this.advance(now);const p=this.player(id);if(p.epoch!==epoch)return;if(typeof value!=='boolean')failure('Invalid availability.');p.available=value;p.input=neutral();p.disconnectedAt=value?null:now;this.changed();this.considerRecovery();}
  reserve(id,hero,now){this.advance(now);const p=this.player(id);if(this.s.phase!=='ready'||this.paused||p.ready)failure('Hero selection is closed.');
    if(!HEROES.some(h=>h.id===hero))failure('Choose an available hero.');
    if(Object.values(this.s.players).some(other=>other.id!==id&&other.hero===hero))failure('That hero is already selected.');
    p.hero=hero;this.changed(true);}
  grant(id,slots,now){this.advance(now);const p=this.player(id);if(this.s.phase!=='ready'||this.s.readyMs<=0||this.paused||p.ready)failure('Optional preparation is closed.');
    if(!Number.isInteger(slots)||slots!==p.slots+1||slots>3)failure('Invalid personal entitlement.');p.slots=slots;this.changed(true);}
  ready(id,upgrades,now){this.advance(now);const p=this.player(id);if(this.s.phase!=='ready'||this.paused)failure('Readiness is closed.');
    if(!p.connected||!p.available||!p.hero)failure('Connect and choose a hero first.');
    if(!Array.isArray(upgrades)||upgrades.length>p.slots||new Set(upgrades).size!==upgrades.length||upgrades.some(x=>!UPGRADES.some(u=>u.id===x)))failure('Choose only earned, distinct upgrades.');
    p.upgrades=[...upgrades];p.ready=true;this.changed(true);
    if(this.s.readyMs<=0||Object.values(this.s.players).every(m=>m.ready&&m.connected&&m.available))this.launch();}
  launch(){if(this.s.phase!=='ready'||this.paused)return;const selected=Object.values(this.s.players).filter(p=>p.ready&&p.connected&&p.available);
    if(!selected.length)return;this.s.starters=selected.map(p=>p.id);this.s.phase='launch';this.s.readyMs=0;
    selected.forEach((p,i)=>{p.started=true;p.maxHp=p.upgrades.includes('vitality')?125:100;p.hp=p.maxHp;p.capacity=p.upgrades.includes('reserve')?4:3;p.magic=p.capacity-2;p.x=140+i*60;p.y=260+i*18;});
    this.event('launch');this.changed(true);}
  setPause(reason,on,now){this.advance(now);if(on&&!this.s.pauses.includes(reason))this.s.pauses.push(reason);if(!on)this.s.pauses=this.s.pauses.filter(x=>x!==reason);
    for(const p of Object.values(this.s.players))p.input=neutral();this.s.lastAt=now;this.changed(true);}
  considerRecovery(){if(!['launch','running','recovery'].includes(this.s.phase))return;
    const living=this.s.starters.map(id=>this.player(id)).filter(p=>p.lives>0);
    if(!living.length){this.finish('defeat','all_lives_lost');return;}
    const connected=living.some(p=>p.connected&&p.available);
    if(!connected&&this.s.phase!=='recovery'){this.s.resumePhase=this.s.phase;this.s.phase='recovery';this.s.recoveryMs=LIMITS.recovery;for(const p of living)p.input=neutral();this.event('recovering');this.changed(true);}
    else if(connected&&this.s.phase==='recovery'){this.s.phase=this.s.resumePhase;this.s.resumePhase=null;this.event('reconnected');this.changed(true);}}
  input(id,epoch,message,now){this.advance(now);const p=this.player(id);
    if(epoch!==p.epoch||!p.connected||!p.available||!p.started||this.s.phase!=='running'||this.paused||p.lives<=0)return;
    if(!Number.isSafeInteger(message.seq)||message.seq<=p.seq)return;
    if(!Number.isFinite(message.x)||!Number.isFinite(message.y)||Math.abs(message.x)>1||Math.abs(message.y)>1||typeof message.attack!=='boolean'||(message.jump!==undefined&&typeof message.jump!=='boolean')||(message.magic!==undefined&&typeof message.magic!=='boolean'))failure('Invalid input.');
    p.seq=message.seq;p.lastInput=now;p.input={x:message.x,y:message.y,attack:message.attack};
    if(p.respawnMs>0)return;
    if(message.jump&&p.jumpMs<=0&&!p.horseMs){p.jumpMs=700;p.aerialUsed=false;p.action='jump';this.event('jump',{playerId:id});}
    if(message.magic)this.special(p);
  }
  startScene(){this.s.phase='running';const n=this.s.starters.length;
    // Stage 1 is the integration/animation scene, not the authored full level.
    this.s.enemies=Array.from({length:n+1},(_,i)=>({id:'raider-'+i,kind:'raider',x:560+i*60,y:245+(i%3)*45,hp:70,maxHp:70,phase:'walk',timer:600+i*220,facing:-1,hurt:0}));
    this.s.props=Array.from({length:n},(_,i)=>({id:'crate-'+i,x:330+i*80,y:345,hp:16}));
    this.s.pickups=Array.from({length:n},(_,i)=>({id:'magic-'+i,kind:'magic',x:400+i*45,y:245,taken:false}));
    this.event('start');this.changed(true);}
  advance(now){if(!Number.isFinite(now))failure('Invalid server time.');let remaining=Math.max(0,now-this.s.lastAt);this.s.lastAt=Math.max(this.s.lastAt,now);
    if(this.s.phase==='terminal')return;if(now>=this.s.expiresAt){this.finish('interrupted','session_expired');return;}if(this.paused)return;
    this.considerRecovery();
    while(remaining>0&&this.s.phase!=='terminal'){
      if(this.s.phase==='ready'){const used=Math.min(remaining,this.s.readyMs);this.s.readyMs-=used;remaining-=used;if(this.s.readyMs<=0){this.launch();if(this.s.phase==='ready')break;}continue;}
      if(this.s.phase==='launch'){const used=Math.min(remaining,this.s.launchMs);this.s.launchMs-=used;remaining-=used;if(this.s.launchMs<=0)this.startScene();continue;}
      if(this.s.phase==='recovery'){const used=Math.min(remaining,this.s.recoveryMs);this.s.recoveryMs-=used;remaining-=used;if(this.s.recoveryMs<=0)this.finish('interrupted','connection_timeout');continue;}
      if(this.s.phase==='running'){
        const step=Math.min(1000/30,remaining,LIMITS.active-this.s.activeMs);
        // Deadline is exclusive: no attack may resolve at or after 180,000 ms.
        if(this.s.activeMs+step>=LIMITS.active){this.s.activeMs=LIMITS.active;this.finish('retreat','time_limit');break;}
        this.s.activeMs+=step;remaining-=step;this.simulate(step,now-remaining);this.considerRecovery();
      }else break;
    }
    this.changed();
  }
  simulate(dt,wallNow){const seconds=dt/1000;
    const players=this.s.starters.map(id=>this.player(id));
    for(const p of players){
      for(const k of ['actionMs','attackCooldown','jumpMs','protectionMs','hurtMs','shieldMs'])p[k]=Math.max(0,p[k]-dt);
      if(!p.shieldMs)p.shield=0;
      if(p.lives<=0){p.action='down';continue;}
      if(p.respawnMs>0){p.respawnMs=Math.max(0,p.respawnMs-dt);if(!p.respawnMs){p.hp=p.maxHp;p.protectionMs=LIMITS.protection;p.x=180;p.y=330;p.action='idle';this.changed(true);}continue;}
      if(!p.connected||!p.available){p.input=neutral();if(p.horseMs>0)this.horseStep(p,dt);continue;}
      p.activeMs+=dt;if(wallNow-p.lastInput>LIMITS.inputLease)p.input=neutral();
      const len=Math.hypot(p.input.x,p.input.y)||1,scale=Math.max(1,len),speed=p.horseMs?(p.horseMs>300&&p.horseMs<=3300?290:0):160;
      p.x=clamp(p.x+p.input.x/scale*speed*seconds,ARENA.left,ARENA.right);p.y=clamp(p.y+p.input.y/scale*speed*.65*seconds,ARENA.far,ARENA.near);
      if(p.input.x){const facing=Math.sign(p.input.x);if(p.horseMs>0&&facing!==p.facing)p.horseTurnMs=140;p.facing=facing;}
      if(p.horseMs>0)this.horseStep(p,dt);
      if(!p.actionMs&&!p.horseMs)p.action=p.jumpMs?'jump':len&& (p.input.x||p.input.y)?'walk':'idle';
      if(!p.horseMs&&p.input.attack&&p.attackCooldown<=0&&p.actionMs<=0){if(p.jumpMs){if(!p.aerialUsed){p.aerialUsed=true;this.attack(p,14);}}else{const values=p.hero==='bajie'?[14,24]:p.hero==='wujing'?[10,10,12]:p.hero==='prince'?[7,9,14]:[8,8,14];this.attack(p,values[p.combo%values.length]);p.combo++;}}
      for(const item of this.s.pickups){if(item.taken||Math.hypot(p.x-item.x,(p.y-item.y)*2)>28)continue;
        if(item.kind==='magic'&&p.magic<p.capacity){p.magic++;item.taken=true;this.event('pickup',{playerId:p.id});this.changed(true);}}
    }
    const targets=players.filter(p=>p.lives>0&&!p.respawnMs&&(p.connected&&p.available||wallNow-(p.disconnectedAt??0)<LIMITS.withdraw));
    for(const e of this.s.enemies){if(e.hp<=0){e.phase='down';continue;}e.hurt=Math.max(0,e.hurt-dt);if(!targets.length)continue;
      const p=targets.reduce((a,b)=>Math.hypot(b.x-e.x,b.y-e.y)<Math.hypot(a.x-e.x,a.y-e.y)?b:a);
      e.facing=p.x<e.x?-1:1;e.timer-=dt;
      if(e.phase==='windup'&&e.timer<=0){e.phase='attack';e.timer=250;for(const target of targets)if(Math.abs(target.x-e.x)<65&&Math.abs(target.y-e.y)<26&&(!target.jumpMs||target.jumpMs<110))this.hurt(target,12);this.event('enemyAttack',{enemyId:e.id});}
      else if(e.phase==='attack'&&e.timer<=0){e.phase='recover';e.timer=650;}
      else if(e.phase==='recover'&&e.timer<=0){e.phase='walk';e.timer=0;}
      else if(e.phase==='walk'&&!e.hurt){const dx=p.x-e.x,dy=p.y-e.y,dist=Math.hypot(dx,dy)||1;
        if(Math.abs(dx)<56&&Math.abs(dy)<22){e.phase='windup';e.timer=650;}
        else{e.x+=dx/dist*65*seconds;e.y=clamp(e.y+dy/dist*50*seconds,ARENA.far,ARENA.near);}}
    }
    if(players.every(p=>p.lives===0))this.finish('defeat','all_lives_lost');
  }
  attack(p,damage){p.action=p.jumpMs?'air':'attack';p.actionMs=320;p.attackCooldown=p.hero==='bajie'?700:400;const power=p.upgrades.includes('power')?1.2:1;
    this.event('attack',{playerId:p.id});
    for(const e of this.s.enemies)if(e.hp>0&&(e.x-p.x)*p.facing>=-18&&Math.abs(e.x-p.x)<(p.hero==='tang'?200:95)&&Math.abs(e.y-p.y)<30){e.hp=Math.max(0,e.hp-damage*power);e.hurt=180;this.event('hit',{enemyId:e.id});}
    for(const prop of this.s.props)if(prop.hp>0&&Math.abs(prop.x-p.x)<95&&Math.abs(prop.y-p.y)<35){prop.hp-=damage*power;if(prop.hp<=0){this.s.pickups.push({id:prop.id+'-magic',kind:'magic',x:prop.x,y:prop.y,taken:false});this.event('break');this.changed(true);}}
  }
  special(p){if(p.magic<=0||p.horseMs>0||p.actionMs>0||p.respawnMs>0||p.lives<=0)return;p.magic--;p.action='special';p.actionMs=700;
    if(p.hero==='prince'){p.horseMs=3600;p.horseHits={};p.horseImpactMs=0;p.horseTurnMs=0;p.jumpMs=0;p.action='horse-transform';p.actionMs=3600;this.event('special',{playerId:p.id,hero:p.hero});this.changed(true);return;}
    const amount={wukong:72,bajie:60,wujing:54,tang:40,prince:60}[p.hero]*(p.upgrades.includes('focus')?1.2:1);
    // Stage-1 special is an authority/effect sample. Full move timing is stage 2.
    for(const e of this.s.enemies)if(e.hp>0&&Math.abs(e.x-p.x)<200&&Math.abs(e.y-p.y)<80)e.hp=Math.max(0,e.hp-amount);
    if(p.hero==='tang')for(const id of this.s.starters){const ally=this.player(id);if(ally.lives>0&&Math.hypot(p.x-ally.x,p.y-ally.y)<200){ally.shield=Math.max(ally.shield,20);if(!ally.shieldMs)ally.shieldMs=2000;}}
    this.event('special',{playerId:p.id,hero:p.hero});this.changed(true);}
  horseStep(p,dt){
    const before=p.horseMs;p.horseMs=Math.max(0,p.horseMs-dt);p.horseImpactMs=Math.max(0,(p.horseImpactMs||0)-dt);p.horseTurnMs=Math.max(0,(p.horseTurnMs||0)-dt);
    if(p.horseMs>3300){p.action='horse-transform';return;}
    if(p.horseMs<=300){p.action=p.horseMs?'horse-return':'idle';if(!p.horseMs){p.actionMs=0;p.horseHits={};}return;}
    p.action=p.horseImpactMs?'horse-impact':p.horseTurnMs?'horse-turn':p.input.x||p.input.y?'horse':'horse-idle';
    // Charge collisions are server-position based, never an instant area pulse.
    if(p.hurtMs>0||!(p.input.x||p.input.y)||before<=300)return;
    for(const e of this.s.enemies){if(e.hp<=0||Math.abs(e.x-p.x)>58||Math.abs(e.y-p.y)>26)continue;
      const hit=p.horseHits[e.id];if(hit&&(hit.count>=2||this.s.activeMs-hit.at<600))continue;
      e.hp=Math.max(0,e.hp-30*(p.upgrades.includes('focus')?1.2:1));e.hurt=180;p.horseHits[e.id]={count:(hit?.count||0)+1,at:this.s.activeMs};p.horseImpactMs=140;p.action='horse-impact';this.event('hit',{enemyId:e.id,playerId:p.id});
    }
  }
  hurt(p,amount){if(p.hp<=0||p.hurtMs>0||p.protectionMs>0||p.respawnMs>0)return;
    const absorbed=Math.min(p.shield,amount);p.shield-=absorbed;p.hp=Math.max(0,p.hp-(amount-absorbed));p.hurtMs=LIMITS.hurt;p.action='hurt';p.actionMs=260;this.event('hurt',{playerId:p.id});
    if(p.hp===0){p.horseMs=0;p.horseHits={};p.horseImpactMs=0;p.horseTurnMs=0;p.actionMs=0;p.lives--;p.input=neutral();p.action='down';p.respawnMs=p.lives>0?LIMITS.respawn:0;this.changed(true);}}
  finish(outcome,reason){if(this.s.result)return this.s.result;this.s.phase='terminal';for(const p of Object.values(this.s.players))p.input=neutral();
    this.s.result={runId:this.s.runId,teamId:this.s.teamId,build:JOURNEY_BUILD,protocol:PROTOCOL,outcome,reason,activeElapsedMs:Math.round(this.s.activeMs),bossDefeated:outcome==='victory',sample:true,
      players:Object.values(this.s.players).map(p=>({studentId:p.id,hero:p.hero,upgrades:[...p.upgrades],participation:!p.started?'not_started':p.lives<=0?'spectated':p.connected?'active':'disconnected',livesUsed:p.started?3-p.lives:0,activeElapsedMs:Math.round(p.activeMs)}))};
    this.event('result',{outcome,reason});this.changed(true);return this.s.result;}
  snapshot(now=Date.now()){const s=this.s;return {runId:s.runId,build:s.build,protocol:s.protocol,teamId:s.teamId,phase:s.phase,serverNow:now,paused:this.paused,pauses:[...s.pauses],readyMs:s.readyMs,launchMs:s.launchMs,activeMs:s.activeMs,recoveryMs:s.recoveryMs,revision:s.revision,starters:[...s.starters],
    players:Object.values(s.players).map(({input,lastInput,seq,disconnectedAt,...p})=>({...copy(p),visible:!p.started||p.connected&&p.available||now-(disconnectedAt??0)<LIMITS.withdraw})),enemies:copy(s.enemies),props:copy(s.props),pickups:copy(s.pickups),events:copy(s.events),result:copy(s.result)};}
}
