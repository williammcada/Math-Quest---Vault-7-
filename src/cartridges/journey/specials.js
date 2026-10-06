import {damageEnemy} from './encounters.js';
import {ARENA} from '../../../public/games/journey/config.js';
export const SPECIAL_DURATION={wukong:2400,bajie:900,wujing:1400,tang:900};
export function beginSpecial(p){p.specialState={hero:p.hero,age:0,x:p.x,y:p.y,facing:p.facing,hits:{},pulse:0};p.actionMs=SPECIAL_DURATION[p.hero];}
export function specialStep(m,p,dt){
  const s=p.specialState;if(!s)return;
  if(p.hp<=0||!p.connected||!p.available){p.specialState=null;p.actionMs=0;return;}
  s.age+=dt;p.action='special';p.actionMs=Math.max(1,SPECIAL_DURATION[s.hero]-s.age);
  const power=p.upgrades.includes('focus')?1.2:1;
  function hit(e,amount,push=0){damageEnemy(m,e,amount*power,p,true);if(push&&e.kind!=='nezha')e.x=Math.max(ARENA.left,Math.min(ARENA.right,e.x+s.facing*push));}
  const enemies=m.s.enemies.filter(e=>e.hp>0&&e.phase!=='entrance');
  if(s.hero==='wukong'){
    const pulse=Math.min(6,Math.floor(s.age/400));
    for(let n=s.pulse;n<pulse;n++)for(const e of enemies)if(Math.abs(e.x-p.x)<170&&Math.abs(e.y-p.y)<65)hit(e,12);
    s.pulse=pulse;
  }else if(s.hero==='bajie'&&s.age>=400&&!s.pulse){
    s.pulse=1;for(const e of enemies)if(Math.abs(e.x-s.x)<200&&Math.abs(e.y-s.y)<70)hit(e,60,45);
  }else if(s.hero==='wujing'&&s.age>=250){
    const previous=s.x+s.facing*Math.max(0,s.age-dt-250)*.30,current=s.x+s.facing*(s.age-250)*.30;
    for(const e of enemies)if(!s.hits[e.id]&&e.x>=Math.min(previous,current)-40&&e.x<=Math.max(previous,current)+40&&Math.abs(e.y-s.y)<65){hit(e,54,35);s.hits[e.id]=true;}
  }else if(s.hero==='tang'&&s.age>=300&&!s.pulse){
    s.pulse=1;for(const e of enemies)if(Math.hypot(e.x-s.x,e.y-s.y)<200)hit(e,40);
    for(const id of m.s.starters){const a=m.player(id);if(a.lives>0&&!a.respawnMs&&Math.hypot(a.x-s.x,a.y-s.y)<200){a.shield=Math.max(a.shield,20);if(!a.shieldMs)a.shieldMs=2000;}}
  }
  if(s.age>=SPECIAL_DURATION[s.hero]){p.specialState=null;p.actionMs=0;p.action='idle';}
}
