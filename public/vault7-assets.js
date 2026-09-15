const scene=(name,alt)=>({src:`./assets/vault7/scenes/${name}.webp`,srcset:`./assets/vault7/scenes/${name}-480.webp 480w, ./assets/vault7/scenes/${name}.webp 960w`,width:960,height:540,alt});
export const SceneAssets={
  'scene.cover':scene('cover','A covert facility embedded in a storm-lit mountain.'),
  'scene.opening-briefing':scene('briefing','An extraction crew receives its mission inside a covert operations room.'),
  'scene.perimeter-power':scene('gate1','Emergency lights illuminate the sealed perimeter power station.'),
  'scene.biometric-checkpoint':scene('gate2','An abandoned biometric checkpoint blocks the way into Vault 7.'),
  'scene.containment-laboratory':scene('gate3','Damaged containment chambers line a secret research laboratory.'),
  'scene.archive-mainframe':scene('gate4','The archive mainframe glows in the darkness of a vast server chamber.'),
  'scene.isolation-core':scene('gate5','Seven containment fins surround the pulsing isolation core.'),
  'scene.route-choice':scene('route','A narrow maintenance route and an exposed security corridor diverge.'),
  'scene.resource-market':scene('market','A field equipment cache waits behind a damaged service shutter.'),
  'scene.cipher-assembly':scene('cipher','Fragmented intelligence is assembled at a vault-side terminal.'),
  'scene.asterion-core':scene('finale','Asterion waits within the seven-finned core as the crew decides its fate.'),
  'ending.isolate':scene('ending-isolate','A sealed core remains conscious beneath the mountain.'),
  'ending.destroy':scene('ending-destroy','A containment chamber collapses into a silent white-hot void.'),
  'ending.copy':scene('ending-copy','A tiny archive device carries a dangerous signal toward the surface.'),
  'ending.release':scene('ending-release','An expanding signal reaches a city beyond the mountain.')
};
