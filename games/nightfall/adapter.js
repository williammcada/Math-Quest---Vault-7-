import {createState,restoreState,step,completeTask,nextObjective} from './simulation.js';
import {render,loadArt,MEDIA} from './renderer.js';
import {CONTROL_PROFILES} from '../../engine/controls.js';
import {CONFIG_REVISION,RESULT_LABELS} from './config.js';
import {TASKS} from './world.js';
export const nightfallAdapter={
 id:'nightfall-city',title:'Nightfall · Last Bus Out',revision:CONFIG_REVISION,media:MEDIA,controlProfile:CONTROL_PROFILES.nightfall,resultLabels:RESULT_LABELS,canvasLabel:'Search the city, repair the bus, then make the final crew decision',
 resultText:'One field run is complete. Wait for the other crew members, then everyone participates in the final story decision.',
 music:s=>s.outcome?'ending':s.enemies.some(e=>e.hp>0&&e.phase==='chase')?'danger':'ambient',
 create:run=>restoreState(run.snapshot,run.loadout,run.route,run.threat??1),step,render,loadArt,
 instructions:'Find the fuse in Maintenance, restore the substation, search Dispatch for keys, and bring the garage battery to the bus. The Clinic rescue is optional. Ammunition is scarce. Close doors, trigger alarms to pull enemies away, or shoot a fuel barrel from a safe distance. Avoid enemies when you can. This is your individual field record in a shared crew repair effort; you are not competing for the same objects.',
 controls:'Tank controls: A/D or ←/→ rotate, W/S or ↑/↓ move. Shift runs. Space fires straight ahead. Hold E to search or repair. M opens the map.',
 hud:s=>`HEALTH ${s.health}/3   AMMO ${s.ammo}   ${s.loadout.includes('vest')?`VEST ${s.vest}/2`:'NO VEST'}   DAMAGE ${s.damage}   ${s.damage===2?"LOUD CARBINE":"PISTOL"}`,
 objective:s=>(nextObjective(s)?.label||'Bus ready')+(s.prompt?' · '+s.prompt:''),
 progress:s=>TASKS.filter(t=>s.tasks[t.id]).map(t=>t.id),
 assisted(s,root,onProgress){
   const target=nextObjective(s);if(!target)return;
   const correct=({fuse:'Search the maintenance drawers',power:'Fit the fuse and isolate the damaged circuit',keys:'Search dispatch records and key hooks',battery:'Use the powered lift in the garage',installed:'Connect the replacement battery',escape:'Use the keys and start the engine'})[target.id];
   root.innerHTML=`<h2>${target.label}</h2><p>Proceed carefully. A covered approach avoids the infected; a direct approach spends supplies.</p><button data-safe>${correct} using the covered route</button><button data-risk>Force a direct crossing</button><p data-feedback></p>`;
   root.querySelector('[data-safe]').onclick=()=>{completeTask(s,target.id);onProgress();};
   root.querySelector('[data-risk]').onclick=()=>{const cost=s.damage===2?2:4;if(s.ammo>=cost){s.ammo-=cost;s.shots+=cost;completeTask(s,target.id);onProgress();}else if(s.vest){s.vest--;s.blocks++;completeTask(s,target.id);onProgress();}else root.querySelector('[data-feedback]').textContent='You lack ammunition and protection. Use the covered route.';};
   if(!s.tasks.survivor){const rescue=document.createElement('button');rescue.textContent='Optional clinic detour: rescue survivor and receive treatment';rescue.onclick=()=>{completeTask(s,'survivor');onProgress();};root.append(rescue);}
 }
};
