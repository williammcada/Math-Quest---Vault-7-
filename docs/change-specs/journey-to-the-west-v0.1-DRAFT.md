# MathQuest: Journey to the West — Design Draft v0.1

**Status:** DESIGN; accepted decisions plus explicitly provisional proposals. Not an implementation specification or release.
**Owner:** William McAda
**Credit:** A WILLIAM MCADA PRODUCT
**Recorded:** 2026-09-30 to 2026-10-01, Asia/Shanghai, through the owner's 08:43 approval.
**Technical companion:** [Source-grounded technical and production draft](journey-to-the-west-v0.1-TECHNICAL-DRAFT.md). Its engineering and tuning proposals are not automatically approved by this decision record.
**Canonical repository:** williammcada/Math-Quest---Vault-7-
**Planning branch:** design/journey-to-the-west-v0.1
**Host source baseline:** main at 7ac12fb98f7ccda591be4ee0bd6baa2f0ee81c28 (merged v0.9.4 candidate).
**New cartridge source baseline:** none; game implementation has not begun.

## 1. Purpose and current authorization

Plan an experimental cooperative arcade brawler for MathQuest, inspired by the gameplay of Golden Axe, The Simpsons arcade game, and X-Men arcade game. Ask the owner about unresolved design choices before building. Complete game, art, enemy, level, multiplayer, and integration design in advance of implementation.

The existing MathQuest repository is the canonical planning home. Its README.md, docs/PROJECT-BRIEF.md, and docs/change-specs/ remain the host project structure. This cartridge draft records local requirements and accepted decisions without changing the host project's current release.

Use DESIGN → CHANGE SPEC → IMPLEMENT → CHECKPOINT → VERIFY → VERIFIED CHECKPOINT → RELEASE → DEPLOY. A source checkpoint, successful build, or concept image is not gameplay verification.

## 2. Accepted decisions and must-retain requirements

1. Property: the classic Journey to the West, with original artwork and dialogue. Modern adaptations are not an asset source.
2. First proof of concept: one three-minute level; expand later only if needed.
3. Maximum five simultaneous players per team, replacing the earlier six-player possibility.
4. Playable roster: Sun Wukong, Zhu Bajie, Sha Wujing, Tang Sanzang, and White Dragon Horse.
5. Nezha is a boss, not a playable sixth character.
6. Detailed old arcade pixel art.
7. Reserve two opening-cutscene positions in the workflow. Narrative and cutscene content will be fitted later. Do not delay gameplay/art design to settle chronology.
8. White Dragon Horse normally fights as a humanoid dragon prince. His special transforms him into a horse that the player can move around.
9. Tang Sanzang may be adapted into an attacking spellcaster. His battle spells are game inventions, not a claim about the novel.
10. Every hero needs a distinct special ability powered by collectible magic. Heroes should be mostly equal in overall usefulness.
11. Magic pickups replenish only the individual player who collects them. The proposed team-wide replenishment was rejected.
12. Provide enough magic for attentive members of the entire team to collect frequently, including through breaking barrels, boxes, and other props. Abundance is required; exact quantities remain tuning proposals.
13. Enemy mix accepted: ordinary melee fighters, leaping attackers, ranged attackers, shield bearers, and charging brutes.
14. Varied enemy entrances accepted: edges, caves, ledges, and breakable barriers. Use readable landing and attack warnings.
15. First-level concept accepted: mountain path, cave ambushes, ruined shrine, open courtyard for Nezha. Brief introductory fights lead into mixed encounters, supply opportunities, and the boss.
16. Meaningful normal and aerial combat; user explicitly wants enemy jumps, jump kicks, ranged attacks, and conventional arcade variety.
17. The owner selected the offered three-lives-with-automatic-respawning option on 2026-09-30 at 21:31. Three lives means the initial life plus two returns. Near-team respawn, life-exhaustion handling, and timer outcomes were subsequently approved in decision 19; exact respawn positioning and protection duration remain open.
18. The owner approved the character appearances in CAST CONCEPT 01 (five heroes plus boss Nezha) on 2026-09-30 at 21:31.
19. End-of-run structure approved at 21:35: respawn near teammates with full health and brief protection; preserve stage/enemy health/time; spectate after all three lives; end on team elimination; surviving players retreat with a lesser gameplay result at three minutes; defeating Nezha earns full victory. Gameplay results remain separate from mathematics accuracy.
20. Multiplayer setup approved at 21:51: one to five human players including solo practice; student choice of unclaimed unique heroes; no AI companions; separate level instance per team; shared enemies/progress/timer; enemy numbers, boss health, and magic supply scale to team size; no friendly fire or teammate blocking; shared play area and camera progression.
21. Personal preparation upgrades approved at 21:57: in response to the shared-team versus individually earned/selected upgrade question, the owner chose "Individual choice." Each student earns and chooses upgrades for their own hero; choices do not grant the same bonuses to teammates. The menu, earning structure, and persistence through respawns were subsequently approved in decision 22.

22. Preparation upgrade package approved at 22:08: choose up to three distinct personal upgrades from Power, Vitality, Magic Reserve, and Focus; required mathematics earns the first choice and each of two optional math blocks earns another; keep upgrades through automatic respawns. Accepted initial balance targets: +20% ordinary/aerial attack damage, +25% maximum health, +1 starting magic charge and +1 capacity, or +20% special damage respectively. Values are starting points for later balancing, not verified balance.

23. Encounter plan approved at 22:26: accept the five-part pacing targets below; Nezha fights alone using a spear combination, returning ring, and signaled fire-wheel rush, combining attacks more aggressively below half health. For a surviving team, begin the boss encounter by elapsed 2:00; if behind, ordinary enemies withdraw and surviving heroes transition to the courtyard with their state preserved. Faster clears can reach Nezha earlier. This is design approval, not implementation authorization or evidence of balance.

24. Character scale revision requested at 22:30: relative to GAMEPLAY COMPOSITION 01, render each of the five player avatars at 90% of its original width and height and Nezha at 110%, maintaining proportions. Applies to in-arena characters, not HUD portraits. Record these as exact production scale targets; a generated preview is illustrative rather than a measured sprite transformation.

25. Revised gameplay composition approved at 22:40 ("Yeah good. Proceed"): use the revised five-player courtyard composition as the visual direction, with player avatars at 90% and Nezha at 110% of the initial composition's scale. Continue design; this is not authorization to bypass the agreed design-before-implementation workflow. Input behavior, precise UI dimensions, and combat mechanics remain subject to the design review below.

26. Combat package approved at 22:54: directional movement plus Attack/Jump/Magic; tap or hold normal combos and airborne attacks; arrows/WASD with J/K/L; the five specials summarized below; start with one magic charge, capacity three, one charge per special, with Magic Reserve adding one starting charge and capacity; target four to six uses per attentive player per full run; keep unused magic through respawns without granting new charges; full meters leave pickups for others. Exact damage and timing remain tuning work.

27. Multiplayer session flow approved at 07:55 on 2026-10-01: students independently complete preparation, choose a character and upgrades, and mark Ready; each team launches automatically with a three-second countdown once all participants are ready; teachers may launch the ready subset, pause/resume one team or all teams, or end runs; the shared clock freezes during teacher pauses; no mid-run new players, but a disconnected player may reclaim their hero/state; teams continue while a member is disconnected; an all-team disconnect pauses briefly then ends as interrupted; starting party size fixes scaling; lagging players are warned then safely returned to the shared play area. Exact reconnect/grace intervals remain open.

28. Cartridge team integration clarified by the owner at 08:02 on 2026-10-01: the brawler is a minigame cartridge inside MathQuest. Students join/form teams as they normally do in MathQuest; the same team enters the cartridge. Do not add separate teacher assignment or a second QR/join-code/team-formation flow. Cloudflare is intended to provide the multiplayer backend for the cartridge; integration with existing team identity and results remains to be designed.

29. Automatic launch limit requested at 08:09 on 2026-10-01: after MathQuest's math gates and relevant decisions are complete and the team reaches the minigame handoff, start automatically as soon as everyone is ready; if a member is absent or unready, allow one minute before proceeding with the ready players. Teacher intervention is not required for this timeout. The assistant recommends this as the default; see the explicit handoff and zero-ready handling below.

30. Optional preparation timing approved on 2026-10-01 at 08:43: optional upgrade questions remain available during the 60-second readiness window, after required gates and relevant decisions are complete. Only completed blocks earn upgrades. Students finish or leave optional work, choose their hero/upgrades and press Ready; everyone ready starts the three-second countdown early, otherwise the deadline starts the ready eligible subset. Optional work cannot delay that deadline.

## 3. Hero mechanics — specials approved; ordinary move details and tuning remain open

| Hero | Proposed ordinary combat | Approved special direction | Intended distinction |
| --- | --- | --- | --- |
| Sun Wukong | Quick staff combinations and spinning aerial strike | Monkey Swarm: two short-lived copies join a coordinated staff assault | Versatile speed and reach |
| Zhu Bajie | Heavy rake sweeps and jumping body slam | Earthshaker: broad damaging knockback shockwave | Heavy impact with slower recovery |
| Sha Wujing | Polearm sweeps and downward aerial strike | River Surge: damaging current pushes enemies back | Reach and crowd control |
| Tang Sanzang | Golden energy pulses and downward aerial burst | Lotus Ward: damage pulse plus brief protection for nearby allies | Effective attacking spellcaster with protective utility |
| White Dragon Horse | Dragon prince with quick sword combinations and aerial lunge | White Horse Charge: temporary player-steered horse transformation | Mobility and directed charge damage |

The five special names and core effects were approved at 22:54, alongside effective normal and aerial attacks for every hero. The ordinary moves in this table remain proposed details; exact timings, damage, and utility limits require specification. The prince's sword is part of his approved visual concept.

Balance proposal: use comparable encounter value rather than identical moves. Every hero must feel useful and have effective free normal attacks. Limit repeated horse-charge hits against the same target. Tang's ranged attacks need practical reach, travel time, and damage limits. His shield must not scale into a mandatory party advantage or allow permanent team protection.

## 4. Magic economy

Accepted: individual collection, frequent opportunities, substantial rewards for investigating and breaking props.

Approved at 22:54:
- One charge per activation; one starting charge; capacity three.
- Magic Reserve adds one starting charge and one capacity (start two, capacity four).
- Target roughly 4–6 special activations per attentive player in a full three-minute run, before the extra starting charge from Magic Reserve. This is a tuning target, not verified balance.
- At full capacity, leave magic available for another player.
- Retain unused charges through automatic respawns; grant no additional charges on respawn.
- Keep collectible magic separate from personal math-earned preparation upgrades.

Supply planning: scale quantities to the starting party size, distribute visible supplies across props and selected enemies, and provide accessible supplies at the boss. Exact placement and quantities remain to be authored and tested.

Do not claim that generous shared-world drops guarantee equitable collection. Students can still take disproportionate amounts. If observation shows monopolization, propose a targeted design revision rather than silently switching to team-wide awards.

## 5. First level and combat proposal

A belt-scrolling arena: travel sideways, move nearer/farther across the ground, jump, attack, and use a special. A shared play area and camera progression, no friendly fire, and no teammate blocking are accepted. Exact camera movement, screen boundaries, and touch controls remain open.

Accepted enemy types:
- Basic fighters: approachable close combat.
- Leaping attackers: visible windup, jump kick, vulnerable landing.
- Ranged attackers: dodgeable projectiles with readable travel.
- Shield bearers: positional counterplay or punish exposed recovery.
- Charging brutes: visible windup, avoid the rush, punish the recovery.

Entrances should create authored encounters, not damage players on spawn. Introduce behaviors before combining them. Approved pacing: opening basics, middle mixed encounters and ambushes, approach encounter and supplies, then Nezha by elapsed 2:00. Detailed timings below are pacing targets; the boss-arrival deadline and catch-up transition are accepted. Exact spawn counts and transition implementation remain open.

Nezha's three signature attacks, solo encounter, and more aggressive combinations below half health are approved below. Health, precise attack timings, vulnerability/stagger rules, and detailed hazard geometry remain to be designed.

## 6. Art and audio planning

Accepted medium: detailed arcade pixel art.
CAST CONCEPT 01 was generated and displayed in this planning conversation, then approved by the owner. It shows five hero panels plus a separate Nezha boss panel, with a small horse-form inset in the dragon prince panel. The image has not been added to this repository; this record preserves its approval and appearance summary.
Proposed visual principles: large readable silhouettes, distinct hero palettes, clear facing/attack silhouettes, subdued scenery behind active threats, restrained overlapping effects.
Approved visual baseline: Wukong has a gold circlet, gold/red clothing, simian features, tail, and gold-banded staff; Bajie has a broad pig-faced silhouette, plum/brown clothing, and rake; Wujing is tall and broad in teal/indigo, with beads and crescent polearm; Tang wears ivory/saffron with a red outer drape and ceremonial headdress, carries a ringed staff, and uses golden lotus-like energy; the prince wears silver-white/pale cyan with small horns, dark hair, and sword, with a white/cyan horse form; Nezha is a youthful red/gold celestial warrior with twin hair buns, flowing sash, spear, ring, and flaming wheels. These appearances are approved as concept direction. Final sprite resolution, proportions at gameplay scale, attack animations, and readable effects remain to be reviewed.

Proposed art sequence:
1. Hero/boss concept lineup — concept direction approved.
2. Gameplay composition at target device proportions.
3. Ordinary enemy designs and entrances.
4. Animation inventory and level/environment assets.

A concept board is not a production sprite sheet, an implemented screen, or proof of animation quality.
Audio, music, boss theme, mute controls, and specific effects require their own design decisions.

## 7. Devices, hosting, and MathQuest integration

Host targets remain the teacher's Windows computer, landscape classroom iPads, and iPhone Safari owner review. Actual compatibility for this new cartridge remains unverified.

Source inspection on 2026-10-01 confirmed normal MathQuest team-code joining, existing student credentials and generated aliases, a GitHub Pages frontend, an HTTP relay, and a Cloudflare QuestSession service. Reuse normal joining. The frontend currently polls every 2.5 seconds; that transport does not supply the proposed combat synchronization. Existing equipment choices and extension checkpoints are team-wide, so personal preparation requires a cartridge-specific host change.

The [technical companion](journey-to-the-west-v0.1-TECHNICAL-DRAFT.md) proposes a Cloudflare BrawlRun Durable Object per team/run with WebSocket combat traffic, while QuestSession continues to own academic progression and authorization. It defines a proposed handoff, readiness lifecycle, authoritative clock, teacher control, reconnect behavior, result return, 48-hour expiry and deletion cascade. The exact WebSocket hostname and school-network feasibility remain unresolved. No hosting/account settings have been changed.

The normal join path currently has no five-member limit. The proposal applies a five-member limit when creating/joining teams for this cartridge, without changing other cartridges. Do not discard extra students silently at the minigame.

Local scope exception: the owner's explicit request authorizes designing real shared multiplayer combat for Journey to the West. The host brief's individual-action policy remains in place for Vault Seven and Nightfall.

Accepted high-level mechanics are recorded above and in the dated decisions below. Exact combat timing, spawn budgets, boss health, network intervals and production requirements are collected as reviewable proposals in the technical companion. Remaining owner choices include enemy/audio direction. Optional personal math during the readiness window was approved at 08:43; see decision 30. The two opening-cutscene slots remain deliberately deferred.

## 8. Handbook and source provenance

Read through connected GitHub tools:
- mcada-project-handbook/AI-START-HERE.md: blob 6557a45aaa6d29d7d1abde808e6d0ac248b08820.
- mcada-project-handbook/UNIVERSAL-RULES.md: initially blob 61edfde857762153535b21a0a63d9b912c0027f7; refreshed on 2026-10-01 to blob 9ec5c8d2b9ab2757c043892b5d7218bc6090da04, including approved U-10.
- mcada-project-handbook/RELEASE-CHECKLIST.md: refreshed blob fbab310ffaa75f477f8d63b1885fa0cfeb2b20dd.
- mcada-project-handbook/CONDITIONAL-STANDARDS.md: blob dad2d3a05ca0f18260196ea51ac6351bffffdc1c.
- MathQuest docs/PROJECT-BRIEF.md: version 0.5, blob 8e0a6040006922338e3b7b4c578d3741f4515aba.
- MathQuest README.md: blob 09f18b6da9d793f56e32737e5169d7eb6c787654.
- MathQuest docs/change-specs/v0.9.2.md: blob 87b49bd1a20ecbb7c0394688e35321a921f79fa5; sections 17–18 on equipment unlocks and teacher extensions read for preparation-loop planning. Source ref: 7ac12fb98f7ccda591be4ee0bd6baa2f0ee81c28. Reading that specification does not verify current runtime behavior.

These are file blob revisions except the explicitly identified host source commit. Tree inspection found no AGENTS.md.
Applicable handbook scope: U-01–U-08 within this task; approved U-09 for any stored work/progress; approved U-10 for held-input release/recovery and physical-device verification; S-02 academic evidence, S-03 live educational games, S-04 deployment/classroom operation. U-01–U-08 remain seeded and conditional modules remain draft in the handbook; this task does not globally ratify them or the proposed S-03 privacy safeguard. No handbook rule was edited.

Literary background consulted:
- Academy of Chinese Studies, Journey to the West: https://chiculture.org.hk/en/china-five-thousand-years/2190
- University of Wisconsin-Madison teaching guide: https://humanities.wisc.edu/wp-content/uploads/sites/1644/2023/06/GWT_JTTW_Teaching_Guide_Complete.pdf
Tang is the vulnerable monk protected by the companions. Our direct combat and shield spells are an acknowledged game adaptation.

## 9. Verification status and next decisions

No implementation, gameplay testing, network testing, or deployment has occurred for this cartridge.
Before implementation, complete and approve a versioned change specification including the game, art, timing, multiplayer, and MathQuest contracts.
Future verification must include different party sizes and hero combinations, simultaneous specials, pickup consumption exactly once, boss stun/damage exploits, touch controls, browser interruption, teacher pause, reconnect, and the actual school-network path.

Current checkpoint: the revised composition, controls, specials, personal upgrades and high-level multiplayer/readiness behavior have been settled as recorded below. The new technical companion supplies proposed values and a production plan after inspecting the host source. Next owner review covers enemy appearance/audio, followed by one consolidated specification review. Optional-personal-math timing was settled at 08:43. Actual endpoint/network feasibility, implementation and verification remain separate work. Exact quantities and timing are proposed tuning, not verified balance.

### End-of-run decisions — approved 2026-09-30 at 21:35

- On an ordinary lost life with lives remaining: automatically return near the team, restore health, and grant a short clearly signaled protection interval.
- Preserve stage progress, enemy/boss health, and the shared remaining time when a player respawns.
- After a player's third life is lost: that player spectates while teammates continue.
- If everyone exhausts all lives: end the run with a team defeat result.
- If the three-minute limit expires with surviving players: end with a retreat/partial-success gameplay outcome; record whether Nezha was defeated separately. Keep gameplay outcome separate from academic evidence.
- Defeating Nezha earns full victory. These outcome rules are approved; numerical timing and edge-case precedence remain to be specified.

### Multiplayer setup — approved 2026-09-30 at 21:51

- Support one to five human players, including solo practice.
- Students choose from unclaimed heroes; one instance of each hero per team.
- Smaller parties use only their chosen heroes; no automatic AI companions.
- Each team plays its own level instance, with team members seeing shared enemies, boss health, pickups, progress, and the same remaining time.
- Scale enemy count, boss durability, and available magic for the starting party size, with quantities to be tuned and tested.
- Turn off friendly fire and blocking between teammates.
- Progress through a shared play area and advance the camera together. Exact camera/lagging-player rules remain open.

The owner accepted this setup. Character availability and selection conflicts need authoritative resolution in the eventual multiplayer design. Party-size scaling must not make disconnecting or exhausting lives an advantage; exact roster changes and scaling policy remain to be designed.

### Mathematics and preparation bonuses — ownership approved at 21:57; menu and earning structure approved at 22:08

Existing MathQuest v0.9.2 specification sections 17–18 define a team preparation loop: required preparation grants one equipment slot; each of up to two completed optional math blocks adds another distinct slot; chosen team resources apply to all eligible student runs. Teacher extension controls include student/module selection, question count, placement, and difficulty. This is a retrieved existing contract, not a blanket adopted requirement for Journey to the West.

The owner chose "Individual choice" when asked to choose shared-team upgrades or individually earned and selected personal upgrades. For this cartridge, each student's preparation upgrades belong to their own hero. Team-wide preparation bonuses are not the chosen approach. This decision does not change the other cartridges.

Approved acquisition and persistence rules:
- Completing required mathematics earns one personal upgrade choice.
- Each of up to two teacher-configured optional math blocks earns that student another choice, for a maximum of three distinct upgrades.
- Offer four upgrade options so completing all three choices still permits different loadouts. No duplicates or stacking the same option.
- Choose before combat; upgrades last for the run and persist through that player's automatic respawns.
- Complete academic preparation before the shared three-minute action run. Rewards must not change recorded mathematical accuracy.
- Retain each student's individual participation and evidence. A teammate cannot fulfill another student's required mathematics.
- Collectible magic during combat continues to replenish only the individual collector.

Approved four-option menu (numerical values are accepted starting points for later balancing):

| Option | Initial effect |
| --- | --- |
| Power | +20% ordinary attack damage, including ordinary aerial attacks |
| Vitality | +25% maximum health; apply the increased maximum on initial spawn and automatic respawns |
| Magic Reserve | +1 starting magic charge and +1 charge capacity; actual baseline is now one starting charge/capacity three, and unused magic persists through respawns |
| Focus | +20% special-attack damage; does not increase protection duration or utility effects |

These are simple numerical bonuses for the proof of concept; new move unlocks are not part of this upgrade package. Each option is intended to work for all five heroes. Percentages do not establish equal practical value; balance must be checked across hero kits and party sizes. Approved with the combat package: grant Magic Reserve's extra starting charge once per run; respawning preserves unused magic and grants no new charges.

### Detailed encounter and Nezha plan — approved 2026-09-30 at 22:26

The owner approved this encounter plan with "Yes" after the encounter/boss proposal and explicit recommendation to guarantee the boss encounter by elapsed 2:00. Precise balancing and implementation details remain open.

| Target elapsed time | Location | Encounter purpose |
| --- | --- | --- |
| 0:00–0:25 | Mountain path | Basic melee enemies from screen edges; accessible breakable props introduce magic collection |
| 0:25–1:00 | Cave approach | Enemies emerge from cave mouths; leaping attackers descend from ledges with landing warnings; introduce dodgeable ranged fire |
| 1:00–1:45 | Ruined shrine | Shield bearers and a charging brute join familiar enemies; a breakable barrier provides an entrance without immediate contact damage |
| 1:45–2:00 | Courtyard approach | Short cleanup and clearly visible magic supplies in several locations; establish Nezha's arrival |
| 2:00–3:00 | Courtyard | Nezha boss fight; no ordinary reinforcements in the first version |

These are pacing targets, not mandatory waiting periods. Quick clears may advance the team and start the boss earlier. Approved guarantee: for a team still alive, start Nezha's fight no later than elapsed 2:00, giving at least the final minute to the centerpiece encounter. If the party is behind, remaining ordinary enemies withdraw and a brief transition moves surviving heroes to the courtyard. Preserve health, lives, magic, chosen upgrades, and elapsed time; do not revive eliminated players or count bypassed enemies as defeated. Fit the transition within the first two minutes, without pausing or extending the three-minute action clock. Exact transition cues and camera behavior remain open.

Approved boss direction (detailed combat rules still open):
- Fight Nezha alone, keeping the courtyard readable with as many as five heroes.
- Spear combination: visible windup, a short close-range sequence, then a punishable recovery.
- Returning ring: an outward and return path that players can read and evade; exact jumping/lane interaction remains to be specified.
- Fire-wheel rush: mark the ground lane before a fast sweep; leave another lane available for evasion and follow with a vulnerable recovery.
- Below half health, combine the same learned attacks with shorter pauses rather than introducing an unexplained new mechanic.
- Use readable target cues and bounded tracking so a windup remains meaningful when the targeted player moves.
- Preserve openings for all five heroes; resolve stagger limits, invulnerability, damage values, and special interactions in the combat specification.

### GAMEPLAY COMPOSITION 01 — revised visual direction approved at 22:40

Generated and displayed in the planning conversation after the encounter approval. Uses CAST CONCEPT 01 as its appearance reference. This is an illustrative gameplay composition, not an implemented screenshot, production sprite sheet, or tested touch interface. Image is available in the conversation and has not been added to this repository.

Composition:
- Landscape tablet proportions, side-on belt-scrolling courtyard with ground-depth movement.
- All five approved heroes visibly separated across the floor, facing Nezha alone.
- Subdued blue-grey/moss courtyard, layered mountain scenery, and stronger character colors; red/gold Nezha stands against cooler scenery.
- Restrained spell effects, visible magic flasks, and a ground warning for the boss rush.
- Compact team status across the top, shared timer, and separate Nezha health bar.
- Proposed touch controls in a bottom strip outside the arena: cross-shaped directional pad and Attack, Jump, Magic buttons.
- Character sizes, framing, HUD abbreviations, charge indicators, lane-warning geometry, and button dimensions are illustrative and do not settle the remaining mechanical or accessibility decisions.
- The revised composition is approved as visual direction. Final art must keep characters and attack cues readable during movement and overlapping effects; runtime readability and touch usability remain unverified.

Scale revision, 2026-09-30 at 22:30:
- Owner requested: "Scale down player avatars by 10% and scale up boss by 10%".
- Exact production targets relative to the first composition: player avatar width/height ×0.90; boss width/height ×1.10. Preserve character proportions and scale attached equipment consistently.
- Revised concept generated and displayed in chat using the original gameplay composition as the edit reference. The preview shows smaller heroes and a larger Nezha; it is not pixel-measured proof of the requested percentages.
- Keep scenery, camera, HUD portrait sizes, and controls at their existing scale. Character hitboxes and attack reach must be designed explicitly rather than silently inferred from this visual revision.
- This request sets the scale direction; it does not constitute approval of every remaining UI or gameplay detail.



### Combat package — approved 2026-09-30 at 22:54

The owner approved the controls, five specials, and magic rules presented in chat. Numerical attack tuning and detailed implementation safeguards remain to be specified and verified.

Controls:
- Directional pad for horizontal and ground-depth movement, including diagonals; normalize diagonal movement so it is not faster.
- Three actions: Attack, Jump, Magic. Repeated taps or holding Attack progress the normal combo. Press Attack while airborne for the hero's aerial strike.
- Use movement and jumping for evasion; no additional block or dodge button for this proof of concept.
- Magic requires a fresh press; holding the button does not spend multiple charges. Invalid/empty activations spend nothing.
- Keyboard equivalents: arrows or WASD to move; J attack, K jump, L magic.
- Support moving while using action buttons, and jump-plus-attack input. Release held inputs on lost focus or canceled touch.
- This package defines controls, not final button sizes or input buffering timings.

Approved hero specials (confirming the special roles in section 3):
- Sun Wukong — Monkey Swarm: two temporary copies join a brief staff assault; copies are effects of the special, not AI teammates.
- Zhu Bajie — Earthshaker: heavy area shockwave that damages and knocks back ordinary enemies.
- Sha Wujing — River Surge: a broad damaging current pushes enemies away.
- Tang Sanzang — Lotus Ward: a damaging pulse with brief protection for nearby teammates, including the caster.
- White Dragon Horse — White Horse Charge: temporarily become a steerable white horse and charge through enemies.
- Every hero keeps effective ordinary and aerial attacks. Exact timing and damage coefficients remain tuning work.
- Special utility must not lock the boss out of acting indefinitely. Horse repeat-hit limits and Tang protection overlap rules need explicit numerical definitions in the implementation specification.

Magic economy:
- Start with one charge, hold at most three, spend one per special.
- Magic Reserve upgrade therefore starts with two charges and raises capacity to four.
- Each pickup replenishes one charge for its collector only; a full meter leaves the pickup available.
- Target roughly four to six special uses per attentive player in a full three-minute run before the extra starting charge from Magic Reserve. This is a tuning goal, not a guaranteed individual pickup share.
- Retain unspent magic through automatic respawns; death does not grant extra charges. Retain earned upgrades as already approved.
- Distribute party-scaled supplies through breakable props, selected enemy drops, the approach to Nezha, and accessible boss-arena supplies. Ensure the guaranteed transition does not leave all remaining magic behind.
- Exact placement and quantity will be authored with the encounter specification and checked across party sizes.

### Multiplayer session flow — approved at 07:55 on 2026-10-01

Recommended classroom behavior:
- Use the existing MathQuest team assignment. Each team has its own preparation/character-selection lobby.
- Students finish their own required mathematics, optionally earn additional upgrades, select an available hero and upgrades, then press Ready. Optional math keeps that student unready until they finish or choose to stop; the 08:43 decision permits it during the readiness window and awards upgrades only for completed blocks.
- Automatically launch that team when all its participating members are ready, or with the ready subset after the one-minute readiness window added at 08:09. Use the existing shared three-second launch countdown. The three-minute action clock starts when control is enabled; readiness waiting and launch countdown are outside it. Reserved opening cutscenes, once specified, also occur before the action clock.
- A teacher can start a ready subset without bypassing any student's required mathematics; absent/unready students wait for the next run. Final ready roster determines party-size scaling.
- Lock heroes and starting roster at launch. No new players enter mid-run; reconnecting members reclaim their existing hero/state.
- Teacher controls can pause/resume one team or all teams, freezing simulation and action time, and end a run. Students cannot pause the shared action for everyone. Teacher-ended runs are recorded as interrupted, separately from victory, retreat, or defeat.
- When one player disconnects, the team continues. Preserve that student's hero, health, remaining lives, upgrades, and magic for reconnection, without replacing them with AI or awarding fresh resources. Return them near the team if the run is still active; no resurrection after life exhaustion.
- Keep difficulty and supply budgets based on the starting roster through disconnections and eliminations.
- If the entire team loses connection, pause briefly for recovery; after a bounded grace period, end as interrupted rather than a combat defeat. Exact grace period, disconnect detection, absent-avatar withdrawal, safe re-entry, and protection against disconnect abuse remain technical design work.
- Keep the shared camera moving with the active group. A player falling behind receives a visible catch-up warning, then is brought forward safely without damage or resource changes; exact thresholds remain open.
- Show an explicit reconnecting/paused/ended status so a frozen view is not mistaken for live play.

The owner approved this classroom flow with "Yes" on 2026-10-01 at 07:55. This approval does not settle the joining interface, exact reconnect/grace intervals, Cloudflare architecture, or classroom privacy and retention details.


### MathQuest team handoff — updated per owner clarification

The Journey to the West brawler is a cartridge inside MathQuest. Students form or join their teams through MathQuest's normal team flow. The existing team proceeds into the cartridge as a group; the cartridge does not create a separate class session, ask the teacher to reassign teams, or issue a second QR/join code.

For each existing MathQuest team:
- Carry the current team roster and each member's existing MathQuest participation/preparation context into that team's cartridge instance.
- Keep the previously approved student choices inside that team: each participating student selects their own unclaimed hero and personal upgrades in the normal cartridge preparation step.
- Use the existing MathQuest handoff to start the cartridge and return to the host experience when the run ends.
- Keep each team's combat session separate, with shared enemies, boss health, pickups, progress, and timer for that team.
- Cloudflare is the proposed multiplayer backend for the cartridge session. Its technical connection to MathQuest team/session identity, reconnect authorization, and the existing result/evidence flow still requires an architecture design.
- Do not add a separate QR code or duplicate team-formation flow for this cartridge.

Handoff condition clarified at 08:09: MathQuest has completed the required gates and relevant decisions and released the team to its minigame. Start the readiness window at that host handoff. Do not start this window merely because the first student finishes an earlier math gate. Preserve individual mathematics eligibility; the timeout does not award missing preparation or bypass required math. Exact host event/field mapping remains to be checked against source.

The owner's clarification supersedes the preceding separate QR-code/teacher-assigned lobby proposal. Normal MathQuest team formation remains the source of team membership.

### One-minute readiness window — requested default and recommended details

Owner request, 2026-10-01 at 08:09: after the MathQuest gates and decisions, launch automatically when everyone is ready, otherwise wait one minute then proceed even if someone is absent. The assistant recommends adopting this default.

Recommended operational details:
- On the normal MathQuest-to-minigame handoff, show a shared 60-second readiness timer alongside character selection and Ready status.
- If everyone is ready earlier, immediately end the waiting period and begin the already approved three-second launch countdown.
- At 60 seconds, begin the three-second launch countdown with the ready, connected, eligible players, provided at least one exists. Size the encounter and supply budget for that actual starting group.
- Freeze the final roster and loadouts at the launch boundary. A not-ready student receives no automatically assigned hero or AI replacement.
- If nobody is ready at expiry, keep the game unstarted. Once at least one eligible player is ready, begin the launch countdown without another full minute of waiting.
- The readiness timer and launch countdown do not consume the three-minute action clock.
- Teacher pause also suspends a pending readiness/launch countdown; teacher start/end controls remain available.
- Preserve the prior mid-run entry rule: a student omitted from the starting roster waits for the next run. A member who actually started and then disconnected can reconnect to their existing hero/state.
- Show a plain message such as "Starting with ready players in 0:45" so students understand the deadline.
- The one-minute value is a fixed initial design default; no additional teacher setting is required for the proof of concept.

The core auto-start/one-minute decision comes from the owner. Zero-ready handling, exact cutoff sequencing, and countdown messaging are the assistant's recommended specification details. No implementation or runtime verification has occurred.

### Source-grounded design checkpoint — 2026-10-01 at 08:23

The owner's “Proceed” advances the planning workflow. The [technical and production draft](journey-to-the-west-v0.1-TECHNICAL-DRAFT.md) now records the inspected host interfaces, proposed Cloudflare architecture, readiness state machine, combat defaults, encounter budgets, art/audio inventory and verification contract. Newly introduced technical numbers remain proposals for consolidated review.

The one-minute readiness window starts only at the normal host-to-minigame handoff, after required gates and relevant decisions. At this 08:23 checkpoint, optional preparation timing was unresolved; decision 30 below supersedes that open item by allowing optional questions during the readiness window. A readiness timeout cannot bypass unfinished required math. Keep the already selected “all ready → three-second countdown” behavior, and proceed with the ready subset after the minute. The technical draft specifies zero-ready and reconnection edge cases for review.

Source confirmation: main remained at 7ac12fb98f7ccda591be4ee0bd6baa2f0ee81c28. Actual deployed frontend/Worker identity was not established. The technical draft's provenance section lists inspected source files and handbook blob revisions. No gameplay implementation, deployment, network test or balance test occurred.

### Optional questions during readiness — approved 2026-10-01 at 08:43

The owner answered “Yes” to keeping optional upgrade questions available during the existing 60-second readiness window.

- Required mathematics and relevant decisions are already complete when the window opens.
- Optional blocks are individual and cannot prevent the host from opening readiness.
- Only fully completed blocks earn an additional personal upgrade, within the accepted three-upgrade maximum.
- A student finishes or leaves optional work, selects an available hero and earned upgrades, then presses Ready.
- All ready starts the three-second launch countdown immediately. At 60 seconds, start that countdown with the ready, connected, eligible subset.
- A student still unready at launch waits for the next run under the accepted entry rule.
- Proposed cutoff detail: close optional questions at the end of the window, retain submitted answers as academic evidence and give no upgrade credit for an incomplete block. If nobody is ready, keep the game unstarted and allow hero/loadout selection using earned upgrades; do not open a second optional-math minute.
- Readiness waiting and launch countdown remain outside the 180-second action clock.

This approval settles preparation timing, not the remaining creative proposals or implementation authorization. Handbook files were rechecked at the same blob revisions recorded in section 8; the host main commit remains 7ac12fb98f7ccda591be4ee0bd6baa2f0ee81c28.
