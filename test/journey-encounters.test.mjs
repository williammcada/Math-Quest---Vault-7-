import test from 'node:test';
import assert from 'node:assert/strict';
import {BrawlModel} from '../src/cartridges/journey/model.js';
import {waveKinds,enterStage,levelStep,enemyStep,projectileStep,damageEnemy,BOSS_MOVES} from '../src/cartridges/journey/encounters.js';
const heroes=['wukong','bajie','wujing','tang','prince'];
function start(n=1){const m=new BrawlModel({runId:'encounters',teamId:'t',expiresAt:1e9,members:Array.from({length:n},(_,i)=>({id:'p'+i}))},0);for(let i=0;i<n;i++){m.connect('p'+i,0);m.reserve('p'+i,heroes[i],0);m.ready('p'+i,[],0);}m.advance(3000);return m;}
function boss(n=1){const m=start(n);enterStage(m,4);return {m,e:m.s.enemies[0],p:m.player('p0')};}

test('authored wave counts, roles and IDs scale with frozen starting roster',()=>{
  for(let n=1;n<=5;n++){
    assert.equal(waveKinds(0,n).length,2+n);assert.equal(waveKinds(1,n).length,2+2*n);assert.equal(waveKinds(2,n).length,3+2*n);
    assert.deepEqual(new Set(waveKinds(2,n)),new Set(['shield','brute','caster','leaper','raider']));
    const m=start(n),ids=[];
    for(let stage=0;stage<3;stage++){
      if(stage)enterStage(m,stage);
      let peak=0;
      for(let tick=0;tick<30;tick++){levelStep(m,900);peak=Math.max(peak,m.s.enemies.filter(e=>e.hp>0).length);for(const e of m.s.enemies)if(!ids.includes(e.id))ids.push(e.id);}
      assert.equal(peak,Math.min(8,n+3,waveKinds(stage,n).length));
      while(m.s.level.queue.length){m.s.enemies.forEach(e=>e.hp=0);levelStep(m,900);for(const e of m.s.enemies)ids.push(e.id);}
    }
    assert.equal(new Set(ids).size,7+5*n);
  }
});
test('entrance warnings cannot damage players or accept attacks before entrance ends',()=>{
  const m=start(),p=m.player('p0');levelStep(m,1);const e=m.s.enemies[0];p.x=e.x;p.y=e.y;
  damageEnemy(m,e,100,p,true);assert.equal(e.hp,e.maxHp);
  enemyStep(m,e,699,[p]);assert.equal(p.hp,100);assert.equal(e.phase,'entrance');
  enemyStep(m,e,1,[p]);assert.equal(e.phase,'walk');assert.equal(p.hp,100);
});
test('cleared stages progress in order and release authored crate supplies once',()=>{
  const m=start(3);for(let stage=0;stage<4;stage++){
    assert.equal(m.s.level.stage,stage);m.s.level.queue=[];m.s.enemies=[];m.s.activeMs+=4001;levelStep(m,1);
  }
  assert.equal(m.s.level.stage,4);assert.equal(m.s.pickups.filter(p=>p.kind==='magic').length,15);
  assert.equal(m.s.pickups.filter(p=>p.kind==='health').length,3);
  assert.equal(new Set(m.s.pickups.map(p=>p.id)).size,18);enterStage(m,4);assert.equal(m.s.pickups.length,18);
});
test('117-second warning and forced boss preserve resources, supplies and starting-party scaling',()=>{
  const m=start(5),p=m.player('p0');levelStep(m,1);p.hp=43;p.magic=0;p.lives=2;m.s.activeMs=117000;levelStep(m,1);
  assert.equal(m.s.level.bossWarning,true);m.s.activeMs=120000;levelStep(m,1);
  assert.equal(m.s.enemies.length,1);assert.equal(m.s.enemies[0].maxHp,3250);assert.equal(m.s.level.withdrawn,1);
  assert.deepEqual([p.hp,p.magic,p.lives],[43,0,2]);assert.equal(m.s.level.queue.length,0);
  assert.equal(m.s.pickups.filter(p=>p.kind==='magic').length,25);assert.equal(m.s.pickups.filter(p=>p.kind==='health').length,5);
  for(let i=0;i<100;i++)levelStep(m,1000);assert.equal(m.s.enemies.length,1);
});
test('full meters leave health, health is personal and capped at max HP',()=>{
  const m=start(2),p=m.player('p0'),q=m.player('p1');m.s.level=null;m.s.enemies=[];p.x=q.x=400;p.y=q.y=300;q.hp=90;
  m.s.pickups=[{id:'h',kind:'health',x:400,y:300,taken:false}];m.advance(3001);
  assert.equal(p.hp,100);assert.equal(q.hp,100);assert.equal(m.s.pickups[0].taken,true);
});
test('ordinary enemies commit warnings without tracking a moved target',()=>{
  for(const kind of ['raider','leaper','caster','shield','brute']){
    const m=start(),p=m.player('p0'),e={id:kind,kind,x:400,y:300,hp:100,maxHp:100,phase:'walk',timer:0,hurt:0,facing:1};
    p.x=430;p.y=300;enemyStep(m,e,1,[p]);assert.equal(e.phase,'windup');const aim={...e.aim},facing=e.facing;
    p.x=200;p.y=350;enemyStep(m,e,300,[p]);assert.deepEqual(e.aim,aim);assert.equal(e.facing,facing);assert.equal(p.hp,100);
  }
});
test('shield reduces frontal ordinary damage, but flanks and magic remain useful',()=>{
  const m=start(),p=m.player('p0'),e={id:'shield',kind:'shield',hp:100,x:400,facing:1,phase:'walk'};p.x=450;
  damageEnemy(m,e,20,p);assert.equal(e.hp,96);p.x=350;damageEnemy(m,e,20,p);assert.equal(e.hp,76);p.x=450;damageEnemy(m,e,20,p,true);assert.equal(e.hp,56);
});
test('Nezha rotates target and move; low-health change leaves warnings intact',()=>{
  const {m,e}=boss(3),targets=Object.values(m.s.players),moves=[],ids=[];
  e.hp=e.maxHp/2-1;
  for(let i=0;i<6;i++){
    e.phase='reposition';e.timer=1;enemyStep(m,e,1,targets);moves.push(e.move);ids.push(e.targetId);
    assert.equal(e.timer,BOSS_MOVES[e.move].warning);e.phase='recover';e.timer=1;enemyStep(m,e,1,targets);assert.equal(e.timer,880);
  }
  assert.deepEqual(moves,['spear','ring','rush','spear','ring','rush']);assert.deepEqual(ids,['p0','p1','p2','p0','p1','p2']);
});
test('boss normal damage never cancels windup; special recovery stagger is rate-limited',()=>{
  const {m,e,p}=boss();e.phase='windup';e.timer=600;damageEnemy(m,e,10,p);assert.equal(e.timer,600);assert.equal(e.phase,'windup');assert.equal(e.hurt,0);
  damageEnemy(m,e,20,p,true);assert.equal(e.timer,600);
  e.phase='recover';e.timer=800;m.s.activeMs=1000;damageEnemy(m,e,20,p,true);assert.equal(e.timer,1050);damageEnemy(m,e,20,p,true);assert.equal(e.timer,1050);
  m.s.activeMs=3000;damageEnemy(m,e,20,p,true);assert.equal(e.timer,1300);
});
test('spear warning precedes two hits, hurt protection prevents an immediate double hit',()=>{
  const {m,e,p}=boss();p.x=700;p.y=e.y;e.move='spear';e.phase='windup';e.timer=600;e.facing=-1;
  enemyStep(m,e,599,[p]);assert.equal(p.hp,100);enemyStep(m,e,1,[p]);assert.equal(p.hp,86);
  enemyStep(m,e,220,[p]);assert.equal(p.hp,86);assert.equal(e.secondStrike,true);
});
test('ring travels outbound and back with one hit per pass',()=>{
  const {m,e,p}=boss();e.move='ring';e.phase='windup';e.timer=1;e.aim={x:300,y:e.y};enemyStep(m,e,1,[p]);assert.equal(m.s.projectiles.length,1);
  const b=m.s.projectiles[0];p.x=b.x-26;p.y=b.y;projectileStep(m,100,[p]);assert.equal(p.hp,88);p.hurtMs=0;projectileStep(m,1,[p]);assert.equal(p.hp,88);
  projectileStep(m,899,[]);assert.equal(b.returning,true);p.x=b.x+26;p.hurtMs=0;projectileStep(m,100,[p]);assert.equal(p.hp,76);
  projectileStep(m,1000,[]);assert.equal(m.s.projectiles.length,0);
});
test('rush commits its lane and direction and can be evaded by depth movement',()=>{
  const {m,e,p}=boss();e.move='rush';e.phase='windup';e.timer=900;e.laneY=270;e.y=270;e.facing=-1;
  p.x=700;p.y=340;enemyStep(m,e,900,[p]);enemyStep(m,e,200,[p]);assert.equal(e.y,270);assert.equal(e.facing,-1);assert.equal(p.hp,100);
  p.x=e.x-52;p.y=270;enemyStep(m,e,100,[p]);assert.equal(p.hp,80);p.hurtMs=0;enemyStep(m,e,1,[p]);assert.equal(p.hp,80);
});
test('pause and all-team recovery freeze boss/projectiles and never restore HP',()=>{
  const {m,e,p}=boss();e.hp=400;e.phase='windup';e.move='ring';e.timer=700;e.aim={x:200,y:300};
  m.setPause('teacher',true,3000);const before=structuredClone(m.s.enemies);m.advance(8000);assert.deepEqual(m.s.enemies,before);
  m.setPause('teacher',false,8000);m.disconnect(p.id,p.epoch,8000);m.advance(9000);assert.deepEqual(m.s.enemies,before);m.connect(p.id,9000);assert.equal(e.hp,400);
});
test('boss death and final-player death before deadline resolve one immutable victory',()=>{
  const {m,e,p}=boss();e.hp=0;p.lives=0;p.hp=0;m.simulate(1,3001);assert.equal(m.s.result.outcome,'victory');assert.equal(m.s.result.bossDefeated,true);m.finish('defeat','late');assert.equal(m.s.result.outcome,'victory');
});
test('exact deadline excludes pending damage; real level reaches boss before retreat',()=>{
  const m=start(),p=m.player('p0');p.protectionMs=1e9;m.advance(123000);assert.equal(m.s.level.stage,4);assert.equal(m.s.enemies[0].kind,'nezha');
  m.advance(183000);assert.equal(m.s.result.outcome,'retreat');assert.equal(m.s.activeMs,180000);assert.equal(m.s.result.bossDefeated,false);
});
