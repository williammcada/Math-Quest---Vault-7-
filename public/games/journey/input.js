import {bindHeldInput,pointInside} from '../../engine/held-input.js';

// Journey supplies its layout and action names; shared input owns every contact.
export function bindJourneyInput(root,onChange,{signal,blocked=()=>false,onInterrupt=()=>{},onReset=()=>{}}={}){
  const dpad=root.querySelector('[data-dpad]');
  const direction=point=>{
    if(!pointInside(point,dpad))return {};
    const r=dpad.getBoundingClientRect(),x=(point.clientX-r.left)/r.width-.5,y=(point.clientY-r.top)/r.height-.5;
    const held={};if(x<-.13)held.left=true;if(x>.13)held.right=true;if(y<-.13)held.up=true;if(y>.13)held.down=true;return held;
  };
  const zones=[{element:dpad,read:direction},...[...root.querySelectorAll('[data-jkey]')].map(element=>({element,read:point=>pointInside(point,element)?{[element.dataset.jkey]:true}:{}}))];
  const binding=bindHeldInput(root,{
    zones,signal,blocked,onPause:onInterrupt,
    keys:{arrowup:'up',w:'up',arrowdown:'down',s:'down',arrowleft:'left',a:'left',arrowright:'right',d:'right',j:'attack',z:'attack',k:'jump',' ':'jump',x:'jump',l:'magic',c:'magic'},
    onChange:held=>{
      root.querySelectorAll('[data-jkey]').forEach(b=>b.classList.toggle('held',!!held[b.dataset.jkey]));
      onChange({x:Number(!!held.right)-Number(!!held.left),y:Number(!!held.down)-Number(!!held.up),attack:!!held.attack,jump:!!held.jump,magic:!!held.magic});
    }
  });
  const win=root.ownerDocument.defaultView;
  for(const type of ['resize','pointercancel','touchcancel'])win.addEventListener(type,onReset,{signal});
  win.visualViewport?.addEventListener('resize',onReset,{signal});
  // HUD/world touch protection is Journey-specific; form selection stays native.
  for(const element of root.querySelectorAll('.j-hud,.j-heading,.j-status')){
    element.addEventListener('touchstart',event=>{if(event.cancelable)event.preventDefault();},{signal,passive:false});
  }
  return binding;
}
