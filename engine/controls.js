// Shared input contract. Physical input never owns simulation state.
export const CONTROL_PROFILES = {
  nightfall: {
    left:[['up','↑ Forward'],['left','↶ Turn left'],['down','↓ Reverse'],['right','↷ Turn right']],
    right:[['run','Run'],['fire','Fire'],['interact','Search / Use']],
    keys:{arrowup:'up',w:'up',arrowdown:'down',s:'down',arrowleft:'left',a:'left',arrowright:'right',d:'right',shift:'run',' ':'fire',e:'interact'},
    help:'W / ↑: forward · S / ↓: reverse · A / ← and D / →: turn · Shift: run · Space: fire · hold E: search / use · M: map. Release Run to fire. Touch: left thumb steers; right thumb runs, fires or interacts. One live run; no restart after defeat.'
  },
  vault: {
    left:[['left','◀ Move left'],['right','Move right ▶']],right:[['jump','Jump'],['interact','Interact / Use']],
    keys:{arrowleft:'left',a:'left',arrowright:'right',d:'right',arrowup:'jump',w:'jump',' ':'jump',e:'interact'},
    help:'A / ← and D / →: move · Space / W / ↑: jump · hold E: panel, access card or elevator; tap E away from these to use a toolkit charge. Touch: hold Move and Jump together. One live run: the first two detections return you to a checkpoint; the third ends the run. Active escape time: three minutes.'
  }
};
export function controlMarkup(profile){
  const buttons=entries=>entries.map(([key,label])=>`<button type="button" data-game-key="${key}" aria-label="${label}">${label}</button>`).join('');
  return `<div class="mq-thumb-controls"><div class="mq-thumb-left ${profile.left.length===4?'mq-tank':''}">${buttons(profile.left)}</div><div class="mq-thumb-right ${profile.right.length===2?'mq-two':''}">${buttons(profile.right)}</div></div>`;
}
export function bindGameInput(root,profile,{signal,onChange,blocked=()=>false,onPause=()=>{},onMap=()=>{}}){
  const keys=new Set(),pointers=new Map();
  const on=(el,event,fn)=>el.addEventListener(event,fn,{signal});
  const sync=()=>{const next={};for(const k of new Set([...keys,...pointers.values()]))next[k]=true;root.querySelectorAll('[data-game-key]').forEach(b=>b.classList.toggle('held',!!next[b.dataset.gameKey]));onChange(next);};
  const clear=()=>{keys.clear();pointers.clear();sync();};
  const release=e=>{pointers.delete(e.pointerId);sync();};
  root.querySelectorAll('[data-game-key]').forEach(b=>{
    on(b,'pointerdown',e=>{e.preventDefault();if(blocked())return;try{b.setPointerCapture(e.pointerId);}catch{}pointers.set(e.pointerId,b.dataset.gameKey);sync();});
    for(const type of ['pointerup','pointercancel','lostpointercapture'])on(b,type,release);
    on(b,'contextmenu',e=>e.preventDefault());
  });
  for(const type of ['pointerup','pointercancel'])on(window,type,release);
  on(window,'pointermove',e=>{if(e.buttons===0&&pointers.has(e.pointerId))release(e);});
  on(window,'keydown',e=>{
    if(e.target?.closest?.('input,select,textarea,[contenteditable="true"]'))return;
    const key=e.key.toLowerCase();if(key==='escape'){clear();onPause();return;}
    if(blocked())return;if(key==='m'&&!e.repeat){onMap();return;}
    if(profile.keys[key]){e.preventDefault();keys.add(profile.keys[key]);sync();}
  });
  on(window,'keyup',e=>{const key=profile.keys[e.key.toLowerCase()];if(key){keys.delete(key);sync();}});
  const suspend=()=>{clear();onPause();};
  on(window,'blur',suspend);on(window,'pagehide',suspend);on(window,'orientationchange',suspend);
  on(document,'visibilitychange',()=>{if(document.hidden)suspend();});
  signal?.addEventListener('abort',clear,{once:true});return {clear};
}
export function crispCanvas(canvas,logicalWidth,logicalHeight){
  const rect=canvas.getBoundingClientRect();
  const scale=Math.min(3,Math.max(1,(rect.width||logicalWidth)/logicalWidth*(globalThis.devicePixelRatio||1)));
  const w=Math.round(logicalWidth*scale),h=Math.round(logicalHeight*scale);
  if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}
  const ctx=canvas.getContext('2d');if(ctx){ctx.setTransform(w/logicalWidth,0,0,h/logicalHeight,0,0);ctx.imageSmoothingEnabled=false;}return ctx;
}
