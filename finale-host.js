// Backward-compatible import; new callers should use the game registry.
import {GameHost} from './engine/game-host.js';
import {gameFor} from './games/registry.js';
import {NIGHTFALL} from './cartridges.js';
export class FinaleHost extends GameHost{constructor(root,options){super(root,{...options,adapter:gameFor(NIGHTFALL.gameId),items:NIGHTFALL.items});}}
