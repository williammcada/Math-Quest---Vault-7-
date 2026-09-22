import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const source=readFileSync(new URL('../public/app.js',import.meta.url),'utf8');
const serialization=source.slice(source.indexOf('function serializeAnswer('),source.indexOf('function answerMarkup('));
test('explicit integer mode serializes positive, negative and zero values without a student denominator',()=>{
 for(const numerator of ['5','-3','0']){const context={draft:{numerator,integerMode:true}};vm.createContext(context);assert.equal(vm.runInContext(serialization+';serializeAnswer("fraction")',context),`${numerator}/1`);}
 const context={draft:{numerator:'3',denominator:'4',integerMode:false}};vm.createContext(context);assert.equal(vm.runInContext(serialization+';serializeAnswer("fraction")',context),'3/4');
 context.draft={numerator:'',integerMode:true};assert.equal(vm.runInContext('serializeAnswer("fraction")',context),'/1');
});
