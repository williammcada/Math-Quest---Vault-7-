export function padSector(dx,dy,radius){
  if(Math.hypot(dx,dy)<radius*.19)return {x:0,y:0};
  const n=(Math.round(Math.atan2(dy,dx)/(Math.PI/4))+8)%8;
  return [{x:1,y:0},{x:1,y:1},{x:0,y:1},{x:-1,y:1},{x:-1,y:0},{x:-1,y:-1},{x:0,y:-1},{x:1,y:-1}][n];
}
export function bindInput({pad,jump,blocked,onPause,onFire,onChange=()=>{}}){
  const ac=new AbortController(),keys=new Map(),jumpPointers=new Map();let padPointer=null,padType=null,touch={x:0,y:0};
  const on=(el,event,fn,opts={})=>el.addEventListener(event,fn,{signal:ac.signal,...opts});
  const value=()=>{const held=new Set(keys.values());return {x:Math.sign(Number(held.has('right'))-Number(held.has('left')))||touch.x,
    y:Math.sign(Number(held.has('down'))-Number(held.has('up')))||touch.y,jump:held.has('jump')||jumpPointers.size>0,prone:held.has('prone')};};
  const sync=()=>{const v=value();pad.dataset.x=v.x;pad.dataset.y=v.y;pad.querySelector('.pad-dot').style.transform=`translate(${v.x*30}px,${v.y*30}px)`;jump.classList.toggle('held',v.jump);onChange(v);};
  const capture=(el,id)=>{try{el.setPointerCapture?.(id);}catch{/* Window capture listeners remain the fallback. */}};
  const unCapture=(el,id)=>{try{if(el.hasPointerCapture?.(id))el.releasePointerCapture(id);}catch{}};
  const clear=()=>{const oldPad=padPointer,oldJumps=[...jumpPointers.keys()];keys.clear();jumpPointers.clear();padPointer=null;padType=null;touch={x:0,y:0};if(oldPad!==null)unCapture(pad,oldPad);for(const id of oldJumps)unCapture(jump,id);sync();};
  const update=e=>{const r=pad.getBoundingClientRect(),dx=e.clientX-r.x-r.width/2,dy=e.clientY-r.y-r.height/2;
    // Dragging far outside the pad neutralizes movement, without expiring a valid held touch.
    touch=Math.hypot(dx,dy)>r.width*.8?{x:0,y:0}:padSector(dx,dy,r.width/2);sync();};
  on(pad,'pointerdown',e=>{e.preventDefault();if(blocked()||padPointer!==null)return;padPointer=e.pointerId;padType=e.pointerType;capture(pad,e.pointerId);update(e);});
  const release=e=>{if(e.pointerId===padPointer){padPointer=null;padType=null;touch={x:0,y:0};}jumpPointers.delete(e.pointerId);sync();};
  on(window,'pointermove',e=>{if(e.buttons===0){release(e);return;}if(e.pointerId===padPointer){if(blocked()){clear();return;}e.preventDefault();update(e);}},{capture:true,passive:false});
  for(const type of ['pointerup','pointercancel','lostpointercapture'])on(window,type,release,{capture:true});
  on(jump,'pointerdown',e=>{e.preventDefault();if(blocked())return;capture(jump,e.pointerId);jumpPointers.set(e.pointerId,e.pointerType);sync();});
  // Independent native-touch reconciliation catches a lost pointerup/cancel on Safari.
  // Preserve the other thumb when just one contact ends. Stationary holds never time out.
  const reconcile=e=>{const touches=Array.from(e.touches||[]);
    if(padType==='touch'&&!touches.some(t=>pad.contains(t.target))){const old=padPointer;padPointer=null;padType=null;touch={x:0,y:0};if(old!==null)unCapture(pad,old);}
    if(!touches.some(t=>jump.contains(t.target)))for(const [id,type] of jumpPointers)if(type==='touch'){jumpPointers.delete(id);unCapture(jump,id);}
    sync();};
  for(const type of ['touchend','touchcancel'])on(window,type,reconcile,{capture:true,passive:true});
  on(pad,'contextmenu',e=>e.preventDefault());on(jump,'contextmenu',e=>e.preventDefault());
  const map={arrowleft:'left',a:'left',arrowright:'right',d:'right',arrowup:'up',w:'up',arrowdown:'down',s:'down',' ':'jump',c:'prone'};
  on(window,'keydown',e=>{if(e.target.closest?.('input,select,textarea'))return;const k=e.key.toLowerCase();
    if(k==='escape'&&!e.repeat){clear();onPause();return;}if(blocked())return;
    if(k==='f'&&!e.repeat){onFire();return;}if(map[k]){e.preventDefault();keys.set(k,map[k]);sync();}});
  on(window,'keyup',e=>{if(map[e.key.toLowerCase()]){keys.delete(e.key.toLowerCase());sync();}});
  const suspend=()=>{clear();onPause(true);};for(const t of ['blur','pagehide','pageshow','orientationchange','resize'])on(window,t,suspend);
  if(window.visualViewport)on(window.visualViewport,'resize',suspend);
  on(document,'visibilitychange',()=>{if(document.hidden)suspend();});
  return {value,clear,destroy:()=>{clear();ac.abort();}};
}
