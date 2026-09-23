// Backward-compatible import; new callers should use the game registry.
import {GameHost} from './engine/game-host.js?v=0.9.4';
import {gameFor} from './games/registry.js?v=0.9.4';
import {NIGHTFALL} from './cartridges.js?v=0.9.4';
import {rescueAdapter} from './games/nightfall/rescue-adapter.js?v=0.9.4';
export class FinaleHost extends GameHost{constructor(root,options){super(root,{...options,adapter:options.run.phase==='early-rescue'?rescueAdapter:gameFor(NIGHTFALL.gameId),items:NIGHTFALL.items});}}
