# Cartridge asset contract — v0.6

Vault 7 is the reference implementation. Its manifest declares real art, audio,
sprites, the extraction entry point, dimensions and resource effects. The current
runtime adapter implements this manifest; an arbitrary new cartridge is not yet
loaded dynamically merely by dropping in a JSON file.

Each story image has an ID, same-origin source, revision, dimensions, description,
focal point, preload policy, fallback and responsive derivative. Fifteen separate
960×540 WebP masters plus 480×270 derivatives ship. Missing images leave the text
visible. There is no narrative or cipher text burned into imagery.

Music is local MP3, starts from teacher controls, and defaults to low volume.
The 64-second loop and 16-second cue are original deterministic synthesis. The
reproduction script is scripts/generate-audio.py. Students hear no automatic
soundtrack; their extraction effects are optional and redundant with the HUD.

The extraction world is 1024×176, viewed through a 320×180 canvas, with 16×16
tiles and a 16×24 sprite (12×22 collider). Wall/sensor graphics are procedural;
the generated sprite atlas has a procedural loading fallback. Missing canvas
falls through to the accessible three-scene route.

The Map, Toolkit and Scanner are implemented. Boots, jammer, cloak, speed/jump,
health, incoming damage and offensive-power slots are reserved. The mini-game
has no authority to change assessment accuracy or question allocation.

Academic data belongs in the Question Package/provider seam. Route, equipment,
alert count, final choice and roster are frozen for a run. The server receives
start, checkpoint, detection, heartbeat and completion commands rather than
continuous player positions. See docs/RUNTIME_CONTRACT_v0.6.md.
