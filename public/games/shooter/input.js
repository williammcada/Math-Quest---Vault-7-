export function padSector(dx,dy,radius){
  if(Math.hypot(dx,dy)<radius*.19)return {x:0,y:0};
  const n=(Math.round(Math.atan2(dy,dx)/(Math.PI/4))+8)%8;
  return [{x:1,y:0},{x:1,y:1},{x:0,y:1},{x:-1,y:1},{x:-1,y:0},{x:-1,y:-1},{x:0,y:-1},{x:1,y:-1}][n];
}
export function bindInput({pad,jump,blocked,onPause,onFire,onChange=()=>{}}){
  const ac=new AbortController(),keys=new Set(),jumpPointers=new Set();let padPointer=null,touch={x:0,y:0};
  const on=(el,event,fn,opts={})=>el.addEventListener(event,fn,{signal:ac.signal,...opts});
  const value=()=>({x:Math.sign(Number(keys.has('right'))-Number(keys.has('left')))||touch.x,
    y:Math.sign(Number(keys.has('down'))-Number(keys.has('up')))||touch.y,jump:keys.has('jump')||jumpPointers.size>0,prone:keys.has('prone')});
  const sync=()=>{const v=value();pad.dataset.x=v.x;pad.dataset.y=v.y;pad.querySelector('.pad-dot').style.transform=`translate(${v.x*30}px,${v.y*30}px)`;jump.classList.toggle('held',v.jump);onChange(v);};
  const clear=()=>{keys.clear();jumpPointers.clear();padPointer=null;touch={x:0,y:0};sync();};
  const update=e=>{const r=pad.getBoundingClientRect();touch=padSector(e.clientX-r.x-r.width/2,e.clientY-r.y-r.height/2,r.width/2);sync();};
  on(pad,'pointerdown',e=>{e.preventDefault();if(blocked()||padPointer!==null)return;padPointer=e.pointerId;pad.setPointerCapture(e.pointerId);update(e);});
  on(pad,'pointermove',e=>{if(e.pointerId===padPointer){e.preventDefault();update(e);}});
  const release=e=>{if(e.pointerId===padPointer){padPointer=null;touch={x:0,y:0};}jumpPointers.delete(e.pointerId);sync();};
  for(const el of [pad,jump,window])for(const type of ['pointerup','pointercancel','lostpointercapture'])on(el,type,release);
  on(jump,'pointerdown',e=>{e.preventDefault();if(blocked())return;jump.setPointerCapture(e.pointerId);jumpPointers.add(e.pointerId);sync();});
  on(pad,'contextmenu',e=>e.preventDefault());on(jump,'contextmenu',e=>e.preventDefault());
  const map={arrowleft:'left',a:'left',arrowright:'right',d:'right',arrowup:'up',w:'up',arrowdown:'down',s:'down',' ':'jump',c:'prone'};
  on(window,'keydown',e=>{if(e.target.closest?.('input,select,textarea'))return;const k=e.key.toLowerCase();
    if(k==='escape'&&!e.repeat){clear();onPause();return;}if(blocked())return;
    if(k==='f'&&!e.repeat){onFire();return;}if(map[k]){e.preventDefault();keys.add(map[k]);sync();}});
  on(window,'keyup',e=>{if(map[e.key.toLowerCase()]){keys.delete(map[e.key.toLowerCase()]);sync();}});
  const suspend=()=>{clear();onPause(true);};for(const t of ['blur','pagehide','orientationchange'])on(window,t,suspend);
  on(document,'visibilitychange',()=>{if(document.hidden)suspend();});
  return {value,clear,destroy:()=>{clear();ac.abort();}};
}
