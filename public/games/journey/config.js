export const JOURNEY_BUILD = 'jttw-0.1.0-stage9-feedback';
export const PROTOCOL = 'jttw-combat/1';
export const HEROES = [
  {id:'wukong',name:'Sun Wukong',color:'#f4b94e',special:'Monkey Swarm'},
  {id:'bajie',name:'Zhu Bajie',color:'#c993cb',special:'Earthshaker'},
  {id:'wujing',name:'Sha Wujing',color:'#55bebc',special:'River Surge'},
  {id:'tang',name:'Tang Sanzang',color:'#ffe4a8',special:'Lotus Ward'},
  {id:'prince',name:'White Dragon Horse',color:'#b9d9ff',special:'White Horse Charge'}
];
export const UPGRADES = [
  {id:'power',name:'Power',text:'+20% ordinary attack damage'},
  {id:'vitality',name:'Vitality',text:'+25% maximum health'},
  {id:'reserve',name:'Magic Reserve',text:'+1 starting charge and capacity'},
  {id:'focus',name:'Focus',text:'+20% special damage'}
];
export const LIMITS = Object.freeze({ready:60000,launch:3000,active:180000,recovery:15000,inputLease:300,withdraw:1000,respawn:2000,protection:2000,hurt:650,ticket:30000});
export const ARENA = Object.freeze({width:960,height:420,left:48,right:912,near:360,far:230});
