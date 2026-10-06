import test from 'node:test';
import assert from 'node:assert/strict';
import {ENVIRONMENTS,environmentForStage,drawEnvironment} from '../public/games/journey/environment-art.js';
test('four distinct environments with shared supply/boss courtyard',()=>{
  assert.equal(new Set(ENVIRONMENTS.map(e=>e.file)).size,4);
  assert.deepEqual([0,1,2,3,4].map(n=>environmentForStage(n).id),['mountain','cave','shrine','courtyard','courtyard']);
  for(const n of [undefined,NaN,-1,'2'])assert.equal(environmentForStage(n).id,'mountain');
});
test('loaded scenery covers canvas without changing snapshot; failed image is safe',()=>{
  const draws=[],c={fillRect(){},drawImage(...args){draws.push(args);}};
  for(let stage=0;stage<5;stage++){
    const snapshot={level:{stage},activeMs:10000},before=JSON.stringify(snapshot);
    drawEnvironment(c,{},snapshot);assert.equal(draws.length,0);
    const env=environmentForStage(stage),img={complete:true,naturalWidth:1536,naturalHeight:1024};
    drawEnvironment(c,{['environment-'+env.id]:img},snapshot);
    assert.equal(draws.length,2);assert.deepEqual(draws[0].slice(-4),[0,0,960,222]);assert.deepEqual(draws[1].slice(-4),[0,222,960,198]);
    assert.equal(JSON.stringify(snapshot),before);draws.length=0;
  }
});
