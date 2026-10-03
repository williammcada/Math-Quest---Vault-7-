import {HERO_ART,HERO_CLIPS} from './hero-art.js';
import {FRAME_BOUNDS} from './frame-bounds.js';
import {FRAME_REPAIRS,REPAIR_ATLASES} from './frame-repairs.js';
const SOURCE=256;
const clips=HERO_CLIPS;
const enemyClips={walk:[2,3,4,5],windup:[6,7],attack:[8,9],recover:[10,11],hurt:[12,13],down:[17]};
export class JourneyRenderer {
  constructor(canvas){this.canvas=canvas;this.ctx=canvas.getContext('2d');this.images={};this.frames=new Map();this.snapshot=null;this.started=performance.now();
    for(const [key,file] of [...Object.entries(HERO_ART).map(([key,art])=>[key,art.file]),['enemy','raider-stage1.png'],['horse','prince-charge-stage3.png'],...Object.entries(REPAIR_ATLASES)]){const img=new Image();img.src=new URL('../../assets/journey/'+file,import.meta.url).href;this.images[key]=img;}this.images.hero=this.images.wukong;
  }
  set(snapshot){this.snapshot=snapshot;}
  sprite(img,frame,x,y,size,facing=1,alpha=1,bounds=null){if(!img||!img.complete||!img.naturalWidth)return;
    const c=this.ctx;c.save();c.globalAlpha=alpha;c.translate(Math.round(x),Math.round(y));c.scale(facing,1);
    // Cells retain padding and a common foot anchor. No baked scene or hitbox.
    const source=bounds?.source||[(frame%6)*SOURCE,Math.floor(frame/6)*SOURCE,SOURCE,SOURCE],pivot=bounds?.pivot||[128,245.76],scale=size/SOURCE*(bounds?.scale??1);
    c.drawImage(img,...source,-pivot[0]*scale,-pivot[1]*scale,source[2]*scale,source[3]*scale);c.restore();}
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
    for(const item of s.pickups||[])if(!item.taken){c.fillStyle=item.kind==='health'?'#7ee88e':'#b0eeec';c.beginPath();c.moveTo(item.x,item.y-26-Math.sin(time*4)*3);c.lineTo(item.x+8,item.y-15);c.lineTo(item.x,item.y-5);c.lineTo(item.x-8,item.y-15);c.fill();c.fillStyle='#f4ffff';c.fillRect(item.x-2,item.y-21,4,5);if(item.kind==='health')c.fillRect(item.x-5,item.y-19,10,2);}
    for(const e of s.enemies||[])if(e.hp>0&&e.phase==='windup'){
      c.fillStyle='#ff934b55';c.strokeStyle='#ffbd72';c.lineWidth=2;
      if(e.kind==='nezha'&&e.move==='rush'){c.fillRect(48,e.laneY-22,864,44);c.strokeRect(48,e.laneY-22,864,44);}
      else if(e.aim&&(e.kind==='caster'||e.kind==='leaper'||e.move==='ring')){c.beginPath();c.moveTo(e.x,e.y);c.lineTo(e.aim.x,e.aim.y);c.stroke();c.strokeRect(e.aim.x-22,e.aim.y-18,44,36);}
      else {const reach=e.kind==='nezha'?130:e.kind==='brute'?99:65;c.fillRect(e.facing<0?e.x-reach:e.x,e.y-26,reach,52);}
    }
    for(const b of s.projectiles||[]){c.strokeStyle=b.kind==='ring'?'#ffe585':'#c49dff';c.lineWidth=4;c.beginPath();c.arc(b.x,b.y-12,b.kind==='ring'?13:6,0,Math.PI*2);c.stroke();}
    const actors=[...(s.enemies||[]).map(e=>({...e,enemy:true})),...(s.players||[]).filter(p=>p.started&&p.visible).map(p=>({...p,enemy:false}))].sort((a,b)=>a.y-b.y);
    for(const a of actors){
      c.fillStyle='#172928aa';c.beginPath();c.ellipse(a.x,a.y,21,6,0,0,Math.PI*2);c.fill();
      const action=a.enemy?(a.hurt>0?'hurt':a.phase):(s.phase==='terminal'&&s.result?.outcome==='victory'?'victory':a.action);
      const signature=action+(a.enemy?'':a.combo);let cache=this.frames.get(a.id);if(!cache||cache.signature!==signature){cache={signature,start:now};this.frames.set(a.id,cache);}
      const list=(a.enemy?enemyClips:clips)[action]||[0],rate=action==='attack'?80:action==='walk'?105:200;
      const index=Math.floor((now-cache.start)/rate),frame=list[['idle','walk','special','victory'].includes(action)&&!(a.hero==='prince'&&action==='special')?index%list.length:Math.min(index,list.length-1)];
      const jump=!a.enemy&&a.jumpMs>0?Math.sin((1-a.jumpMs/700)*Math.PI)*55:0;
      const alpha=!a.enemy&&a.protectionMs>0?(Math.floor(now/90)%2?.45:1):1;
      const art=a.enemy?null:HERO_ART[a.hero],repair=a.enemy?null:FRAME_REPAIRS[a.hero]?.[frame];
      if(a.enemy&&a.kind!=='raider'){
        // Explicit technical proxies; production enemy/boss sprite art is pending.
        const colors={leaper:'#c18cf0',caster:'#adbdff',shield:'#c5ac76',brute:'#bd8170',nezha:'#f3ad62'};
        const width=a.kind==='brute'?42:a.kind==='nezha'?34:26,height=a.kind==='nezha'?78:64;
        c.fillStyle=colors[a.kind]||'#ccc';c.globalAlpha=a.phase==='entrance'?.4:1;c.fillRect(a.x-width/2,a.y-height,width,height);c.globalAlpha=1;
        if(a.kind==='shield'){c.strokeStyle='#f5de8d';c.lineWidth=5;c.beginPath();c.moveTo(a.x+a.facing*21,a.y-60);c.lineTo(a.x+a.facing*21,a.y-8);c.stroke();}
        c.fillStyle='#fff';c.font='11px system-ui';c.textAlign='center';c.fillText(a.kind.toUpperCase()+' · PROXY',a.x,a.y+15);
      }else if(!a.enemy&&a.hero==='prince'&&action.startsWith('horse')){
        const horseFrames={'horse-transform':[0,1],'horse':[4,5,6,7],'horse-idle':[2],'horse-turn':[8],'horse-impact':[9],'horse-return':[10,11]};
        const seq=horseFrames[action]||[2],idx=Math.floor((now-cache.start)/100),f=seq[action==='horse'?idx%seq.length:Math.min(idx,seq.length-1)];
        const rows=[0,290,520,765,1024],row=Math.floor(f/4),col=f%4,feet=[272,510,758,997];
        this.sprite(this.images.horse,f,a.x,a.y,104,a.facing,alpha,{source:[col*384,rows[row],384,rows[row+1]-rows[row]],pivot:[192,feet[row]-rows[row]]});
      }else this.sprite(this.images[repair?.image||(a.enemy?'enemy':a.hero)],frame,a.x,a.y-jump,a.enemy?96:art.size,a.facing,alpha,a.enemy?null:repair||FRAME_BOUNDS[a.hero]?.[frame]);
      if(!a.enemy&&a.hero==='wukong'&&a.action==='special')for(const offset of [-55,55])this.sprite(this.images.wukong,frame,a.x+offset,a.y-jump,art.size,a.facing,.35,FRAME_BOUNDS.wukong?.[frame]);
      if(a.enemy&&a.phase==='windup'){c.strokeStyle='#ffb95b';c.lineWidth=2;c.strokeRect(a.x-31,a.y-6,62,12);c.fillStyle='#ffd78c';c.font='bold 18px system-ui';c.textAlign='center';c.fillText('!',a.x,a.y-90);}
      if(a.hp>0){c.fillStyle='#142122';c.fillRect(a.x-22,a.y-100,44,4);c.fillStyle=a.enemy?'#c47165':'#a7dd92';c.fillRect(a.x-22,a.y-100,44*a.hp/a.maxHp,4);}
      if(!a.enemy){c.font='11px system-ui';c.textAlign='center';c.fillStyle='#eff4ec';c.fillText(a.alias,a.x,a.y+18);}
    }
    c.fillStyle='#d9c99c';c.font='14px system-ui';c.textAlign='left';c.fillText(s.level?.name?.toUpperCase()||'MOUNTAIN TRAINING COURT',28,31);
    c.fillStyle='#adbdc5';c.font='12px system-ui';c.textAlign='right';c.fillText('COMBAT CHECKPOINT · ENEMY ART PENDING',932,31);
    if(s.level?.bossWarning&&s.level.stage<4){c.fillStyle='#ffe585';c.font='bold 18px system-ui';c.textAlign='center';c.fillText('NEZHA IS APPROACHING',480,65);}
    const boss=s.enemies?.find(e=>e.kind==='nezha');if(boss){c.fillStyle='#182533';c.fillRect(200,55,560,14);c.fillStyle='#eda46b';c.fillRect(200,55,560*Math.max(0,boss.hp)/boss.maxHp,14);c.fillStyle='#fff';c.font='13px system-ui';c.textAlign='center';c.fillText('NEZHA · '+Math.ceil(boss.hp)+' / '+boss.maxHp,480,88);}
  }
}
