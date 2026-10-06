import test from 'node:test';import assert from 'node:assert/strict';
import {JourneyAudio} from '../public/games/journey/audio.js';
import {JOURNEY_STORY} from '../public/games/journey/story.js';
import {journeyScene} from '../src/cartridges/journey/server.js';
test('two opening slots, contextual gates and distinct endings',()=>{
  assert.equal(JOURNEY_STORY.opening.length,2);assert.equal(new Set(Object.values(JOURNEY_STORY.endings)).size,4);
  assert.ok(journeyScene({stage:'briefing'},[],[]).image);
  for(const outcome of ['victory','retreat','defeat','interrupted'])assert.equal(journeyScene({stage:'victory',journeyResult:{outcome}},[],[]).paragraphs[0],JOURNEY_STORY.endings[outcome]);
});
test('audio deduplicates events, switches boss theme and silences pause/background',()=>{
  const old=globalThis.document;globalThis.document={hidden:false};
  try{const a=new JourneyAudio(),fx=[];let stopped=0;a.silence=()=>stopped++;a.fx=(...args)=>fx.push(args);
    const s={phase:'running',level:{stage:0},events:[{id:1,type:'pickup'}]};a.sync(s);a.sync(s);assert.equal(fx.length,1);
    a.sync({...s,level:{stage:4}});assert.equal(a.theme,'boss');assert.ok(stopped>=2);
    a.sync({...s,paused:true});assert.equal(a.stopped,true);globalThis.document.hidden=true;a.sync(s);assert.equal(a.stopped,true);
  }finally{globalThis.document=old;}
});
test('music scheduler bounds lookahead and independent effect mute',()=>{
  const old=globalThis.document;globalThis.document={hidden:false};
  try{const a=new JourneyAudio(),notes=[];a.ctx={currentTime:0,state:'running'};a.tone=(...n)=>notes.push(n);a.stopped=false;a.theme='stage';a.tick();assert.ok(notes.length>0);assert.equal(a.step,1);a.music=false;a.ctx.currentTime=1;a.tick();assert.equal(a.step,1);a.effects=false;a.fx('pickup');const count=notes.length;a.effects=true;a.fx('pickup');assert.ok(notes.length>count);
  }finally{globalThis.document=old;}
});
