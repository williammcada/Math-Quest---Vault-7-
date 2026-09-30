# MathQuest: Journey to the West — Design Draft v0.1

**Status:** DESIGN; accepted decisions plus explicitly provisional proposals. Not an implementation specification or release.
**Owner:** William McAda
**Credit:** A WILLIAM MCADA PRODUCT
**Recorded:** 2026-09-30, Asia/Shanghai, through the owner's 21:51 message.
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
17. The owner selected the offered three-lives-with-automatic-respawning option on 2026-09-30 at 21:31. Three lives means the initial life plus two returns. Respawn position, protection duration, exhaustion handling, and timer outcome remain proposals below.
18. The owner approved the character appearances in CAST CONCEPT 01 (five heroes plus boss Nezha) on 2026-09-30 at 21:31.
19. End-of-run structure approved at 21:35: respawn near teammates with full health and brief protection; preserve stage/enemy health/time; spectate after all three lives; end on team elimination; surviving players retreat with a lesser gameplay result at three minutes; defeating Nezha earns full victory. Gameplay results remain separate from mathematics accuracy.
20. Multiplayer setup approved at 21:51: one to five human players including solo practice; student choice of unclaimed unique heroes; no AI companions; separate level instance per team; shared enemies/progress/timer; enemy numbers, boss health, and magic supply scale to team size; no friendly fire or teammate blocking; shared play area and camera progression.

## 3. Proposed hero mechanics — exact moves remain open

| Hero | Proposed ordinary combat | Proposed special | Intended distinction |
| --- | --- | --- | --- |
| Sun Wukong | Quick staff combinations and spinning aerial strike | Monkey Swarm: two short-lived copies join a coordinated staff assault | Versatile speed and reach |
| Zhu Bajie | Heavy rake sweeps and jumping body slam | Earthshaker: broad damaging knockback shockwave | Heavy impact with slower recovery |
| Sha Wujing | Polearm sweeps and downward aerial strike | River Surge: damaging current pushes enemies back | Reach and crowd control |
| Tang Sanzang | Golden energy pulses and downward aerial burst | Lotus Ward: damage pulse plus brief protection for nearby allies | Effective attacking spellcaster with protective utility |
| White Dragon Horse | Dragon prince with quick sword combinations and aerial lunge | White Horse Charge: temporary player-steered horse transformation | Mobility and directed charge damage |

Tang's attacking spellcaster adaptation and the dragon prince/horse transformation are accepted. The exact weapon for the prince, special names, timings, numbers, and other move details are proposals awaiting review.

Balance proposal: use comparable encounter value rather than identical moves. Every hero must feel useful and have effective free normal attacks. Limit repeated horse-charge hits against the same target. Tang's ranged attacks need practical reach, travel time, and damage limits. His shield must not scale into a mandatory party advantage or allow permanent team protection.

## 4. Magic economy

Accepted: individual collection, frequent opportunities, substantial rewards for investigating and breaking props.

Unconfirmed earlier proposals:
- One charge per activation.
- Capacity of three charges.
- One starting charge.
- Additional magic from selected enemies and before the boss.

Further proposal for review:
- Tuning target proposed in chat at 21:24: roughly 4–6 special activations per attentive player per run; this number is not yet accepted.
- Design supply quantities around the number of participating players, so a five-player party is not given a solo player's supply.
- Put visible pickups in several places across the play area.
- At full capacity, leave magic for another player rather than consume it.
- Keep the magic resource separate from any future math-earned pre-run upgrades; the latter have not yet been specified for this cartridge.

Do not claim that generous shared-world drops guarantee equitable collection. Students can still take disproportionate amounts. If observation shows monopolization, propose a targeted design revision rather than silently switching to team-wide awards.

## 5. First level and combat proposal

A belt-scrolling arena: travel sideways, move nearer/farther across the ground, jump, attack, and use a special. Camera, screen boundaries, exact touch controls, and friendly-fire policy remain open.

Accepted enemy types:
- Basic fighters: approachable close combat.
- Leaping attackers: visible windup, jump kick, vulnerable landing.
- Ranged attackers: dodgeable projectiles with readable travel.
- Shield bearers: positional counterplay or punish exposed recovery.
- Charging brutes: visible windup, avoid the rush, punish the recovery.

Entrances should create authored encounters, not damage players on spawn. Introduce behaviors before combining them. Proposed pacing: opening basics, middle mixed encounters and ambushes, approach encounter and supplies, roughly final minute for Nezha. This is a pacing target, not an approved forced-transition or spawn schedule.

Nezha's detailed move set, health, phases, arena hazards, and vulnerability windows remain to be designed.

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

Host context from docs/PROJECT-BRIEF.md: teacher Windows computer, landscape classroom iPads, iPhone Safari review support, keyboard and touch as appropriate. Retain those target devices for planning; actual compatibility remains unverified.

Owner suggests Cloudflare for multiplayer. Cloudflare is a candidate, not an approved replacement of existing infrastructure. Current MathQuest documentation describes a GitHub Pages front end, relay, and Cloudflare session service. This draft has not established whether the existing service is suitable for real-time combat. Choose an architecture only after designing and checking the required synchronization, authority, latency, cost, and school-network behavior.

Local scope exception: the owner's explicit request authorizes real shared multiplayer combat for this new cartridge. The current host brief's individual-action policy remains unchanged for Vault Seven and Nightfall.

Still to define:
- Character selection conflicts, selection deadline, and late joining (student choice and unique heroes are accepted).
- Exact camera progression and lagging-player handling (shared play area accepted).
- Exact respawn delay, protection duration, safe position, and same-update outcome precedence (life-exhaustion and team-defeat behavior are accepted).
- Three-minute clock ownership, start point, and pause rules (expiry outcome accepted).
- Disconnect/reconnect behavior, absent-player handling, teacher control.
- Academic gates, optional math, pre-run upgrades, and evidence contract.
- Learner data, retention, deletion, and inherited privacy boundaries.
- Deployment process and concurrent classroom team count.

## 8. Handbook and source provenance

Read through connected GitHub tools:
- mcada-project-handbook/AI-START-HERE.md: blob 6557a45aaa6d29d7d1abde808e6d0ac248b08820.
- mcada-project-handbook/UNIVERSAL-RULES.md: blob 61edfde857762153535b21a0a63d9b912c0027f7.
- mcada-project-handbook/CONDITIONAL-STANDARDS.md: blob dad2d3a05ca0f18260196ea51ac6351bffffdc1c.
- MathQuest docs/PROJECT-BRIEF.md: version 0.5, blob 8e0a6040006922338e3b7b4c578d3741f4515aba.
- MathQuest README.md: blob 09f18b6da9d793f56e32737e5169d7eb6c787654.
- MathQuest docs/change-specs/v0.9.2.md: blob 87b49bd1a20ecbb7c0394688e35321a921f79fa5; sections 17–18 on equipment unlocks and teacher extensions read for preparation-loop planning. Source ref: 7ac12fb98f7ccda591be4ee0bd6baa2f0ee81c28. Reading that specification does not verify current runtime behavior.

These are file blob revisions except the explicitly identified host source commit. Tree inspection found no AGENTS.md.
Applicable handbook scope: U-01–U-08 within this task; approved U-09 for any stored work/progress; S-02 academic evidence, S-03 live educational games, S-04 deployment/classroom operation. U-01–U-08 remain seeded and conditional modules remain draft in the handbook; this task does not globally ratify them or the proposed S-03 privacy safeguard. No handbook rule was edited.

Literary background consulted:
- Academy of Chinese Studies, Journey to the West: https://chiculture.org.hk/en/china-five-thousand-years/2190
- University of Wisconsin-Madison teaching guide: https://humanities.wisc.edu/wp-content/uploads/sites/1644/2023/06/GWT_JTTW_Teaching_Guide_Complete.pdf
Tang is the vulnerable monk protected by the companions. Our direct combat and shield spells are an acknowledged game adaptation.

## 9. Verification status and next decisions

No implementation, gameplay testing, network testing, or deployment has occurred for this cartridge.
Before implementation, complete and approve a versioned change specification including the game, art, timing, multiplayer, and MathQuest contracts.
Future verification must include different party sizes and hero combinations, simultaneous specials, pickup consumption exactly once, boss stun/damage exploits, touch controls, browser interruption, teacher pause, reconnect, and the actual school-network path.

Immediate next design topics: math-earned preparation bonuses, then review a gameplay composition and detailed encounter plan. Exact magic quantities and hero ability tuning remain proposals until accepted and tested.

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

### Mathematics and preparation bonuses — proposal awaiting owner response

Existing MathQuest v0.9.2 specification sections 17–18 define a team preparation loop: required preparation grants one equipment slot; each of up to two completed optional math blocks adds another distinct slot; chosen team resources apply to all eligible student runs. Teacher extension controls include student/module selection, question count, placement, and difficulty. This is a retrieved existing contract, not yet an adopted requirement for Journey to the West.

Recommended proposal:
- Follow that acquisition pattern with one initial team bonus and up to two additional distinct bonuses earned through teacher-configured optional math blocks.
- Team-selected bonuses apply to each participating hero for the run.
- Candidate choices: stronger ordinary attacks, higher maximum health, or greater magic reserves. Exact names, strengths, duration, and visual changes remain provisional.
- Collectible magic during combat continues to replenish only the individual collector.
- Complete academic preparation before the shared three-minute action run. Rewards must not change recorded mathematical accuracy.
- Academic block completion must retain the host's individual participation/evidence rules; a single teammate must not silently fulfill another student's required mathematics.

Alternative requiring owner choice: individual students earn and select personal hero bonuses instead of a shared team loadout.
Ask the owner to select shared-team or individual-hero upgrades before refining values or implementation.
