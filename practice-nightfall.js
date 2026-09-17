import {createState,completeTask} from './games/nightfall/simulation.js';
import {FinaleHost} from './finale-host.js';
import {NIGHTFALL} from './cartridges.js';
document.querySelector('#items').innerHTML=NIGHTFALL.items.map(i=>`<label><input type="checkbox" value="${i.id}">${i.title}</label>`).join('');
let runtime;
document.querySelector('#restart').onclick=()=>{runtime?.destroy();const loadout=[...document.querySelectorAll('#items input:checked')].map(i=>i.value),threat=Number(document.querySelector('#threat').value),snapshot=createState(loadout,document.querySelector('#route').value,threat);const checkpoint=document.querySelector('#checkpoint').value;if(checkpoint)for(const id of checkpoint==='power'?['fuse','power']:['fuse','power','keys','battery','installed'])completeTask(snapshot,id);if(document.querySelector('#survivor').checked)completeTask(snapshot,'survivor');runtime=new FinaleHost(document.querySelector('#game'),{practice:true,run:{runId:`practice-${crypto.randomUUID()}`,configRevision:NIGHTFALL.revision,status:'not_started',loadout,threat,snapshot,seq:0},route:document.querySelector('#route').value});runtime.s.debug=document.querySelector('#debug').checked;};
document.querySelector('#restart').click();

document.querySelector('#debug').onchange=e=>{if(runtime)runtime.s.debug=e.target.checked;};
