// Scenery is presentation only. Collision remains in config.js / the server.
export const ENVIRONMENTS=Object.freeze([
  {id:'mountain',file:'environment-mountain-stage7.png',floor:'#59624d'},
  {id:'cave',file:'environment-cave-stage7.png',floor:'#34484d'},
  {id:'shrine',file:'environment-shrine-stage7.png',floor:'#505b53'},
  {id:'courtyard',file:'environment-courtyard-stage7.png',floor:'#716956'}
]);
export function environmentForStage(stage){return ENVIRONMENTS[Number.isInteger(stage)?Math.max(0,Math.min(3,stage)):0];}
export function drawEnvironment(c,images,s){
  const env=environmentForStage(s?.level?.stage),img=images['environment-'+env.id];
  c.fillStyle='#182938';c.fillRect(0,0,960,420);
  if(img?.complete&&img.naturalWidth){
    // Split at the authored ground horizon to preserve an undistorted upper
    // landscape and map the empty floor precisely onto our combat belt.
    const w=img.naturalWidth,h=img.naturalHeight,split=Math.round(h*.52);
    c.drawImage(img,0,0,w,split,0,0,960,222);
    c.drawImage(img,0,split,w,h-split,0,222,960,198);
    c.fillStyle='#101d2922';c.fillRect(0,0,960,420);
  }else{
    c.fillStyle=env.floor;c.fillRect(0,222,960,198);
    c.fillStyle='#829488';for(let x=0;x<960;x+=80)c.fillRect(x,224,40,2);
  }
  if(s?.level?.stage===4){
    // A stable boss atmosphere, never a flashing overlay or collision effect.
    c.fillStyle='#9f35151c';c.fillRect(0,42,960,180);
    c.fillStyle='#eea258';for(const x of [24,928]){c.fillRect(x,156,8,18);c.fillRect(x+2,151,4,8);}
  }
  // Opaque title strip protects UI readability on every palette.
  c.fillStyle='#0b182eea';c.fillRect(0,0,960,43);
  c.fillStyle='#07131b77';c.fillRect(0,382,960,38);
}
