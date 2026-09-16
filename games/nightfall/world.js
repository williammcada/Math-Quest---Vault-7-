export const REVISION='nightfall-city-2';
export const WORLD={width:2560,height:1280,tile:32,bus:{x:1168,y:1120}};
export const BUILDINGS=[
 {id:'maintenance',name:'MAINTENANCE',x:224,y:128,w:416,h:352,door:416,floor:3},
 {id:'dispatch',name:'DISPATCH',x:832,y:64,w:448,h:384,door:1056,floor:3},
 {id:'clinic',name:'CLINIC',x:1440,y:128,w:352,h:384,door:1600,floor:2},
 {id:'garage',name:'PARKING GARAGE',x:1888,y:608,w:512,h:448,door:2112,floor:4},
 {id:'substation',name:'SUBSTATION',x:224,y:768,w:448,h:320,door:416,floor:13}
];
export const TASKS=[
 {id:'fuse',label:'Search maintenance for the fuse',x:384,y:240,duration:3.5,prop:5},
 {id:'power',label:'Restore power and isolate fallen lines',x:448,y:896,duration:4,requires:['fuse'],prop:7},
 {id:'keys',label:'Search dispatch for the bus keys',x:1088,y:208,duration:3.5,prop:5},
 {id:'battery',label:'Lower and collect the garage battery',x:2208,y:752,duration:4,requires:['power'],prop:6},
 {id:'installed',label:'Install the battery at the bus',x:1168,y:1080,duration:4,requires:['battery'],prop:6},
 {id:'survivor',label:'Rescue the clinic survivor',x:1632,y:240,duration:3,optional:true,prop:12},
 {id:'escape',label:'Start the bus',x:1168,y:1152,duration:2.5,requires:['installed','keys'],prop:0}
];
export const PICKUPS=[
 {id:'a1',x:544,y:320,kind:'ammo',amount:5},{id:'a2',x:960,y:304,kind:'ammo',amount:5},
 {id:'a3',x:576,y:992,kind:'ammo',amount:4},{id:'a4',x:2304,y:912,kind:'ammo',amount:6},
 {id:'cache1',x:2048,y:224,kind:'ammo',amount:10},{id:'cache2',x:1344,y:624,kind:'ammo',amount:10},
 {id:'heal1',x:928,y:368,kind:'health',amount:1},{id:'heal2',x:2016,y:864,kind:'health',amount:1}
];
export const PROPS=[
 {id:'wreck1',x:736,y:576,w:128,h:64,art:1,burning:true},
 {id:'wreck2',x:1728,y:640,w:128,h:64,art:2,burning:true},
 {id:'wreck3',x:1376,y:960,w:96,h:64,art:3},
 {id:'wreck4',x:1920,y:320,w:128,h:64,art:1},
 {id:'wreck5',x:64,y:640,w:128,h:64,art:2},
 {id:'barricade1',x:928,y:704,w:224,h:32,art:4},
 {id:'barricade2',x:1792,y:864,w:32,h:256,art:4},
 {id:'rubble1',x:672,y:176,w:96,h:192,art:11},
 {id:'rubble2',x:2048,y:416,w:192,h:96,art:11},
 {id:'lines',x:736,y:864,w:128,h:32,art:8,wire:true}
];
const overlap=(x,y,r,b)=>x+r>b.x&&x-r<b.x+b.w&&y+r>b.y&&y-r<b.y+b.h;
export function walls(s){
 const list=[];
 for(const b of BUILDINGS){
   list.push({x:b.x,y:b.y,w:b.w,h:16},{x:b.x,y:b.y,w:16,h:b.h},{x:b.x+b.w-16,y:b.y,w:16,h:b.h});
   list.push({x:b.x,y:b.y+b.h-16,w:b.door-b.x,h:16},{x:b.door+80,y:b.y+b.h-16,w:b.x+b.w-b.door-80,h:16});
   if(b.id==='garage'&&!s.tasks.power)list.push({x:b.door,y:b.y+b.h-16,w:80,h:16,gate:true});
 }
 return list;
}
export function solid(s,x,y,r=11){
 if(x<r||y<r||x>WORLD.width-r||y>WORLD.height-r)return true;
 return walls(s).some(b=>overlap(x,y,r,b))||PROPS.some(b=>(!b.wire||!s.tasks.power)&&overlap(x,y,r,b));
}
export function lineClear(s,a,b){const count=Math.ceil(Math.hypot(b.x-a.x,b.y-a.y)/8);for(let i=1;i<=count;i++)if(solid(s,a.x+(b.x-a.x)*i/count,a.y+(b.y-a.y)*i/count,2))return false;return true;}
export function nextObjective(s){return TASKS.find(t=>!t.optional&&!s.tasks[t.id]&&(t.requires||[]).every(id=>s.tasks[id]));}
export function seededEnemies(){
 const enemies=[];let seed=1733;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 const state={tasks:{}};
 for(let i=0;i<56;i++){
   let x,y,tries=0;do{x=48+rand()*2464;y=48+rand()*1184;tries++;}while(tries<200&&(solid(state,x,y,16)||Math.hypot(x-1168,y-1120)<260));
   const kind=i%11===0?'brute':i%5===0?'crawler':i%3===0?'runner':'shambler';
   enemies.push({id:`e${i}`,x,y,homeX:x,homeY:y,kind,hp:kind==='brute'?6:kind==='shambler'?2:1,phase:'wander',timer:0,angle:rand()*Math.PI*2,deathTime:0});
 }
 return enemies;
}
