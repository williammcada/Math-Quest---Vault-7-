# MathQuest Aerial Shooter v0.1.0 — Implementation Specification

**Document revision:** 2  
**Date:** 30 September 2026, Asia/Shanghai  
**Status:** IMPLEMENT — owner approved all §3 technical defaults in the subsequent “Yes” response on 30 September 2026. Initial implementation is authorized; release and classroom deployment remain separate gates.  
**Owner / credit:** William McAda / A WILLIAM MCADA PRODUCT  
**Working game ID:** aerial-shooter  
**Working level title:** Coastal Escape (descriptive title, not a final narrative decision)  
**Canonical repository:** williammcada/Math-Quest---Vault-7-  
**Design branch:** design/aerial-shooter-v0.1.0  
**Implementation branch:** implementation/aerial-shooter-v0.1.0  
**Code baseline:** 7ac12fb98f7ccda591be4ee0bd6baa2f0ee81c28, merged MathQuest v0.9.4 candidate  
**Pre-consolidation design checkpoint:** 4ac6d8a896361e3dd512cc1987c17bdcb9e3fc75  
**Handbook baseline:** 00cbde605ab08203b6b5fd2374d225155608fc29  
**Decision history:** [Design log](aerial-shooter-v0.1.0-design-draft-1.md)  
**Parent:** [MathQuest Project Brief](../PROJECT-BRIEF.md)

## 1. Deliverable, authority and boundaries

Design and subsequently implement one polished, approximately three-minute top-down aerial shooter level for MathQuest. It uses original arcade pixel art, WWII-style propeller aircraft, automatic forward fire, freely controlled movement, three lives and two recovery checkpoints. A WWII experimental-plane escape is a possible later narrative. No final factions, historical event, character names or team choice are invented here.

The immediate implementation target is the reusable game module and hosted owner-practice entry. The live classroom adapter, entitlement and timing contracts are specified here so the module can later enter a narrative cartridge without a physics rewrite. A test-room integration harness may verify those contracts; it must be labeled as a development harness and cannot masquerade as a finished narrative cartridge. Live classroom publication requires the later approved narrative placement and matched frontend/backend release.

This document consolidates decisions explicitly approved in the conversation. §2 and §3 are approved. The owner approved the technical defaults after the consolidated specification was presented. Later sections make those approved initial defaults concrete. The owner requested advance design and questions about unspecified choices; do not treat the existence of this file as permission to silently settle a different product design.

No shared infrastructure migration, multiplayer combat, new account system, new paid service, extra level, weapon shop, score leaderboard, additional difficulty preset or new math curriculum is included. Preserve existing cartridges, privacy controls, reports, accounts/credentials, math validation and deployment architecture.

The module version v0.1.0 is independent of the eventual MathQuest platform release number. Keep the main application version unchanged during design. A later platform release number must be chosen at integration.

## 2. Approved requirements

| ID | Requirement |
| --- | --- |
| AP-01 | Top-down aircraft facing upward; battlefield automatically scrolls. Player moves freely across the playfield and primarily shoots forward. |
| AP-02 | WWII-style propeller planes, detailed arcade pixel art, ocean → islands → coast/harbor environments. |
| AP-03 | Automatic fire, familiar cross-shaped touchscreen movement controls, keyboard support, landscape iPad and iPhone Safari action play. |
| AP-04 | Baseline health 100; ordinary hits deal 10, heavy shots and aircraft collisions 20. One second of protection follows a damaging hit. |
| AP-05 | Three lives total: initial life plus two replacements. Checkpoints at midpoint and final boss; before midpoint, recover at the start. |
| AP-06 | One cumulative 180-second active-play allowance across all lives. Replaying a checkpoint never restores that allowance. |
| AP-07 | Respawn restores full applicable health and math-earned upgrades, removes temporary shooting effects, and preserves the record of already-collected supplies. |
| AP-08 | Required mathematics grants one upgrade choice; each additional teacher-prescribed question block grants one more distinct upgrade, maximum three. Follow Nightfall's shared team loadout structure. |
| AP-09 | Initial upgrade tuning: movement speed +20%; starting/maximum health +50%; weapon damage +50%. Visible weapon animation changes. |
| AP-10 | Formation fighters, weaving interceptors, armored bombers, ship/coastal turrets, distinctive medium supply planes, and a large aircraft boss with smaller supporting fighters. |
| AP-11 | Six reviewed encounter bands: 0–25, 25–50, 50–90, 90–120, 120–135 and 135–180 seconds, as detailed below. |
| AP-12 | Two destructible boss wing guns, followed by exposed central fuselage. Supporting fighters enter in quieter intervals. Boss/guns fully reset on boss-checkpoint recovery. |
| AP-13 | One spread-shot opportunity, 20 seconds; one rapid-fire opportunity, 20 seconds; one wingman opportunity, 30 seconds. New temporary bonuses replace old ones. Wingman provides firepower, not a shield. |
| AP-14 | Three planned repair opportunities, 25 health each, capped at maximum. Defeat prominent medium carriers and fly through the dropped items. |
| AP-15 | Boss destruction is full individual success. Still alive at the individual limit with the boss surviving is a lesser escape. Exhausted lives mean defeat. Neither result changes academic evidence or the team's narrative choice. |
| AP-16 | Ships/buildings are below flight altitude; overlap with their artwork causes no body-collision damage. Their attacks remain dangerous. |
| AP-17 | Approved corrected visual concept: silver/blue player, distinct olive/charcoal enemies, yellow supply plane, burgundy/cream four-engine boss with two separate wing guns, coastal scenery. |
| AP-18 | Energetic flight music, distinct boss music, distinct sound effects, low initial volume and visible mute. Visual equivalents for warnings. |
| AP-19 | One Standard difficulty initially, hard but fair, boss beatable with baseline weapon; upgrades make it easier without increasing enemy strength. |
| AP-20 | Assisted alternative consists of three guided tactical choices without reflex demands; report it separately and preserve academic/team outcomes. |
| AP-21 | Five-minute authoritative shared classroom window contains each student's active allowance. Teacher pause suspends it; individual pause/disconnect does not. Shared closure has a neutral reason distinct from individual escape. |

Approvals were recorded on 30 September 2026 at 21:26 (recovery/damage), 21:33 (encounters/boss/pickups), 21:51 (visual direction) and 21:57 (audio, Standard difficulty, assisted play and shared window), Asia/Shanghai.

## 3. Approved initial technical defaults

These choices make the specification buildable. Approved on 30 September 2026 by the owner’s “Yes”; they remain initial tuning, not validated gameplay balance. Historical “proposed” and “candidate” wording below identifies their design origin, not outstanding approval.

| ID | Proposed default | Reason / review implication |
| --- | --- | --- |
| TD-01 | A focused JavaScript/Canvas 2D game module, fixed 60 Hz simulation, data-authored waves, integrated through MathQuest's adapter interface. No added game-engine dependency. | Reuses the existing host and makes rules/tuning inspectable; it does not replace MathQuest's classroom engine. |
| TD-02 | A fixed 640 × 360 logical playfield, uniformly scaled inside landscape layouts, with D-pad and essential HUD outside the attack area. | Equal visibility and game geometry across supported devices; exact touch layout requires phone mockup testing. |
| TD-03 | Immediate normalized directional movement, 180 logical units/second, 216 with Agility; no inertia or rotation-to-steer. | Familiar responsive directional control. Diagonal speed equals cardinal speed. |
| TD-04 | Eight primary shots/second, 10 damage per shot; rapid fire is ×1.5 rate; wingman supplies 50% additional baseline forward damage. Exact HP and projectile values are in §7. | Initial reviewable balance, subject to explicit playtest changes. |
| TD-05 | Instant logical respawn at the checkpoint, clear hostile projectiles, reset the checkpoint's encounters, two seconds of respawn protection; death explosion is cosmetic. | Clear recovery without hidden timer resets or damage during an animation. This protection is separate from the approved one-second protection after ordinary hits. |
| TD-06 | Pickups last eight active seconds. Uncollected opportunities can reappear on replay; collected opportunities cannot. Full-health repair pickups are consumed with “Hull full.” | Defines missed-pickup/replay behavior and avoids storage/farming ambiguity. |
| TD-07 | Four wing/banking propeller animation phases per pose; separate damage/weapon effect layers; production asset inventory in §11. | Keeps identity consistent without generating every combination separately. |
| TD-08 | Three assisted choices with explanatory feedback and retry, no individual reflex timer; shared classroom window still applies. Entering assisted mode is one-way for that run. | An accessible alternative, not a fresh combat attempt or fabricated boss victory. |
| TD-09 | Explicit teacher-set N for each upgrade block. Pre-fill only from equal ordinary gate loads; if gate counts differ, require the teacher to choose N before enabling extra preparation. | Never silently fall back to Nightfall's default three or average unequal gates. Does not reallocate the existing math plan. |
| TD-10 | Exact wave/carrier positions, warning intervals, HP values and outcome tie rules in §§6–9. | These are candidate tuning and engineering rules for this level, not universal MathQuest rules. |
| TD-11 | Practice first; then adapter/harness verification; narrative integration/publication after its own approved placement. | Supports the owner's requested later narrative retrofit. |
| TD-12 | Proposed test floor: 667 × 375 CSS-pixel landscape viewport, plus primary iPhone and school iPads; actual supported models/OS versions recorded after testing. | A layout target, not a claim of real-device support. Smaller layouts must pause with a useful message rather than clip controls. |

Any approved change to these defaults should be recorded in this file before its implementation checkpoint. Do not call the numerical values validated balance until playtests support that claim.

## 4. Handbook and source grounding

Consulted handbook: AI-START-HERE.md, UNIVERSAL-RULES.md, CONDITIONAL-STANDARDS.md (S-02/S-03/S-04), RELEASE-CHECKLIST.md and PROJECT-MAP.md, at the baseline above. U-01–U-08 retain the handbook's seeded status; use the relevant rules already adopted by MathQuest. U-09 is explicitly approved. This task makes no global handbook amendment.

Read MathQuest's README, PROJECT-BRIEF, v0.9 cartridge contract, v0.6 runtime/asset contracts, ART_PROVENANCE, applicable v0.9 technical-spec sections, v0.9.2 mobile/equipment/cross-cartridge/timing sections, and v0.9.4 scope/compatibility sections. Historical contracts supply context, not a requirement to duplicate Vault Seven or Nightfall world dimensions, rules or audio arrangements.

Current-source observations checked against the pinned v0.9.4 code:
- public/engine/game-host.js already uses a 1/60-second simulation accumulator, adapter rendering, audio, persistence and low-frequency snapshots.
- It still hardcodes a 640 × 360 canvas, map control, tank input, several Nightfall labels and a generic time guard. The adapter boundary is not yet sufficient by itself.
- public/engine/controls.js supplies pointer ownership/cancellation and keyboard/touch merging; its four-button layout currently assumes the tank-control class.
- src/engine/equipment.js uses one base slot plus completed blocks capped at three, team voting/readiness and Event Lead confirmation.
- Extra preparation currently uses a separate supply count or three; normal gates are balanced from total questions and can have unequal loads.
- Existing validation expects cartridge-specific snapshots. The shooter needs its own validator and records; renaming Nightfall fields is not enough.

The code baseline and handbook head were checked again for this consolidation and remain the versions listed above. No deployed browser or Worker was inspected during this documentation task.

## 5. Architecture and module contracts

### 5.1 Responsibilities

| Component | Owns | Must not own |
| --- | --- | --- |
| Existing session engine | Teacher authorization, room/team roster, entitlement, shared window, accepted run revision/status, reports | Per-frame bullets/positions or academic decisions made by game physics |
| Shooter simulation | Movement, auto-fire, enemies, projectiles, collisions, pickups, clocks, lives, boss and action outcome | Network transport, DOM, user accounts, question scoring |
| Shooter level data | Timeline, stable event IDs, paths, attack definitions, scenery markers and checkpoints | Executable narrative/DOM fragments |
| Renderer/assets | Art, animations, effect presentation, draw order | Changing damage, firing cadence or outcomes |
| Shared host + shooter adapter | Input, resize, pause, audio lifecycle, HUD, assisted UI, snapshots and practice/live boundary | Hardcoded new gameplay branches in generic shared UI |
| Narrative cartridge later | Placement, vote choices, briefing and epilogue text | Reinterpreting gameplay as academic mastery |

Suggested future paths (not files created by this specification):
- public/games/aerial-shooter/core.js — pure simulation and collision helpers.
- public/games/aerial-shooter/level.js — authored timeline/paths/checkpoints.
- public/games/aerial-shooter/adapter.js — create/step/render/HUD/assisted/media contract.
- public/games/aerial-shooter/render.js — renderer and animation selection.
- public/games/aerial-shooter/tuning.js — versioned numeric parameters.
- public/aerial-shooter-practice.html — owner review entry.
- public/assets/aerial-shooter/ — manifests, sprites, scenery and audio.
- src/games/aerial-shooter.js — proposed live run validation/window helpers.
- test/aerial-shooter*.test.mjs — invariants and integration checks.

Path names are proposed, not an assertion about existing directories. Keep modules small and specific to this game; do not build a generic editor or abstract all current minigames.

### 5.2 Host changes

Introduce declarative capabilities with legacy defaults: logical dimensions, movement style, utility buttons, map availability, idle kit text, pause/result wording and recovery behavior. Shooter has no map requirement and no manual-fire button. Retain existing games' profiles and behavior.

Clear simulation accumulators on pause/resume/rotation; never execute a large backlog on return. A slow frame must not shorten the active-time budget silently. Separate monotonic active elapsed time from fixed physics substeps; if catching up would exceed the safe processing bound, pause locally with a performance message. The authoritative shared window continues. This requires performance testing; it is not solved merely by clamping delta time.

Proposed pure API: createRun(config, snapshot), step(state, normalizedInput, dt), snapshot(state), restore(config, snapshot). Adapter wraps these in the current host interface. State uses plain serializable values; randomness is seeded and its state is saved. No Date.now, DOM, timers, asset fetches or audio calls inside the pure simulation.

### 5.3 Rendering and input

Normalize up/down/left/right into a unit movement vector; opposing directions cancel. Apply Agility once. Clamp the collider inside the playfield. Aircraft bank visually without changing aim.

Touch: fixed cross D-pad; adjacent edge/corner detection must permit one-thumb diagonal movement and gliding between directions, alongside normal pointer cancellation. Keyboard: arrows/WASD, Escape to pause. Auto-fire starts only in active action play and stops under any pause, overlay, assisted/terminal state or background interruption.

D-pad buttons at least 56 CSS pixels. Preserve touch scrolling outside gameplay. Add Reset controls, Pause, Sound and Controls utilities without covering targetable space. HUD shows health/max health, remaining lives, remaining active time, current bonus/time and boss component health during that encounter. Use readable HTML text, not rasterized labels enlarged from the art buffer.

## 6. Clocks, lives, state transitions and recovery

### 6.1 Three independent time concepts

| Clock | Advances when | Can rewind/reset? |
| --- | --- | --- |
| Individual active elapsed | Unpaused action simulation; instant recovery belongs to the same run | Never decreases; 180 seconds maximum |
| Level progress | Action simulation, controls wave/scenery position | Rewinds only to checkpoint: 0, 90 or 135 seconds |
| Authoritative shared window | Server elapsed time since team action stage opens, excluding teacher pauses | No reset from a student action, restart, reconnect or late Start |

Display the smaller remaining opportunity when the shared deadline is sooner than the student's active allowance. Practice uses the 180-second run but no live classroom deadline by default; a clearly labeled harness may test shared-window behavior.

Checkpoint acquisition is monotonic: crossing 90 locks midpoint; crossing 135 locks boss. The corresponding wave is not re-spawned twice in the same checkpoint attempt. Attempt number increases on each life lost while run ID stays constant. Entity IDs combine authored event ID, actor index and attempt number; pickup opportunity IDs do not include attempt number.

### 6.2 Damage and respawn

Approved health is 100 or 150 with Armor; standard/heavy damage is 10/20. Damage is ignored until the one-second hit-protection interval ends. A bullet is consumed on collision even when the player is protected. Aircraft-body collisions do not destroy the enemy or let the player farm damage; apply the same protection gate and gently separate bodies along the smallest overlap.

Proposed respawn handling:
1. Decrement lives. If none remain, terminal defeat.
2. Otherwise move the player to the checkpoint start (horizontal center, lower safe area).
3. Restore full approved max health; retain permanent upgrades; clear temporary effect, enemy projectiles and transient effects.
4. Rebuild the checkpoint's enemy/timeline state. Reset boss/guns/escorts when recovering at boss.
5. Preserve cumulative active elapsed, checkpoint, lives consumed, collected opportunity IDs and counters.
6. Grant two seconds of respawn protection; apply only visual death effects that do not block control or add uncounted play time.

Reload/reconnect is not death: restore the latest valid state without a free heal, ammo/bonus refill, extra life or timer reset. An unavailable/corrupt snapshot must show a recovery limit and offer teacher/assisted handling, not silently start a fresh classroom run.

### 6.3 Proposed terminal precedence

Existing accepted server terminal state always wins. At the start of a command/tick, an expired shared window closes unfinished records neutrally. For a local fixed step allowed to run:
1. Apply simultaneous damage and pickup events using stable entity order.
2. If player health is depleted, consume a life and either respawn logically or mark exhausted-life defeat.
3. Exhausted-life defeat takes priority over simultaneous boss destruction.
4. Otherwise boss destruction yields success.
5. Otherwise active elapsed reaching 180 seconds yields lesser escape for the living/recovered player.

This avoids arbitrary dependence on iteration order. The simultaneous last-life/boss case is the approved initial fairness rule in TD-10.

Terminal states are immutable. Stop damage, auto-fire, spawning and music transitions at closure. Allow the approved result effect to complete without keeping the playable clock running.

## 7. Proposed balance sheet

All numbers here beyond the approved health/damage/upgrades/durations are initial tuning proposals. Units are logical playfield units; timings are active seconds.

### 7.1 Player and weapons

| Setting | Candidate value |
| --- | --- |
| Player visual size / collider | 28 × 36 / centered ellipse with radii 8 × 12 |
| Movement / Agility movement | 180 / 216 units per second |
| Primary rate / damage | 8 shots per second / 10 damage |
| Weapon-upgrade damage | 15 per primary shot; visibly brighter/heavier firing effect |
| Player projectile speed | 420 units per second upward |
| Spread | Center stream at normal damage plus two streams at ±15 degrees, half damage each |
| Rapid fire | 12 shots per second; damage per shot unchanged |
| Wingman | One follower offset laterally; 8 shots per second at 5 damage |
| Upgrade interaction | Weapon multiplier ×1.5 applies to all friendly projectile damage; no hidden double multiplication |
| Repeat-hit rule | One projectile hit per target component per volley; projectile is consumed on hit |
| Score | No new score/leaderboard system in this version; bounded counters for balancing only |

Damage can use half-unit integer storage to represent 7.5 exactly. Visual twin tracers may represent one damage event; art must not accidentally double the DPS.

### 7.2 Enemies

| Enemy | HP | Path/movement | Attack candidate |
| --- | ---: | --- | --- |
| Fighter | 20 | Three-plane V/stagger, downward at 55 units/s | Two straight bullets 0.3 s apart; 2.4 s cycle, bullet speed 85 |
| Interceptor | 30 | Downward at 42 units/s, sine horizontal weave of amplitude 55 | One aimed bullet at sampled player position every 2.2 s, speed 100 |
| Bomber | 100 | Slow downward pass at 25 units/s | Five heavy bullets in a ±32-degree fan, speed 65, 3.2 s cycle |
| Ship/shore turret | 80 | Moves with scrolling surface | Aim indicator 0.65 s, then three aimed ordinary bullets 0.2 s apart; 3 s cycle, speed 85 |
| Supply carrier | 60 | Slow, visible center/quarter-lane pass | At most one straight ordinary two-bullet volley every 3 s |
| Boss left/right gun | 240 each | Fixed on moving boss body | Alternating five-bullet ordinary fans, 1.8 s between gun attacks |
| Boss core | 600 | Exposed only after both guns are destroyed | Seven-bullet heavy sweep over 1.1 s, then at least 1.7 s recovery |
| Boss escorts | 20 each | Paired fighters | Reuse fighter attack; no special rules |

All aircraft contact damage is 20. Bomber/core heavy bullets deal 20; other hostile projectiles deal 10. Small ordinary bullets cannot visually resemble the heavy type. No enemy projectile homes after release.

Baseline primary DPS is 80 if every shot hits. Boss nominal damage requirement is 1,080, or 13.5 seconds of uninterrupted perfect-hit fire. That is a tuning calculation, not evidence that real players can finish: gun alignment, phase transitions, escort diversion, damage avoidance and shot travel reduce effective attack time. Verify actual baseline completion within the 45-second no-death boss section.

### 7.3 Fairness and population limits

Minimum 0.75-second readable entry before a new enemy attacks; at least 0.65-second heavy/aimed attack warning. Do not fire from outside the visible field. Player movement at baseline must leave a traversable gap in every pattern.

Candidate caps: 8 ordinary airborne enemies plus boss, 4 surface turrets, 64 hostile projectiles, 96 friendly projectiles and 40 cosmetic particles. Bound each effect's lifetime. Schedule waves to remain under caps. If an unexpected cap conflict occurs, defer a lower-priority ordinary volley and log it in practice diagnostics; never drop the boss, supply carrier or objective silently. Repeated cap deferrals mean the authored schedule needs correction.

## 8. Authored level schedule

The approved bands are fixed. Exact events below are proposed authored content for review under TD-10. This is deliberately reproducible level data, not arbitrary random spawning. Optional left/right mirrored variants may be added only after the baseline version passes.

Scenery scroll candidate: 36 units/s before and during the boss. Decorative layers can use separate parallax speeds. Scenery never controls collision or spawn timing. Bottom is downstream; player faces north/up.

Lane centers at x = 110 (L), 320 (C), 530 (R); offset formations may use x ±45 around their anchor. Units refer to the 640 × 360 field. Enter from y = -40 except signaled side entries; exit below y = 410. Surface objects spawn above the field and pass through the scenery layer.

| Progress s | Event ID | Authored event |
| ---: | --- | --- |
| 0 | intro | Ocean begins; clear field and steering instruction. |
| 4 | f01 | Three-fighter V, center. |
| 13 | f02 | Three staggered fighters, left anchor. |
| 21 | f03 | Three staggered fighters, right anchor. |
| 25 | supply-spread | Yellow medium carrier in center; spread opportunity SPREAD-1. |
| 31 | i01 | Two weaving interceptors, left/right. |
| 39 | f04 | Three-fighter V, center. |
| 45 | supply-repair-a | Yellow carrier on left quarter; repair opportunity REPAIR-1. |
| 50 | t01 | One ship turret on right. |
| 57 | t02 | One ship turret on left, firing staggered from t01. |
| 65 | supply-rapid | Center carrier; rapid-fire opportunity RAPID-1. |
| 71 | b01 | One armored bomber, center. |
| 77 | f05 | Fighter pair, left/right; no spawn inside surviving bomber. |
| 84 | i02 | Two interceptors; wave exits/clears before midpoint opening. |
| 90 | checkpoint-mid | Harbor begins, lock checkpoint; clear warning interval. |
| 93 | t03 | Shore turret on left. |
| 100 | supply-repair-b | Center carrier; repair opportunity REPAIR-2. |
| 105 | i03 | Two interceptors weaving from opposite quarters. |
| 112 | t04 | Shore turret on right. |
| 116 | f06 | Three fighters; last normal combat wave. |
| 120 | coast-exit | Transition to open harbor mouth; no new ordinary wave. |
| 125 | supply-wingman | Center carrier; wingman opportunity WINGMAN-1. |
| 132 | boss-warning | Three-second visible/audio boss approach cue. |
| 135 | checkpoint-boss | Lock boss checkpoint; boss enters. |
| 143 | escorts-a | First fighter pair, scheduled into a safe boss firing interval. |
| 150 | supply-repair-c | Side-quarter repair carrier; REPAIR-3, avoid blocking a boss-gun lane. |
| 163 | escorts-b | Second fighter pair; avoid the densest core sweep. |
| 180 | individual-limit | No-death reference only: actual closure uses cumulative active time. |

Each supply time denotes carrier entry, not guaranteed collection. A carrier stays available until destroyed or it naturally exits. A spawned pickup drifts at 20 units/s and lasts eight active seconds. Spawn positions must keep the first few seconds of a pickup reachable at baseline speed. Boss and ordinary enemy hazards cannot cover every route to a pickup.

Before the boss, retire remaining ordinary combat enemies and their shots through a visible retreat/clear transition during the warning interval. Resolve any unclaimed wingman carrier/drop explicitly: proposed carrier exits by boss entry, but its already dropped pickup remains until its normal expiry. Do not delete an uncollected visible pickup without explanation.

Checkpoint recovery reconstructs events at or after 0, 90 or 135. Supply opportunity IDs remain stable: a collected opportunity does not re-drop; a missed opportunity may reappear when its event is replayed. A full-health repair consumes its opportunity.

## 9. Boss design and attack schedule

Four propeller engines are decorative propulsion units; exactly two outer wing guns are destructible targets. Separate hitboxes, art and health indicators. The main body cannot be damaged during the gun phase; feedback must communicate this clearly, without suggesting missed input.

Candidate boss placement: width 440, height 130, centered near (320, 88), with a slow ±35-unit lateral oscillation. Wing guns sit at local offsets approximately ±180, +5. The core weak point sits on the forward/lower fuselage. All weak points must be reachable by forward fire from the playable area, without requiring body contact.

- Entry: 2-second motion, attacks suppressed. Player can position.
- Gun phase: left/right fans alternate; destroyed guns stop firing immediately. A final surviving gun keeps its own cadence rather than doubling to compensate.
- Transition: 1-second visible armor break/weak-point exposure; clear the preceding fan pattern if needed for readability.
- Core phase: one telegraphed sweep followed by a recovery gap, repeated. No bullet reversal/homing.
- Escort pairs use authored opportunities but may wait up to three seconds for a recovery gap. If no safe slot exists, fix the schedule in tuning rather than creating an unavoidable compound attack.
- Boss defeat ends the combat result immediately and clears hostile shots/escorts. A short explosion/escape presentation may play after the terminal result; it awards no extra combat time or points.
- Checkpoint recovery restores all boss components. Player loadout and spent supplies persist; temporary bonus does not.

No infinite reinforcement loop is included. Boss HP does not scale with acquired upgrades, lives left or recent damage.

## 10. Mathematics, practice and assisted route

### 10.1 Entitlement contract

Live run loadout must originate from the session engine. Required work opens one equipment slot; completing each prescribed optional block opens another, maximum three distinct items. All targeted students complete their assigned block under existing MathQuest mathematics rules. Correctness, attempts and hints remain academic evidence.

The shared team recommends/marks ready/confirms equipment through the existing process. The confirmed loadout applies to each eligible student's independent run. Switching to assisted mode, replaying a checkpoint or collecting a temporary bonus cannot earn an equipment slot.

New teacher setting: “Questions for each extra upgrade.” Show the actual N before a team starts a block. When ordinary gate loads all equal N, use that known value. When they differ, do not infer a mean: require an explicit teacher value for the shooter before extra preparation can be offered. Respect existing question availability and reuse controls. Do not hardcode three as an invisible fallback.

The effect of teacher changes applies to future blocks only; a started block keeps its pinned assignment count. Freeze loadout before the first team's action start under the platform's run-configuration rules.

### 10.2 Practice entry

One hosted entry opens without a classroom room or mathematics. Show game version, level revision, source checkpoint and “Practice — no classroom evidence.” It may let the owner simulate all eight upgrade combinations and restart freely. These controls must never be exposed as live entitlement controls.

Owner practice uses the same level, assets, controls, audio and physics as live play. Optional diagnostic toggles show colliders/timing/entity count only in development mode. Do not silently grant invulnerability. On phones, Start, Pause, Sound, Controls and Restart remain available without a keyboard.

### 10.3 Assisted sequence proposal

Choose assisted play before Start or switch once from an active run after a clear explanation. Preserve run ID, academic evidence, loadout and shared deadline; switching cannot reopen a terminal action result.

| Step | Proposed prompt and interaction | Feedback |
| --- | --- | --- |
| 1 | Three aircraft/route cards: choose the route outside the marked turret firing lane. | Explain that the turret covers the marked lane; allow retry. |
| 2 | A static bomber fan: choose the marked gap between shots. | Explain waiting for/using the gap; allow retry. |
| 3 | Boss diagram: choose an active wing gun before the protected center. | Explain the exposed-target sequence; completion is assisted, not a recorded combat boss kill. |

Use plain text alternatives for all figures and keyboard/touch selection. No countdown demanding a quick answer; the shared classroom window remains visible and teacher-controlled. Completion records assisted_completed. There is no academic penalty for a wrong tactical choice and no hidden question-score update.

## 11. Production art and audio contract

### 11.1 Approved reference

The corrected concept board is the visual baseline. Reference image provenance: exec-a9904eb5-4acb-48b9-8c69-dc3701b4cbef.png; 1536 × 1024; SHA-256 951ee024a5572557971b49b3e6751625757025df52aaebca66937663cc9c9e2a. It was inspected in this conversation and approved by the owner. It is concept art, not a playable screenshot or an atlas. The binary is not included in this documentation commit.

Preserve its silver/blue player, olive fighter, charcoal/orange interceptor, gray-green bomber, yellow supply aircraft, burgundy/cream boss, deep ocean, turquoise shallows and warm harbor palette. Preserve distinct silhouettes and four engines versus two gun pods. Essential text stays outside imagery.

Production sprites must be separately authored using the approved reference, with transparent backgrounds, shared pivots, consistent scaling and deliberate animation frames. Do not crop the concept board into supposed finished sprites. Keep exact hit geometry in data, independent of transparent padding.

### 11.2 Candidate asset inventory

| Family | Required assets / states | Candidate logical display size |
| --- | --- | --- |
| Player | Neutral, bank left/right; four propeller phases each; optional weapon muzzle layer; damaged smoke overlay | 28 × 36 |
| Fighter | Neutral and slight banks; propeller loop | 28 × 32 |
| Interceptor | Left/right bank and neutral; propeller loop | 30 × 34 |
| Bomber | Twin propellers; normal/damaged overlay | 56 × 48 |
| Supply plane | Propeller loop; visible carrier stripe; separate S/R/W/repair badge | 48 × 44 |
| Wingman | Friendly palette, propeller/bank variants | 22 × 28 |
| Boss | Four propeller loops, two intact/destroyed gun layers, closed/open/damaged core, smoking/destroyed state | 440 × 130 |
| Surface enemies | Gunboat hull/wake; shore emplacement; aiming turret, muzzle flash, destroyed state | 64 × 80 / 48 × 48 |
| Projectiles | Friendly normal/upgraded/spread; hostile normal/heavy; no identical silhouettes for different damage classes | Tuned to collider/visibility |
| Pickups | Spread, rapid, wingman and repair icons with shape/letter distinction, short pulse cycle | 18–24 square |
| Effects | Small/large explosions, hit spark, smoke, engine trail, water splash; short bounded animations | Varied |
| Scenery | Seamless ocean layers, island tiles, shallow-water edges, harbor/docks/buildings and distant details | Chunked scrolling layers |
| Assisted | Three static tactical figures with text alternatives | Responsive cards |

Candidate delivery: transparent PNG atlases plus explicit rectangle/pivot metadata; compressed local background images; small palettes with crisp edges. Retain editable/full-resolution source assets and original prompts/provenance in the project when creating production deliverables. Manifest fields include asset ID, path, revision, dimensions, frame rectangles, pivot, role, source/provenance, checksum, preload group, fallback and byte count.

Draw order: ocean → ground/scenery/turrets → shadows → aircraft → projectiles/pickups → bounded effects → independent HTML HUD. Reduce background contrast near hazards if readability suffers; do not remove gameplay objects to claim performance.

### 11.3 Audio

Approved: flight theme, separate boss theme, low volume and optional sound. Candidate music loops: 60–90 seconds flight, 45–60 seconds boss, with short outcome cues. Original sound palette: propeller/engine ambience, primary fire, upgraded fire, rapid fire, enemy fire, heavy shot, hit, explosion, repair, bonus, checkpoint, boss warning, victory, lesser escape and defeat.

Store local Safari-decodable audio and manifest every cue. Start/resume only following supported user interaction. Stop or suspend loops under local/teacher pause and backgrounding. Repeated polling, respawn or re-entry cannot layer duplicate music. Distinct gameplay cues must remain recognizable under music; cap simultaneous effect voices. Missing audio shows a useful status and never blocks gameplay.

## 12. Run records, authority and lifecycle

### 12.1 Proposed snapshot contents

Config identity: engine, game, level, tuning and asset revisions; run/team/student IDs; seed; mode; loadout; difficulty Standard; stage/phase ID. All are pinned by the live run issuer.

State: activeElapsedMs, levelProgressMs, attemptIndex, checkpointID, livesRemaining, health/maxHealth, player position/movement, shot cooldown, hit/respawn protection remaining, temporary type/time, enemies and bullet states, spawned event cursor/set, boss components/phase, collected opportunity IDs, PRNG state, assisted step, terminal outcome/reason.

Evidence counters: deaths, shots, successful hits, damage events, pickups collected/missed, boss component kills, mode-switch time, maximum level progress and active time. Counters remain bounded and monotonic where appropriate. Store no unnecessary free-text player data.

Snapshots must include enough state to restore pending spawns, attack cooldowns and pickups faithfully. Do not serialize only health/position and claim full recovery.

### 12.2 Commands and validation

Reuse the platform's credential and command envelope. Use a distinct phase/game identity with start, progress, life_lost/checkpoint, assist and complete events. Exact command names can fit the existing router but must not route through Nightfall's health/ammo/task validator.

Every command includes stable command ID, run ID, pinned config revision, monotonic sequence and active elapsed. Validate roster/authorization, current stage, allowed modes/outcomes, bounded quantities, nondecreasing deaths/time/collected IDs, valid checkpoint resets and no impossible bonus/life/health creation. Legitimate full-health increases occur only through approved repair or validated life loss; Armor is frozen. A death resets level progress without resetting cumulative active time.

Client gameplay remains reported engagement evidence, not a server-replayed anti-cheat guarantee. Academic checking stays server/provider owned.

Snapshot at start, checkpoint, life loss, pickup, assistance switch, completion and a bounded heartbeat (existing host baseline is five seconds; coalesce transient updates). No per-frame transport. Retries reuse command IDs. Completion cannot be lost because a progress update overwrote its queue entry.

### 12.3 Reconnect, closure and deletion

Server terminal state overrides cached active snapshots. On reconnect, reconcile run/revision/status before enabling Resume. Stale events cannot reopen a closed window, reset a boss after terminal victory or refill lives.

Proposed outage behavior: show disconnected status promptly; pause local gameplay after 30 seconds without service contact, retaining its latest local snapshot. Shared deadline continues. On return, if the authoritative phase is open, offer explicit Resume; if closed, show its recorded neutral closure reason.

Individual active timeout is escape_lesser. Shared deadline is window_closed, with started/not-started retained. Teacher advancement is teacher_advanced. Teacher ending the room is session_ended. Accessible result is assisted_completed. Do not collapse these into combat defeat.

Register new local records with the platform privacy/deletion registry. Visible delete-current-practice and clear-practice controls, plus existing authorized room/group deletion, must remove shooter state without unrelated records. Destructive deletion needs clear scope, Cancel/confirmation and recovery guidance. Verify persistence after reload and fresh starts afterward. No real user records are to be deleted as a development shortcut.

## 13. Acceptance and verification plan

All gameplay/device/deployment checks below are **Not run** at this documentation checkpoint.

| ID | Required check | Evidence to retain |
| --- | --- | --- |
| V-01 | Fixed-step determinism with the same seed/config/input; save/restore continues identical events | Automated trace comparisons |
| V-02 | Diagonal normalization, bounds, touch glide, multitouch/cancel/blur/rotation; auto-fire blocked by overlays | Automated invariants plus real touch recording |
| V-03 | Health 100/150, damage 10/20, hit protection, three lives, checkpoint acquisition and full-health recovery | State-transition cases and screenshots |
| V-04 | Active clock never rewinds; level clock rewinds correctly; repeated Start/reload cannot refill time/lives | Boundary traces around 90/135/180 seconds |
| V-05 | Boss guns independently stop, core locks/unlocks, reset is complete, escorts fire in readable windows | Component/phase checks and full playthrough |
| V-06 | All six authored supplies appear; collected IDs survive deaths; missed/full-health/expiry behavior matches contract | Timeline report plus replay cases |
| V-07 | All eight loadout combinations; no/all upgrades; firing rate/damage multiplication; one bonus replaces another | Numeric checks plus selected human playtests |
| V-08 | Standard baseline weapon can defeat boss; all upgrades help; no unavoidable attack combination | Recorded baseline/upgraded runs and human feedback, not only a perfect bot |
| V-09 | Individual victory/escape/defeat, simultaneous terminal cases, assisted result, teacher/window closure remain distinct | Result/CSV/JSON fixtures and live harness |
| V-10 | N from equal gates, unequal gate validation, teacher edits, all-member completion, entitlement survives reconnect | Teacher + multiple student flow |
| V-11 | Shared five-minute window, teacher pause, late start, absent device, disconnect/rejoin and duplicate commands | Server fake-clock tests plus real session flow |
| V-12 | Snapshot restores entities/cooldowns/pickups, malformed/old snapshots fail visibly, terminal state wins | Recovery/revision tests |
| V-13 | Sound starts on gesture, mute works, music changes once, no duplicate loops after pause/respawn/restart | Real iPhone/iPad audio checks |
| V-14 | 667 × 375 candidate layout plus primary iPhone and actual school iPads; safe areas/chrome/rotation | Device/model/OS/browser/viewport screenshots |
| V-15 | Phone background/lock/return; no hidden damage, time jumps, stuck inputs or silent live restart | Real-device interruption test |
| V-16 | Stress scene: boss, escorts, repair, most demanding bonus and effects; 60 fps target, 30 fps floor | Per-device frame/memory/asset measurements |
| V-17 | No repeated >50 ms ordinary-play stalls or growing memory/listeners/audio across three restarts | Performance profile with environment |
| V-18 | Practice never sends classroom evidence or grants live upgrades | Request-log check |
| V-19 | Missing/corrupt art/audio; loading/retry/assisted path is usable | Network failure cases |
| V-20 | Delete/cancel/clear/reload/recreate; unrelated data preserved | Scoped fixture checks, no real-data destruction |
| V-21 | Vault Seven, Nightfall city and First Response retained after shared-host changes | Existing regression suite plus affected UI workflows |
| V-22 | Actual hosted version/assets/cache and practice access on Wi-Fi/mobile connection | HTTPS URL, exact source SHA, downloaded asset identities |
| V-23 | School teacher/student network and approximately 23-iPad classroom trial for integrated release | Actual observed concurrency/device report |

Not every mathematical result needs retesting for a standalone practice module. Shared math entitlement or reporting changes do require targeted end-to-end checks. Do not copy unrelated assessment/export constraints into this game.

A perfect scripted run proves only feasibility under that input. It does not establish appropriate difficulty, actual touch usability or classroom readiness. Record Passed / Failed / Not run / Not applicable with evidence and the exact tested candidate.

## 14. Ordered implementation and release checkpoints

| Stage | Concrete output / gate |
| --- | --- |
| Design review | Approve/amend §3 proposals; identify primary devices and any remaining product conflicts. |
| CHANGE SPEC checkpoint | Preserve this document, decision history, brief linkage and reference identities. |
| IMPLEMENT A | Pure simulation, exact level data, state/timer/recovery rules, basic practice controls. Temporary collision shapes are development aids only. |
| CHECKPOINT A | Commit identifiable engine candidate before extended debugging. |
| VERIFY A | Deterministic/timer/life/pickup/terminal tests; advance only when the engine contracts behave correctly. |
| IMPLEMENT B | Approved production art, full animation/audio, responsive practice and assisted route using the same simulation. |
| CHECKPOINT B | Preserve playable art-complete candidate; publish an identified owner preview through established hosting when authorized for that iteration. |
| VERIFY B | Complete phone/iPad review, baseline/upgraded balance, audio, interruption, loading and performance checks. |
| IMPLEMENT C | Session adapter and harness: entitlements, shared window, recovery, reports/privacy. No invented final narrative. |
| CHECKPOINT C / VERIFY C | Preserve and test matched frontend/backend candidate; regress existing cartridges and integration workflow. |
| VERIFIED CHECKPOINT | Commit exact bytes that passed their declared verification scope, with evidence; do not upgrade “practice verified” to “classroom verified.” |
| RELEASE | Version manifests, README/release notes, packaging and deployment materials only; no new features. |
| DEPLOY | Verify actual hosted frontend and required Worker revisions, entry assets, caches and phone access. Classroom rollout awaits approved narrative integration and school checks. |

Do not merge this design branch onto a live frontend as a side effect of preparing documentation. Candidate previews must be clearly labeled and must not replace a verified classroom release silently. Existing service/address architecture stays in place. ZIP/upload/final-response failure must be recovered from preserved checkpoints, not by rebuilding verified gameplay.

## 15. Completion criteria and remaining limits

The design package is complete as a reviewable implementation specification: approved requirements, candidate engine architecture, level schedule, combat/pickup values, asset list, recovery and classroom contracts, and verification gates are explicit.

It is not yet an approved implementation checkpoint. The outstanding decision is review of §3 and its detailed candidate values; the owner has not separately approved those newly specified technical defaults. Final narrative identity/placement and physical device support remain later explicit work. Actual production assets, playable code, mobile tests, hosting and classroom integration are not delivered by this document.

When implementation begins, retrieve the canonical source again and record the new exact starting commit. If other MathQuest work has advanced main, reconcile this specification with that source instead of overwriting it or importing unrelated minigame decisions.
