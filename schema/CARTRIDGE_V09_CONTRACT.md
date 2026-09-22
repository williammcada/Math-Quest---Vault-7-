# MathQuest cartridge contract · v0.9

Cartridges own story, game rules and art. `src/question-provider.js` owns question delivery. Arcade difficulty, inventory, outcomes and timing never alter an answer, academic difficulty, score or mastery classification.

## Resolution and ordering

`resolution.type`: `cipher | evidence | repaired_system | extraction_zone | final_decision | none`.

`resolution.minigamePlacement`: `pre_final_decision | post_final_decision | none`.

Vault 7 uses cipher → AI decision → extraction → epilogue. Nightfall uses market → field runs → crew decision → epilogue. Narrative team completion requires the epilogue stage; all field runs finishing alone is not team completion.

## Game boundaries

The game registry declares a practice entry and either an adapter or a preserved runtime. Both runtimes use `engine/controls.js` and the shared thumb layout, cancellation handling and display scaling. Nightfall's adapter declares instructions, input profile, HUD, objective, result labels, music selector, simulation, restoration, renderer and assisted path. Vault's side-view runtime preserves its checkpoint/server protocol and uses the same input profile contract. Future games should use the adapter interface rather than extending shared UI with cartridge branches.

## Stable run configuration

New rooms pin engine version and cartridge revision. Nightfall issues per-player run IDs with configuration, map, asset, route, inventory and threat revisions. The first successful start freezes the entire crew's threat and roster. Later changes are rejected. Students see no named teacher threat preset in gameplay. Live runs cannot restart. Practice restarts never call live APIs.

## Input

Profiles declare left/right action groups and normalized keyboard mappings. Touch buttons own pointer IDs; keys and touch are merged. Release, pointer cancellation, lost capture, blur, hidden page, page hide and rotation clear input. Help pauses local active time. Reset controls clears held inputs without restoring resources. A blocked input callback prevents movement through overlays. Buttons are at least 56 CSS pixels in both dimensions.

## Evidence

Nightfall progress carries run ID, configuration revision, monotonic sequence, active elapsed milliseconds and a snapshot. Snapshot fields include threat, tasks, pickups, ammo, health, vest, shots, hits, blocks, heals, doors, distractions and enemy state. The server validates envelope, objective prerequisites, resource ceilings, pickup continuity, ammo creation, equipment use and timing. It is client-reported engagement evidence, not an anti-cheat authoritative simulation.

Vault summaries carry map revision, checkpoint, detections, integrity, active time, accessible step, objectives and spent toolkit checkpoint charges. First two detections cause checkpoint recovery; the third is terminal. Active time limit is 180 seconds. Shared-window closure is neutral; it is not proof of capture.

Terminal narrative failure never changes academic evidence. Teacher closure and technical limits are neutral. Assisted completion is a valid completion. Results remain downloadable after End session.

## Assets

Cartridge manifests identify cover and scene images, sprite atlases, music and effect cues. Paths must be relative to the published project directory. Missing media cannot prevent the assisted route. Audio requires a user gesture; pause/mute affects the local player. No remote media service or new account is required.

## Migration

v0.8 gameplay saves are not migrated into v0.9 physics. Export/end old rooms before updating. An old engine room may still be exported and ended, but cannot accept new gameplay commands. Use fresh rooms after a matched frontend/backend deployment.
