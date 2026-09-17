// Backward-compatible import; new callers should use the game registry.
import {GameHost} from './engine/game-host.js?v=0.9.1';
import {gameFor} from './games/registry.js?v=0.9.1';
import {NIGHTFALL} from './cartridges.js?v=0.9.1';
export class FinaleHost extends GameHost{constructor(root,options){super(root,{...options,adapter:gameFor(NIGHTFALL.gameId),items:NIGHTFALL.items});}}
