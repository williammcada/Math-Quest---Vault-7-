"""Purpose-created procedural SFX, deterministic seed; no third-party samples."""
from pathlib import Path
import wave
import numpy as np
rate=22050;rng=np.random.default_rng(902);out=Path('public/assets/nightfall/city/v092');out.mkdir(exist_ok=True)
def write(name,y):
 y=np.tanh(y);y=y/max(1,np.max(np.abs(y)))*.85
 with wave.open(str(out/(name+'.wav')),'wb') as w:w.setparams((1,2,rate,len(y),'NONE','not compressed'));w.writeframes((y*32767).astype('<i2').tobytes())
def base(sec):
 t=np.arange(int(rate*sec))/rate;n=rng.normal(0,1,len(t));return t,n
for name,sec,decay in [('shot',.55,16),('shotgun',.8,10),('breach',1.15,5)]:
 t,n=base(sec);low=np.convolve(n,np.ones(15)/15,'same');y=2*n*np.exp(-t*90)+4*low*np.exp(-t*decay)+.7*np.sin(2*np.pi*(95*t-25*t*t))*np.exp(-t*decay);write(name,y)
t,n=base(.3);write('step',np.convolve(n,np.ones(25)/25,'same')*np.exp(-t*25)*2+np.sin(2*np.pi*72*t)*np.exp(-t*32)*.35)
t,n=base(1);y=n*np.exp(-t*18)*.7
for start in [.035,.08,.14,.22,.31,.44]:
 age=np.maximum(0,t-start);y+=np.where(t>=start,np.sin(2*np.pi*(1800+start*3800)*age)*np.exp(-age*35),0)*.15
write('glass',y)
t,n=base(1.2);freq=np.where((t%.6)<.3,750,1050);write('alarm',np.sin(2*np.pi*np.cumsum(freq)/rate)*.32)
for name,sec in [('moan',1.8),('enemy-death',.9)]:
 t,n=base(sec);f=100-25*t/sec+8*np.sin(t*12);phase=2*np.pi*np.cumsum(f)/rate;env=np.sin(np.pi*t/sec)**.7;y=sum(np.sin(phase*k)*1/k for k in range(1,10));write(name,(y*.25+np.convolve(n,np.ones(9)/9,'same')*.15)*env)
