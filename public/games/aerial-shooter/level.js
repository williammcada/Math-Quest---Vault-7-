// Every opportunity has a stable ID, independent of checkpoint attempts.
const wave=(at,id,kind,xs,shape='line')=>({at,id,kind,xs,shape});
const supply=(at,id,x,pickup,opportunity)=>({at,id,kind:'supply',xs:[x],pickup,opportunity});
export const LEVEL = Object.freeze([
  wave(4,'f01','fighter',[275,320,365],'v'), wave(13,'f02','fighter',[65,110,155],'stagger'),
  wave(21,'f03','fighter',[485,530,575],'stagger'), supply(25,'supply-spread',320,'spread','SPREAD-1'),
  wave(31,'i01','interceptor',[110,530]), wave(39,'f04','fighter',[275,320,365],'v'),
  supply(45,'supply-repair-a',160,'repair','REPAIR-1'), wave(50,'t01','ship',[530]), wave(57,'t02','ship',[110]),
  supply(65,'supply-rapid',320,'rapid','RAPID-1'), wave(71,'b01','bomber',[320]), wave(77,'f05','fighter',[110,530]),
  wave(84,'i02','interceptor',[110,530]), {at:90,id:'checkpoint-mid',kind:'checkpoint',checkpoint:90},
  wave(93,'t03','shore',[110]), supply(100,'supply-repair-b',320,'repair','REPAIR-2'),
  wave(105,'i03','interceptor',[160,480]), wave(112,'t04','shore',[530]), wave(116,'f06','fighter',[275,320,365],'v'),
  {at:120,id:'coast-exit',kind:'scenery'}, supply(125,'supply-wingman',320,'wingman','WINGMAN-1'),
  {at:132,id:'boss-warning',kind:'warning'}, {at:135,id:'checkpoint-boss',kind:'boss',checkpoint:135},
  {...wave(143,'escorts-a','fighter',[240,400]),escort:true}, supply(150,'supply-repair-c',240,'repair','REPAIR-3'),
  {...wave(163,'escorts-b','fighter',[240,400]),escort:true}
].map(e=>Object.freeze({...e,tick:Math.round(e.at*60)})));
export const OPPORTUNITIES = Object.freeze(LEVEL.filter(e=>e.opportunity).map(e=>e.opportunity));
export const CHECKPOINTS = [0,90,135];
export const sceneryAt = seconds => seconds<45?'ocean':seconds<90?'islands':seconds<120?'harbor':'harbor-mouth';
