// Opt-in free-movement profile. Existing tank/platform input is unchanged.
export const DIRECTIONAL_KEYS={arrowup:'up',w:'up',arrowdown:'down',s:'down',arrowleft:'left',a:'left',arrowright:'right',d:'right'};
export function directionAt(x,y,width,height){
  const nx=(x-width/2)/(width/2),ny=(y-height/2)/(height/2),out={};
  if(Math.abs(nx)<.18&&Math.abs(ny)<.18)return out;
  // Square zones allow diagonals and one-thumb gliding; no dead gaps.
  if(nx<-.26)out.left=true;if(nx>.26)out.right=true;if(ny<-.26)out.up=true;if(ny>.26)out.down=true;
  return out;
}
export function bindDirectionalInput(root,{signal,onChange,blocked=()=>false,onPause=()=>{}}){
  const keyboard=new Set(),pointers=new Map(),pad=root.querySelector('[data-dpad]');
  const on=(el,type,fn)=>el.addEventListener(type,fn,{signal});
  const sync=()=>{const value=Object.fromEntries([...keyboard].map(k=>[k,true]));for(const p of pointers.values())Object.assign(value,p);root.querySelectorAll('[data-direction]').forEach(el=>el.classList.toggle('held',!!value[el.dataset.direction]));onChange(value);};
  const clear=()=>{keyboard.clear();pointers.clear();sync();};
  const move=e=>{if(!pointers.has(e.pointerId))return;if(blocked()){clear();return;}const r=pad.getBoundingClientRect();pointers.set(e.pointerId,directionAt(e.clientX-r.left,e.clientY-r.top,r.width,r.height));sync();};
  on(pad,'pointerdown',e=>{e.preventDefault();if(blocked())return;pointers.set(e.pointerId,{});try{pad.setPointerCapture(e.pointerId);}catch{}move(e);});
  on(pad,'pointermove',e=>{if(e.pointerType==='mouse'&&!e.buttons){pointers.delete(e.pointerId);sync();}else move(e);});
  for(const type of ['pointerup','pointercancel','lostpointercapture'])on(window,type,e=>{pointers.delete(e.pointerId);sync();});
  on(pad,'contextmenu',e=>e.preventDefault());
  on(window,'keydown',e=>{if(e.target?.closest?.('input,select,textarea,dialog'))return;const key=e.key.toLowerCase();if(key==='escape'){clear();onPause();return;}if(DIRECTIONAL_KEYS[key]&&!blocked()){e.preventDefault();keyboard.add(DIRECTIONAL_KEYS[key]);sync();}});
  on(window,'keyup',e=>{keyboard.delete(DIRECTIONAL_KEYS[e.key.toLowerCase()]);sync();});
  const suspend=()=>{clear();onPause();};for(const type of ['blur','pagehide','orientationchange'])on(window,type,suspend);
  on(document,'visibilitychange',()=>{if(document.hidden)suspend();});signal?.addEventListener('abort',clear,{once:true});return {clear};
}
