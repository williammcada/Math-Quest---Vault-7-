import {FinaleHost} from './finale-host.js';
import {NIGHTFALL} from './cartridges.js';
document.querySelector('#items').innerHTML=NIGHTFALL.items.map(i=>`<label><input type="checkbox" value="${i.id}">${i.title}</label>`).join('');
let runtime;
document.querySelector('#restart').onclick=()=>{runtime?.destroy();runtime=new FinaleHost(document.querySelector('#game'),{practice:true,run:{runId:`practice-${crypto.randomUUID()}`,configRevision:NIGHTFALL.revision,status:'not_started',loadout:[...document.querySelectorAll('input:checked')].map(i=>i.value),seq:0},route:document.querySelector('#route').value});};
document.querySelector('#restart').click();
