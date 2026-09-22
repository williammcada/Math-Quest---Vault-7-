import fs from 'node:fs';
let host=fs.readFileSync('public/engine/game-host.js','utf8').replace('<b>LAST BUS OUT</b>','<b>${esc(this.adapter.title)}</b>').replace('<h2>Last Bus Out</h2>','<h2>${esc(this.adapter.title)}</h2>');
host=host.replace("on(window,'keydown',e=>{const k=mapping[e.key];", "on(window,'keydown',e=>{if(e.key.toLowerCase()==='m'&&!e.repeat&&!/INPUT|SELECT|TEXTAREA/.test(e.target.tagName))this.s.map=!this.s.map;const k=mapping[e.key];");
host=host.replace("else this.s.time+=dt;","else if(this.mode==='assisted')this.s.time+=dt;");
host=host.replace("aria-label=\"Move up\"","aria-label=\"Move forward\"").replace("aria-label=\"Move down\"","aria-label=\"Reverse\"").replace("aria-label=\"Move left\"","aria-label=\"Turn left\"").replace("aria-label=\"Move right\"","aria-label=\"Turn right\"");
fs.writeFileSync('public/engine/game-host.js',host);
let app=fs.readFileSync('public/app.js','utf8').replace('>Vault gates<select','>Mission gates<select').replace('Your teacher has frozen Vault 7.','Your teacher has paused the mission.').replace('Vault 7 opens the next stage only when every agent finishes.','The next stage opens only when every team member finishes.');fs.writeFileSync('public/app.js',app);
let smoke=fs.readFileSync('scripts/browser-smoke.cjs','utf8').replaceAll('[data-answer="0"]','[data-safe]').replace('for(let i=0;i<3;i++)await page.locator(\'[data-safe]\')','for(let i=0;i<6;i++)await page.locator(\'[data-safe]\')');fs.writeFileSync('scripts/browser-smoke.cjs',smoke);
