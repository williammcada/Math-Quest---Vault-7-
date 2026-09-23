// Source renderer review, independent of browser/device verification.
// Run with the runtime's @napi-rs/canvas entry path and an output PNG path.
import {writeFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {drawCar} from '../public/games/nightfall/hardware.js';
import {render,MEDIA} from '../public/games/nightfall/renderer.js';
import {createState,triggerDistraction} from '../public/games/nightfall/simulation.js';
import {PROPS,propBounds} from '../public/games/nightfall/world.js';
const {createCanvas,loadImage}=await import(pathToFileURL(process.argv[2]));
const art={};for(const key of ['props','tiles','actors'])art[key]=await loadImage(new URL('../public/'+MEDIA[key].replace('./',''),import.meta.url));
const canvas=createCanvas(1280,600),c=canvas.getContext('2d');c.fillStyle='#142331';c.fillRect(0,0,1280,600);
const car=PROPS.find(p=>p.id==='wreck1'),ordinary=PROPS.find(p=>p.id==='wreck3');
for(const [i,mode] of ['Ordinary car','Ready / lit','Ready / dim','Active / lit','Spent'].entries()){
 const s=createState(),p=i===0?ordinary:car,b=propBounds(p);s.time=i===2?1:0;if(i>=3){triggerDistraction(s,'alarm');s.time=i===4?13:0;}
 c.save();c.translate(i*256+128-(b.x+b.w/2),85-(b.y+b.h/2));drawCar(c,p,s,art.props);c.restore();
 c.fillStyle='#edf4ff';c.font='18px sans-serif';c.fillText(mode,i*256+35,160);
}
for(const [i,active] of [false,true].entries()){
 const s=createState();s.x=792;s.y=670;s.time=0;if(active)triggerDistraction(s,'alarm');
 const scene=createCanvas(640,360);render(scene.getContext('2d'),s,art,{map:false,reducedMotion:true});c.drawImage(scene,i*640,200);
 c.fillStyle='#edf4ff';c.font='18px sans-serif';c.fillText(active?'Active alarm — full scene':'Ready alarm — full scene',i*640+15,590);
}
await writeFile(process.argv[3],canvas.toBuffer('image/png'));
