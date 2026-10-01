import {journeyServer} from './journey/server.js';
import {vault7Server} from './vault-7/server.js';
import {advanceExpansion} from '../expansion.js';
const registry=new Map([
 ['journey-west',journeyServer],
 ['vault-7',vault7Server],
 ['nightfall',{advance(team){return advanceExpansion(this,team);}}]
]);
export function serverFor(room){const adapter=registry.get(room.state.config.cartridgeId);if(!adapter)throw new Error('Unsupported cartridge.');return adapter;}
