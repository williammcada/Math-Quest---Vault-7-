# MathQuest: Journey to the West — Consolidated Change Specification v0.1

**Stage:** CHANGE SPEC — Review 1, awaiting owner approval before implementation.
**Revision:** 2026-10-01, after the owner's 08:50 creative-direction approval.
**Status rule:** Previously approved requirements remain accepted. The numerical, architectural and production defaults below are the proposed implementation baseline for this consolidated review; they are not verified balance or runtime results.
**Owner:** William McAda
**Credit:** A WILLIAM MCADA PRODUCT
**Date:** 2026-10-01, Asia/Shanghai
**Canonical repository:** williammcada/Math-Quest---Vault-7-
**Branch:** design/journey-to-the-west-v0.1
**Host inspected:** main at `7ac12fb98f7ccda591be4ee0bd6baa2f0ee81c28`, v0.9.4 candidate.
**Accepted decisions:** [Design decision record](journey-to-the-west-v0.1-DRAFT.md).
**Scope:** One multiplayer proof-of-concept level inside MathQuest. This document consolidates the accepted design with the proposed technical baseline. Once approved, use this file as the implementation specification; retain the earlier drafts as provenance.
**Host version:** Source remains the v0.9.4 candidate; cartridge v0.1 is a separate design version. Assign the next host integration release version after reconciling the then-current main branch.


## Review summary

### Already accepted

- Classic Journey to the West with original art/dialogue; five travelers playable and Nezha as boss.
- One level, one to five humans, unique heroes, no AI companions, three total lives with automatic respawn, 180 seconds of active action.
- Detailed arcade pixel art; approved cast and revised composition; player avatar scale 90% and Nezha 110% relative to the first composition.
- Individual magic collection, generous breakable supplies, five distinct specials, personal math-earned upgrades.
- Normal MathQuest team joining; one-minute readiness after required gates/decisions, automatic early start when all ready, three-second launch countdown.
- Optional personal upgrade questions available during that readiness window; only completed blocks earn upgrades.
- Teacher pause/resume/end, ready-subset launch, reconnecting starters, no new mid-run entrants, separate team instances and fixed starting-party scaling.
- Five original enemy appearances and the arcade/Chinese-instrument audio direction approved at 08:50.
- Two opening cutscenes and narrative content deliberately reserved for later.

### Proposed baseline in this review

| Area | Proposed initial default |
| --- | --- |
| Health and respawn | 100 base health; 2-second respawn delay and protection; 0.65-second hurt protection |
| Supplies | Five one-charge magic pickups per starter, distributed through the level; one 25-health pickup per starter |
| Nezha | 650 health per starter; readable spear, ring and rush patterns; normal-competence solo target 40–60 seconds |
| Networking | Cloudflare combat object per team/run; 30 Hz simulation, 20 Hz input and 15 Hz snapshots |
| Recovery | 300 ms stale-network-input lease, one-second avatar withdrawal threshold, 15-second all-team recovery |
| Audio production | Stage loop 45–60 seconds, separate boss loop 30–45 seconds; per-device music/effects controls |
| Results | One authoritative team outcome plus individual participation, kept separate from math accuracy |
| First implementation stage | A small synchronized scene using MathQuest identity/handoff, plus one complete hero/enemy animation sample |

These are starting values to measure and tune. Approval does not certify practical balance or device/network support. The detailed sections control where the summary omits a condition.

## 1. Product contract

Preserve normal MathQuest setup, student team-code entry, aliases/credentials, teacher-selected math, individual evidence, shared narrative decisions, and reports. Students join their normal teams once. Their existing team reaches this cartridge's final action section after its gates and relevant decisions. No second room code, team assignment, account, or separate classroom app.

Approved action: one level, maximum five human players, no AI companions, three total lives per player, automatic respawns, 180 seconds of active gameplay, and shared combat state. Each player selects one unclaimed member of the five-person traveling party. Personal math upgrades, individual magic collection, the five specials, Nezha's solo boss fight, and the revised art direction are accepted in the decision record.

Two opening-cutscene positions and narrative payload slots remain reserved as requested. Do not invent story choices or historical chronology to close those deliberately deferred slots. Every story/academic transition must be represented separately from combat results.

Apply a cartridge-specific five-member limit in the normal MathQuest join validation and display remaining places. The inspected host currently validates the team code but has no five-member check in join(). Preserve other cartridges' team behavior. Rejoining with an existing credential must not count as a sixth member.


### Controls, roles and visual identity

Accepted controls: normalize diagonal ground movement; touch D-pad plus Attack, Jump and Magic. Tap or hold Attack for ordinary combos; Attack in the air performs one aerial attack per jump. Jump/Magic require fresh presses. Magic consumes a charge only on a valid cast. Keyboard: arrows/WASD, J Attack, K Jump, L Magic. Simultaneous direction/actions must work. Use movement/jumps for evasion; no fourth block/dodge button.

Friendly fire and teammate body blocking are off. Use a shared belt-scrolling play area; vertical movement changes ground depth. No split screen. Wukong's copies are temporary special effects, not additional players.

| Hero | Combat role and approved special | Approved appearance |
| --- | --- | --- |
| Sun Wukong | Fast staff fighter; Monkey Swarm creates two temporary attacking copies | Simian features and tail, gold circlet, red/gold clothing, gold-banded staff |
| Zhu Bajie | Heavy rake sweeps; Earthshaker damages and knocks back a group | Broad pig-faced silhouette, plum/brown clothes, rake |
| Sha Wujing | Long-reach polearm fighter; River Surge damages and pushes enemies | Tall broad figure, teal/indigo, beads, crescent polearm |
| Tang Sanzang | Attacking spellcaster; Lotus Ward damages and briefly protects nearby allies | Ivory/saffron robes, red drape, ceremonial headdress, ringed staff, golden lotus effects |
| White Dragon Horse | Mobile sword-fighting dragon prince; White Horse Charge becomes a steerable horse | Silver-white/pale cyan, small horns, dark hair, sword; white/cyan horse form |
| Nezha | Solo boss with spear combination, returning ring and fire-wheel rush | Youthful red/gold celestial warrior, twin hair buns, flowing sash, spear, ring and flaming wheels |

Tang's offensive spells are an explicit game adaptation. Do not present them or the invented enemy faction as a claim about the novel. Original artwork is required; the recent film is not the production asset source.

Every player starts with one magic charge, capacity three, and spends one per special. A pickup adds one only to its collector. Full-meter players leave it available. Retain unused magic through death; respawns do not refill it. Magic Reserve starts at two with capacity four. Four to six casts per attentive player per full run is a tuning goal, not an individually guaranteed pickup share.

On death with lives left, respawn near active teammates with full modified health and brief protection while preserving world state, time, upgrades and unused magic. After three lives, spectate. All eliminated means defeat; a surviving team at three minutes retreats; defeating Nezha wins. A teacher/network interruption is a distinct result.

### Proposed shared-camera and selection details

- First valid server hero reservation wins; a rejected selection shows the remaining choices. Ready requires an eligible hero and valid earned loadout. Switching hero releases the old reservation atomically.
- “Everyone ready” refers to the handoff's full eligible team roster, including an absent member until the deadline; it is not merely everyone currently connected.
- Propose a forward-only camera following the median horizontal position of living, connected players, clamped to authored encounter boundaries. Keep each player's foot point visible inside the play area.
- Warn a player held at the trailing boundary for one second; after a further two seconds, bring them to a safe nearby position. This does not heal, award magic, cancel already resolved damage or grant invulnerability. It cannot advance the camera through a closed encounter.
- All scene changes and forced catch-up use server positions; local prediction cannot push the shared camera ahead.
- Layout must reserve space for the HUD, safe areas and touch controls. Production frame manifests record sprite bounds, foot pivots, hitboxes and the accepted relative scale; concept images alone do not establish pixel measurements.

## 2. Findings from actual source

| Existing implementation | Consequence for this cartridge |
| --- | --- |
| src/worker.js join() accepts teamPin during setup, assigns generated Agent aliases and teamId, then locks roster at teacher launch. | Reuse those team/student identities. The user was right that joining belongs to MathQuest. |
| public/app.js polls every 2,500 ms; /api/health identifies https-polling. | Keep this for academic/session views; add a real-time combat transport. |
| wrangler.jsonc already binds SESSIONS to a SQLite QuestSession Durable Object. | Cloudflare is already part of the host; add a separate object class for each team run. |
| Equipment slots and inventory are team-level. Students recommend a basket; the Event Lead confirms the vote winner. Optional blocks unlock a team slot after everyone completes. | Personal earning and choices need a cartridge-specific entitlement path. Reusing the current equipment screen unchanged would violate approval. |
| Public/server cartridge registries currently contain Vault Seven and Nightfall. Some app paths treat every non-Vault cartridge as Nightfall. | Add explicit cartridge capabilities/dispatch at affected boundaries; avoid allowing Journey to the West to fall into Nightfall transitions or UI. |
| GameHost runs a local adapter simulation and sends progress. It offers local pause/assisted behavior. | Add a multiplayer host that sends inputs and renders authoritative state. A local pause must not freeze a team. |
| hosting.js intentionally uses the existing relay and avoids student connections to workers.dev. | A WebSocket address and network route must be explicitly selected and tested. Existing HTTP reachability proves nothing about socket reachability. |
| The host stores 48-hour expiry from room creation and provides session purge. | A child combat object must inherit expiry and deletion rather than create a new retention window. |

These are source observations, not assertions about current deployed bytes. Inspect/reconcile any newer host source and other cartridge branches before implementation.

## 3. Proposed Cloudflare architecture

Use one new SQLite-backed **BrawlRun** Durable Object per (MathQuest session, team, run). Keep **QuestSession** authoritative for mathematics, credentials, teacher permissions and academic progression.

- QuestSession validates the normal handoff, creates a run once, and sends an immutable roster/entitlement record internally.
- BrawlRun owns character reservations, readiness deadline, starting roster, simulation, enemies, pickups, clock, lives, boss and terminal result.
- Browsers use WebSockets to send input and receive combat state. They cannot award damage, magic, upgrades, health or outcomes.
- Terminal results return internally to QuestSession with run identity and idempotent completion. The browser cannot submit a trusted victory.
- QuestSession exposes progress/results through the existing dashboard and exports. Math evidence remains in its existing path.
- Keep the present frontend and academic relay addresses. Add a configured combat WebSocket endpoint; no domain purchase or infrastructure migration is authorized here.

### Transport boundary

Proposed sequence:
1. Existing authenticated MathQuest HTTP command requests a combat connection ticket.
2. QuestSession verifies student membership, room expiry, cartridge, run, and participation eligibility.
3. Issue a single-use ticket, valid for 30 seconds, bound to student/run/protocol version.
4. Open the configured secure WebSocket and authenticate in the first message. Do not put the long-lived student/teacher credential into a URL.
5. Reject unauthenticated input, oversized messages, invalid values, stale sequences, mismatched build/protocol versions and cross-team tickets.
6. Permit only one controlling socket per student. An authenticated reconnect replaces the old controller; it never creates a second hero.

Proposed message families: authenticate, reserveHero, ready, input, acknowledge; server snapshot, event, roster, countdown, paused, result and error. Version the schema as jttw-combat/1. Attach runId, connection epoch and increasing sequence numbers. Do not allow arbitrary object mutation or user-selected object identifiers.

The WebSocket upgrade path must preserve the Cloudflare 101/webSocket response. Audit the current CORS wrapper, which reconstructs ordinary Responses; do not assume it transparently supports upgrades. Validate the Origin separately from ticket authorization.

Cloudflare officially supports Durable Object coordination with WebSockets. Its Hibernation API is appropriate during inactive periods, but scheduled simulation timers prevent hibernation during active play. The proposed architecture follows those capabilities; its suitability on the school's network remains untested. [CF1–CF2]

## 4. Academic and upgrade integration

Keep required questions, answer validation, first-attempt accuracy, hints, teacher difficulty and imported question policies in MathQuest.

For this cartridge, apply the accepted personal preparation policy using the proposed scoped host changes:
- Required preparation earns one personal choice.
- Each completed optional teacher-configured block earns its student another, maximum three choices.
- Store personal completed block IDs and selected upgrade IDs by student, not in team.inventory.
- Reuse the question provider and evidence format. Scope optional assignment/completion to the requesting student. Do not call the current team-wide equipment.extend unchanged.
- Other students may prepare independently; their entitlement is not increased by a teammate's completion.
- Do not silently omit compulsory work. Required gates and relevant decisions must complete before the 60-second readiness window.
- Approved by the owner on 2026-10-01 at 08:43: optional questions remain available during the existing 60-second preparation/readiness window. Only completed blocks earn an upgrade; a student must finish or leave optional work, select a hero/loadout and press Ready to join the starting roster. Everyone ready starts the launch countdown early; otherwise, at the deadline, start the ready subset under the accepted rule. Unfinished optional work earns no completion credit; preserve already submitted answers as academic evidence.
- Proposed cutoff detail: close optional questions at the readiness deadline (or earlier launch), award only blocks completed by that cutoff, and freeze starters' earned/selected upgrades at launch. If nobody is ready at expiry, keep the run unstarted and permit selection/Ready using already earned upgrades; do not reopen optional questions or grant another minute.
- The current extension mechanism places the team at a gate and waits for everyone. The approved timing requires a cartridge-specific optional-preparation state that does not block the host handoff. Required gates must remain complete before readiness opens.

Accepted upgrades: Power +20% ordinary/aerial damage; Vitality +25% max health; Magic Reserve +1 starting charge and capacity; Focus +20% special damage. No duplicates. Effects survive automatic respawns; additional starting magic is awarded once.

MathQuest should pass readiness eligibility and earned choices to the combat object, without question prompts, student answers, real names or full academic histories.

## 5. Lifecycle and timing

| State | Proposed behavior |
| --- | --- |
| Academic preparation | Existing required MathQuest gates/decisions. No combat countdown. Optional personal questions may continue during readiness as approved. |
| Ready | Host handoff opens one authoritative 60-second window; pick an unclaimed hero, confirm loadout and Ready. |
| Launch | All eligible team members ready ends waiting early; otherwise deadline selects ready/connected/eligible players. Three-second countdown. |
| Running | Start the 180-second active clock when control becomes available. Shared team simulation. |
| Teacher pause | Freeze simulation, active clock, readiness/launch countdown and game-duration effects. Clear held inputs. |
| Network recovery | If no starter with lives remaining has a usable connection, freeze and allow a proposed 15-second reconnection grace window. A connected player awaiting respawn still counts as connected; elimination resolves as defeat first. |
| Terminal | Exactly one victory, retreat, defeat or interrupted result; return through MathQuest's result/ending path. |

At the authoritative cutoff, close optional questions and preserve submitted academic evidence. Freeze upgrade entitlements and the selected launch roster together so a delayed result cannot change an active run's loadout. Server-accepted completion before the cutoff counts; incomplete blocks earn no upgrade. Teacher pause freezes the readiness window as well as launch/action clocks.

If zero players are ready at the deadline, do not create an empty fight. Start the launch countdown when the first eligible player subsequently becomes ready. The 60-second readiness window and three-second countdown are outside the 180 seconds. Use server times; tab refresh, duplicate Ready, device clock changes and reconnection do not reset them.

Freeze the launch roster at countdown start. If a selected player disconnects during countdown, retain their slot/state and apply the disconnect policy; if nobody remains connected, enter recovery rather than start an unattended match. Do not silently allow a new member to replace a selected hero mid-run.

One run per team handoff. Retrying a network request cannot create another. Practice mode is separately labeled and does not add classroom evidence or consume classroom progression.

### Clock and terminal precedence

Proposed authoritative rules:
- Active elapsed excludes approved pauses and all-team network recovery only. One student's absence/local overlay does not stop it.
- At the boundary of 180,000 ms, accept only gameplay events timestamped before the deadline; later damage cannot create a victory.
- Resolve simultaneous pre-deadline boss death and final-player death as victory.
- Otherwise zero lives for all starting heroes means defeat; reaching the deadline with a survivor means retreat.
- An already terminal result is immutable. Teacher end before terminal produces interrupted; network grace expiry produces interrupted with a separate reason.
- Backend process/state loss produces interrupted; do not silently rewind health, enemy deaths, charges or clock.

These tie-break rules and the 15-second grace interval are proposed engineering defaults.

## 6. Reconnect and held inputs

Proposed input transport: full directional/held-attack state at up to 20 Hz, plus edge-triggered Jump and Magic commands. Repeated transmission must not repeat an edge action. Server simulation starts at 30 Hz with snapshots at 15 Hz; render locally at up to 60 fps using interpolation and limited local movement prediction. Values are initial profiling targets.

A proposed 300 ms network input lease neutralizes stale movement; valid held touches continually refresh input messages. This is not a local inactivity timeout, and must not interrupt a legitimate stationary held touch.

On loss of focus, hidden page, lock/rotation, local Help, controller disconnect, or capture loss: immediately clear local held input and notify the server when possible. A hidden student device is unavailable for control. After a proposed one-second connection-loss threshold, withdraw that hero from targeting and pickup collection while retaining authoritative state. Hits already resolved remain resolved; no resource restoration. Returning players reappear near the group with the same lives/health/magic, and must release/repress actions. A zero-life player returns as a spectator.

No AI takeover, new mid-run participants, or difficulty reduction on dropout. Reconnect does not grant fresh spawn magic or renew shield durations. Specify a small safe placement outside an active hit volume, without a renewable invulnerability bonus. Repeated-disconnect tests must check that pending attacks, recovery and damage cannot be canceled for profit.

All-team recovery suspends action time for up to 15 seconds; teacher pause cannot accidentally consume this recovery allowance. Expiry ends as interrupted. Exact timer interaction will be covered in lifecycle tests.

Implement approved **U-10**: test rapid taps, diagonal slides, release outside buttons, multiple fingers/both release orders, pointer cancellation/capture failure/loss, focus/background, lock/unlock, rotation, pause, deaths/retries and teardown. Provide Reset controls without resetting progress. Release/cancel recovery is a release gate on actual iPad/iPhone hardware.

## 7. Combat tuning proposal

All heroes begin with 100 health, three total lives, one magic charge and capacity three. Approved upgrades apply multiplicatively to the affected attack category once. Propose 0.65 seconds of hurt protection following a damaging hit, a two-second death-to-respawn delay, and two seconds of clearly marked respawn protection. Existing unused magic and upgrades persist.

| Hero | Ordinary full combo target | Special starting point |
| --- | --- | --- |
| Wukong | 8 + 8 + 14 damage over 1.2 s; fast staff reach | Two copies over 2.4 s; up to 72 total damage to one target |
| Bajie | 14 + 24 over 1.6 s; broad heavy sweeps | 60 area damage plus ordinary-enemy knockback |
| Wujing | 10 + 10 + 12 over 1.4 s; long polearm reach | 54 damage in a broad moving wave plus push |
| Tang | 8 + 8 + 12 over 1.2 s; visible finite-range projectiles | 40 pulse damage; nearby allies including self gain up to 20 damage absorption for 2 s |
| Dragon prince | 7 + 9 + 14 over 1.25 s; mobile sword attacks | Steerable horse for 3 s; at most two 30-damage hits per target, at least 0.6 s apart |

One aerial attack per jump; ordinary attacks and jump attacks cost no magic. A jump is not invulnerable to every attack: it evades low attacks while airborne but can meet another aerial attack. Ground-depth overlap and visible foot shadows govern hit alignment. Explain this through brief practice cues.

Each special costs one charge and has a cast lock, preventing double-spend or simultaneous overlapping self-casts. Proposed precise Tang overlap rule: a new shield starts with 20 absorption for two seconds; while a shield is active, another cast may restore absorption up to 20 but does not extend the existing expiry. Shield protection never heals health. Proposed boss rule: ordinary attacks do not interrupt telegraphs or committed attacks; the boss takes damage normally. Specials may cause a 0.25-second stagger only during recovery, at most once per two seconds, and never displace Nezha outside the arena.

These numbers target similar ordinary single-target output, with different reach/area/protection. They are not proof of equal practical power. Check every hero solo and in mixed parties, with one and three upgrades. Useful normal attacks and clear openings must make every permitted party viable.

## 8. Authored level and supply plan

Accepted sequence and target timings:
- 0:00–0:25 mountain path.
- 0:25–1:00 cave approach.
- 1:00–1:45 ruined shrine.
- 1:45–2:00 courtyard supplies.
- Nezha starts no later than 2:00; earlier if cleared quickly.

Proposed wave counts for N starting players:
- Path: 2 + N ordinary melee enemies.
- Cave: 2 + 2N mixed melee/leaper/ranged enemies, introducing attacks before combinations.
- Shrine: 3 + 2N mixed enemies including shields and a brute.
- Maximum simultaneous ordinary enemies: min(8, N + 3); stagger entries to preserve space.
- No ordinary reinforcements during Nezha.

Use authored spawn locations/roles rather than unrestricted random spawning. Approach from edges, caves, ledges and the barrier; warnings precede damage. No damage on arrival. For the initial proof of concept, environmental falls are decorative boundaries, not unannounced instant deaths.

At 1:57, if necessary, warn that Nezha is arriving and withdraw unresolved enemies; complete the transition by 2:00. Preserve survivor state and do not award kills for bypassed enemies. Include boss supplies in the destination so forced advancement cannot remove all access to magic.

Magic proposal: 5N one-charge pickups across the full run, plus the normal N starting charges. Distribute N on the path, N near caves, N at the shrine, N on the courtyard approach, and N as accessible boss-arena supplies. This supports the accepted four-to-six-use target with some missed pickups; it does not guarantee fair collection. Boss supplies are available even after the forced transition. Use deterministic pickup IDs and exactly-once collection.

Health proposal: N pickups in the shrine/approach, each healing 25 up to the collector's maximum. Full-health players do not consume them. Health pickups are a new proposed detail.

## 9. Nezha tuning proposal

Boss health begins at **650 × N**. Scale durability with starting party size, not with disconnects or extra earned upgrades. Keep attack damage consistent across party sizes; target choice rotates fairly.

| Move | Warning | Attack | Recovery |
| --- | --- | --- | --- |
| Spear combination | 0.6 s stance cue | Two short thrusts, 14 damage each; hurt protection prevents unfair immediate multi-hit | 0.8 s |
| Returning ring | 0.7 s raise/aim cue | Readable outbound/return path, 12 damage per pass; evade by ground-depth movement | 0.9 s |
| Fire-wheel rush | 0.9 s marked lane | Locked direction after warning, 20 damage; other lanes stay clear | 1.0 s |

Alternate actions with movement/repositioning. Below half health, reduce gaps between learned moves by about 20%; keep warning duration readable. Avoid back-to-back rushes, offscreen strikes and target tracking after a rush commits.

Target a roughly 40–60-second solo boss encounter at ordinary competence, with faster completion for skilled/upgraded teams. Validate rather than guaranteeing this duration from health arithmetic. A player standing still and holding Attack should not reliably win. Normal hit reactions cannot permanently stun the boss; vulnerability comes from readable recovery windows.

## 10. Art production plan — enemy direction approved

Accepted anchors: CAST CONCEPT 01, GAMEPLAY COMPOSITION 01 revised, five players at 90% and Nezha at 110% relative to the original composition. The generated illustrations remain reference art; exact sprite dimensions/pivots must be defined in a production manifest.

Ordinary enemy appearance direction approved by the owner at 08:50 on 2026-10-01:

| Role | Original visual direction | Readability cue |
| --- | --- | --- |
| Melee | Small horned mountain raider with short saber | Compact forward stance |
| Leaper | Lean cliff acrobat with long scarf | Crouch and landing shadow |
| Ranged | Robed talisman caster | Raised paper charm and visible projectile |
| Shield | Bronze-armored guard with broad shield | Shield-facing silhouette and exposed back |
| Brute | Large ox-like mountain demon with club | Broad shoulders, lowered-head rush cue |

Treat these as original fantasy designs, not claims that they accompany Nezha in the novel. Story connections remain in the reserved narrative work.

Production inventory:
- Five hero sets: idle, walk, facing, three-part/two-part combo as applicable, jump rise/fall, aerial attack, hurt, knockdown, special, victory.
- Horse form: transform, run/turn, impact and return; clone effects reuse Wukong's art with a distinct treatment.
- Nezha: idle/hover, reposition, three attack sequences, warning/recovery, phase cue, hurt, defeat.
- Five enemy sets: entrance, idle/move, warning, attack, hurt, defeat; leaper landing and shield facing.
- Four connected environment sections, breakable props, health/magic items, ground shadows and compact effects.
- HUD portraits, lives, charge slots, timer, boss bar, reconnect/paused/result overlays and touch controls.

Use consistent pixel density and nearest-neighbor display; render ordinary interface text legibly. Keep touch controls outside the walkable arena. Produce one complete hero animation sample at intended gameplay size before expanding the full cast, then test a five-hero/high-enemy-density scene.

Static scenery, sprite sheets, frame manifests and collision maps must be separate assets. Do not use an entire concept screenshot as the game, invent unseen animation quality, or infer collision solely from painted effects. The precise encounter/collision map should be authored as data and inspected with a debug overlay.

## 11. Audio direction — approved

Direction approved at 08:50 on 2026-10-01: energetic arcade synthesis with Chinese-inspired percussion, plucked strings and flute colors, using original/licensed audio. Propose one 45–60-second looping stage theme, a distinct 30–45-second Nezha theme, short victory/retreat/defeat cues, and separate weapon, jump, hit, prop-break, pickup, special, boss-warning and UI sounds.

Per-device music/effects controls; gameplay remains understandable muted. Unlock audio during the student's Ready gesture so automatic launch is compatible with browser audio activation rules. Pause/resume tracks without doubling them; cap overlapping identical impact sounds so five heroes do not swamp warnings. New assets require provenance/license entries.

The enemy appearances, musical direction, distinct Nezha theme and recognizable effects are approved creative requirements. Proposed loop lengths, detailed production settings and finished assets remain subject to specification review and later verification.

## 12. Data, return to MathQuest, and deletion

Proposed handoff record: protocol/build revisions, room/team/run IDs, parent expiresAt, eligible pseudonymous student IDs, hero reservations, earned upgrade IDs, selected narrative decision IDs, and server clock fields. Do not copy question/answer history into the combat object.

Proposed terminal result:
- run ID/version and one team outcome: victory, retreat, defeat or interrupted;
- active duration, boss defeated flag and reason;
- per-player participation (not started/active/spectated/disconnected), hero, upgrades, lives used, active seconds and completed time;
- descriptive gameplay counters only if needed for review; never convert them to math accuracy or mastery.

QuestSession commits the result once, exposes it in its existing reporting workflow, and opens the cartridge's ending slot. A disconnected student receives the already committed result when they return. Never wait for every browser acknowledgement before finishing a team run.

Keep live world state in memory. Persist launch metadata, life/resource transitions, critical phase boundaries and a terminal result/outbox. On backend restart without a provably coherent resume state, close as interrupted rather than reconstructing guessed progress.

Match retention: no later than parent room expiry, 48 hours from original room creation. Teacher deletion closes sockets, revokes tickets and deletes child state/results. Track child run IDs in the parent; add a child expiry alarm as a backstop. No per-frame input telemetry or real student names. Extend ordinary deletion controls to individual saved gameplay records, the session group and applicable saved-work scope per U-09, with clear scope, confirmation and preservation of unrelated academic records when deleting only a gameplay record.

## 13. Hosting, capacity and readiness evidence

A dedicated WebSocket-capable hostname routed to the Cloudflare Worker is the preferred proposal. The actual hostname is unresolved. Do not silently send students to workers.dev, assume the HTTP relay proxies upgrades, register a domain, enable a paid plan or migrate the frontend.

First network gate: demonstrate authenticated WebSockets between the actual teacher/student network paths and the intended hostname, including interruption/rejoin. If unavailable, keep the cartridge marked unavailable/interrupted with mathematics intact; do not claim a polling substitute provides the approved experience.

Initial load target: six teams of five (30 players) plus one teacher, with a separate actual-class trial around the host's historical 23-iPad target. Test different simultaneous party sizes and 1–5 heroes.

Rough capacity estimate, not a bill: 30 players × 20 input messages/s × 180 s = 108,000 incoming WebSocket messages. At Cloudflare's documented 20:1 billing ratio, that is 5,400 request units plus connections/control traffic. Six active run objects × 180 s × 0.128 GB = about 138 GB-s. These exclude academic polling, other applications, Workers charges, storage, pauses and repeated classes. Active simulation timers prevent hibernation; stop them outside play. [CF2–CF3]

Cloudflare currently lists SQLite Durable Objects on Free and Paid plans. Verify actual account-wide usage, quotas and the endpoint before making any cost commitment. Free-tier limits are not evidence that this classroom deployment will be free or reliable. [CF3]

Provisional technical targets: 60 fps rendering target on supported devices, 30 fps minimum under worst approved visual load; network p95 round-trip target below 200 ms. If measurements fail, revisit animation/effect budgets, smoothing and attack cues before claiming classroom readiness.

## 14. Implementation sequence after specification approval

1. Preserve a source checkpoint from the then-current host, reconcile other in-flight cartridge changes, and assign the host release version separately from cartridge v0.1.
2. Implement the scoped cartridge registry, personal entitlement and host handoff/state contracts with a tiny internal multiplayer scene.
3. Verify network authorization, timing, result commit, deletion and 1–5-client synchronization before full art integration.
4. Build one complete hero/enemy interaction, then expand to the five hero kits, authored level and Nezha.
5. Integrate reviewed animation and audio assets, teacher views, responsive controls and reports.
6. Preserve an implementation checkpoint before extended tests.
7. Verify exact candidate; preserve a verified checkpoint only after required gates pass.
8. Release/package and deploy the same preserved candidate; inspect the actual hosted frontend and Worker identities.

The internal multiplayer scene is an eventual verification step; no prototype implementation has been started by this design task.

### Verification matrix

| Area | Required evidence |
| --- | --- |
| Host integration | Normal team joining, five-member cartridge limit, existing gates/votes, personal optional blocks, correct handoff and return |
| Isolation | Other cartridges retain team equipment and their own action/ending paths; no non-Vault fallthrough |
| Ready timing | All ready early; one absent; nobody ready; late Ready; refresh; duplicate commands; teacher pause; launch disconnect |
| Authority | Hero reservation race, one controller per student, spoofed input/state/results, exactly-once pickup/cast/result |
| Combat | Each hero solo; mixed parties; all specials together; normal/air attack alignment; shields, horse repeat-hit and boss stagger limits |
| Outcomes | Three lives, respawn state, spectating, all eliminated, Nezha by 2:00, deadline tie-break, interrupted run |
| Recovery | One/all clients offline, reconnect, hidden/locked/rotated device, process reset, teacher pause/resume/end with acknowledgement |
| U-10 input | Full physical-device release/interruption matrix from section 6; fresh input after every interruption |
| Art/audio | Readable maximum-density scene, actual animations, no blurred UI, muted play, audio resume, boss cues |
| Data | Idempotent reports, gameplay/math separation, record/group deletion, 48-hour expiry, invalid credentials |
| Deployment | Exact versioned assets and Worker, chosen WebSocket hostname, school networks and concurrent class devices |

All runtime rows are **Not run**. Documentation inspection is complete; no game implementation, network test or physical-device result is implied.

Before the first implementation checkpoint, add meaningful tests for readiness/optional-math cutoff races, hero reservations, pickup/cast/result idempotency, authorization, clock/terminal precedence and deletion. Verify controls and visual/audio quality through actual interaction; automated emulation does not replace physical iPad/iPhone checks.

## 15. Approval scope, deferred work and release gates

### Consolidated approval requested

The owner has approved the product, preparation timing, characters, enemies and audio direction. This Review 1 asks for acceptance of the engineering/production baseline, proposed numerical defaults and first implementation stage. No gameplay code or deployment has been performed under this document.

Once approved, begin with:
1. Reconcile the current host commit and preserve an identifiable starting checkpoint on an isolated implementation branch.
2. Build the normal-identity handoff and a small authoritative multiplayer scene with readiness, movement, clock, pause/reconnect and result return.
3. Produce one complete hero/enemy animation sample at the intended display size.
4. Verify those components before expanding to all heroes, the full authored level and Nezha.

A first implementation checkpoint is not a completed cartridge or verified release.

### Explicitly deferred narrative

Keep two opening-cutscene slots and the cartridge ending slot in the lifecycle. For the development scene, those slots may be empty and skip without consuming action time. Preserve structured host decision IDs and gameplay outcomes so later story content can be fitted without rewriting combat.

The complete student-facing narrative, gate/choice text and outcome epilogues require their own content pass before a classroom cartridge release. Do not silently invent or approve that content through this technical specification. Gameplay outcome must not rewrite the students' earlier narrative choices or academic accuracy.

### Operational gates

- The exact WebSocket hostname and available Cloudflare account quota are still unknown. Record them in deployment configuration/provenance once verified. A review approval does not purchase a domain, enable a paid plan or silently replace the existing frontend/relay.
- Local implementation and technical tests can proceed after specification approval; actual hosted multiplayer and school-network suitability require a configured endpoint and measurements.
- School teacher/student network checks, physical controls, approximately 23 actual classroom devices, and exact hosted frontend/Worker identity remain release/deployment evidence requirements.
- No classroom readiness claim until the applicable checks in section 14 pass on the preserved candidate.

### Document authority

Use this consolidated file for future implementation changes and checkpoints. Keep the earlier design decision record as approval history and the technical draft as historical research. Do not maintain three competing technical specifications. Any owner correction updates this consolidated file and records its scope; changes to required behavior must remain visible.

## 16. Source and handbook provenance

Inspected host commit: `7ac12fb98f7ccda591be4ee0bd6baa2f0ee81c28`.
Source inspection read main's project brief v0.5, README, the v0.9.4 approved specification and v0.9.1 privacy requirements. This consolidation also read planning-branch PROJECT-BRIEF.md v0.6 at blob ee7031baef1e1ab5bb2cd1c56dbfa3aa325aac19, the decision record and the technical draft. Main was rechecked and unchanged during the 08:50 approval turn. The handbook's three intake files were refreshed at the same revisions listed below; RELEASE-CHECKLIST.md was read during the earlier source-inspection pass in this conversation.

| Source file | Blob revision |
| --- | --- |
| `src/worker.js` | `d7efdf716e335d62cab3036565284a11dc136353` |
| `src/engine/equipment.js` | `2974cd6141632e81b7b3aeb54e361ad3a76587d2` |
| `src/engine/extensions.js` | `a6a0bf8632305fb7f42f062ef27e423c156ecb71` |
| `public/app.js` | `34899ad8279f9dc4e55ead6f2446ec76c4d58d8e` |
| `public/engine/game-host.js` | `4005dcbc6c84e11df58e43a8a71e591141724096` |
| `public/engine/controls.js` | `9615286a571c8e71c4cdd1c08b8369b21b52fa32` |
| `public/hosting.js` | `ea1c89057ed6bae8376d5964ae9cc766e27a2165` |
| `src/cors.js` | `a4cf1799cfdb84972562274e037180e234702877` |
| `public/cartridges.js` | `97c5280552ea04698e6b6cf3883e6b137d38d4b5` |
| `src/cartridges/registry.js` | `61190818f949c8b9cef8cadd065091b4c1e76b0e` |
| `public/games/registry.js` | `d1614814ed7e8f4987d2a1f8f5117b088b7a56e2` |
| `wrangler.jsonc` | `eea249bc0091a122e205b419afc943bf7fe90cce` |

Handbook read 2026-10-01:
- AI-START-HERE.md: `6557a45aaa6d29d7d1abde808e6d0ac248b08820`.
- UNIVERSAL-RULES.md: `9ec5c8d2b9ab2757c043892b5d7218bc6090da04`; approved U-09 and newly approved U-10 apply.
- CONDITIONAL-STANDARDS.md: `dad2d3a05ca0f18260196ea51ac6351bffffdc1c`; selected S-02, S-03, S-04.
- RELEASE-CHECKLIST.md: `fbab310ffaa75f477f8d63b1885fa0cfeb2b20dd`.

U-01–U-08 retain their task-selected scope; conditional handbook modules remain draft globally. No new global ratification is inferred. The accepted multiplayer scope is an explicit local exception to the host brief's individual-action baseline.

Cloudflare primary documentation checked 2026-10-01:
- [CF1: Use WebSockets](https://developers.cloudflare.com/durable-objects/best-practices/websockets/)
- [CF2: Durable Object lifecycle](https://developers.cloudflare.com/durable-objects/concepts/durable-object-lifecycle/)
- [CF3: Durable Objects pricing](https://developers.cloudflare.com/durable-objects/platform/pricing/)
