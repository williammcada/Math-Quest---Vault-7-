// Lives outside the rendered dashboard. Polling cannot restart the soundtrack.
export class TeacherAudio {
  constructor(){this.audio=new Audio('./assets/vault7/audio/vault7-ambient.mp3');this.audio.loop=true;this.audio.volume=.22;this.audio.preload='none';this.message='Sound is off until you press Play.';}
  markup(){return `<section class="panel teacher-audio"><div><h2>Room soundtrack</h2><p>Original Vault 7 instrumental · plays on this teacher device only</p></div><div class="audio-controls"><button class="secondary" id="audio-play">${this.audio.paused?'Play soundtrack':'Pause soundtrack'}</button><button class="quiet" id="audio-mute">${this.audio.muted?'Unmute':'Mute'}</button><button class="quiet" id="audio-finale">Finale cue</button><label>Volume<input id="audio-volume" type="range" min="0" max="100" value="${Math.round(this.audio.volume*100)}"></label></div><p id="audio-status" class="fine" role="status">${this.message}</p></section>`;}
  bind(){
    const play=document.querySelector('#audio-play'),mute=document.querySelector('#audio-mute'),volume=document.querySelector('#audio-volume'),status=document.querySelector('#audio-status');
    if(!play)return;
    play.onclick=async()=>{if(this.audio.paused){try{await this.audio.play();this.message='Soundtrack playing.';}catch{this.message='Audio could not load. You can continue the mission and retry Play.';}}else{this.audio.pause();this.message='Soundtrack paused.';}play.textContent=this.audio.paused?'Play soundtrack':'Pause soundtrack';status.textContent=this.message;};
    mute.onclick=()=>{this.audio.muted=!this.audio.muted;if(this.cue)this.cue.muted=this.audio.muted;mute.textContent=this.audio.muted?'Unmute':'Mute';};
    volume.oninput=()=>{this.audio.volume=Number(volume.value)/100;if(this.cue)this.cue.volume=this.audio.volume;};
    document.querySelector('#audio-finale').onclick=async()=>{this.audio.pause();play.textContent='Play soundtrack';this.cue?.pause();this.cue=new Audio('./assets/vault7/audio/vault7-finale.mp3');this.cue.volume=this.audio.volume;this.cue.muted=this.audio.muted;try{await this.cue.play();status.textContent='Finale cue playing. Press Play soundtrack to return to the loop.';}catch{status.textContent='Finale audio unavailable.';}};
  }
}
