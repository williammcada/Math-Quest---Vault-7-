export function drawSpecialEffects(c,s){
  for(const p of s.players||[]){
    if(!p.visible||!p.started)continue;
    if(p.shieldMs>0&&p.shield>0){c.strokeStyle='#ffe8a9';c.lineWidth=2;c.beginPath();c.ellipse(p.x,p.y-38,35,46,0,0,Math.PI*2);c.stroke();}
    const a=p.specialState;if(!a)continue;
    c.save();c.lineWidth=3;
    if(a.hero==='bajie'&&a.age>=400){const r=Math.min(200,(a.age-400)*.5);c.strokeStyle='#efc477';c.beginPath();c.ellipse(a.x,a.y,r,r*.25,0,0,Math.PI*2);c.stroke();}
    if(a.hero==='wujing'&&a.age>=250){const x=a.x+a.facing*(a.age-250)*.30;c.strokeStyle='#7bede5';c.fillStyle='#57baca44';c.beginPath();c.ellipse(x,a.y-20,28,55,0,0,Math.PI*2);c.fill();c.stroke();}
    if(a.hero==='tang'&&a.age>=300){const r=Math.min(200,(a.age-300)*.6);c.strokeStyle='#ffe29e';for(let i=0;i<8;i++){const theta=i*Math.PI/4;c.beginPath();c.ellipse(a.x+Math.cos(theta)*r*.4,a.y-15+Math.sin(theta)*r*.18,r*.4,r*.12,theta,0,Math.PI*2);c.stroke();}}
    c.restore();
  }
}
