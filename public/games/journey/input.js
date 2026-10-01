// Independent contacts: releasing one thumb cannot clear the other thumb.
// This cartridge's controller includes U-10 interruption handling without
// changing the existing cartridges' input behavior.
export function bindJourneyInput(root,onChange,{signal,blocked=()=>false}={}){
  const contacts=new Map(),keys=new Map();
  const mapping={arrowup:'up',w:'up',arrowdown:'down',s:'down',arrowleft:'left',a:'left',arrowright:'right',d:'right',j:'attack',k:'jump',l:'magic'};
  const on=(el,type,fn)=>el?.addEventListener(type,fn,{signal});
  const sync=()=>{const held=new Set([...keys.values(),...[...contacts.values()].flat()]);
    root.querySelectorAll('[data-jkey]').forEach(b=>b.classList.toggle('held',held.has(b.dataset.jkey)));
    onChange({x:Number(held.has('right'))-Number(held.has('left')),y:Number(held.has('down'))-Number(held.has('up')),attack:held.has('attack'),jump:held.has('jump'),magic:held.has('magic')});};
  const clear=()=>{contacts.clear();keys.clear();sync();};
  const release=e=>{contacts.delete(e.pointerId);sync();};
  const dpad=root.querySelector('[data-dpad]');
  const direction=e=>{const r=dpad.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
    if(Math.abs(x)>.7||Math.abs(y)>.7)return [];const dirs=[];if(x<-.13)dirs.push('left');if(x>.13)dirs.push('right');if(y<-.13)dirs.push('up');if(y>.13)dirs.push('down');return dirs;};
  const pads=new Set();
  on(dpad,'pointerdown',e=>{e.preventDefault();if(blocked())return;pads.add(e.pointerId);contacts.set(e.pointerId,direction(e));try{dpad.setPointerCapture(e.pointerId);}catch{contacts.delete(e.pointerId);pads.delete(e.pointerId);}sync();});
  on(window,'pointermove',e=>{if(!contacts.has(e.pointerId))return;if(e.buttons===0){pads.delete(e.pointerId);release(e);return;}if(pads.has(e.pointerId)){contacts.set(e.pointerId,direction(e));sync();}});
  root.querySelectorAll('[data-jkey]').forEach(button=>{
    on(button,'pointerdown',e=>{e.preventDefault();if(blocked())return;contacts.set(e.pointerId,[button.dataset.jkey]);try{button.setPointerCapture(e.pointerId);}catch{contacts.delete(e.pointerId);}sync();});
    on(button,'lostpointercapture',release);on(button,'contextmenu',e=>e.preventDefault());
  });
  for(const type of ['pointerup','pointercancel'])on(window,type,e=>{pads.delete(e.pointerId);release(e);});
  on(dpad,'lostpointercapture',e=>{pads.delete(e.pointerId);release(e);});
  on(window,'keydown',e=>{if(e.target?.closest?.('input,select,textarea,[contenteditable]'))return;const key=e.key.toLowerCase();if(key==='escape'){clear();return;}if(blocked()||!mapping[key])return;e.preventDefault();keys.set(key,mapping[key]);sync();});
  on(window,'keyup',e=>{keys.delete(e.key.toLowerCase());sync();});
  for(const type of ['blur','pagehide','orientationchange','resize'])on(window,type,clear);
  on(window.visualViewport,'resize',clear);on(document,'visibilitychange',()=>{if(document.hidden)clear();});
  signal?.addEventListener('abort',clear,{once:true});return {clear,debug:()=>({contacts:contacts.size,keys:keys.size})};
}
