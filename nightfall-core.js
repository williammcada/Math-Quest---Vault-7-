export const WORLD={width:960,height:640,key:{x:832,y:160},bus:{x:832,y:544}};
export const WALLS=[{x:160,y:224,w:192,h:192},{x:448,y:224,w:256,h:192},{x:160,y:32,w:480,h:64}];
export function newRun(loadout=[],route='clinic') {
  return {revision:'nightfall-1',x:80,y:544,health:3,ammo:loadout.includes('ammo-pouch')?60:36,vest:loadout.includes('vest')?2:0,medkit:loadout.includes('medkit')?1:0,damage:loadout.includes('carbine')?2:1,loadout:[...loadout],route,time:0,immune:0,cooldown:0,key:false,checkpoint:0,shots:0,hits:0,blocks:0,heals:0,spawnWave:0,enemies:[],bullets:[],picked:[],outcome:null,events:[],assistStep:0};
}
export const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const fields=new WeakMap();
function directionField(s){
  let cached=fields.get(s);if(cached&&s.time-cached.at<.5)return cached.cells;
  const cells=new Int16Array(600).fill(-1),x=Math.floor(s.x/32),y=Math.floor(s.y/32),queue=[y*30+x];cells[queue[0]]=0;
  for(let i=0;i<queue.length;i++){const at=queue[i],cx=at%30,cy=Math.floor(at/30);for(const [nx,ny] of [[cx-1,cy],[cx+1,cy],[cx,cy-1],[cx,cy+1]]){const n=ny*30+nx;if(nx<0||ny<0||nx>=30||ny>=20||cells[n]>=0||solid(nx*32+16,ny*32+16,11))continue;cells[n]=cells[at]+1;queue.push(n);}}
  fields.set(s,{at:s.time,cells});return cells;
}
function solid(x,y,r=12){return x<r||y<r||x>948||y>628||WALLS.some(w=>x+r>w.x&&x-r<w.x+w.w&&y+r>w.y&&y-r<w.y+w.h);}
export function clearLine(a,b){const n=Math.ceil(distance(a,b)/8);for(let i=1;i<n;i++)if(solid(a.x+(b.x-a.x)*i/n,a.y+(b.y-a.y)*i/n,1))return false;return true;}
export function pickups(route){return [{id:'ammo1',x:96,y:176,kind:'ammo'},{id:'ammo2',x:route==='clinic'?768:880,y:320,kind:'ammo'},{id:'health',x:384,y:route==='clinic'?160:464,kind:'health'}];}
export function damagePlayer(s){
  if(s.immune>0)return;
  s.immune=1.25;
  if(s.vest){s.vest--;s.blocks++;s.events.push('shield');return;}
  s.health--;s.hits++;s.events.push('hit');
  if(s.health===1&&s.medkit){s.medkit--;s.health++;s.heals++;s.events.push('heal');}
  if(s.health<=0)s.outcome='setback';
}
export function step(s,input,dt=1/60){
  if(s.outcome)return s;
  dt=Math.min(Math.max(dt,0),1/30);s.time=Math.min(90,s.time+dt);s.events=[];s.immune=Math.max(0,s.immune-dt);s.cooldown=Math.max(0,s.cooldown-dt);
  const dx=(input.right?1:0)-(input.left?1:0),dy=(input.down?1:0)-(input.up?1:0),norm=Math.hypot(dx,dy)||1;
  const nx=s.x+dx/norm*135*dt,ny=s.y+dy/norm*135*dt;
  if(!solid(nx,s.y))s.x=nx;if(!solid(s.x,ny))s.y=ny;
  if(dx||dy){s.faceX=dx/norm;s.faceY=dy/norm;}
  const schedule=[8,20,35,50,65];
  if(s.spawnWave<schedule.length&&s.time>=schedule[s.spawnWave]){
    const count=s.spawnWave===0?2:3;
    for(let i=0;i<count&&s.enemies.length<10;i++){
      const spots=[{x:96,y:128},{x:384,y:464},{x:848,y:96},{x:736,y:464},{x:384,y:160}];
      const pos=spots[(s.spawnWave+i)%spots.length];
      if(distance(pos,s)<160)continue;
      const kind=i===2&&s.spawnWave>=2?'blocker':i===1&&s.spawnWave>=1?'runner':'walker';
      s.enemies.push({...pos,kind,health:kind==='blocker'?4:kind==='runner'?1:2,warning:.75});
    }s.spawnWave++;
  }
  if(input.fire&&s.cooldown===0&&s.ammo>0){
    const target=s.enemies.filter(e=>e.warning<=0&&distance(e,s)<240&&clearLine(s,e)).sort((a,b)=>distance(a,s)-distance(b,s))[0];
    if(s.bullets.length<24){const d=target?distance(s,target)||1:1;s.bullets.push({x:s.x,y:s.y,dx:target?(target.x-s.x)/d:s.faceX||0,dy:target?(target.y-s.y)/d:s.faceY||-1,life:.8});s.ammo--;s.shots++;s.cooldown=.25;s.events.push('shot');}
  }
  const field=directionField(s);
  for(const e of s.enemies){
    e.warning-=dt;if(e.warning>0)continue;
    let target=s;
    if(!clearLine(e,s)){const x=Math.floor(e.x/32),y=Math.floor(e.y/32);const candidates=[[x-1,y],[x+1,y],[x,y-1],[x,y+1]].filter(([x,y])=>x>=0&&y>=0&&x<30&&y<20&&field[y*30+x]>=0).sort((a,b)=>field[a[1]*30+a[0]]-field[b[1]*30+b[0]]);if(candidates.length)target={x:candidates[0][0]*32+16,y:candidates[0][1]*32+16};}
    const d=distance(e,target)||1,speed=e.kind==='runner'?80:e.kind==='blocker'?25:42;
    const ex=e.x+(target.x-e.x)/d*speed*dt,ey=e.y+(target.y-e.y)/d*speed*dt;
    if(!solid(ex,e.y))e.x=ex;if(!solid(e.x,ey))e.y=ey;
    if(distance(e,s)<24)damagePlayer(s);
  }
  for(const b of s.bullets){b.life-=dt;const start={x:b.x,y:b.y};b.x+=b.dx*340*dt;b.y+=b.dy*340*dt;if(!clearLine(start,b)||solid(b.x,b.y,2))b.life=0;const e=s.enemies.find(e=>e.warning<=0&&distance(e,b)<18);if(e&&b.life>0){e.health-=s.damage;b.life=0;s.events.push('impact');}}
  s.bullets=s.bullets.filter(b=>b.life>0);s.enemies=s.enemies.filter(e=>e.health>0);
  for(const p of pickups(s.route))if(!s.picked.includes(p.id)&&distance(s,p)<25){if(p.kind==='health'&&s.health>=3)continue;s.picked.push(p.id);if(p.kind==='ammo')s.ammo=Math.min(s.loadout.includes('ammo-pouch')?84:60,s.ammo+12);else s.health=Math.min(3,s.health+1);s.events.push('pickup');}
  if(!s.key&&distance(s,WORLD.key)<28){s.key=true;s.checkpoint=1;s.events.push('key');}
  if(s.key&&s.y>448)s.checkpoint=2;
  if(s.key&&distance(s,WORLD.bus)<38&&!s.outcome){s.outcome='success';s.checkpoint=3;s.events.push('success');}
  if(s.time>=90&&!s.outcome)s.outcome='timed_out';
  return s;
}
export function restoreRun(snapshot,loadout,route){
  const s=newRun(loadout,route);
  if(!snapshot||snapshot.revision!==s.revision)return s;
  for(const k of ['x','y','health','ammo','vest','medkit','time','immune','cooldown','checkpoint','shots','hits','blocks','heals','spawnWave','assistStep'])if(Number.isFinite(snapshot[k]))s[k]=snapshot[k];
  s.health=Math.max(0,Math.min(3,s.health));s.vest=Math.max(0,Math.min(s.vest,loadout.includes('vest')?2:0));s.medkit=Math.max(0,Math.min(s.medkit,loadout.includes('medkit')?1:0));s.time=Math.max(0,Math.min(90,s.time));
  s.key=!!snapshot.key;s.picked=Array.isArray(snapshot.picked)?snapshot.picked.filter(x=>pickups(route).some(p=>p.id===x)):[];
  s.enemies=Array.isArray(snapshot.enemies)?snapshot.enemies.filter(e=>Number.isFinite(e.x)&&Number.isFinite(e.y)&&Number.isFinite(e.health)&&Number.isFinite(e.warning)&&['walker','runner','blocker'].includes(e.kind)).slice(0,10):[];
  if(solid(s.x,s.y)){s.x=s.key?832:80;s.y=s.key?176:544;}
  s.outcome=['success','setback','timed_out','skipped'].includes(snapshot.outcome)?snapshot.outcome:null;
  return s;
}
