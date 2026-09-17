export class GameAudio{
 constructor(media){this.media=media;this.enabled=false;this.volume=.45;this.failed=[];this.buffers={};this.voices=new Set();this.destroyed=false;this.paused=false;}
 async start(){
   if(this.destroyed)return [];this.ctx ||=new(window.AudioContext||window.webkitAudioContext)();await this.ctx.resume();if(this.destroyed)return [];this.enabled=true;this.failed=[];
   if(!this.master){this.master=this.ctx.createGain();this.master.connect(this.ctx.destination);}this.master.gain.value=this.volume;
   await Promise.all(['ambient','danger','ending','effects'].map(async key=>{if(this.buffers[key])return;try{const response=await fetch(this.media[key]);if(!response.ok)throw Error(response.status);const bytes=await response.arrayBuffer();if(!bytes.byteLength)throw Error('Empty file');this.buffers[key]=await this.ctx.decodeAudioData(bytes);}catch(e){this.failed.push(`${key}: ${e.message}`);}}));
   if(this.enabled&&!this.destroyed)this.music('ambient');if(this.paused)this.pause(true);return this.failed;
 }
 music(key){if(this.trackKey===key||!this.enabled||!this.buffers[key])return;this.track?.stop();const source=this.ctx.createBufferSource(),gain=this.ctx.createGain();source.buffer=this.buffers[key];source.loop=key!=='ending';gain.gain.value=.38;source.connect(gain);gain.connect(this.master);source.start();this.track=source;this.trackKey=key;}
 effect(type){if(!this.enabled||!this.buffers.effects||this.voices.size>=8||this.ctx.state!=='running')return;const map={shot:0,dry:1,lunge:2,impact:3,'enemy-death':4,death:4,hurt:5,heal:6,vest:7,pickup:8,objective:9,power:10,engine:11,step:12,locked:13};const slot=map[type];if(slot===undefined)return;const source=this.ctx.createBufferSource(),gain=this.ctx.createGain();source.buffer=this.buffers.effects;gain.gain.value=type==='step'?.18:.55;source.connect(gain);gain.connect(this.master);this.voices.add(source);source.onended=()=>this.voices.delete(source);source.start(0,slot, .8);}
 async toggle(){if(this.enabled){this.enabled=false;await this.ctx?.suspend();return;}if(!this.ctx||this.failed.length){await this.start();return;}this.enabled=true;if(!this.paused)await this.ctx.resume();if(!this.track)this.music('ambient');}
 pause(value){this.paused=value;if(!this.ctx||!this.enabled||this.destroyed)return;(value?this.ctx.suspend():this.ctx.resume()).catch(()=>{});}
 destroy(){this.destroyed=true;this.enabled=false;try{this.track?.stop();for(const v of this.voices)v.stop();this.ctx?.close().catch(()=>{});}catch{}}
}
