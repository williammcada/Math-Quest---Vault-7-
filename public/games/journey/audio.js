// Original procedural score/effects; no samples, external requests or library.
// 48-second stage theme / 36-second boss theme, eight bars each at 80/106.67 bpm.
export class JourneyAudio {
  constructor(){this.music=true;this.effects=true;this.lastEvent=0;this.voices=new Set();this.step=0;this.next=0;this.lastFx=new Map();}
  async unlock(){const AC=globalThis.AudioContext||globalThis.webkitAudioContext;if(!AC)return;this.ctx??=new AC();if(this.ctx.state==='suspended')await this.ctx.resume();this.timer??=setInterval(()=>this.tick(),50);}
  tone(hz,time,duration,gain=.035,type='triangle'){
    if(!this.ctx||this.voices.size>=32)return;
    const o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type=type;o.frequency.setValueAtTime(hz,time);g.gain.setValueAtTime(.0001,time);g.gain.exponentialRampToValueAtTime(gain,time+.008);g.gain.exponentialRampToValueAtTime(.0001,time+duration);o.connect(g);g.connect(this.ctx.destination);this.voices.add(o);o.onended=()=>{this.voices.delete(o);o.disconnect();g.disconnect();};o.start(time);o.stop(time+duration+.01);
  }
  silence(){for(const v of this.voices)try{v.stop();}catch{}this.voices.clear();this.next=0;}
  sync(s){const stopped=s.paused||!['running','launch'].includes(s.phase)||document.hidden;
    const theme=s.level?.stage===4?'boss':'stage';if(stopped!==this.stopped||theme!==this.theme){this.silence();this.step=0;}this.stopped=stopped;this.theme=theme;
    for(const e of s.events||[]){if(e.id<=this.lastEvent)continue;this.lastEvent=e.id;if(!stopped||e.type==='result')this.fx(e.type,e.hero,e.outcome);}
  }
  fx(type,hero,outcome){if(!this.ctx||!this.effects||document.hidden)return;const t=this.ctx.currentTime;if(t-(this.lastFx.get(type)??-1)<.075)return;this.lastFx.set(type,t);
    const notes={attack:[180,90],enemyAttack:[120,65],jump:[330,660],hit:[160,70],hurt:[100,55],break:[95,50],pickup:[660,880,1320],bossWarning:[220,233,220],bossTelegraph:[330,220],stage:[392,523,784],special:[{wukong:440,bajie:98,wujing:294,tang:660,prince:523}[hero]||440,784,1047],result:outcome==='victory'?[523,659,784,1047]:outcome==='defeat'?[220,196,147]:[392,330,294],ui:[660]}[type];
    notes?.forEach((n,i)=>this.tone(n,t+i*.07,.13,.045,type==='break'||type==='hurt'?'sawtooth':'triangle'));
  }
  tick(){if(!this.ctx||this.ctx.state!=='running'||!this.music||this.stopped||document.hidden)return;const now=this.ctx.currentTime,beat=this.theme==='boss'?.28125:.375;
    if(this.next<now)this.next=now;
    while(this.next<now+.12){const k=this.step%128,scale=this.theme==='boss'?[0,3,5,7,10]:[0,2,4,7,9],pattern=[0,2,3,1,4,3,2,1,0,1,3,4,2,3,1,0],base=this.theme==='boss'?146.83:196;
      const note=base*2**(scale[pattern[(k+Math.floor(k/16)*3)%16]]/12);
      if(k%4!==3)this.tone(note*2,this.next,.20,.027,'triangle'); // plucked melody
      if(k%8===0)this.tone(base/2,this.next,beat*3,.035,'sine');
      if(k%16===8)this.tone(note*4,this.next,beat*4,.012,'sine'); // flute-like answer
      if(k%4===0)this.tone(60,this.next,.12,.055,'sine');
      if(k%4===2){this.tone(190,this.next,.045,.025,'square');this.tone(287,this.next,.08,.012,'triangle');}
      this.step++;this.next+=beat;
    }
  }
  destroy(){clearInterval(this.timer);this.silence();this.ctx?.close();}
}
