# MathQuest: Journey to the West — Technical Design Draft v0.1

**Stage:** DESIGN → CHANGE SPEC. Proposed engineering and production details for review; no implementation authorization or verification implied.
**Owner:** William McAda
**Credit:** A WILLIAM MCADA PRODUCT
**Date:** 2026-10-01, Asia/Shanghai
**Canonical repository:** williammcada/Math-Quest---Vault-7-
**Branch:** design/journey-to-the-west-v0.1
**Host inspected:** main at `7ac12fb98f7ccda591be4ee0bd6baa2f0ee81c28`, v0.9.4 candidate.
**Accepted decisions:** [Design decision record](journey-to-the-west-v0.1-DRAFT.md).
**Scope:** A new MathQuest cartridge with a multiplayer final action section. All new numbers below are proposed tuning unless identified as previously approved.

## 1. Product contract

Preserve normal MathQuest setup, student team-code entry, aliases/credentials, teacher-selected math, individual evidence, shared narrative decisions, and reports. Students join their normal teams once. Their existing team reaches this cartridge's final action section after its gates and relevant decisions. No second room code, team assignment, account, or separate classroom app.

Approved action: one level, maximum five human players, no AI companions, three total lives per player, automatic respawns, 180 seconds of active gameplay, and shared combat state. Each player selects one unclaimed member of the five-person traveling party. Personal math upgrades, individual magic collection, the five specials, Nezha's solo boss fight, and the revised art direction are accepted in the decision record.

Two opening-cutscene positions and narrative payload slots remain reserved as requested. Do not invent story choices or historical chronology to close those deliberately deferred slots. Every story/academic transition must be represented separately from combat results.

Apply a cartridge-specific five-member limit in the normal MathQuest join validation and display remaining places. The inspected host currently validates the team code but has no five-member check in join(). Preserve other cartridges' team behavior. Rejoining with an existing credential must not count as a sixth member.

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

For this cartridge, propose a narrow personal preparation policy:
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
| Network recovery | If no surviving participant is connected, freeze and allow a proposed 15-second reconnection grace window. |
| Terminal | Exactly one victory, retreat, defeat or interrupted result; return through MathQuest's result/ending path. |

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

Each special costs one charge and has a cast lock, preventing double-spend or simultaneous overlapping self-casts. Tang shields do not stack or extend indefinitely; refresh uses the greater remaining amount/duration within the original per-cast limits, never health healing. Boss knockback/stagger is bounded and cannot permanently cancel attack cycles.

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

## 10. Art production proposal

Accepted anchors: CAST CONCEPT 01, GAMEPLAY COMPOSITION 01 revised, five players at 90% and Nezha at 110% relative to the original composition. The generated illustrations remain reference art; exact sprite dimensions/pivots must be defined in a production manifest.

Propose these ordinary enemy looks for owner review:

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

## 11. Audio proposal

Recommended direction for review: energetic arcade synthesis with Chinese-inspired percussion, plucked strings and flute colors, using original/licensed audio. Propose one 45–60-second looping stage theme, a distinct 30–45-second Nezha theme, short victory/retreat/defeat cues, and separate weapon, jump, hit, prop-break, pickup, special, boss-warning and UI sounds.

Per-device music/effects controls; gameplay remains understandable muted. Unlock audio during the student's Ready gesture so automatic launch is compatible with browser audio activation rules. Pause/resume tracks without doubling them; cap overlapping identical impact sounds so five heroes do not swamp warnings. New assets require provenance/license entries.

This direction and the enemy looks are proposals, not yet owner-approved creative decisions.

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

All runtime rows are **Not run**.

## 15. Current review decisions and remaining limits

Optional questions during the 60-second readiness window were approved at 08:43 on 2026-10-01; section 4 records the policy and proposed cutoff handling.

Creative choices for owner review: the proposed five enemy designs and arcade/Chinese-instrument audio direction. Numerical combat/respawn/reconnect defaults are collected here for one specification review rather than individual micro-approvals.

Before implementation approval, close or explicitly accept:
- reviewed enemy/audio direction and a production asset plan;
- result/ending payload contract while preserving the requested deferred narrative slots;
- selected WebSocket hostname/route, account budget, and the network feasibility gate;
- the consolidated gameplay/engineering defaults in this document.

No gameplay code, deployed service, account setting, actual student data or handbook rule was changed. This design does not establish physical-device, latency, balance or animation quality.

## 16. Source and handbook provenance

Inspected host commit: `7ac12fb98f7ccda591be4ee0bd6baa2f0ee81c28`.
Read project brief v0.5, README, v0.9.4 approved specification, v0.9.1 privacy requirements and the current design decision record.

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
