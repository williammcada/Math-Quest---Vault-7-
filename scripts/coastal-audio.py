"""Original deterministic Coastal Escape score. No sampled commercial music."""
import numpy as np, wave, subprocess
from pathlib import Path
RATE=22050
out=Path(__file__).resolve().parents[1]/'public/assets/coastal-escape'
def note(midi):return 440*2**((midi-69)/12)
def score(name,tempo,bright):
 beat=60/tempo;duration=32*beat;audio=np.zeros(int((duration+2)*RATE))
 def tone(start,length,midi,gain,kind='soft'):
  t=np.arange(int(length*RATE))/RATE;freq=note(midi)
  wavelet=np.sin(2*np.pi*freq*t)+.23*np.sin(2*np.pi*freq*2*t)+.08*np.sin(2*np.pi*freq*3*t)
  envelope=np.minimum(1,t/.08)*np.minimum(1,(length-t)/.5)
  if kind=='bell':envelope*=np.exp(-t*2.5)
  a=int(start*RATE);audio[a:a+len(t)]+=wavelet*envelope*gain
 chords=[[50,57,62,65],[46,53,58,62],[48,55,60,64],[45,52,57,61]]
 melody=[74,69,72,65,70,65,69,62,72,67,76,72,73,69,64,69]
 for bar in range(8):
  chord=chords[bar%4]
  for pitch in chord:tone(bar*4*beat,4*beat,pitch,.055 if bright else .038)
  for i in range(4):tone((bar*4+i)*beat,beat*1.5,chord[i]+12,.04,'bell')
  if bright:
   for i in range(2):tone((bar*4+i*2)*beat,beat*1.8,melody[(bar*2+i)%16],.07)
 audio[:RATE]*=np.linspace(0,1,RATE);audio[-2*RATE:]*=np.linspace(1,0,2*RATE)
 audio=np.tanh(audio)*.65
 wav=out/(name+'.wav')
 with wave.open(str(wav),'wb') as f:f.setnchannels(1);f.setsampwidth(2);f.setframerate(RATE);f.writeframes((audio*32767).astype('<i2').tobytes())
 subprocess.run(['ffmpeg','-y','-loglevel','error','-i',str(wav),'-codec:a','libmp3lame','-b:a','96k',str(out/(name+'.mp3'))],check=True);wav.unlink()
score('ambient',64,False);score('finale',82,True)
