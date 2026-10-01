import {HEROES,ARENA} from './config.js';
const SOURCE=256;
const clips={idle:[0,1],walk:[2,3,4,5],attack:[6,7,8,9,10,11],jump:[12,13],air:[14],hurt:[16],down:[17],special:[18,19],victory:[22,23]};
const enemyClips={walk:[2,3,4,5],windup:[6,7],attack:[8,9],recover:[10,11],hurt:[12,13],down:[17]};
export class JourneyRenderer {
  constructor(canvas){this.canvas=canvas;this.ctx=canvas.getContext('2d');this.images={};this.frames=new Map();this.snapshot=null;this.started=performance.now();
    for(const [key,file] of [['hero','wukong-stage1.png'],['enemy','raider-stage1.png']]){const img=new Image();img.src=new URL('../../assets/journey/'+file,import.meta.url).href;this.images[key]=img;}
  }
  set(snapshot){this.snapshot=snapshot;}
  sprite(img,frame,x,y,size,facing=1,alpha=1){if(!img.complete||!img.naturalWidth)return;
    const c=this.ctx;c.save();c.globalAlpha=alpha;c.translate(Math.round(x),Math.round(y));c.scale(facing,1);
    // Cells retain padding and a common foot anchor. No baked scene or hitbox.
    c.drawImage(img,(frame%6)*SOURCE,Math.floor(frame/6)*SOURCE,SOURCE,SOURCE,-size/2,-size*.96,size,size);c.restore();}
  draw(now=performance.now()){
    const canvas=this.canvas,c=this.ctx,s=this.snapshot;if(!c)return;
    if(canvas.width!==960||canvas.height!==420){canvas.width=960;canvas.height=420;}c.imageSmoothingEnabled=false;
    c.fillStyle='#121d33';c.fillRect(0,0,960,420);
    // Authored sample scenery: restrained pixel silhouettes behind threats.
    c.fillStyle='#263c51';c.beginPath();c.moveTo(0,210);for(let x=0;x<=960;x+=32)c.lineTo(x,85+Math.sin(x*.009)*60+Math.sin(x*.025)*22);c.lineTo(960,260);c.lineTo(0,260);c.fill();
    c.fillStyle='#354c58';c.beginPath();c.moveTo(0,235);for(let x=0;x<=960;x+=24)c.lineTo(x,180+Math.sin(x*.014)*34);c.lineTo(960,275);c.lineTo(0,275);c.fill();
    c.fillStyle='#344342';c.fillRect(0,224,960,196);c.fillStyle='#45534a';c.fillRect(0,240,960,130);
    for(let i=0;i<80;i++){c.fillStyle=i%3?'#3c4943':'#526052';c.fillRect((i*137)%960,247+(i*53)%116,12+(i%3)*7,3);}
    for(const x of [56,865]){c.fillStyle='#233738';c.fillRect(x,155,30,112);c.fillStyle='#6a6756';c.fillRect(x+5,148,22,12);c.fillStyle='#bab280';c.fillRect(x+8,160,16,16);c.fillStyle='#323e37';c.fillRect(x-12,140,55,8);}
    c.fillStyle='#172b2b';c.fillRect(0,379,960,41);c.fillStyle='#677057';c.fillRect(0,377,960,3);
    if(!s){c.fillStyle='#dce7dc';c.font='20px system-ui';c.textAlign='center';c.fillText('Connecting to your team…',480,260);return;}
    const time=(now-this.started)/1000;
    for(const prop of s.props||[]){if(prop.hp<=0)continue;c.fillStyle='#553625';c.fillRect(prop.x-16,prop.y-31,32,31);c.strokeStyle='#a77b44';c.lineWidth=3;c.strokeRect(prop.x-15,prop.y-30,30,29);c.beginPath();c.moveTo(prop.x-13,prop.y-27);c.lineTo(prop.x+13,prop.y-3);c.stroke();}
    for(const item of s.pickups||[])if(!item.taken){c.fillStyle='#b0eeec';c.beginPath();c.moveTo(item.x,item.y-26-Math.sin(time*4)*3);c.lineTo(item.x+8,item.y-15);c.lineTo(item.x,item.y-5);c.lineTo(item.x-8,item.y-15);c.fill();c.fillStyle='#f4ffff';c.fillRect(item.x-2,item.y-21,4,5);}
    const actors=[...(s.enemies||[]).map(e=>({...e,enemy:true})),...(s.players||[]).filter(p=>p.started&&p.visible).map(p=>({...p,enemy:false}))].sort((a,b)=>a.y-b.y);
    for(const a of actors){
      c.fillStyle='#172928aa';c.beginPath();c.ellipse(a.x,a.y,21,6,0,0,Math.PI*2);c.fill();
      const action=a.enemy?(a.hurt>0?'hurt':a.phase):(s.phase==='terminal'&&s.result?.outcome==='victory'?'victory':a.action);
      const signature=action+(a.enemy?'':a.combo);let cache=this.frames.get(a.id);if(!cache||cache.signature!==signature){cache={signature,start:now};this.frames.set(a.id,cache);}
      const list=(a.enemy?enemyClips:clips)[action]||[0],rate=action==='attack'?80:action==='walk'?105:200;
      const index=Math.floor((now-cache.start)/rate),frame=list[['idle','walk','special','victory'].includes(action)?index%list.length:Math.min(index,list.length-1)];
      const jump=!a.enemy&&a.jumpMs>0?Math.sin((1-a.jumpMs/700)*Math.PI)*55:0;
      const alpha=!a.enemy&&a.protectionMs>0?(Math.floor(now/90)%2?.45:1):1;
      if(a.enemy||a.hero==='wukong'){
        this.sprite(this.images[a.enemy?'enemy':'hero'],frame,a.x,a.y-jump,a.enemy?96:104,a.facing,alpha);
        if(!a.enemy&&a.action==='special')for(const offset of [-55,55])this.sprite(this.images.hero,frame,a.x+offset,a.y-jump,104,a.facing,.35);
      }else{
        // Explicitly labeled stage-1 stand-ins; other hero art follows later.
        c.fillStyle=HEROES.find(h=>h.id===a.hero)?.color||'#fff';c.fillRect(a.x-15,a.y-jump-48,30,43);c.beginPath();c.arc(a.x,a.y-jump-55,12,0,Math.PI*2);c.fill();c.fillStyle='#152630';c.font='bold 13px system-ui';c.textAlign='center';c.fillText(a.hero[0].toUpperCase(),a.x,a.y-jump-24);
      }
      if(a.enemy&&a.phase==='windup'){c.strokeStyle='#ffb95b';c.lineWidth=2;c.strokeRect(a.x-31,a.y-6,62,12);c.fillStyle='#ffd78c';c.font='bold 18px system-ui';c.textAlign='center';c.fillText('!',a.x,a.y-90);}
      if(a.hp>0){c.fillStyle='#142122';c.fillRect(a.x-22,a.y-100,44,4);c.fillStyle=a.enemy?'#c47165':'#a7dd92';c.fillRect(a.x-22,a.y-100,44*a.hp/a.maxHp,4);}
      if(!a.enemy){c.font='11px system-ui';c.textAlign='center';c.fillStyle='#eff4ec';c.fillText(a.alias,a.x,a.y+18);}
    }
    c.fillStyle='#d9c99c';c.font='12px system-ui';c.textAlign='left';c.fillText('MOUNTAIN TRAINING COURT',28,31);
    c.fillStyle='#adbdc5';c.font='12px system-ui';c.textAlign='right';c.fillText('WUKONG + RAIDER ANIMATION SAMPLE',932,31);
  }
}
