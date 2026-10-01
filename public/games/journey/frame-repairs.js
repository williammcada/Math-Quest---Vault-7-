// Supplemental poses retain original animation indices and gameplay timing.
const bajieFrames=[1,2,4,5,7,8,9,10,11,14,15,16];
export const REPAIR_ATLASES={bajieRepair:'bajie-repair-stage3.png'};
export const FRAME_REPAIRS={bajie:Object.fromEntries(bajieFrames.map((original,index)=>{
 const row=Math.floor(index/4),column=index%4,rows=[0,341,683,1024],feet=[304,615,938];
 return [original,{image:'bajieRepair',source:[column*384,rows[row],384,rows[row+1]-rows[row]],pivot:[192,feet[row]-rows[row]]}];
}))};
