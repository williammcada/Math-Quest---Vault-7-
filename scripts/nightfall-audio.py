"""Deterministic original pulse score. No recorded samples or external music."""
from pathlib import Path
import numpy as np
import wave
import subprocess
root=Path(__file__).resolve().parents[1]/'public/assets/nightfall'
root.mkdir(parents=True,exist_ok=True)
sr=22050
for name,seconds,bpm in [('ambient',64,90),('finale',32,120)]:
    t=np.arange(seconds*sr)/sr
    beat=t*bpm/60
    phase=beat%1
    roots=np.take([55,65.406,49,58.27],(beat//8).astype(int)%4)
    bass=np.sin(2*np.pi*roots*t)*np.exp(-phase*5)*.14
    kick=np.sin(2*np.pi*(55*t+1.4*(1-np.exp(-phase*25))))*np.exp(-phase*24)*.1
    notes=np.take([220,261.626,329.628,293.665,220,196,174.614,207.652],(beat*2).astype(int)%8)
    pluck=(np.sin(2*np.pi*notes*t)+.25*np.sin(4*np.pi*notes*t))*np.exp(-(beat*2%1)*8)*.045
    pad=(np.sin(2*np.pi*55*t)+np.sin(2*np.pi*82.5*t))*.045
    fade=np.minimum(1,t/.1)*np.minimum(1,(seconds-t)/.1)
    track=np.clip((bass+kick+pluck+pad)*fade,-.8,.8)
    wav=root/(name+'.wav')
    with wave.open(str(wav),'wb') as f:
        f.setnchannels(1);f.setsampwidth(2);f.setframerate(sr);f.writeframes((track*32767).astype('<i2').tobytes())
    subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(wav),'-b:a','80k',str(root/(name+'.mp3'))],check=True)
    wav.unlink()
