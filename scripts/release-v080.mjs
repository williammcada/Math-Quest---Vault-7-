import fs from 'node:fs';
import path from 'node:path';
function walk(p){return fs.readdirSync(p,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(p,e.name)):[path.join(p,e.name)]);}
for(const file of [...walk('public'),...walk('test'),'VERSION.json','package.json','scripts/validate-release.mjs']){
 if(!/\.(js|mjs|html|json)$/.test(file))continue;
 let s=fs.readFileSync(file,'utf8').replaceAll('0.7.0','0.9.1');
 if(file==='VERSION.json')s=s.replaceAll('nightfall-1','nightfall-city-2').replace('2026-09-15','2026-09-16');
 if(file==='public/app.js')s=s.replaceAll('Vault 7 Dashboard','MathQuest Dashboard').replaceAll('${member.itemsCompleted}/${state.config.totalQuestions}','${member.itemsCompleted}/${member.assignedTotal??state.config.totalQuestions}').replace('`${member.gateProgress}/${item.gateLoad}`','`${member.gateProgress}/${member.gateLoad??item.gateLoad}`').replaceAll('student.firstAttemptCorrect / Math.max(1, state.config.totalQuestions)','student.firstAttemptCorrect / Math.max(1, student.assignedTotal??state.config.totalQuestions)');
 if(file==='public/expansion-ui.js')s=s.replace('s.firstAttemptCorrect/Math.max(1,state.config.totalQuestions)','s.firstAttemptCorrect/Math.max(1,s.assignedTotal??state.config.totalQuestions)');
 if(file==='test/nightfall-runtime.test.mjs')s=s.replace("assert.deepEqual(f.runtime.input,{})","assert.deepEqual(f.runtime.input,{tank:true})").replace('i<3;i++)f.root.querySelector(\'[data-answer="0"]\')','i<6;i++)f.root.querySelector(\'[data-safe]\')');
 if(file==='test/migration-ui.test.mjs')s=s.replaceAll('[data-answer="0"]','[data-safe]').replace('for(let i=0;i<3;i++)ui.win.document.querySelector(\'[data-safe]\')','for(let i=0;i<6;i++)ui.win.document.querySelector(\'[data-safe]\')');
 fs.writeFileSync(file,s);
}
let worker=fs.readFileSync('src/worker.js','utf8').replaceAll('MathQuest_Vault7_','MathQuest_').replace('student.firstAttemptCorrect / Math.max(1, this.state.config.totalQuestions)','student.firstAttemptCorrect / Math.max(1, assignedCount(this,student))').replace('gateName: this.state.config.gateNames[team.gateIndex],',"gateName: team.extraGate?'Last Checkpoint':this.state.config.gateNames[team.gateIndex],");fs.writeFileSync('src/worker.js',worker);
