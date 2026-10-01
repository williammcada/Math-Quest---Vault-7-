# Nightfall II: False Haven v0.1.0 — practice candidate

Date: 2026-10-01 (Asia/Shanghai)
Stage: implemented, automated verification passed, hosted practice published and smoke-tested. Physical-device/full combat verification remains open. This is not a verified classroom release.

## Exact preserved source

- Implementation checkpoint: e62f7e7ba84197bc0c454bdb97bf5c7dcac7e236 (branch nightfall-false-haven-v0.1.0).
- Tested application candidate: **0124d53351dd7f69e6c0a8ef58979a878304b808**. Fetched this GitHub commit and checked it out detached before the final test/build runs. The later documentation commit adds no application changes.
- [Play hosted practice](https://williammcada.github.io/Math-Quest---Vault-7-/public/practice-false-haven.html).
- [Implementation specification](../change-specs/nightfall-chapter-2-v0.1.0.md).

## Implemented

New False Haven scenario using shared Nightfall simulation, rendering and held-input controls. 3840 × 1920 compound; power/drainage chain, permanent service shortcut, two-position cargo trolley, depot shutter, vehicle barrier, local speaker trap, movable barricades, existing doors/windows/alarms/fuel hazards, supplies and bus escape. Four original enemy types and existing pistol/carbine-primary plus shotgun mechanics; 46 initial enemies plus eight delayed finale enemies. New chapter timer is 300 active seconds; old city/rescue timing remains unchanged. Practice includes loadouts, assisted completion, saved-round recovery and scoped deletion controls. No classroom registration, new math subsystem or Arcade integration.

Shared engine changes derive navigation dimensions and enemy restore bounds from world data, scale the map, position the bus per scenario, and dispatch chapter-specific geometry/events. Cache-busted new chapter imports prevent reuse of obsolete shared-module cache entries. The canonical public/ source is the editing and deployment source; legacy root copies were not regenerated.

## Evidence and limits

| Check | Result |
| --- | --- |
| Full Node test suite on exact candidate | Passed: 178 tests, 0 failed. Includes existing city/rescue and shared held-input regressions, 7 new chapter simulation/host tests. |
| npm run build | Passed: recursive JS syntax and existing release asset/catalog checks. |
| Area | Passed: Chapter 1 2,936 reachable sampled cells; Chapter 2 6,878; ratio 2.342643. Identical fully opened tile-center/collision/flood-fill method; one valid barricade configuration alone exceeds 2×, without needing a configuration union. Bounding area ratio 2.25. |
| Mandatory route | Passed: collision-aware movement and real Use input complete every objective and escape at 148.63 active seconds without firing. Ordinary enemies removed for this puzzle/traversal isolation test; finale still spawns. This is not a combat-balance or first-time human timing result. |
| Spawn placement | Passed: 46 initial actors in free space, all four existing kinds. |
| Puzzle/recovery | Passed: prerequisite rejection, drainage, occupied trolley rejection/recovery, speaker cooldown, saved topology/time/ammo, terminal persistence, guided result and host pause/input clearing. |
| Canvas scene inspection | Passed: actual renderer with existing atlases inspected at bus, utility, depot and map using node canvas. |
| Hosted browser smoke | Passed: cloud Chrome loaded v0.1.0/artwork, started action round, showed countdown, pause and map, switched to guided route, completed all ten steps, reloaded and retained assisted_completed. No application JS error observed in captured logs; browser-extension metadata errors were unrelated. This does not verify sustained keyboard combat or physical touch. |
| Hosted bytes | Passed: ten changed/new runtime files downloaded from Pages matched exact candidate bytes; see hosted-parity.json. |
| Local Chromium automation | Not run: browser launch blocked by environment socket restriction; hosted browser used for smoke instead. |
| Physical iPhone/iPad, sustained combat, audible music, complete deletion UI flow | Not run. No resolved-on-device claim. |
| Classroom, school-network, Math-Arcade admission | Not applicable to this standalone practice milestone; integration remains separate. |

Evidence: [test log](evidence/false-haven-v0.1.0/tests.txt), [build log](evidence/false-haven-v0.1.0/build.txt), [hosted parity](evidence/false-haven-v0.1.0/hosted-parity.json), [hosted guided result](evidence/false-haven-v0.1.0/hosted-guided-result.jpg).

## Next verification

Owner playtest combat/puzzle readability and physical iPhone/iPad input, native menus, zoom and interruption behavior. Adjust only against observed issues. Preserve this candidate if packaging or later integration fails. The full classroom narrative and math-admission host are intentionally not represented as complete.
