import {REVISION,TASKS,PICKUPS,PROPS,DISTRACTIONS,WINDOWS,doorRects,solid,lineClear,nextObjective,seededEnemies} from './world.js?v=0.9.1';
import {threatFor} from './config.js?v=0.9.1';
export const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const emit=(s,type,text)=>{s.events.push({type,text});if(text){s.message=text;s.messageAt=s.time;}};
export function createState(loadout=[],route='clinic',threat=1){
 return {revision:REVISION,threat:threatFor(threat).id,x:1168,y:1200,angle:-Math.PI/2,health:3,ammo:12+(loadout.includes('ammo-pouch')?24:0),vest:loadout.includes('vest')?2:0,medkit:0,damage:loadout.includes('carbine')?2:1,loadout:[...loadout],route,time:0,immune:0,cooldown:0,tasks:{},picked:[],enemies:seededEnemies(threat),bullets:[],events:[],shots:0,hits:0,blocks:0,heals:0,doors:Object.fromEntries(doorRects().map(d=>[d.id,{closed:false,hp:100}])),doorRevision:0,doorUses:0,doorsBroken:0,distractions:{},windows:{},hordeTriggered:false,distractionsUsed:0,noise:0,noiseX:1168,noiseY:1200,noiseKind:null,noiseId:0,interact:0,interactId:null,outcome:null,anim:'idle',animTime:0,checkpoint:{x:1168,y:1200},message:'Find the fuse in Maintenance. Dispatch holds the keys. Close doors or trigger a lure to break pursuit.',messageAt:0};
}
export function restoreState(raw,loadout=[],route='clinic',threat=1){
 const s=createState(loadout,route,threat);if(!raw||raw.revision!==REVISION||raw.threat!==s.threat)return s;
 for(const key of ['x','y','angle','time','shots','hits','blocks','heals','doorUses','doorsBroken','distractionsUsed'])if(Number.isFinite(raw[key]))s[key]=Math.max(key==='angle'?-1000:0,Math.min(key==='time'?7200:100000,raw[key]));
 for(const key of ['tasks','picked','checkpoint','doors','distractions','windows'])if(raw[key]&&typeof raw[key]==='object')s[key]=structuredClone(raw[key]);
 s.hordeTriggered=!!raw.hordeTriggered;if(s.hordeTriggered)s.enemies.push(...dispatchHorde());
 s.health=Math.max(0,Math.min(3,Number(raw.health)||0));s.ammo=Math.max(0,Math.min(loadout.includes('ammo-pouch')?84:60,Number(raw.ammo)||0));s.vest=Math.max(0,Math.min(s.vest,Number(raw.vest)||0));
 const known=new Map((Array.isArray(raw.enemies)?raw.enemies:[]).map(e=>[e.id,e]));
 for(const e of s.enemies){const old=known.get(e.id);if(old&&Number.isFinite(old.x)&&Number.isFinite(old.y)){e.x=Math.max(16,Math.min(2544,old.x));e.y=Math.max(16,Math.min(1264,old.y));e.hp=Math.max(0,Math.min(e.hp,Number(old.hp)||0));e.phase=e.hp?(e.horde?'investigate':'return'):'dead';e.target=e.horde?{x:1096,y:384}:{x:e.homeX,y:e.homeY};if(e.horde)e.memory=30;}}
 s.outcome=['success','lost','setback','skipped','timed_out','teacher_advanced'].includes(raw.outcome)?raw.outcome:null;
 if(solid(s,s.x,s.y)){s.x=s.checkpoint.x;s.y=s.checkpoint.y;if(solid(s,s.x,s.y)){s.x=1168;s.y=1200;}}return s;
}
export function damage(s,amount=1,fire=false){
 if(s.immune>0||s.outcome)return;s.immune=1.4;s.anim='hurt';s.animTime=.35;
 if(s.vest&&!fire){s.vest--;s.blocks++;emit(s,'vest',`Vest blocked a strike · ${s.vest} plates remain.`);return;}
 s.health=Math.max(0,s.health-amount);s.hits++;emit(s,'hurt',fire?'Fire! Half your maximum health lost. Leave the flames now.':'Hit! Break sight, close a door, or look for first aid.');
 if(s.health<=0){s.outcome='lost';emit(s,'death','Your radio falls silent. Your field record is saved; the crew will decide what happens next.');}
}
// Connected-space fields target evidence, never the hidden player's position.
// Closed doors attenuate sound; solid walls are impassable to sound and sight.
const cache=new WeakMap();
export function navigationField(s,target,{sound=false}={}){
 let entries=cache.get(s);if(!entries){entries=new Map();cache.set(s,entries);}
 const tx=Math.floor(target.x/32),ty=Math.floor(target.y/32),key=`${tx},${ty}:${s.doorRevision}:${!!s.tasks.power}:${sound}`;
 if(entries.has(key))return entries.get(key);
 const cells=new Float32Array(3200).fill(Infinity),queue=[],start=ty*80+tx;
 if(start<0||start>=3200)return cells;cells[start]=0;queue.push(start);
 const doors=doorRects().filter(d=>s.doors[d.id]?.closed&&s.doors[d.id].hp>0);
 for(let i=0;i<queue.length;i++){
  const n=queue[i],x=n%80,y=Math.floor(n/80);
  for(const [a,b]of[[x-1,y],[x+1,y],[x,y-1],[x,y+1]]){
   if(a<0||a>=80||b<0||b>=40||solid(s,a*32+16,b*32+16,8,true))continue;
   const k=b*80+a,door=doors.some(d=>Math.abs(d.y+8-(b*32+16))<24&&a*32+16>d.x-8&&a*32+16<d.x+d.w+8),cost=cells[n]+32+(door?(sound?180:96):0);
   if(cost<cells[k]&&cost<6000){cells[k]=cost;queue.push(k);}
  }
 }
 if(entries.size>24)entries.delete(entries.keys().next().value);entries.set(key,cells);return cells;
}
export function soundDistance(s,source,target){return navigationField(s,source,{sound:true})[Math.floor(target.y/32)*80+Math.floor(target.x/32)]??Infinity;}
export function makeNoise(s,x,y,radius,duration,kind='shot'){Object.assign(s,{noise:duration,noiseX:x,noiseY:y,noiseRadius:radius,noiseKind:kind,noiseId:s.noiseId+1});}
export function move(s,obj,dx,dy){const count=Math.max(1,Math.ceil(Math.hypot(dx,dy)/5));for(let i=0;i<count;i++){if(!solid(s,obj.x+dx/count,obj.y))obj.x+=dx/count;if(!solid(s,obj.x,obj.y+dy/count))obj.y+=dy/count;}}
export function toggleDoor(s,id){
 const d=doorRects().find(d=>d.id===id),state=s.doors[id];if(!d||!state||state.hp<=0)return false;
 if(!state.closed&&[s,...s.enemies.filter(e=>e.hp>0)].some(a=>a.x>d.x-12&&a.x<d.x+d.w+12&&Math.abs(a.y-(d.y+8))<20)){emit(s,'locked','The doorway is occupied. Step clear before closing it.');return false;}
 state.closed=!state.closed;s.doorRevision++;s.doorUses++;emit(s,'power',`${id} door ${state.closed?'closed · buys time, not permanent safety':'open'}.`);return true;
}
export function triggerDistraction(s,id){
 const d=DISTRACTIONS.find(d=>d.id===id);if(!d||s.distractions[id])return false;
 s.distractions[id]={started:s.time,ignitesAt:s.time+(d.kind==='barrel'?1.2:0),until:s.time+d.duration+(d.kind==='barrel'?1.2:0)};s.distractionsUsed++;makeNoise(s,d.x,d.y,d.radius,d.duration,'lure');emit(s,'power',d.kind==='barrel'?'FUEL LEAK — ignition in 1.2 seconds! Leave the marked area.':'Car alarm active. It attracts across roughly half the map. Move away quietly.');return true;
}
export function breakWindow(s,id){
 const pane=WINDOWS.find(w=>w.id===id);s.windows||={};if(!pane||s.windows[id])return false;
 s.windows[id]=true;s.doorRevision++;makeNoise(s,pane.x+8,pane.y+40,155,.8,'window');emit(s,'impact','Window broken. Walk through the opening. Noise travels as far as running.');return true;
}
export function dispatchHorde(){return Array.from({length:8},(_,i)=>({id:`dispatch-h${i}`,x:1056+(i%4)*26,y:490+Math.floor(i/4)*32,homeX:1088,homeY:500,kind:'shambler',hp:2,phase:'investigate',timer:0,angle:-Math.PI/2,target:{x:1096,y:384},memory:30,horde:true,deathTime:0}));}
function summonHorde(s){if(s.hordeTriggered)return;s.hordeTriggered=true;s.enemies.push(...dispatchHorde());emit(s,'power','KEYS COLLECTED — horde at the dispatch door! A closed door buys a few seconds. Break a window and escape.');}
export function completeTask(s,id){
 const t=TASKS.find(t=>t.id===id);if(!t||s.tasks[id]||!(t.requires||[]).every(r=>s.tasks[r]))return false;
 s.tasks[id]=true;s.checkpoint={x:s.x,y:s.y};makeNoise(s,s.x,s.y,180,1,'repair');
 if(id==='keys')summonHorde(s);
 if(id==='survivor'){s.health=Math.min(3,s.health+1);emit(s,'heal','Survivor rescued: one health restored; terminal ambush reduced.');}
 else if(id==='escape'){s.outcome='success';emit(s,'engine','Bus running. Field record complete. Next: the crew’s final decision.');}
 else if(id!=='keys')emit(s,id==='power'?'power':'objective',({fuse:'High-current fuse recovered.',power:'Power restored. Fallen lines isolated. Garage shutter open.',battery:'Battery recovered. Return to the bus.',installed:'Battery installed. Bring the keys and start the engine.'})[id]);
 if(id==='installed'){const cap=Math.max(1,threatFor(s.threat).ambush-(s.tasks.survivor?2:0));s.enemies.filter(e=>e.hp>0&&dist(e,s)<650).sort((a,b)=>dist(a,s)-dist(b,s)).slice(0,cap).forEach(e=>{e.phase='investigate';e.target={x:s.x,y:s.y};e.memory=5;});}return true;
}
function advanceEnemy(s,e,active,dt){
 const tune=threatFor(s.threat),d=dist(e,s),sees=d<240&&lineClear(s,e,s);
 e.timer=Math.max(0,e.timer-dt);e.memory=Math.max(0,(e.memory||0)-dt);
 if(e.breachId&&s.doors[e.breachId]?.hp>0&&s.time<e.breachUntil){e.phase='investigate';e.memory=Math.max(e.memory,.2);}
 if(e.phase==='stagger'){if(!e.timer)e.phase='search';return;}
 if(e.phase==='windup'){if(!sees){e.phase='search';e.memory=tune.search;return;}if(!e.timer){e.phase='lunge';e.timer=.25;e.angle=Math.atan2(s.y-e.y,s.x-e.x);emit(s,'lunge','');}return;}
 if(e.phase==='lunge'){move(s,e,Math.cos(e.angle)*215*dt,Math.sin(e.angle)*215*dt);if(dist(e,s)<23&&lineClear(s,e,s))damage(s);if(!e.timer){e.phase='recover';e.timer=.9;}return;}
 if(e.phase==='recover'){if(!e.timer)e.phase='search';return;}
 if(sees){e.phase='chase';e.target={x:s.x,y:s.y};e.memory=tune.memory+(e.kind==='runner'?1:0);}
 else if(s.noise>0&&e.heard!==s.noiseId&&soundDistance(s,{x:s.noiseX,y:s.noiseY},e)<=s.noiseRadius){e.heard=s.noiseId;e.phase='investigate';e.target={x:s.noiseX,y:s.noiseY};e.memory=tune.memory;}
 if(e.phase==='chase'&&(!e.memory||dist(e,e.target||e)<18)&&!sees){e.phase='search';e.memory=tune.search;}
 if(e.phase==='investigate'&&(!e.memory||dist(e,e.target||e)<25)){e.phase='search';e.memory=tune.search;}
 if(e.phase==='search'&&!e.memory){e.phase='return';e.target={x:e.homeX,y:e.homeY};}
 if(e.phase==='return'&&dist(e,e.target||e)<25){e.phase='wander';e.target=null;}
 if(sees&&d<52){e.phase='windup';e.timer=e.kind==='runner'?.45:.7;return;}
 if(e.phase==='search'){e.angle+=dt;return;}
 let target=e.target;
 if(!target||e.phase==='wander'){if(!e.timer){e.angle+=1.73;e.timer=2.5;}if(dist(e,{x:e.homeX,y:e.homeY})>65)e.angle=Math.atan2(e.homeY-e.y,e.homeX-e.x);move(s,e,Math.cos(e.angle)*12*dt,Math.sin(e.angle)*12*dt);return;}
 if(!lineClear(s,e,target)){
  const grid=navigationField(s,target),x=Math.floor(e.x/32),y=Math.floor(e.y/32),options=[[x-1,y],[x+1,y],[x,y-1],[x,y+1]].filter(([a,b])=>a>=0&&a<80&&b>=0&&b<40&&Number.isFinite(grid[b*80+a])).sort((a,b)=>grid[a[1]*80+a[0]]-grid[b[1]*80+b[0]]);
  if(options.length)target={x:options[0][0]*32+16,y:options[0][1]*32+16};
 }
 const door=doorRects().find(d=>s.doors[d.id]?.closed&&s.doors[d.id].hp>0&&e.target&&(e.y-(d.y+8))*(e.target.y-(d.y+8))<0&&dist(e,{x:Math.max(d.x,Math.min(d.x+d.w,e.x)),y:d.y+8})<30);
 if(door&&['chase','investigate'].includes(e.phase)&&e.memory>0){if(e.breachId!==door.id){e.breachId=door.id;e.breachUntil=s.time+tune.doorSeconds+1;}s.doors[door.id].hp=Math.max(0,s.doors[door.id].hp-100/tune.doorSeconds*dt);if(!s.doors[door.id].hp){s.doors[door.id].closed=false;s.doorRevision++;s.doorsBroken++;e.breachId=null;emit(s,'impact','A barricaded door broke. Move!');}return;}
 e.angle=Math.atan2(target.y-e.y,target.x-e.x);const speed=({runner:78,shambler:38,brute:27,crawler:42})[e.kind]*(e.phase==='return'?.6:1);
 let dx=Math.cos(e.angle)*speed*dt,dy=Math.sin(e.angle)*speed*dt;
 for(const other of active)if(other!==e){const gap=dist(e,other);if(gap>0&&gap<22){dx+=(e.x-other.x)/gap*12*dt;dy+=(e.y-other.y)/gap*12*dt;}}
 const before={x:e.x,y:e.y};move(s,e,dx,dy);e.stuck=dist(e,before)<.02?(e.stuck||0)+dt:0;
 if(e.stuck>.5){move(s,e,-Math.sin(e.angle)*24*dt,Math.cos(e.angle)*24*dt);if(e.stuck>2){e.phase='search';e.memory=tune.search;e.stuck=0;}}
}
export function step(s,input,dt=1/60){
 s.events=[];if(s.outcome)return s;dt=Math.max(0,Math.min(dt,1/30));s.time+=dt;s.immune=Math.max(0,s.immune-dt);s.cooldown=Math.max(0,s.cooldown-dt);s.noise=Math.max(0,s.noise-dt);s.animTime=Math.max(0,s.animTime-dt);
 s.angle+=((input.right?1:0)-(input.left?1:0))*2.8*dt;const m=(input.up?1:0)-(input.down?1:0),running=!!input.run&&m&&!input.fire,speed=(running?155:100)*(s.tasks.battery&&!s.tasks.installed?.85:1);
 move(s,s,Math.cos(s.angle)*m*speed*dt,Math.sin(s.angle)*m*speed*dt);if(s.animTime<=0)s.anim=running?'run':m?'walk':'idle';
 if(m&&s.time-(s.lastStep||0)>(running?.28:.48)){s.lastStep=s.time;emit(s,'step','');if(running&&s.noise<=0)makeNoise(s,s.x,s.y,155,.28,'running');}
 if(input.fire&&!running&&s.cooldown<=0){s.cooldown=.38;if(s.ammo>0){s.ammo--;s.shots++;s.anim='fire';s.animTime=.18;makeNoise(s,s.x,s.y,s.damage===2?580:430,1.2,'shot');s.bullets.push({x:s.x,y:s.y,angle:s.angle,life:.9});emit(s,'shot','');}else emit(s,'dry','Out of ammunition. Evade and search for supplies.');}
 for(const d of DISTRACTIONS){const live=s.distractions[d.id];if(live&&live.until>s.time){if(s.noise<=0)makeNoise(s,d.x,d.y,d.radius,.5,'lure');if(d.kind==='barrel'&&s.time>=live.ignitesAt){if(dist(s,d)<60&&lineClear(s,s,d))damage(s,1.5,true);for(const e of s.enemies)if(e.hp>0&&dist(e,d)<60&&lineClear(s,e,d)){e.hp=0;e.phase='dead';e.deathTime=s.time;}}}}
 // Alarms must be heard beyond the normal nearby-AI budget. Keep those
 // investigators active until they arrive; only their heard location is known.
 if(s.noise>0&&s.noiseKind==='lure')for(const e of s.enemies)if(e.hp>0&&e.heard!==s.noiseId&&soundDistance(s,{x:s.noiseX,y:s.noiseY},e)<=s.noiseRadius){e.heard=s.noiseId;e.phase='investigate';e.target={x:s.noiseX,y:s.noiseY};e.memory=30;e.lured=true;}
 const nearby=s.enemies.filter(e=>e.hp>0&&dist(e,s)<650).sort((a,b)=>dist(a,s)-dist(b,s)).slice(0,threatFor(s.threat).active);
 const active=[...new Set([...nearby,...s.enemies.filter(e=>e.hp>0&&(e.horde||e.lured&&e.memory>0))])];s.activeCount=active.length;
 for(const e of active)advanceEnemy(s,e,active,dt);
 for(const bullet of s.bullets){const before={...bullet};bullet.x+=Math.cos(bullet.angle)*520*dt;bullet.y+=Math.sin(bullet.angle)*520*dt;bullet.life-=dt;const pane=WINDOWS.find(w=>!s.windows?.[w.id]&&bullet.x>=w.x-8&&bullet.x<=w.x+w.w+8&&bullet.y>=w.y&&bullet.y<=w.y+w.h);if(pane){breakWindow(s,pane.id);bullet.life=0;continue;}if(!lineClear(s,before,bullet)){bullet.life=0;continue;}const barrel=DISTRACTIONS.find(d=>d.kind==='barrel'&&!s.distractions[d.id]&&dist(d,bullet)<24);if(barrel){triggerDistraction(s,barrel.id);bullet.life=0;continue;}for(const e of active){if(e.hp<=0)continue;const vx=bullet.x-before.x,vy=bullet.y-before.y,t=Math.max(0,Math.min(1,((e.x-before.x)*vx+(e.y-before.y)*vy)/(vx*vx+vy*vy||1)));if(Math.hypot(e.x-before.x-vx*t,e.y-before.y-vy*t)<(e.kind==='brute'?20:14)){e.hp=Math.max(0,e.hp-s.damage);e.phase=e.hp?'stagger':'dead';e.timer=e.kind==='brute'?.08:.3;e.deathTime=s.time;bullet.life=0;emit(s,e.hp?'impact':'enemy-death','');break;}}}
 s.bullets=s.bullets.filter(b=>b.life>0).slice(-24);
 for(const p of PICKUPS)if(!s.picked.includes(p.id)&&dist(s,p)<25&&(p.kind!=='health'||s.health<3)){s.picked.push(p.id);if(p.kind==='ammo'){const n=p.amount+threatFor(s.threat).pickupBonus;s.ammo=Math.min(s.loadout.includes('ammo-pouch')?84:60,s.ammo+n);emit(s,'pickup',`Found ${n} rounds.`);}else{s.health=Math.min(3,s.health+p.amount);s.heals++;emit(s,'heal','First aid restored one health.');}}
 for(const p of PROPS)if(p.burning&&s.x>p.x-5&&s.x<p.x+p.w+5&&s.y>p.y-5&&s.y<p.y+p.h+5)damage(s);
 const task=TASKS.filter(t=>!s.tasks[t.id]&&dist(t,s)<68&&lineClear(s,s,t)).sort((a,b)=>dist(a,s)-dist(b,s))[0],door=doorRects().find(d=>s.doors[d.id].hp>0&&dist(s,{x:Math.max(d.x,Math.min(d.x+d.w,s.x)),y:d.y+8})<48),lure=DISTRACTIONS.find(d=>d.kind==='alarm'&&!s.distractions[d.id]&&dist(d,s)<78),pane=WINDOWS.find(w=>!s.windows?.[w.id]&&dist(s,{x:w.x+8,y:w.y+40})<58);
 s.nearby=task?.id||null;s.prompt=task?`Hold Search / Use: ${task.label} · ${Math.min(100,Math.floor(s.interact/task.duration*100))}%`:pane?`Hold Search / Use: break window · ${Math.min(100,Math.floor(s.interact/1.2*100))}%`:door?`Tap Search / Use: ${s.doors[door.id].closed?'open':'close'} ${door.id} door (${Math.ceil(s.doors[door.id].hp)}%)`:lure?`Tap Search / Use: ${lure.label}`:'';
 if(task&&(task.requires||[]).some(id=>!s.tasks[id]))s.prompt='This station is locked until the earlier objectives are complete.';
 if(input.interact&&task){if(!(task.requires||[]).every(id=>s.tasks[id])){if(!s.prevInteract)emit(s,'locked',`Required first: ${task.requires.filter(id=>!s.tasks[id]).join(', ')}.`);s.interact=0;}else{if(s.interactId!==task.id)s.interact=0;s.interactId=task.id;s.interact+=dt;if(s.interact>=task.duration){completeTask(s,task.id);s.interact=0;}}}
 else if(input.interact&&pane){if(s.interactId!==pane.id)s.interact=0;s.interactId=pane.id;s.interact+=dt;if(s.interact>=1.2){breakWindow(s,pane.id);s.interact=0;}}
 else {s.interact=0;s.interactId=null;if(input.interact&&!s.prevInteract){if(door)toggleDoor(s,door.id);else if(lure)triggerDistraction(s,lure.id);}}
 s.prevInteract=!!input.interact;return s;
}
export {nextObjective};
