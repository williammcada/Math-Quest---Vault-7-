# Nightfall Chapter 2: False Haven — v0.1.0 implementation specification

Date: 2026-10-01 (Asia/Shanghai)
Owner: William McAda
Credit: A WILLIAM MCADA PRODUCT
Stage: CHANGE SPEC. Concept accepted by “proceed”; implementation details below are the build baseline, with numeric encounter tuning provisional until playtesting.
Canonical repository: williammcada/Math-Quest---Vault-7-
Inspected source commit: 59c11c90c2f0893333dfe30b62578fd73deb9bbf
Deliverable: a new Nightfall mini-game scenario, first exposed through a separate practice entry. Full classroom story/cartridge registration and Math-Arcade integration follow separately; do not register an unfinished cartridge.

## 1. Purpose and continuity

Survivors arrive by bus at a fortified evacuation center. Lights and a repeating announcement suggest safety, but nobody answers the radio. Infection spread inside before arrival. Emergency lockdown seals the vehicle exit behind them. The player must restore utilities, manipulate the compound's routes, and return to the bus to escape.

Opening text: “Remain inside the perimeter. Transport is on its way.”
The unattended announcement continues as the player discovers abandoned processing tents and a deserted control booth.

Preserve the existing engine, perspective, turning/movement/manual aiming, wall-aware combat, enemy types, weapon mechanics, accessibility path and audio controls. No new enemy class, boss, vehicle-driving subsystem or physics engine. Survivor names and Chapter 1 ending variants must be reconciled with actual cartridge narrative before classroom integration; the mini-game assumes arrival without rewriting Chapter 1's endings.

## 2. Consulted records and source findings

Read AGENTS.md, full docs/PROJECT-BRIEF.md, public/games/nightfall/world.js, config.js and simulation.js at the source commit above. Read the opening/baseline/preservation sections (lines 1–65) of docs/change-specs/v0.9.2.md; this is not a claim of a complete historical-spec audit.

Handbook file blob revisions actually consulted in this conversation:
- AI-START-HERE.md: 6557a45aaa6d29d7d1abde808e6d0ac248b08820.
- UNIVERSAL-RULES.md: 6bde7c1f4ccdf5ed2163955e553379ba55186e2f.
- CONDITIONAL-STANDARDS.md: 1a794984142f3702c027a28e492a310aaba9f096.

Apply approved U-09 to any saved progress, U-10 to held/touch controls, and S-03-A's 300-second new-level default. Retain project adoption of U-01–U-08 and relevant S-02/S-03/S-04 without promoting draft handbook modules to universal approval. S-03-M applies when adding the math host, not to rewriting this action simulation.

Source observations:
- Canonical frontend is public/, not root legacy copies.
- Chapter 1 bounds: 2560 × 1280; tile size 32; navigation grid 80 × 40.
- Enemy kinds: shambler, runner, crawler, brute. Their baseline health values are 2, 1, 1, 6 respectively.
- Standard config has 34 seeded enemies, plus eight store guards and a separately triggered eight-member garage horde. “34 enemies total” would be inaccurate.
- Weapons are pistol/carbine primary (carbine loadout raises primary damage from 1 to 2), plus a collected shotgun. The current switch toggles primary/shotgun; it is not a three-slot inventory.
- Shotgun: seven pellets, 30-degree spread, 312-pixel range, damage 1 per pellet, 0.9-second cadence; pickup grants eight shells.
- Pathfinding, sound indexing, restore bounds and encounter positions contain Chapter 1 constants. worldFor already dispatches rescue versus city, providing a starting seam for a third scenario.
- Existing alarm behavior can activate all enemies and override normal nearby-AI budgets. Reusing it unchanged for the compound speaker would produce unintended map-wide behavior.

## 3. Map contract

Chapter 2 world bounds: 3840 × 1920 at 32-pixel tiles, a 120 × 60 grid. Bounding area is 7,372,800 square pixels versus Chapter 1's 3,276,800: exactly 2.25×.

Separately require at least 2× Chapter 1's reachable walkable area. Measure with the same tile-center sampling, player collision radius and flood-fill method in both maps. Use each scenario's legitimate fully opened traversal state; union reachable cells across valid alternate object configurations, count each cell once, and exclude unreachable decoration, closed building voids and isolated pockets. Preserve the measurement script/output with the candidate. Bounds alone do not satisfy acceptance.

District plan (layout regions, not solid building rectangles):
| District | Approximate region (x, y, w, h) | Role |
| --- | --- | --- |
| Arrival yard | 0, 1280, 1280, 640 | Bus refuge, perimeter gate clue, initial supplies |
| Shelter block | 0, 0, 1280, 1280 | Dormitories, optional rooms, two-way circulation |
| Utility yard | 1280, 0, 1280, 960 | Generator, power selector, speaker booth |
| Service passage | 1280, 960, 1280, 960 | Pumped traversal route and manual shortcut |
| Loading depot | 2560, 0, 1280, 1280 | Cargo trolley, machinery, gate-control approach |
| Evacuation gate | 2560, 1280, 1280, 640 | Vehicle exit controls and return shortcut |

Author a loop from arrival through shelter/utility, service passage, depot and gate back to arrival. Show the locked vehicle gate from the start. Provide at least two unlocked return shortcuts. Maintain current actor scale and camera zoom; increased size must come from playable geography.

Required-route target: 180–260 active seconds on a familiar Standard run. First-time completion target is within 300 seconds with readable prompts; validate through playtesting, not a claimed result. Avoid mandatory visits to all optional rooms. If pacing fails, shorten routing and interactions rather than shrinking below the area minimum or silently extending the timer.

## 4. Objectives and environmental state

Use one existing Search / Use action with contextual prompts. No additional touch-button row or pixel-precise dragging.

| ID | Preconditions | Interaction/result |
| --- | --- | --- |
| generator_online | None | Hold Use 3 s at generator; starts utilities |
| power_pump | Generator online | Tap labeled selector; powers drainage |
| passage_drained | Pump powered | Automatic 6 active-second drain; visible level change |
| service_shortcut | Passage drained; player reaches far lever | Hold Use 1.5 s; permanent manual shortcut |
| power_depot | Generator online; shortcut open | Tap selector; powers depot, pump stops |
| trolley_parked | Depot powered; track unoccupied | Hold Use 2 s; trolley moves along fixed track to terminal position |
| depot_shutter | Trolley parked; depot powered | Hold Use 2 s; opens maintenance route |
| gate_unlocked | Reach control booth through maintenance route | Hold Use 3 s; unlock exit, trigger finale once |
| barrier_released | Gate unlocked | Hold Use 2 s at protected release lever |
| escape | Barrier released; reach bus | Hold Use 2 s; success |

Water stays drained. Shortcut stays open. Once powered machinery completes its movement, mechanical latches preserve that progress after power changes. Selector tells the player why depot power is unavailable until the shortcut is secured. All required objectives can be completed with zero ammunition.

Speaker puzzle: optional combat solution positioned before utility access. Activate a 12-second local broadcast, lure nearby enemies into a fenced inspection lane, close its gate from outside. Prompt explicitly identifies the gate and lure. Missed timing leaves an evasion/combat route; closing the gate on occupied collision space is refused. Gate may be reopened. Do not lock the player into the lane. Speaker is reusable after a 15-second cooldown. Define a connected-space sound radius of 640 pixels initially; unlike legacy car alarms, it must not globally redirect every enemy. Trapped enemies cannot pass fences or attack through them; player-created geometry must update navigation.

Cargo trolley: two authored positions and one fixed track; no general pushing physics. Abort/defer movement while an actor occupies the swept volume. Never crush, teleport or enclose an actor. It exposes access and supplies cover at its destination. Its transition and final footprint must match rendering.

Optional interactions: two selectable barricades with fixed positions, reusable ordinary doors, two car alarms, two fuel hazards and optional supply rooms. Reuse existing window-breaking behavior for optional shortcuts only. Barrels remain optional and consume ammunition when shot. Do not require a new crafting, inventory-key or combination-lock system.

## 5. Combat and starting balance

Retain all four enemy classes and existing attacks, health, speed, sight and hearing principles. Use authored placements with a reproducible seed for minor permitted variation.

Initial Standard target: 54 enemies total, including eight reserved finale enemies, distributed across districts rather than all active at once. These are tuning targets, not user-mandated quantities. Start from the existing Standard nearby budget of nine; explicitly bound speaker investigators and finale activation so legacy alarm/horde exceptions cannot activate the whole larger map. Record actual peak active count and performance.

Keep primary pistol/carbine loadout semantics and shotgun switching intact. Start with pistol, 12 primary rounds, three health; carbine remains the existing earned/loadout option. Practice may expose the existing loadout selector without pretending equipment was academically earned. Place a reachable optional shotgun cache containing eight shells. Suggested initial supplies: six primary-ammo caches of six rounds, three one-health pickups. Preserve loadout effects and caps. Tune scarcity against actual evasion and completion results.

Weapon HUD must name Pistol or Carbine correctly and show Shotgun only when obtained. No fourth weapon, new damage upgrade or separate pistol/carbine simultaneous inventory is introduced.

Finale: gate unlock emits a visible/audio warning before eight pre-authored reserve enemies enter from believable breach positions outside the player's immediate view. At least three seconds warning; no spawn on the player or in the bus interaction radius. Route through previously opened shortcuts. No boss. Victory requires reaching and using the bus, not killing all enemies.

## 6. Time, outcomes and host boundaries

300 seconds cumulative active simulation time. Start after instructions close and the player presses Start. Freeze during local pause or page suspension; clear held input. No offscreen damage. Success, death, or expiry ends the round once. Use explicit outcomes success, lost, timed_out, assisted_completed and host closure as appropriate; timed_out text is “Escape incomplete — time expired.”

Practice replay may reset the scenario without mathematics and must be labeled practice. Math-Arcade integration requires a fresh completed math gate for every new round/replay, with no math interruptions inside the run. Consume admission once; reload must not duplicate admission or replenish an ongoing run's supplies/time.

Existing MathQuest classroom sessions have different authoritative shared-window and story-gate policies. This spec does not migrate those sessions or replace their backend. Before registering Chapter 2 there, specify its adapter/lifecycle and authoritative window separately. Keep teacher/session closure distinct from local active-time expiry and academic evidence.

Death ends this round; checkpoint coordinates used for safe restoration are not free respawns. Save legitimate puzzle progress, ammunition, enemy state and elapsed time for interruption recovery within a live round. Ended rounds remain ended after reload. New paid/admitted rounds start clean.

If progress is stored, provide confirmed Delete this run and Clear Chapter 2 progress with Cancel, preserve Chapter 1/other games and academic records, and record recovery limits. Invalid or incompatible saves must show a clear restart path without overwriting unrelated data.

## 7. Engine changes and isolation

Extend worldFor with scenario false-haven. Keep Chapter 1 default and rescue behavior unchanged. Prefer chapter world/config data with shared simulation and renderer rather than copied engines.

Derive grid columns/rows/cell count, indexing, world bounds, enemy restore clamps, camera bounds and map markers from worldFor(s).WORLD. Audit every occurrence of 80, 40, 3200, 2544, 1264, 2560 and 1280 in relevant modules for semantic map constants; do not blindly replace unrelated values.

Add a geometry revision incremented by doors, shutters, barriers, trolley movement and drained passage changes. Navigation/sound cache keys include scenario and geometry revision. Recalculate safe routes after topology changes. Generalize task callbacks; Chapter 1-specific battery and garage events must not fire in False Haven.

Versioned scenario state includes scenarioId, configRevision, runId, active elapsed time, powerCircuit, drainage state, shortcut flags, trolley state, shutters/barriers, speaker cooldown, finaleTriggered, objective completion and existing player/enemy/pickup fields. Validate IDs/enums and finite coordinates on restoration. Restore topology before locating actors; recover invalid actor positions to authored safe points.

Audit renderer.js, adapter.js, hardware.js and shared host before coding; those modules were not fully inspected for this specification. Retain public/engine/held-input.js. Use one shared contact ownership/release mechanism and generated delivery parity, not separate per-chapter input patches.

## 8. Presentation and target devices

Preserve pixel-art style, camera scale and familiar readable HUD. Shelter palette: cold floodlights, faded evacuation signage, amber generator lamps, red emergency indicators. State changes need shape/text cues as well as color. Reuse existing licensed assets and sound controls for the first playable checkpoint; missing compound props must be identified rather than silently omitted.

Music moves from uneasy ambient to danger during the finale; audio resumes correctly after pause and gates. Avoid continuous exposition: opening briefing, short objective labels and one finale warning. No new names/endings asserted as Chapter 1 canon.

Targets: Windows keyboard/browser, landscape iPad, landscape iPhone owner review; portrait setup/help plus rotation guidance. Preserve aim/fire/use/weapon/pause completeness. Active gameplay must resist stuck controls, native callouts, unintended zoom and viewport movement while ordinary settings remain usable. Physical-device evidence is required before claiming those targets verified.

## 9. Implementation checkpoints

1. Generalize dimensions and scenario selection; run existing city/rescue regression checks; preserve identifiable implementation checkpoint.
2. Build compound geometry, objective chain, speaker and trolley; preserve implementation checkpoint before extended tests.
3. Add authored encounters, supplies, finale and presentation; measure walkable area and route timings.
4. Verify exact candidate, save verification record and verified checkpoint; then update version/README/package without adding features.
5. Publish practice entry using existing hosting and verify actual hosted bytes/version. Classroom and Arcade registration remain subsequent integration work.

Workflow: DESIGN → CHANGE SPEC → IMPLEMENT → CHECKPOINT → VERIFY → VERIFIED CHECKPOINT → RELEASE → DEPLOY.
Recover preserved checkpoints after packaging/upload failure; do not reconstruct already verified work.

## 10. Acceptance and evidence

| Check | Required evidence | Current result |
| --- | --- | --- |
| Source identity | Commit and canonical paths above | Passed: repository read |
| Concept/source compatibility review | Listed dimensions, kinds, weapon semantics, hard-coded bounds | Passed: static inspection only |
| Bounds and usable area | 2.25× bounds; >=2× reachable area using saved measurement | Not run |
| Objectives and recoverability | Full escape; wrong power order; repeated interactions; zero-ammo completion; no softlocks | Not run |
| Dynamic geometry | Occupied trolley path, gate occupancy, navigation refresh, sight/bullet occlusion | Not run |
| Enemy/weapon preservation | All four kinds; pistol/carbine loadouts; shotgun stats/switching; Chapter 1/rescue regression | Not run |
| Timer/results | Exactly one terminal result, pause/background, expiry, replay and reload | Not run |
| Persistence/deletion | Restore every puzzle stage; invalid saves; cancellation; unrelated data intact | Not run |
| Controls | Full U-10 interruption/multitouch/native-menu/viewport checks | Not run |
| Physical Windows/iPad/iPhone | Named device/browser/version, exact candidate and results | Not run |
| Performance and pacing | Full-route playtests, peak active enemies, larger-map frame timings | Not run |
| Deployment | Hosted candidate matches verified checkpoint | Not run |

No implementation, runtime test, verified release or deployment is claimed by this specification.
