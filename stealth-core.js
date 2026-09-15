// Pure, deterministic simulation shared by the browser and Node acceptance tests.
export const REVISION='vault7-stealth-1';
export const RULES={width:1024,height:176,tile:16,viewWidth:320,viewHeight:180,step:1/60,speed:72,groundAccel:600,airAccel:320,friction:800,gravity:620,jump:-225,jumpCut:-90,maxFall:300,coyote:.1,buffer:.12,limit:180000,teamWindow:300000};
export const CHECKPOINTS={none:{x:32,y:136},A:{x:180,y:136},B:{x:648,y:136},C:{x:840,y:136}};
export const EQUIPMENT={map:{name:'Maintenance Map',effect:'Look for green SAFE boxes and ON/OFF countdowns beside sensors.'},toolkit:{name:'Silent Toolkit',effect:'One route spotlight is switched OFF before you enter. Movement speed is unchanged.'},scanner:{name:'Code Scanner',effect:'Cyan dashed cones show where searchlights will point in 2 seconds.'}};
const common=[[0,10,64,1],[0,0,1,11],[63,0,1,11],[6,6,4,1],[10,9,1,1],[42,6,4,1],[47,9,2,1],[50,5,3,1],[57,9,1,1],[60,4,3,1]];
const corridor=[[16,9,2,1],[21,5,4,1],[27,9,1,1],[31,9,2,1],[34,5,4,1],[39,9,1,1]];
const shaft=[[14,9,2,1],[17,8,2,2],[20,7,6,1,2],[28,8,4,1,2],[33,7,4,1,2],[38,9,2,1]];
const emitter=(id,x,amp,period,range,half,phase=0,hardest=false)=>({id,x,y:12,center:Math.PI/2,amp:amp*Math.PI/180,period,range,half:half*Math.PI/180,phase,hardest});
export function createLevel(route='corridor',equipment=null,adverseCount=0){
  const grid=Array.from({length:11},()=>Array(64).fill(0));
  const rects=[...common,...(route==='shaft'?shaft:corridor)];
  for(const[x,y,w,h,type=1]of rects)for(let ty=y;ty<y+h;ty++)for(let tx=x;tx<x+w;tx++)grid[ty][tx]=type;
  const emitters=route==='shaft'?[emitter('EV1',376,30,5.2,145,14),emitter('EV2',552,40,4.6,160,15,Math.PI/2,true)]:[emitter('EC1',344,36,4.8,170,15),emitter('EC2',584,48,5.6,190,17,Math.PI/2,true)];
  emitters.push(emitter('EG1',728,34,5,165,15,Math.PI),emitter('EG2',888,42,4.2,180,16,Math.PI/3));
  emitters.forEach(e=>{e.disabled=equipment==='toolkit'&&e.hardest;});
  const sensors=route==='shaft'?[{id:'SV1',x:432,y:96,w:8,h:48,on:1,off:1.5,phase:.5},{id:'SV2',x:592,y:112,w:8,h:48,on:1.5,off:1.5,phase:0}]:[{id:'SC1',x:448,y:148,w:32,h:4,on:1,off:0,phase:0},{id:'SC2',x:608,y:132,w:4,h:28,on:1.25,off:1.25,phase:0}];
  return {route,equipment,adverseCount,grid,rects,emitters,sensors,revision:REVISION,safeZones:[{x:104,y:136,w:32,h:24},{x:688,y:136,w:32,h:24},{x:968,y:136,w:32,h:24}]};
}
export function angleAt(e,t,alert=0){return e.center+e.amp*Math.sin(e.phase+2*Math.PI/e.period*(1+.08*Math.min(alert,3))*t);}
export function sensorActive(s,t){return s.off===0 || ((t+s.phase)%(s.on+s.off))<s.on;}
export const bounds=p=>({x:p.x+2,y:p.y+2,w:12,h:22});
export const overlaps=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
const solid=(level,x,y)=>level.grid[y]?.[x]===1;
// Grid DDA returns the first solid hit, or the requested end point.
export function raycast(level,x,y,ex,ey){
  const dx=ex-x,dy=ey-y,dist=Math.hypot(dx,dy);if(!dist)return{x,y,blocked:false};
  let tx=Math.floor(x/16),ty=Math.floor(y/16);const sx=Math.sign(dx),sy=Math.sign(dy);
  const deltaX=dx?Math.abs(16/dx):Infinity,deltaY=dy?Math.abs(16/dy):Infinity;
  let maxX=dx?((sx>0?(tx+1)*16:tx*16)-x)/dx:Infinity,maxY=dy?((sy>0?(ty+1)*16:ty*16)-y)/dy:Infinity,t=0;
  for(let n=0;n<100&&t<1;n++){
    if(solid(level,tx,ty))return{x:x+dx*t,y:y+dy*t,blocked:true};
    if(maxX<maxY){t=maxX;maxX+=deltaX;tx+=sx;}else{t=maxY;maxY+=deltaY;ty+=sy;}
  }return{x:ex,y:ey,blocked:false};
}
export function inCone(level,e,x,y,t){
  if(e.disabled)return false;const dx=x-e.x,dy=y-e.y,d=Math.hypot(dx,dy),a=angleAt(e,t,level.adverseCount);
  if(!d||d>e.range||(dx*Math.cos(a)+dy*Math.sin(a))/d<Math.cos(e.half))return false;
  return !raycast(level,e.x,e.y,x,y).blocked;
}
export function coverage(level,p,t){
  if(p.x>=956)return 0;const b=bounds(p),samples=[b.y+.1,b.y+b.h/2,b.y+b.h-.1];
  return samples.filter(y=>level.emitters.some(e=>inCone(level,e,b.x+b.w/2,y,t))).length/3;
}
export function conePolygon(level,e,t){const a=angleAt(e,t,level.adverseCount),pts=[{x:e.x,y:e.y}];for(let i=0;i<=32;i++){const angle=a-e.half+2*e.half*i/32;pts.push(raycast(level,e.x,e.y,e.x+e.range*Math.cos(angle),e.y+e.range*Math.sin(angle)));}return pts;}
const approach=(value,target,amount)=>value<target?Math.min(target,value+amount):Math.max(target,value-amount);
export class StealthSimulation{
  constructor(config={},recovery={}){
    this.level=createLevel(config.route,config.equipment,config.adverseCount);this.checkpoint=recovery.checkpoint||null;
    this.elapsed=(recovery.activeElapsedMs||0)/1000;this.detections=recovery.detections||0;this.integrity=3-this.detections;
    this.player={...CHECKPOINTS[this.checkpoint||'none'],vx:0,vy:0,grounded:false,facing:1};
    this.state='ready';this.visibility=0;this.darkDelay=0;this.immunity=recovery.status==='active'?1.25:0;
    this.events=[];this.coyote=0;this.jumpBuffer=0;this.prevJump=false;this.exitHold=0;this.stateTimer=0;this.outcome=null;
  }
  start(){if(this.state==='ready')this.state='playing';}
  summary(){return{checkpoint:this.checkpoint,activeElapsedMs:Math.min(180000,Math.round(this.elapsed*1000)),detections:this.detections,integrityRemaining:this.integrity,resourcesUsed:this.level.equipment?[this.level.equipment]:[],mapRevision:REVISION};}
  complete(outcome){if(this.state==='terminal')return;this.state='terminal';this.outcome=outcome;this.events.push({type:'complete',outcome,...this.summary()});}
  detect(sourceId){if(this.immunity>0||this.state!=='playing')return;this.detections++;this.integrity--;this.visibility=0;this.state='detected';this.stateTimer=.25;this.events.push({type:'detected',sourceId,...this.summary()});}
  move(axis,dt){
    const p=this.player,prior=bounds(p);p[axis]+=p[axis==='x'?'vx':'vy']*dt;let b=bounds(p);
    for(let ty=Math.max(0,Math.floor(b.y/16));ty<=Math.min(10,Math.floor((b.y+b.h-.001)/16));ty++)for(let tx=Math.max(0,Math.floor(b.x/16));tx<=Math.min(63,Math.floor((b.x+b.w-.001)/16));tx++){
      const tile=this.level.grid[ty][tx];if(!tile)continue;const r={x:tx*16,y:ty*16,w:16,h:16};if(!overlaps(b,r))continue;
      if(tile===2&&(axis==='x'||p.vy<0||prior.y+prior.h>r.y+.01))continue;
      if(axis==='x'){p.x=p.vx>0?r.x-14:r.x+14;p.vx=0;}
      else if(p.vy>=0){p.y=r.y-24;p.vy=0;p.grounded=true;}else{p.y=r.y+14;p.vy=0;}
      b=bounds(p);
    }
    if(p.y<0){p.y=0;p.vy=Math.max(0,p.vy);}
  }
  step(input={},dt=RULES.step){
    if(['ready','terminal'].includes(this.state))return;
    if(this.state==='detected'||this.state==='respawning'){
      this.stateTimer-=dt;if(this.stateTimer<=0){if(this.state==='detected'){if(!this.integrity)return this.complete('captured');this.state='respawning';this.stateTimer=.8;}
      else{Object.assign(this.player,CHECKPOINTS[this.checkpoint||'none'],{vx:0,vy:0,grounded:false});this.immunity=1.25;this.state='playing';this.prevJump=false;this.jumpBuffer=0;}}return;
    }
    this.elapsed+=dt;if(this.elapsed>=180)return this.complete('timeout');this.immunity=Math.max(0,this.immunity-dt);
    const p=this.player;this.coyote=p.grounded?.1:Math.max(0,this.coyote-dt);this.jumpBuffer=Math.max(0,this.jumpBuffer-dt);
    if(input.jump&&!this.prevJump)this.jumpBuffer=.12;
    if(this.jumpBuffer>0&&this.coyote>0){p.vy=-225;p.grounded=false;this.coyote=0;this.jumpBuffer=0;}
    if(!input.jump&&this.prevJump&&p.vy<-90)p.vy=-90;this.prevJump=!!input.jump;
    const direction=(input.right?1:0)-(input.left?1:0),speed=72*(this.level.equipment==='servo_boots'?1.2:1);
    if(direction){p.vx=approach(p.vx,direction*speed,(p.grounded?600:320)*dt);p.facing=direction;}else if(p.grounded)p.vx=approach(p.vx,0,800*dt);
    this.move('x',dt);p.vy=Math.min(300,p.vy+620*dt);p.grounded=false;this.move('y',dt);
    for(const[key,x]of [['A',176],['B',656],['C',848]])if(p.x>=x&&['',null,'A','B','C'].indexOf(key)>['',null,'A','B','C'].indexOf(this.checkpoint)){this.checkpoint=key;this.events.push({type:'checkpoint',...this.summary()});}
    const t=this.elapsed,b=bounds(p),sensor=this.level.sensors.find(s=>sensorActive(s,t)&&overlaps(b,s));
    if(sensor&&p.x<956)this.detect(sensor.id);
    if(this.state!=='playing')return;
    const light=this.immunity>0?0:coverage(this.level,p,t);
    if(light){this.visibility=Math.min(100,this.visibility+60*light*dt);this.darkDelay=0;}else{this.darkDelay+=dt;if(this.darkDelay>=.3)this.visibility=Math.max(0,this.visibility-35*dt);}
    if(this.visibility>=100)this.detect('spotlight');
    if(this.state!=='playing')return;
    this.exitHold=input.interact&&overlaps(b,{x:960,y:64,w:48,h:96})?this.exitHold+dt:0;
    if(this.exitHold>=.6)this.complete('extracted');
  }
}
export function validateLevel(level){
  const errors=[];for(const [name,p]of Object.entries(CHECKPOINTS)){const b=bounds(p);for(let y=Math.floor(b.y/16);y<=Math.floor((b.y+b.h-.01)/16);y++)for(let x=Math.floor(b.x/16);x<=Math.floor((b.x+b.w-.01)/16);x++)if(solid(level,x,y))errors.push(`${name} intersects solid ${x},${y}`);}
  if(level.emitters.filter(e=>e.hardest).length!==1)errors.push('Exactly one hardest route emitter required');return errors;
}
