import {ARENA} from '../../../public/games/journey/config.js';

export const STAGES=['Mountain Path','Cave Approach','Ruined Shrine','Courtyard Supplies','Nezha'];
export const ROLES={
  raider:{hp:70,speed:65,reach:56,warning:650,damage:12,recovery:650},
  leaper:{hp:60,speed:85,reach:175,warning:800,damage:14,recovery:900},
  caster:{hp:50,speed:45,reach:250,warning:850,damage:12,recovery:1100},
  shield:{hp:100,speed:50,reach:60,warning:800,damage:14,recovery:850},
  brute:{hp:160,speed:35,reach:90,warning:1000,damage:20,recovery:1100}
};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const overlaps=(p,x,y,reach=65,depth=26)=>Math.abs(p.x-x)<reach&&Math.abs(p.y-y)<depth;
const grounded=p=>!p.jumpMs||p.jumpMs<110;

export function waveKinds(stage,n){
  if(stage===0)return Array(2+n).fill('raider');
  if(stage===1)return Array.from({length:2+2*n},(_,i)=>['raider','leaper','caster'][i%3]);
  if(stage===2)return Array.from({length:3+2*n},(_,i)=>['shield','brute','caster','leaper','raider'][i%5]);
  return [];
}
export function startLevel(m){
  m.s.level={stage:-1,name:'',enteredAt:0,queue:[],spawnIn:0,spawned:0,withdrawn:0,bossWarning:false};
  m.s.projectiles=[];m.s.projectileSeq=0;enterStage(m,0);
}
export function enterStage(m,stage){
  const s=m.s,l=s.level,n=s.starters.length;
  if(stage<=l.stage)return;
  l.withdrawn+=s.enemies.filter(e=>e.hp>0).length;
  s.enemies=[];s.projectiles=[];s.props=[];l.stage=stage;l.name=STAGES[stage];l.enteredAt=s.activeMs;
  l.queue=waveKinds(stage,n).map((kind,i)=>({id:`stage-${stage}-${i}`,kind,index:i}));l.spawnIn=0;
  // Two authored crates per starter in each pre-boss arena. Stable stock IDs
  // allow stage release and forced arrival to share an exactly-once path.
  if(stage<4)s.props=supplies(stage,n).map(item=>({...item,id:'crate-'+item.id,pickupId:item.id,hp:16}));
  if(stage===2)for(let i=0;i<n;i++)s.pickups.push({id:`health-${i}`,kind:'health',x:330+i*75,y:310,taken:false});
  if(stage===4){
    for(let part=0;part<4;part++)for(const item of supplies(part,n))reveal(m,item);
    for(let i=0;i<n;i++){
      reveal(m,{id:`supply-4-${i}`,kind:'magic',x:280+i*85,y:245});
      reveal(m,{id:`health-${i}`,kind:'health',x:330+i*75,y:310});
    }
    s.enemies=[{id:'nezha',kind:'nezha',x:780,y:295,hp:650*n,maxHp:650*n,phase:'reposition',timer:1100,facing:-1,hurt:0,moveIndex:0,targetIndex:0,lastStagger:-2000,move:null,hitIds:[]}];
  }
  m.event('stage',{stage,name:l.name});m.changed(true);
}
export function supplies(stage,n){
  return Array.from({length:2*n},(_,i)=>({
    id:i<n?`supply-${stage}-${i}`:`bonus-${stage}-${i-n}`,
    kind:i<n||stage%2===0?'magic':'health',
    x:190+(i%n)*130+(i>=n?55:0),y:240+(i>=n?95:0)
  }));
}
function reveal(m,item){if(!m.s.pickups.some(p=>p.id===item.id))m.s.pickups.push({...item,taken:false});}
function releaseCrates(m){
  for(const p of m.s.props)if(p.hp>0&&p.pickupId)reveal(m,{id:p.pickupId,kind:p.kind||'magic',x:p.x,y:p.y});
}
export function levelStep(m,dt){
  const s=m.s,l=s.level;if(!l)return;
  if(s.activeMs>=117000&&!l.bossWarning&&l.stage<4){l.bossWarning=true;m.event('bossWarning');m.changed(true);}
  if(s.activeMs>=120000&&l.stage<4){releaseCrates(m);enterStage(m,4);return;}
  if(l.stage===4)return;
  l.spawnIn-=dt;
  if(l.queue.length&&l.spawnIn<=0&&s.enemies.filter(e=>e.hp>0).length<Math.min(8,s.starters.length+3)){
    const {id,kind,index}=l.queue.shift(),r=ROLES[kind],left=index%2===1;
    // Entrance is a harmless warning phase inside clamped, visible bounds.
    s.enemies=s.enemies.filter(e=>e.hp>0);
    s.enemies.push({id,kind,x:left?72:888,y:245+(index%3)*45,hp:r.hp,maxHp:r.hp,phase:'entrance',timer:700,facing:left?1:-1,hurt:0});
    l.spawnIn=900;l.spawned++;m.event('entrance',{enemyId:id,kind});
  }
  if(!l.queue.length&&!s.enemies.some(e=>e.hp>0)&&s.activeMs-l.enteredAt>=(l.stage===3?3000:4000)){
    releaseCrates(m);enterStage(m,l.stage+1);
  }
}
function projectile(m,e,p,kind,damage,speed,life){
  const dx=p.x-e.x,dy=p.y-e.y,dist=Math.hypot(dx,dy)||1;
  m.s.projectiles.push({id:'shot-'+(++m.s.projectileSeq),owner:e.id,kind,x:e.x,y:e.y,originX:e.x,originY:e.y,vx:dx/dist*speed,vy:dy/dist*speed,damage,age:0,life,returning:false,hitIds:[]});
}
export function projectileStep(m,dt,targets){
  for(const b of m.s.projectiles||[]){
    b.age+=dt;
    if(b.kind==='ring'&&!b.returning&&b.age>=b.life/2){b.returning=true;b.vx=-b.vx;b.vy=-b.vy;b.hitIds=[];}
    b.x+=b.vx*dt/1000;b.y+=b.vy*dt/1000;
    for(const p of targets)if(!b.hitIds.includes(p.id)&&overlaps(p,b.x,b.y,22,18)&&grounded(p)){m.hurt(p,b.damage);b.hitIds.push(p.id);}
  }
  m.s.projectiles=(m.s.projectiles||[]).filter(b=>b.age<b.life);
}
function strike(m,e,targets,damage,reach,depth=26,aerial=false){
  for(const p of targets)if(overlaps(p,e.x,e.y,reach,depth)&&(aerial||grounded(p))&&(p.x-e.x)*e.facing>=-18)m.hurt(p,damage);
  m.event('enemyAttack',{enemyId:e.id});
}
export function enemyStep(m,e,dt,targets){
  if(e.hp<=0){e.phase='down';return;}
  if(e.kind==='nezha'){bossStep(m,e,dt,targets);return;}
  const r=ROLES[e.kind]||ROLES.raider;e.hurt=Math.max(0,e.hurt-dt);e.timer-=dt;
  if(e.phase==='entrance'){if(e.timer<=0)e.phase='walk';return;}
  // Telegraph/committed phases keep their original facing and target point.
  if(e.phase==='windup'&&e.timer<=0){
    e.phase='attack';e.timer=e.kind==='leaper'?450:250;
    if(e.kind==='caster')projectile(m,e,e.aim,'talisman',r.damage,220,1800);
    else if(e.kind!=='leaper')strike(m,e,targets,r.damage,r.reach+9);
  }else if(e.phase==='attack'){
    if(e.kind==='leaper'){
      e.x=clamp(e.x+(e.aim.x-e.x)*Math.min(1,dt/Math.max(dt,e.timer+dt)),ARENA.left,ARENA.right);
      e.y=clamp(e.y+(e.aim.y-e.y)*Math.min(1,dt/Math.max(dt,e.timer+dt)),ARENA.far,ARENA.near);
      if(e.timer<=0)strike(m,e,targets,r.damage,65,30,true);
    }
    if(e.timer<=0){e.phase='recover';e.timer=r.recovery;}
  }else if(e.phase==='recover'&&e.timer<=0)e.phase='walk';
  else if(e.phase==='walk'&&targets.length&&!e.hurt){
    const p=targets.reduce((a,b)=>Math.hypot(b.x-e.x,b.y-e.y)<Math.hypot(a.x-e.x,a.y-e.y)?b:a);
    e.facing=p.x<e.x?-1:1;const dx=p.x-e.x,dy=p.y-e.y,d=Math.hypot(dx,dy)||1;
    if(Math.abs(dx)<r.reach&&Math.abs(dy)<(e.kind==='leaper'?80:24)){
      e.phase='windup';e.timer=r.warning;e.aim={x:p.x,y:p.y};
    }else{e.x=clamp(e.x+dx/d*r.speed*dt/1000,ARENA.left,ARENA.right);e.y=clamp(e.y+dy/d*r.speed*.77*dt/1000,ARENA.far,ARENA.near);}
  }
}
export const BOSS_MOVES={spear:{warning:600,attack:550,recovery:800},ring:{warning:700,attack:2000,recovery:900},rush:{warning:900,attack:1300,recovery:1000}};
function bossStep(m,e,dt,targets){
  e.hurt=0;e.timer-=dt;
  if(e.phase==='reposition'){
    if(!targets.length)return;
    const p=targets[e.targetIndex%targets.length];
    const wantedX=clamp(p.x+(e.x>=p.x?105:-105),ARENA.left+30,ARENA.right-30),dx=wantedX-e.x,dy=p.y-e.y,d=Math.hypot(dx,dy)||1;
    e.x=clamp(e.x+dx/d*Math.min(d,130*dt/1000),ARENA.left,ARENA.right);e.y=clamp(e.y+dy/d*Math.min(d,100*dt/1000),ARENA.far,ARENA.near);
    e.facing=p.x<e.x?-1:1;
    if(e.timer<=0){e.move=['spear','ring','rush'][e.moveIndex++%3];e.targetId=p.id;e.targetIndex++;e.aim={x:p.x,y:p.y};e.laneY=e.y;e.phase='windup';e.timer=BOSS_MOVES[e.move].warning;m.event('bossTelegraph',{move:e.move,targetId:p.id});}
    return;
  }
  const move=BOSS_MOVES[e.move];if(!move)return;
  if(e.phase==='windup'&&e.timer<=0){
    e.phase='attack';e.timer=move.attack;e.secondStrike=false;e.hitIds=[];
    if(e.move==='spear')strike(m,e,targets,14,130);
    if(e.move==='ring')projectile(m,e,e.aim,'ring',12,260,2000);
    return;
  }
  if(e.phase==='attack'){
    if(e.move==='spear'&&!e.secondStrike&&e.timer<=move.attack-220){e.secondStrike=true;strike(m,e,targets,14,130);}
    if(e.move==='rush'){
      e.x=clamp(e.x+e.facing*520*dt/1000,ARENA.left,ARENA.right);
      for(const p of targets)if(!e.hitIds.includes(p.id)&&overlaps(p,e.x,e.laneY,55,22)&&grounded(p)){m.hurt(p,20);e.hitIds.push(p.id);}
    }
    if(e.timer<=0){e.phase='recover';e.timer=move.recovery;}
  }else if(e.phase==='recover'&&e.timer<=0){e.phase='reposition';e.timer=e.hp<e.maxHp/2?880:1100;}
}

export function damageEnemy(m,e,amount,p,special=false){
  if(e.hp<=0||e.phase==='entrance')return;
  // Shield faces its attacker: ordinary frontal damage is reduced, not erased.
  if(e.kind==='shield'&&!special&&(p.x-e.x)*e.facing>0)amount*=.2;
  e.hp=Math.max(0,e.hp-amount);
  if(e.kind==='nezha'){
    if(special&&e.phase==='recover'&&m.s.activeMs-e.lastStagger>=2000){e.timer+=250;e.lastStagger=m.s.activeMs;}
  }else e.hurt=180;
  m.event('hit',{enemyId:e.id,playerId:p.id});
}
