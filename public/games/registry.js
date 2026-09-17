import {nightfallAdapter} from './nightfall/adapter.js?v=0.9.1';
// Vault 7 retains its verified runtime. Both games have explicit practice entries.
export const GAME_REGISTRY=Object.freeze({
 'topdown-combat':{adapter:nightfallAdapter,practice:'./practice-nightfall.html'},
 stealth:{runtime:'./stealth.js',practice:'./dev-extraction.html'}
});
export function gameFor(id){const item=GAME_REGISTRY[id];if(!item?.adapter)throw new Error('This game uses its preserved cartridge runtime.');return item.adapter;}
