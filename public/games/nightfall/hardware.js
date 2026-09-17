import {DISTRACTIONS,propBounds,WINDOWS} from './world.js?v=0.9.1';
export function drawCar(c,p,s){
 const b=propBounds(p),alarm=DISTRACTIONS.find(d=>d.propId===p.id),live=alarm&&s.distractions[alarm.id],active=live&&live.until>s.time;
 c.save();c.translate(b.x,b.y);const w=b.w,h=b.h;
 c.fillStyle='#080e13';c.fillRect(12,-2,16,5);c.fillRect(w-28,-2,16,5);c.fillRect(12,h-3,16,5);c.fillRect(w-28,h-3,16,5);
 const paint=c.createLinearGradient(0,0,0,h);paint.addColorStop(0,'#6c7677');paint.addColorStop(.5,'#313b3f');paint.addColorStop(1,'#171f26');c.fillStyle=paint;c.beginPath();c.roundRect(0,0,w,h,7);c.fill();c.strokeStyle='#879295';c.lineWidth=1;c.stroke();
 c.fillStyle='#122b38';c.beginPath();c.moveTo(w*.28,4);c.lineTo(w*.39,7);c.lineTo(w*.39,h-7);c.lineTo(w*.28,h-4);c.closePath();c.fill();c.strokeStyle='#7297a5';c.stroke();
 c.fillStyle='#101d27';c.fillRect(w*.68,5,w*.12,h-10);c.strokeStyle='#141c22';c.strokeRect(w*.4,4,w*.25,h-8);
 c.strokeStyle='#92765c';c.beginPath();c.moveTo(7,h*.5);c.lineTo(20,h*.7);c.lineTo(30,h*.4);c.moveTo(w-18,5);c.lineTo(w-8,h-6);c.stroke();
 c.fillStyle='#aa775f';c.fillRect(w-3,5,3,7);c.fillRect(w-3,h-12,3,7);
 if(alarm){c.fillStyle=active||!live&&Math.floor(s.time*2)%2?'#ff354c':'#5e1827';c.beginPath();c.arc(w*.52,h*.5,3,0,Math.PI*2);c.fill();if(active){c.strokeStyle='#ff596c';c.strokeRect(-5,-5,w+10,h+10);}}
 c.restore();
}
export function drawFixtures(c,s){
 for(const d of DISTRACTIONS){if(d.kind!=='barrel')continue;
   const live=s.distractions[d.id],warning=live&&s.time<live.ignitesAt,fire=live&&s.time>=live.ignitesAt&&s.time<live.until;
   c.save();c.translate(d.x,d.y);const metal=c.createLinearGradient(-12,0,12,0);metal.addColorStop(0,'#322b28');metal.addColorStop(.5,'#9a7651');metal.addColorStop(1,'#42352d');c.fillStyle=metal;c.beginPath();c.roundRect(-12,-15,24,30,4);c.fill();c.strokeStyle='#c4b298';c.lineWidth=2;c.beginPath();c.moveTo(-12,-8);c.lineTo(12,-8);c.moveTo(-12,8);c.lineTo(12,8);c.stroke();c.fillStyle='#efe3ca';c.fillRect(-10,-5,20,11);c.font='bold 8px system-ui';c.fillStyle='#362520';c.fillText('GAS',-9,3);
   if(warning||fire){c.strokeStyle=warning?'#ffd6a1':'#ff8752';c.lineWidth=2;c.setLineDash(warning?[6,4]:[]);c.beginPath();c.arc(0,0,60,0,Math.PI*2);c.stroke();c.setLineDash([]);}
   if(warning){c.font='bold 10px system-ui';c.fillStyle='#fff0d3';c.fillText('IGNITING — MOVE!',-45,-65);}
   if(fire){const glow=c.createRadialGradient(0,0,5,0,0,60);glow.addColorStop(0,'#ffe4a8aa');glow.addColorStop(1,'#f2663230');c.fillStyle=glow;c.beginPath();c.arc(0,0,60,0,Math.PI*2);c.fill();for(let i=0;i<9;i++){const a=i*2.4,r=i?20+i*3:0,x=Math.cos(a)*r,y=Math.sin(a)*r;c.fillStyle=i%2?'#ffb644bb':'#ff663caa';c.beginPath();c.moveTo(x-7,y+8);c.quadraticCurveTo(x-12,y-4,x+Math.sin(s.time*9+i)*5,y-23);c.quadraticCurveTo(x+13,y-4,x+7,y+8);c.closePath();c.fill();}}
   c.restore();
 }
 for(const w of WINDOWS){const broken=s.windows?.[w.id];c.fillStyle=broken?'#12222c':'#729fab';c.fillRect(w.x,w.y,w.w,w.h);c.strokeStyle='#c8e4e6';c.lineWidth=2;c.strokeRect(w.x,w.y,w.w,w.h);
   if(!broken){c.strokeStyle='#253c4d';for(let y=w.y+20;y<w.y+w.h;y+=20){c.beginPath();c.moveTo(w.x,y);c.lineTo(w.x+w.w,y);c.stroke();}c.strokeStyle='#d9eff4';c.beginPath();c.moveTo(w.x+3,w.y+7);c.lineTo(w.x+12,w.y+17);c.stroke();}
   else{c.fillStyle='#c4e4e5';c.beginPath();c.moveTo(w.x,w.y);c.lineTo(w.x+7,w.y+8);c.lineTo(w.x+16,w.y);c.fill();}
   c.font='bold 9px system-ui';c.fillStyle='#e5f2f4';c.fillText(broken?'EXIT':'GLASS',w.x-10,w.y-5);
 }
}
