// Cartridge dispatch keeps Nightfall's established behavior separate.
import * as nightfall from './cartridges/nightfall/server.js';
import {coastalCommand,coastalProjection,settleCoastal} from './cartridges/coastal-escape/server.js';
export const expansionFor=nightfall.expansionFor;
export const advanceExpansion=nightfall.advanceExpansion;
export function expansionCommand(room,student,input){
 if(room.state.config.cartridgeId==='coastal-escape'){
  const result=coastalCommand(room,student,input);if(result!==null)return result;
 }
 return nightfall.expansionCommand(room,student,input);
}
export function settleRuns(room,force,outcome){return room.state.config.cartridgeId==='coastal-escape'?settleCoastal(room,force,outcome):nightfall.settleRuns(room,force,outcome);}
export function expansionProjection(room,t,teacher,viewer,base){const result=nightfall.expansionProjection(room,t,teacher,viewer,base);return room.state.config.cartridgeId==='coastal-escape'?coastalProjection(room,t,teacher,viewer,result):result;}
