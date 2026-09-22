"""Original deterministic instrumental. No samples, external music, or voices."""
import numpy as np, wave, subprocess
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]/'public/assets/vault7/audio'
ROOT.mkdir(parents=True,exist_ok=True)
sr=32000

def export(name,seconds,finale=False):
    t=np.arange(int(seconds*sr))/sr
    # Frequencies quantized to whole cycles over the loop; phase is seamless.
    hz=lambda f:round(f*seconds)/seconds
    phase=t%(2/3)
    beat=np.floor(t/(2/3)).astype(int)
    envelope=(1-np.exp(-phase*70))*np.exp(-phase*7)
    root=np.take([55,55,58.27,51.91],(beat//24)%4)
    root=np.round(root*seconds)/seconds
    bass=np.sin(2*np.pi*root*t)*envelope*.16
    drone=(np.sin(2*np.pi*hz(55)*t)+.4*np.sin(2*np.pi*hz(82.4069)*t)+.22*np.sin(2*np.pi*hz(116.541)*t))*.09
    pulse=np.sin(2*np.pi*(53*phase+24*(1-np.exp(-phase*34))/34))*np.exp(-phase*25)*.12
    eighth=t%(1/3)
    hats=(np.sin(2*np.pi*hz(3301)*t)+np.sin(2*np.pi*hz(5711)*t))*(1-np.exp(-eighth*500))*np.exp(-eighth*90)*.013
    melody=np.take([220,261.6256,246.9417,164.8138,220,233.0819,196,164.8138],(beat//3)%8)
    melody=np.round(melody*seconds)/seconds
    melodic=np.sin(2*np.pi*melody*t)*envelope*.035
    glow=.7+.3*np.cos(2*np.pi*t/seconds)
    track=(bass+drone*glow+pulse+hats+melodic)
    if finale:
        track+=np.sin(2*np.pi*hz(110)*t)*(1-np.cos(2*np.pi*t/seconds))*.045
        track*=np.minimum(1,t/1.5)*np.minimum(1,(seconds-t)/2.5)
    # Quiet stereo spread, no compressor or abrupt volume rise.
    stereo=np.stack([track+np.sin(2*np.pi*hz(165)*t)*.009,track+np.sin(2*np.pi*hz(166)*t)*.009],axis=1)
    stereo=np.clip(stereo,-.65,.65)
    wav=ROOT/(name+'.wav')
    with wave.open(str(wav),'wb') as f:
        f.setnchannels(2);f.setsampwidth(2);f.setframerate(sr);f.writeframes((stereo*32767).astype('<i2').tobytes())
    subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(wav),'-c:a','libmp3lame','-b:a','96k',str(ROOT/(name+'.mp3'))],check=True)
    wav.unlink()
export('vault7-ambient',64)
export('vault7-finale',16,True)
