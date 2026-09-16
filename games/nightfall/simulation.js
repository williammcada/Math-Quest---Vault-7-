import {REVISION,WORLD,TASKS,PICKUPS,PROPS,solid,lineClear,nextObjective,seededEnemies} from './world.js';
export const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const emit=(s,type,text)=>{s.events.push({type,text});if(text){s.message=text;s.messageAt=s.time;}};
export function createState(loadout=[],route='clinic'){
 return {revision:REVISION,x:1168,y:1200,angle:-Math.PI/2,health:3,ammo:12+(loadout.includes('ammo-pouch')?24:0),vest:loadout.includes('vest')?2:0,medkit:loadout.includes('medkit')?1:0,damage:loadout.includes('carbine')?2:1,loadout:[...loadout],route,time:0,immune:0,cooldown:0,tasks:{},picked:[],enemies:seededEnemies(),bullets:[],events:[],shots:0,hits:0,blocks:0,heals:0,noise:0,noiseX:1168,noiseY:1200,interact:0,interactId:null,outcome:null,anim:'idle',animTime:0,checkpoint:{x:1168,y:1200},message:'Find the fuse in Maintenance. Dispatch holds the bus keys.',messageAt:0};
}
export function restoreState(raw,loadout,route){
 const s=createState(loadout,route);if(!raw||raw.revision!==REVISION)return s;
 for(const key of ['x','y','angle','time','shots','hits','blocks','heals'])if(Number.isFinite(raw[key]))s[key]=Math.max(key==='angle'?-1000:0,Math.min(key==='time'?7200000:100000,raw[key]));
 for(const key of ['tasks','picked','checkpoint'])if(raw[key]&&typeof raw[key]==='object')s[key]=structuredClone(raw[key]);
 s.health=Math.max(0,Math.min(3,Number(raw.health)||0));s.ammo=Math.max(0,Math.min(60+(loadout.includes('ammo-pouch')?24:0),Number(raw.ammo)||0));
 s.vest=Math.max(0,Math.min(s.vest,Number(raw.vest)||0));s.medkit=Math.max(0,Math.min(s.medkit,Number(raw.medkit)||0));
 const known=new Map((Array.isArray(raw.enemies)?raw.enemies:[]).map(e=>[e.id,e]));
 for(const e of s.enemies){const old=known.get(e.id);if(old&&Number.isFinite(old.x)&&Number.isFinite(old.y)){e.x=Math.max(16,Math.min(2544,old.x));e.y=Math.max(16,Math.min(1264,old.y));e.hp=Math.max(0,Math.min(e.hp,Number(old.hp)||0));e.phase=e.hp?'wander':'dead';}}
 s.outcome=['success','setback','skipped'].includes(raw.outcome)?raw.outcome:null;
 if(solid(s,s.x,s.y)){s.x=s.checkpoint.x;s.y=s.checkpoint.y;if(solid(s,s.x,s.y)){s.x=1168;s.y=1200;}}
 return s;
}
export function damage(s){
 if(s.immune>0||s.outcome)return;s.immune=1.4;s.anim='hurt';s.animTime=.35;
 if(s.vest){s.vest--;s.blocks++;emit(s,'vest','Vest plate absorbed the strike.');return;}
 s.health--;s.hits++;emit(s,'hurt','Hit! Find space or first aid.');
 if(s.health===1&&s.medkit){s.medkit--;s.health++;s.heals++;emit(s,'heal','Trauma kit restored one health.');}
 if(s.health<=0){s.outcome='setback';emit(s,'death','Sol sends a rescue crew. Your progress is recorded.');}
}
const cache=new WeakMap();
function field(s){
 let v=cache.get(s);if(v&&s.time-v.time<.65&&v.power===!!s.tasks.power)return v.cells;
 const cells=new Int16Array(3200).fill(-1),queue=[],start=Math.floor(s.y/32)*80+Math.floor(s.x/32);cells[start]=0;queue.push(start);
 for(let i=0;i<queue.length;i++){const n=queue[i],x=n%80,y=Math.floor(n/80);for(const [a,b]of[[x-1,y],[x+1,y],[x,y-1],[x,y+1]]){const k=b*80+a;if(a<0||a>=80||b<0||b>=40||cells[k]>=0||solid(s,a*32+16,b*32+16,9))continue;cells[k]=cells[n]+1;queue.push(k);}}
 cache.set(s,{time:s.time,power:!!s.tasks.power,cells});return cells;
}
function move(s,obj,dx,dy){if(!solid(s,obj.x+dx,obj.y))obj.x+=dx;if(!solid(s,obj.x,obj.y+dy))obj.y+=dy;}
export function completeTask(s,id){
 const t=TASKS.find(t=>t.id===id);if(!t||s.tasks[id]||!(t.requires||[]).every(r=>s.tasks[r]))return false;
 s.tasks[id]=true;s.checkpoint={x:s.x,y:s.y};s.noise=3;s.noiseX=s.x;s.noiseY=s.y;
 if(id==='survivor'){s.health=Math.min(3,s.health+1);emit(s,'heal','Survivor rescued: treatment received. The survivor will distract half of the terminal ambush.');}
 else if(id==='escape'){s.outcome='success';emit(s,'engine','Bus running. Everybody aboard!');}
 else emit(s,id==='power'?'power':'objective',({fuse:'High-current fuse recovered.',power:'Power restored. Fallen lines isolated. Garage shutter is open.',keys:'Bus keys recovered.',battery:'Battery recovered. Return to the bus.',installed:'Battery installed. Bring the keys and start the engine.'})[id]);
 if(id==='installed'){
   const count=s.tasks.survivor?3:6;
   const pool=s.enemies.filter(e=>e.hp>0&&dist(e,s)>650).slice(0,count);
   pool.forEach((e,i)=>{e.x=1000+i*58;e.y=960;e.phase='chase';e.angle=Math.PI/2;});
 }
 return true;
}
export function step(s,input,dt=1/60){
 s.events=[];if(s.outcome){s.animTime+=dt;return s;}dt=Math.max(0,Math.min(dt,1/30));s.time+=dt;s.immune=Math.max(0,s.immune-dt);s.cooldown=Math.max(0,s.cooldown-dt);s.noise=Math.max(0,s.noise-dt);s.animTime=Math.max(0,s.animTime-dt);
 let dx=0,dy=0;
 if(input.scheme==='direct'){
   dx=(input.right?1:0)-(input.left?1:0);dy=(input.down?1:0)-(input.up?1:0);
   if(Number.isFinite(input.aim))s.angle=input.aim;else if(dx||dy)s.angle=Math.atan2(dy,dx);
 }else{s.angle+=((input.right?1:0)-(input.left?1:0))*2.8*dt;const m=(input.up?1:0)-(input.down?1:0);dx=Math.cos(s.angle)*m;dy=Math.sin(s.angle)*m;}
 const norm=Math.hypot(dx,dy)||1,running=!!input.run&&(dx||dy)&&!input.fire,speed=(running?155:100)*(s.tasks.battery&&!s.tasks.installed ? .85 : 1);
 move(s,s,dx/norm*speed*dt,dy/norm*speed*dt);if(s.animTime<=0)s.anim=running?'run':dx||dy?'walk':'idle';
 if((dx||dy)&&s.time-(s.lastStep||0)>(running?.28:.48)){s.lastStep=s.time;emit(s,'step','');}
 if(running){s.noise=Math.max(s.noise,.4);s.noiseX=s.x;s.noiseY=s.y;}
 if(input.fire&&!running&&s.cooldown<=0){
   s.cooldown=.38;
   if(s.ammo>0){s.ammo--;s.shots++;s.anim='fire';s.animTime=.18;s.noise=2;s.noiseX=s.x;s.noiseY=s.y;s.bullets.push({x:s.x,y:s.y,angle:s.angle,life:.9});emit(s,'shot','');}
   else emit(s,'dry','Out of ammunition. Evade and search for supplies.');
 }
 const active=s.enemies.filter(e=>e.hp>0&&dist(e,s)<650).sort((a,b)=>dist(a,s)-dist(b,s)).slice(0,22),grid=active.length?field(s):null;
 for(const e of active){
   e.timer=Math.max(0,e.timer-dt);const d=dist(e,s),sees=d<240&&lineClear(s,e,s),hears=s.noise>0&&Math.hypot(e.x-s.noiseX,e.y-s.noiseY)<(running?200:s.damage===2?580:430);
   if(e.phase==='stagger'){if(e.timer===0)e.phase='chase';continue;}
   if(e.phase==='windup'){if(e.timer===0){e.phase='lunge';e.timer=.28;e.angle=Math.atan2(s.y-e.y,s.x-e.x);emit(s,'lunge','');}continue;}
   if(e.phase==='lunge'){move(s,e,Math.cos(e.angle)*235*dt,Math.sin(e.angle)*235*dt);if(dist(e,s)<24)damage(s);if(e.timer===0){e.phase='recover';e.timer=.85;}continue;}
   if(e.phase==='recover'){if(e.timer===0)e.phase='chase';continue;}
   if(sees||hears)e.phase='chase';if(d>600)e.phase='wander';
   if(e.phase==='chase'){
     if(d<56){e.phase='windup';e.timer=e.kind==='runner'?.32:.55;continue;}
     let target=s;
     if(!lineClear(s,e,s)){
       const x=Math.floor(e.x/32),y=Math.floor(e.y/32),options=[[x-1,y],[x+1,y],[x,y-1],[x,y+1]].filter(([a,b])=>a>=0&&a<80&&b>=0&&b<40&&grid[b*80+a]>=0).sort((a,b)=>grid[a[1]*80+a[0]]-grid[b[1]*80+b[0]]);
       if(options.length)target={x:options[0][0]*32+16,y:options[0][1]*32+16};
     }
     e.angle=Math.atan2(target.y-e.y,target.x-e.x);const v=({runner:86,shambler:42,brute:30,crawler:48})[e.kind];move(s,e,Math.cos(e.angle)*v*dt,Math.sin(e.angle)*v*dt);
   }else{if(e.timer===0){e.angle+=1.73;e.timer=2.5;}move(s,e,Math.cos(e.angle)*15*dt,Math.sin(e.angle)*15*dt);}
 }
 for(const bullet of s.bullets){const before={...bullet};bullet.x+=Math.cos(bullet.angle)*520*dt;bullet.y+=Math.sin(bullet.angle)*520*dt;bullet.life-=dt;if(!lineClear(s,before,bullet)){bullet.life=0;continue;}for(const e of active){if(e.hp<=0)continue;const vx=bullet.x-before.x,vy=bullet.y-before.y,t=Math.max(0,Math.min(1,((e.x-before.x)*vx+(e.y-before.y)*vy)/(vx*vx+vy*vy||1)));if(Math.hypot(e.x-before.x-vx*t,e.y-before.y-vy*t)<(e.kind==='brute'?20:14)){e.hp=Math.max(0,e.hp-s.damage);e.phase=e.hp?'stagger':'dead';e.timer=e.kind==='brute'?.08:.25;e.deathTime=s.time;bullet.life=0;emit(s,e.hp?'impact':'enemy-death','');break;}}}
 s.bullets=s.bullets.filter(b=>b.life>0).slice(-24);
 for(const p of PICKUPS)if(!s.picked.includes(p.id)&&dist(s,p)<25&&(p.kind!=='health'||s.health<3)){
   s.picked.push(p.id);if(p.kind==='ammo'){s.ammo+=p.amount;emit(s,'pickup',`Found ${p.amount} rounds.`);}else{s.health=Math.min(3,s.health+p.amount);emit(s,'heal','First aid restored one health.');}
 }
 for(const p of PROPS)if(p.burning&&s.x>p.x-13&&s.x<p.x+p.w+13&&s.y>p.y-13&&s.y<p.y+p.h+13)damage(s);
 const nearby=TASKS.find(t=>!s.tasks[t.id]&&dist(t,s)<52);
 s.nearby=nearby?.id||null;
 if(input.interact&&nearby){
   if(!(nearby.requires||[]).every(id=>s.tasks[id])){emit(s,'locked',`Required first: ${nearby.requires.filter(id=>!s.tasks[id]).join(', ')}.`);s.interact=0;}
   else{if(s.interactId!==nearby.id)s.interact=0;s.interactId=nearby.id;s.interact+=dt;if(s.interact>=nearby.duration){completeTask(s,nearby.id);s.interact=0;}}
 }else{s.interact=0;s.interactId=null;}
 return s;
}
export {nextObjective};
