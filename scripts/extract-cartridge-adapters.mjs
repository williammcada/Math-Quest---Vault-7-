import fs from 'node:fs';
fs.mkdirSync('src/cartridges/vault-7',{recursive:true});
let s=fs.readFileSync('src/worker.js','utf8');
const names=['prepareCipher','vote','resolveDecision','marketSelect','marketReady','marketBuy','marketContinue','submitCode','finaleVote','resolveFinale'];
const extracted=[];
for(const name of names){const start=s.indexOf('  '+name+'('),end=s.indexOf('\n  }',start)+4;if(start<0||end<4)throw Error(name);const body=s.slice(start,end);extracted.push(body.trim());const sig=body.slice(2,body.indexOf('{')),params=sig.slice(sig.indexOf('(')+1,sig.lastIndexOf(')')).split(',').map(x=>x.trim().split(' = ')[0]).filter(Boolean).join(',');s=s.slice(0,start)+`  ${sig}{return serverFor(this).${name}.call(this,${params});}`+s.slice(end);}
let start=s.indexOf('  maybeAdvance(team)'),end=s.indexOf('\n  }',start)+4;
extracted.push(s.slice(start,end).trim().replace('maybeAdvance(team)','advance(team)').replace('    if(finishCheckpoint(this,team))return;\n','').replace('    if(expansionFor(this))return advanceExpansion(this,team);\n',''));
s=s.slice(0,start)+`  maybeAdvance(team){if(finishCheckpoint(this,team))return;return serverFor(this).advance.call(this,team);}`+s.slice(end);
const shuffle=`function shuffle(records,seed){const result=[...records];for(let i=result.length-1;i>0;i--){const j=hashSeed(\`\${seed}:\${i}\`)% (i+1);[result[i],result[j]]=[result[j],result[i]];}return result;}`;
fs.writeFileSync('src/cartridges/vault-7/server.js',`import {VAULT7_SECRETS,vault7Scene} from '../../vault7.js';\nimport {hashSeed} from '../../math.js';\nimport {beginExtraction} from '../../extraction.js';\n${shuffle}\nexport const vault7Server={\n${extracted.join(',\n')},\nscene:vault7Scene\n};\n`);
s=s.replace("import { VAULT7_SECRETS, vault7Scene }", "import { VAULT7_SECRETS }");
s="import {serverFor} from './cartridges/registry.js';\n"+s;
s=s.replace('vault7Scene(team, members, this.state.config.gateNames)','serverFor(this).scene(team, members, this.state.config.gateNames)');
fs.writeFileSync('src/worker.js',s);
