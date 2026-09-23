// Source-rendered review only; this does not exercise browser layout or devices.
import {writeFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {render,MEDIA} from '../public/games/nightfall/renderer.js';
import {createRescue,recruit} from '../public/games/nightfall/rescue.js';
import {breakWindow,triggerDistraction} from '../public/games/nightfall/simulation.js';
const {createCanvas,loadImage}=await import(pathToFileURL(process.argv[2]));
const art={};for(const key of ['props','tiles','actors'])art[key]=await loadImage(new URL('../public/'+MEDIA[key].replace('./',''),import.meta.url));
const output=createCanvas(1280,800),c=output.getContext('2d');c.fillStyle='#142331';c.fillRect(0,0,1280,800);
for(const [i,label] of ['Terminal and south road','North road · alarm diversion','Clinic · Imani recruited','Depot Garage · Tomas recruited'].entries()){
 const s=createRescue(i===3?'depot':'clinic');
 if(i===1){s.x=1344;s.y=616;triggerDistraction(s,'rescue-alarm');}
 if(i>=2){s.x=1792;s.y=264;breakWindow(s,'store-west');recruit(s);s.follower.x-=32;}
 const canvas=createCanvas(640,360);render(canvas.getContext('2d'),s,art,{map:false,reducedMotion:true});c.drawImage(canvas,(i%2)*640,Math.floor(i/2)*400);
 c.fillStyle='#edf4ff';c.font='18px sans-serif';c.fillText(label,(i%2)*640+16,Math.floor(i/2)*400+388);
}
await writeFile(process.argv[3],output.toBuffer('image/png'));
