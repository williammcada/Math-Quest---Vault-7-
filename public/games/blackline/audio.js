import Sim from './sim.js';
class Sound{
 constructor(){this.ctx=null;this.music=true;this.sfx=true;this.step=0;this.next=0;this.active=false;this.voices=new Set();this.tailUntil=0;}
 async unlock(){try{if(!this.ctx){this.ctx=new (window.AudioContext||window.webkitAudioContext)();this.master=this.ctx.createGain();this.master.gain.value=.22;this.master.connect(this.ctx.destination);this.engine=this.ctx.createOscillator();this.engine.type='sawtooth';this.eg=this.ctx.createGain();this.eg.gain.value=0;this.engine.connect(this.eg);this.eg.connect(this.master);this.engine.start();}await this.ctx.resume();}catch{}}
 tone(freq,time,len,gain,type='square',endFreq){if(!this.ctx)return;const o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type=type;o.frequency.setValueAtTime(freq,time);if(endFreq)o.frequency.exponentialRampToValueAtTime(endFreq,time+len);g.gain.setValueAtTime(gain,time);g.gain.exponentialRampToValueAtTime(.001,time+len);o.connect(g);g.connect(this.master);this.voices.add(o);o.start(time);o.stop(time+len+.01);o.onended=()=>{this.voices.delete(o);o.disconnect();g.disconnect();};}
 update(s){if(!this.ctx)return;const playing=s.mode==='running'||s.mode==='countdown';if(!playing){if(s.mode==='result'&&this.ctx.currentTime<this.tailUntil){this.eg.gain.value=0;return;}this.pause();return;}if(this.ctx.state!=='running')return;const t=this.ctx.currentTime;if(!this.active){this.active=true;this.next=t;}
 this.eg.gain.setTargetAtTime(this.sfx&&s.mode==='running'?.06:0,t,.05);this.engine.frequency.setTargetAtTime(35+s.v*2.3,t,.05);
 if(this.music&&this.next<t+.12){const seq=[0,0,7,0,3,0,10,7,0,0,7,12,3,10,7,3],n=seq[this.step%16],area=Sim.section(s.z),f=(area===3?49:area===5?61.74:55)*Math.pow(2,n/12);this.tone(f,this.next,.15,.3,'sawtooth');if(this.step%4===0)this.tone(130,this.next,.13,.5,'sine',35);if(this.step%4===2)this.tone(320,this.next,.06,.12,'triangle');if(this.step%2===1||area>=4)this.tone(4200,this.next,.024,.06,'square');if(this.step%8===0)this.tone(f*4,this.next,.7,.05,'triangle');this.step++;this.next+=60/150/2;}else if(!this.music)this.next=t;
 }
 fx(e){if(!this.ctx||!this.sfx)return;const t=this.ctx.currentTime;const map={jump:[220,650,.25],land:[100,45,.2],hit:[180,35,.3],go:[440,880,.3],win:[440,1760,.6],fail:[180,40,.7],siren:[330,660,.45],lock:[640,500,.18],shot:[210,65,.10],ram:[95,38,.25],repair:[520,1040,.35]};if(map[e]){const [a,b,d]=map[e];if(e==='win'||e==='fail'){this.stopVoices();this.tailUntil=t+d+.05;}this.tone(a,t,d,.3,'triangle',b);}}
 stopVoices(){for(const o of this.voices)try{o.stop();}catch{}this.voices.clear();}
 reset(){this.stopVoices();this.active=false;this.step=0;this.tailUntil=0;}
 pause(){if(!this.ctx)return;this.active=false;this.stopVoices();this.tailUntil=0;this.eg.gain.value=0;if(this.ctx.state==='running')this.ctx.suspend().catch(()=>{});}
}
export {Sound};
