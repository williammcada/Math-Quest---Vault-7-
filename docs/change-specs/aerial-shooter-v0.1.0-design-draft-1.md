# MathQuest aerial shooter — v0.1.0 design draft 1, revision 2

**Date:** 30 September 2026 (Asia/Shanghai)  
**Revision 2:** records the owner's 21:26 approval of timer, respawn and damage rules; adds a proposed encounter design for review.  
**Status:** DESIGN — accepted decisions and unresolved design questions; not an implementation-ready change specification.  
**Working identifier:** aerial-shooter; final cartridge title and narrative remain open.  
**Owner:** William McAda  
**Canonical repository:** williammcada/Math-Quest---Vault-7-  
**Source baseline inspected:** `7ac12fb98f7ccda591be4ee0bd6baa2f0ee81c28` — merged MathQuest v0.9.4 candidate. This is source identity, not proof of the live deployed version.  
**Design branch:** `design/aerial-shooter-v0.1.0`  
**Parent brief:** [MathQuest Project Brief](../PROJECT-BRIEF.md)

## 1. Scope and workflow

Design one satisfactory aerial-shooter level before implementation. Settle mechanics, enemy and boss patterns, wave schedule, upgrade/drop contracts, art and animation requirements, audio, device layouts, integration and verification in advance. Ask Will about unresolved design decisions rather than silently inventing them.

Build a new action simulation compatible with MathQuest, with narrative added later. A WWII test-plane escape is a possible narrative, not an approved complete story. This is separate from other proposed MathQuest minigames, including the side-scrolling platform shooter and multiplayer brawler.

Follow DESIGN → CHANGE SPEC → IMPLEMENT → CHECKPOINT → VERIFY → VERIFIED CHECKPOINT → RELEASE → DEPLOY. This document records the DESIGN stage only. Source changes, assets, a playable build, tests and deployment are not delivered by this draft. Preserve accepted decisions in a later versioned implementation specification and update the parent brief when the implementation scope is settled.

## 2. Consulted handbook and project records

Handbook repository baseline: `00cbde605ab08203b6b5fd2374d225155608fc29`.

Read during design intake:
- `AI-START-HERE.md`
- `UNIVERSAL-RULES.md`
- `CONDITIONAL-STANDARDS.md`, especially S-02, S-03 and S-04
- `RELEASE-CHECKLIST.md`
- `PROJECT-MAP.md`

Apply MathQuest's adopted U-01–U-08 principles within their documented scope; preserve the distinction between the handbook's seeded/draft material and approved rules. U-09 is explicitly approved and applies to any saved work/progress within this feature's scope. No handbook amendment or new universal requirement is made here.

Project source and documents inspected:
- `README.md`, `docs/PROJECT-BRIEF.md`
- `schema/CARTRIDGE_V09_CONTRACT.md`
- `schema/CARTRIDGE_ASSET_CONTRACT.md`
- `docs/RUNTIME_CONTRACT_v0.6.md`
- `docs/ART_PROVENANCE.md`
- Shared architecture/input/result/performance sections of `docs/specifications/MathQuest_v0.9_Technical_Specification.md`
- Relevant portions of `docs/change-specs/v0.9.2.md` and `v0.9.4.md`, including iPhone requirements, equipment acquisition, future-cartridge principles and scope of timing/retry exceptions
- `public/engine/game-host.js`, `public/engine/controls.js`
- `src/engine/equipment.js`, `src/engine/extensions.js`, `src/engine/supply.js`, relevant `src/worker.js` sections and `public/engine/teacher-tools.js`

The old asset/runtime contracts describe historical reference implementations. Do not promote their particular world sizes, audio arrangements, timers or mechanics into new shooter requirements.

## 3. Accepted gameplay direction

| Topic | Owner decision |
| --- | --- |
| Camera and scrolling | Top-down view; aircraft flies upward through an automatically scrolling battlefield. |
| Movement | Free movement around the playable area, primarily forward shooting. |
| Aircraft | WWII-style propeller planes. |
| Art | Arcade pixel art. |
| Environment | Ocean, islands and possibly a coastal city for the first level. |
| Duration | 180 seconds cumulative active play across all three lives. Checkpoint recovery does not refill the clock. |
| Firing | Automatic primary fire. |
| Touch controls | Familiar Mega Man/Chrono Circuit-style touchscreen controls. Proposed interpretation is a fixed cross-shaped directional pad with diagonal movement. |
| Health | Health bar supporting approximately ten normal hits or five heavy hits at baseline. |
| Lives | Three lives total (initial life plus two replacements), with midpoint and boss checkpoints. Before the midpoint, return to the beginning. Restore full applicable health and earned upgrades, clear temporary bonuses, and preserve claimed-pickup history. |
| Boss | Large enemy aircraft in the final section, supported by smaller aircraft. |
| Time expiry | If the player is still alive and the boss survives at the time limit, count an escape with a lesser individual outcome. |
| Ordinary enemies | Formation fighters, weaving interceptors, tougher bombers, and ship/coastal gun turrets. |
| Supplies | Planned pickup opportunities from visually prominent medium enemies. |
| Temporary shooting bonuses | Exactly one planned opportunity for spread shot, one for rapid fire, and one for a wingman in this level. |
| Healing | Health pickups at several planned opportunities from destroyed enemies; exact count, amount and schedule remain open. |

Three lives belong to this cartridge's one classroom run. They do not authorize unlimited new runs or change other cartridges' attempt policies.

## 4. Mathematics and preflight upgrades

Owner selected the Nightfall preparation structure:
1. Required mathematics leads to the first equipment choice.
2. An additional prescribed question block unlocks a second distinct upgrade.
3. A further block unlocks the third distinct upgrade.
4. Teacher controls the question workload.
5. For this shooter, each additional upgrade block should use the fixed questions-per-gate amount prescribed by the teacher.

Use a maximum of three distinct preflight upgrades with one tier each. Additional permanent upgrades require extra mathematics. Temporary in-flight shooting bonuses and repair pickups are separately authorized gameplay items; they do not unlock permanent upgrade slots.

| Upgrade | Accepted initial tuning | Presentation/limits |
| --- | --- | --- |
| Agility | Movement speed +20% | Changes player movement, not battlefield scrolling or enemy speed. |
| Armor | Maximum and starting health +50% | Health bar must communicate the increased capacity. |
| Weapons | Weapon damage +50% | Visibly different projectile/firing animation. |

The percentages were accepted as initial tuning and may be adjusted after playtesting. Do not secretly compensate by increasing enemy strength when an upgrade is selected.

The user selected the standard Nightfall structure; its source uses shared team equipment. Retain that as the inherited interpretation unless the owner requests individual loadout selection. The exact teacher control for matching the upgrade workload to gates needs resolution, because existing gates need not all have equal counts.

### Source finding: question-count linkage is a requested change

At the inspected baseline:
- `equipmentSlots` grants one base slot plus completed equipment blocks, capped at three.
- `equipment.extend` uses `t.supply?.count || 3`; it does not derive the count automatically from normal gate loads.
- `configureSupply` accepts a separate count from 1–20.
- Ordinary gate loads are balanced from total questions and gate count, so they can differ.
- Equipment is selected by team recommendations/readiness and Event Lead confirmation.
- Extra equipment blocks require the targeted team members to complete their assigned questions; academic first-attempt evidence remains separate.

Therefore, describe matching the teacher's normal gate amount as a new shooter requirement, not an existing automatic behavior. Do not redesign the existing cartridges' settings incidentally.

## 5. Outcome separation

Desired shooter result distinction:
- Boss destroyed: full individual gameplay success.
- Time limit reached while still alive with boss surviving: lesser escape outcome.
- All lives exhausted: gameplay defeat; exact narrative wording remains open.
- Teacher closure, disconnection/shared-window closure and assisted completion must retain their own reasons rather than be fabricated as combat defeat or boss victory.

An individual combat/escape result must not overwrite the team's chosen narrative option or alter answer correctness, first-attempt evidence, mastery or academic grades. Later narrative text can acknowledge the personal result while preserving the selected team branch.

## 6. MathQuest requirements carried forward

- Teacher Windows/desktop keyboard support, landscape iPad touch, and landscape iPhone Safari action support.
- Portrait setup/help/navigation and a safe rotate prompt; no clipped apparently playable action view.
- Complete reachable touch controls; simultaneous input; no stuck movement after release, pointer cancellation, blur, rotation or backgrounding.
- Honor safe areas/browser chrome; no action-screen scrolling; readable HTML HUD/instructions.
- Pause freezes unsafe local simulation and clears input/audio correctly. An individual's pause or abandoned device cannot indefinitely extend the team's eventual action window.
- Accessible/assisted completion and classroom/practice separation.
- Hosted HTTPS practice preview with visible build identity, touch restart and actual game mechanics, usable without a room or math gates.
- Local effects/audio with user-gesture activation and mute; threats must also have visual cues. Exact shooter soundtrack/effects remain to be designed.
- Separate academic and gameplay evidence; frozen run configuration; bounded snapshot/event reporting instead of per-frame network traffic.
- Reuse the established repository, Pages frontend, relay/service and credentials architecture. No new hosting provider, multiplayer synchronization, infrastructure rename or paid dependency is authorized here.
- Meaningful upgrade effects; hard but fair gameplay; required completion should remain feasible with baseline equipment as a proposed balance criterion for approval.
- Save/recovery/deletion behavior must conform to applicable platform rules; do not erase actual user records during development.
- Verify actual supported iPhone/iPad models and browser versions. Responsive desktop checks do not establish real-device support.

## 7. Approved recovery, damage and timer rules

Explicitly approved by the owner on 30 September 2026 at 21:26 (Asia/Shanghai):
- Baseline health is 100. Ordinary bullets deal 10 damage; heavy shots and aircraft collisions deal 20. Armor gives 150 maximum/starting health.
- Every damaging hit grants one second of protection from further damage.
- One cumulative 180-second active-play budget covers all three lives. Checkpoint recovery rewinds section progress but never replenishes this budget.
- A late death can leave too little time to reach or destroy the boss. If alive when the budget expires, the player gets the lesser escape outcome.
- Three lives means the initial life plus two replacements. A death with a replacement remaining returns to the latest checkpoint (or the beginning before the first checkpoint).
- Respawn restores full applicable health, retains math-earned upgrades, and clears temporary shooting effects.
- Already-collected supplies remain spent across deaths; checkpoint replay must not grant them repeatedly.
- Exhausting all lives ends the gameplay run as defeat.
- Gameplay outcomes remain individual and do not overwrite the team narrative choice or academic results.

### Details still open

These remain proposals or unresolved implementation contracts:
- A visible supply marker and distinct medium-aircraft silhouette identify each planned carrier.
- Each temporary shooting effect has a clear visible timer; duration, stacking/replacement and damage interactions remain open.
- Defeating an enemy carrier is required for its drop; pickup requires flying through it. Escape/expiry/missed pickup behavior remains open.
- A separate authoritative classroom window may be required in addition to the individual action clock; its duration and pause rules are not yet chosen.

## 8. Remaining design questions and deliverables

Resolve in discussion before declaring the implementation specification complete:
1. Separate cumulative active-time and rewindable level-progress clocks; finalize checkpoint locations, boss-entry logic, death-transition timing and simultaneous terminal-event precedence.
2. Finalize respawn placement/protection and enemy/boss reset details; full health, retained permanent upgrades, cleared temporary bonuses and spent claimed pickups are approved.
3. Finalize aircraft collision separation and treatment of surface objects; aircraft collision damage of 20 is approved.
4. Exact gate-count mapping when normal gates have unequal loads; teacher authority over optional preparation.
5. Enemy statistics, silhouettes, entry/exit paths, fire cadence, targeting rules, warning cues, simultaneous limits and fair escape routes.
6. Boss identity, phases, attacks, escorts, health, weak points and cleanup on success.
7. Authored three-minute timeline: scenery transitions, checkpoint placements, supply carriers, healing drops, temporary-bonus durations and boss allocation.
8. Detailed art board: player/enemy contrast, palettes, sprite sizes, animation frames, bullets, smoke/explosions, background layers, UI icons and asset manifests.
9. Main/boss music, sound-effect inventory, mixing, warning redundancy and mobile audio lifecycle.
10. Playfield shape within landscape screens, control/HUD placement, smallest supported devices and performance stress scene.
11. Assisted route and actual outcome/report fields, reconnect and save lifecycle, teacher controls and shared-window closure.
12. Integration boundaries and exact adapter/host changes; existing host has assumptions that require audit and does not establish that a new game plugs in without work.
13. Acceptance matrix for no/all upgrades, lives/checkpoints, all supply opportunities, timeout/boss/defeat, inputs, audio, interruptions, classroom evidence and existing-cartridge regression.

No tests were run and no support claim is verified for the new shooter. The next work remains detailed design, followed by the agreed change specification.


## 9. Proposed level and encounter design — awaiting owner review

All new choices in this section are proposals, not implied by approval of the three recovery/damage/timer rules. Working level descriptor: Coastal Escape; final title/narrative remains open.

### Two clocks

Use cumulative active run time for the approved 180-second limit and a separate rewindable level-progress clock for scenery, authored waves and checkpoints. The schedule below describes a no-death traversal. A checkpoint replay rewinds only level progress and uses up the remaining cumulative budget. The final boss encounter continues until destruction, terminal defeat or the cumulative limit; it does not exit early merely because the scenery scrolls onward.

| Level progress, no deaths | Setting and encounter | Planned supplies/checkpoints |
| --- | --- | --- |
| 0–25 seconds | Open ocean; first fighters arrive after a short movement lead-in, then alternate left/right formations. | Teach steering, forward alignment and bullet avoidance. |
| 25–50 seconds | Island chain; weaving interceptors cross the field, followed by a readable formation. | Spread-shot carrier at 25 seconds; repair carrier at 45 seconds. |
| 50–90 seconds | Shipping channel; staggered ship turrets fire aimed salvos, followed by an armored bomber and fighter cover. | Rapid-fire carrier at 65 seconds. |
| 90–120 seconds | Coastal harbor; midpoint checkpoint, shore batteries and short interceptor waves alternate rather than attacking all at once. | Checkpoint at 90 seconds; repair carrier at 100 seconds. |
| 120–135 seconds | Harbor exit/open water; final wingman carrier, then a brief lull and incoming-boss warning. | Wingman carrier at 125 seconds; boss checkpoint at 135 seconds. |
| 135–180 seconds | Large enemy aircraft boss with pairs of supporting fighters. | Repair carrier at 150 seconds of no-death level progress; final encounter ends on boss destruction, defeat or cumulative timeout. |

Drop times refer to carrier arrival, not automatic pickup delivery. Each carrier must be destroyed to release its pickup. Three repair opportunities are proposed, each restoring 25 health capped at the current maximum.

### Enemy identities and fair attack patterns

| Enemy | Proposed behavior | Counterplay |
| --- | --- | --- |
| Formation fighter | Three-plane V or staggered line; descends predictably and fires short straight volleys. | Move between lanes or align forward fire early. |
| Weaving interceptor | Crosses on a shallow S path; fires at the player's sampled position, with no midflight bullet homing. | Change direction after the volley is released. |
| Armored bomber | Slow, broad silhouette; telegraphed fan of heavy projectiles with readable gaps. | Use the gap or attack during the interval between salvos. |
| Ship/coastal turret | Scrolls with the surface; visible aim/flash before a limited aimed volley. | Move after aim locks; destroy it or pass outside its firing lane. |
| Supply aircraft | Distinct medium silhouette, bright recognition stripe and an S/R/W/repair icon; slower predictable traversal with limited covering fire. | Prioritize the carrier, then fly through its pickup. |
| Boss escorts | Enter in pairs during defined boss pauses, using the existing formation-fighter behavior. | Clear escorts before the next heavy boss pattern. |

Proposed fairness constraints: visible warnings for fast/side entries; no attacks from invisible enemies; no deliberate ramming homing; preserve an avoidable route for baseline speed; legible hostile bullets distinct from friendly shots and background. Surface ships/buildings are below flight altitude and do not inflict aircraft-body collision damage; their projectiles do. Aerial body collision handling still needs exact contact/separation behavior.

### Boss proposal

An oversized four-engine armored bomber with two destructible wing gun positions:
1. **Wing-gun phase:** alternating fans from the two positions. Destroying one visibly removes that firing source.
2. **Fuselage phase:** expose the central weak point after both guns are disabled; use wider sweeping volleys with deliberate recovery gaps.
3. Supporting fighter pairs appear at bounded intervals, not continuously, and are not simultaneous with the densest boss volley.

Proposed checkpoint recovery resets boss/guns/escorts and hostile bullets to the start of this encounter. The player gets approved full health and retained earned upgrades, but less cumulative time. This boss-reset choice still requires approval. Plan the boss to be beatable with baseline weapon damage in the available no-death encounter time; exact health/fire-rate numbers need a later balancing sheet.

### Temporary bonuses proposal

| Bonus | Proposed duration | Proposed behavior |
| --- | --- | --- |
| Spread shot | 20 seconds | Retains the forward stream and adds two angled streams for wide coverage. |
| Rapid fire | 20 seconds | Increases primary firing rate; exact multiplier is still open. |
| Wingman | 30 seconds | One accompanying friendly plane fires forward; follows the player and cannot absorb damage as a shield. |

Timers run only during active simulation. Permanent weapon damage enhancement continues to apply according to an explicit later damage formula. If effects overlap, the proposed simple rule is that the newly collected bonus replaces the previous bonus; no stacking. Pickups use both icon/shape and color. Their expiry, full-health collection behavior, unclaimed-drop recovery and exact projectile values remain open.

### Art/audio direction proposal

Original arcade pixel art: navy/teal ocean, turquoise shallows, muted green islands, warm stone harbor, and restrained clouds/wakes so hazards remain visible. Player plane: bright silver with blue accents. Enemy fighters: olive/charcoal with distinct silhouettes. Boss: dark burgundy with cream bands for strong contrast. Fictional unit markings, with no commitment yet to particular historical factions or national insignia.

Propose animated propellers, left/right banking, muzzle flashes, hit flashes, progressive boss damage, smoke and layered explosions. Keep HUD and instructions as sharp readable text outside the low-resolution art.

Propose an original energetic arcade flight theme and a distinct boss theme, with separate cues for player fire, enemy fire, heavy fire, hits, destruction, repair pickup, bonus pickup, checkpoint, warning, victory and lesser escape. Audio remains optional and every threat cue has a visible equivalent.

### Next review request

Ask the owner to review the timeline, boss structure/reset policy and timed-bonus/repair package as a proposed design. Review a visual concept board after the overall direction is accepted. Do not treat silence about an unpresented detail as approval.
