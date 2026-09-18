# MathQuest v0.9 Technical Specification

> Repository preservation copy converted from `MathQuest_v0.9_Technical_Specification.docx` on 18 September 2026.  
> Original DOCX SHA-256: `2d324397729e85a7e4b30a359dca18dbd289aadba7052a40326ce95fd6bf2c72`.  
> Conversion changes the container format only; the specification remains the approved v0.9 implementation contract.

A WILLIAM MCADA PRODUCT

MathQuest Version 0.9 Technical Specification

**Action Game Standards Nightfall Balance Vault 7 Extraction Upgrade**

| **Field**                    | **Value**                         |
|------------------------------|-----------------------------------|
| **Document status**          | Approved build specification      |
| **Product version**          | MathQuest v0.9.0                  |
| **Specification version**    | 1.0                               |
| **Author and product owner** | William McAda                     |
| **Prepared**                 | 16 September 2026                 |
| **Implementation target**    | Astra handoff and classroom pilot |

> *This document is the authoritative implementation contract for MathQuest v0.9. It consolidates every accepted decision made after the v0.8 build and supersedes conflicting v0.8 behavior for the subjects addressed here.*

# **Document authority**

This specification freezes the v0.9 release target. It is written for the implementation model and for later human review. Where it conflicts with the v0.8 implementation record, this document controls for v0.9. Existing v0.8 features not changed here remain in force.

Version 0.9 is a stabilization release. It should make the two existing cartridges coherent, readable, controllable on school iPads, easier to supervise, and reliable enough to remain the classroom baseline while later cartridges are designed. It is not permission to widen scope into real-time multiplayer, new cartridges, hosted learner accounts, GradePal integration, or another infrastructure migration.

## **Release decision**

| **Area**                | **v0.9 decision**                                                                                                                                                                                                |
|-------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Shared action games** | Adopt one visible control, readability, recovery, result, and evidence contract for all present and future minigames.                                                                                            |
| **Nightfall**           | Retain the v0.8 city mission and assets, but rebalance enemy pressure, repair perception and collision, add doors and distractions, make equipment matter, and move the final team choice after the action game. |
| **Vault 7**             | Retain the exfiltration concept, clarify its place after the AI decision, improve it into a short three-beat stealth escape, and replace low-resolution game text with a crisp interface.                        |
| **Teacher control**     | Add private per-team Nightfall threat settings and unmistakable team and student completion states while preserving End session and live question extensions.                                                    |
| **Outcomes**            | Give each student one meaningful action run. Failure changes the personal epilogue but never academic mastery or the team's right to finish.                                                                     |
| **Platform**            | Preserve the M1 modular boundaries established in v0.8. Do not create new cartridge-specific code in the shared shell.                                                                                           |

## **Definition of done**

Version 0.9 is complete only when both cartridges can be run end to end on the teacher computer and school iPads, every required control is visible and usable by touch, Vault 7 text is crisp, Nightfall is beatable at Standard without purchasing every upgrade, results appear clearly on the teacher dashboard, reconnects preserve state, and all automated and physical-device acceptance gates in this document pass.

# **Contents**

1 Scope and frozen boundaries

2 Shared action game contract

3 Teacher experience and live control

4 Narrative sequencing and resolution

5 Nightfall gameplay revision

6 Vault 7 extraction upgrade

7 Cartridge and data contracts

8 Implementation plan

9 Verification and release gates

10 Frozen decisions and deferred work

# **1 Scope and frozen boundaries**

## **1.1 In scope**

- A shared action-game input and accessibility contract designed first for landscape iPads and also supporting keyboards.

- Crisp in-game typography and device-pixel-ratio-aware canvas rendering, especially in Vault 7.

- A single-attempt live-session policy with accessible completion, teacher advancement, explicit terminal outcomes, and age-appropriate personal epilogues.

- Nightfall threat presets, finite enemy pursuit, wall-aware sight and sound, closable breakable doors, distractions, collision repair, resource-economy adjustment, and clearer teacher completion reporting.

- Vault 7 narrative handoff, three-beat exfiltration structure, route differentiation, alert behavior, meaningful equipment effects, and clearer outcome writing.

- Nightfall narrative reordering so the final moral choice follows the action mission.

- Cartridge schema fields for optional resolution mechanisms and explicit minigame placement.

- Regression tests for math, imports, differentiated player difficulty, extensions, reports, pause, End session, reconnect, and both cartridge paths.

## **1.2 Explicit non goals**

| **Excluded work**                     | **Reason**                                                                                                                                                                                                                                      |
|---------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Real-time cooperative multiplayer** | The present runtime is client-local with periodic validated snapshots. Shared combat requires an authoritative simulation, low-latency transport, prediction, reconciliation, host migration or server ownership, and a separate network spike. |
| **New cartridges**                    | The goal is to stabilize the shared contract and the two reference cartridges before expanding horizontally.                                                                                                                                    |
| **Full Vault 7 rebuild**              | The existing exfiltration structure is narratively appropriate. v0.9 improves clarity, tension, route identity, and presentation without replacing the entire game.                                                                             |
| **New hosted learner accounts**       | Stable identity and GradePal integration remain future platform work.                                                                                                                                                                           |
| **Infrastructure renaming**           | Do not rename or replace the current GitHub Pages path, Netlify relay, Worker, or Durable Object as part of this release. Infrastructure migration is a separate change with its own rollback plan.                                             |
| **Graphic horror**                    | Nightfall may be tense and may state that a character did not return, but it must remain appropriate for Grade 4 and Grade 5 students and contain no gore.                                                                                      |

## **1.3 Architecture boundaries**

| **Layer**             | **Owns in v0.9**                                                                             | **Must not own**                                                 |
|-----------------------|----------------------------------------------------------------------------------------------|------------------------------------------------------------------|
| **MathQuest shell**   | Rooms, teams, teacher commands, common controls, stage rendering, exports, practice registry | Cartridge story prose, enemy rules, cartridge-specific equipment |
| **Question provider** | Question eligibility, answer contracts, player difficulty, assignment and extension batches  | Narrative consequences or action-game difficulty                 |
| **Cartridge package** | Story graph, scenes, market, choices, minigame placement, outcome templates, assets          | Authentication, persistence adapters, mathematical checking      |
| **Game adapter**      | Simulation, renderer, input map, snapshots, gameplay result                                  | Academic mastery, student roster authority, team voting          |
| **Evidence writer**   | Academic attempts and separate gameplay engagement records                                   | Inferring mastery from combat or stealth performance             |

The game host must consume declarative adapter capabilities. Shared UI may ask an adapter which movement and action buttons to render, but it must not contain branches such as “if Nightfall” or “if Vault 7” to implement gameplay rules.

# **2 Shared action game contract**

## **2.1 iPad control layout**

Landscape iPad is the primary control surface. Every action game uses two fixed thumb zones anchored inside the bottom safe area. Controls remain visible unless the student explicitly collapses the help overlay; no essential action may depend on a tiny contextual target in the center of the screen.

| **Zone**            | **Nightfall mapping**                   | **Vault 7 mapping**    | **Requirement**                                                             |
|---------------------|-----------------------------------------|------------------------|-----------------------------------------------------------------------------|
| **Bottom left**     | Forward, Reverse, Turn Left, Turn Right | Move Left, Move Right  | Movement buttons remain reachable by the left thumb and support held input. |
| **Bottom right**    | Run, Fire, Search or Use                | Jump, Interact or Use  | Every button is text-labeled and reachable by the right thumb.              |
| **Top utility bar** | Pause, Sound, Map, Controls             | Pause, Sound, Controls | Compact utilities may not displace the primary controls.                    |

- Primary buttons are at least 56 CSS pixels in both dimensions and honor iPad safe-area insets.

- The runtime supports simultaneous pointer presses, including Forward plus Run and Move plus Jump.

- Pointer capture, global pointer release, pointer cancellation, visibility change, blur, page hide, and orientation change clear held input.

- No character may continue walking, turning, firing, or running after the finger is lifted or the app loses focus.

- A visible Reset controls command clears all held keys and pointers without resetting game progress.

- Touch controls must not trigger page scrolling, text selection, double-tap zoom, or browser gestures while the player is interacting with the game surface.

## **2.2 Keyboard contract**

| **Action**           | **Nightfall**                               | **Vault 7**                                 |
|----------------------|---------------------------------------------|---------------------------------------------|
| **Move**             | W or Up forward; S or Down reverse          | A or Left move left; D or Right move right  |
| **Turn or facing**   | A or Left turn left; D or Right turn right  | Movement direction controls facing          |
| **Primary action**   | Space fires                                 | Space, W, or Up jumps                       |
| **Secondary action** | Shift runs                                  | E interacts or uses                         |
| **Interact**         | E searches, repairs, opens, closes, or uses | E uses panels, doors, and elevator controls |
| **Map**              | M toggles map                               | Not required                                |

The complete keyboard map appears before Start mission and remains available from a Controls button during play. Labels must describe behavior rather than only display letters. Keyboard and touch input may be used interchangeably in the same run.

## **2.3 Readability and rendering**

Vault 7’s current low-resolution game text fails the release standard. Essential text must not be painted into a low-resolution canvas and enlarged. Objectives, interaction prompts, equipment effects, controls, alerts, checkpoint notices, subtitles, and result messages should be HTML elements layered around or above the canvas. Canvas-only labels are reserved for short nonessential world decoration.

| **Element**                            | **Minimum standard**                                                                                         |
|----------------------------------------|--------------------------------------------------------------------------------------------------------------|
| **Secondary interface text**           | 16 CSS pixels on iPad at normal browser zoom                                                                 |
| **Objectives and interaction prompts** | 18 CSS pixels or larger, high contrast, concise wrapping                                                     |
| **Critical state**                     | Text plus icon or shape; never color alone                                                                   |
| **Canvas backing store**               | CSS size multiplied by current devicePixelRatio, with transforms adjusted so world coordinates remain stable |
| **Font**                               | Readable system or bundled sans serif; no pixel font for essential instructions                              |
| **Text scaling**                       | No rasterized paragraph or objective text scaled from the logical 320 by 180 or 640 by 360 game buffer       |

Responsive testing must cover the actual school iPad viewport, browser chrome visible and hidden, both orientations, and 100 percent browser zoom. The HUD may wrap, but it may not overlap the playfield, controls, or safe areas.

## **2.4 Start pause audio and help**

- A readiness screen identifies the story action, current objective, equipment, touch controls, keyboard controls, sound status, and accessible option before simulation starts.

- The Start mission press creates or resumes the AudioContext. Audio failure must name the missing category or asset and allow play to continue.

- Pause freezes simulation time, clears input, suspends game audio, and preserves the run. Returning from the background never resumes movement automatically.

- The Controls panel may be reopened without restarting the run. Opening help pauses the local simulation.

- All information conveyed by audio also appears visually. Sound remains optional and must not be required to detect an objective or threat.

## **2.5 Attempt and terminal outcome policy**

Each student receives one primary action run during a live classroom session. There is no ordinary live-session retry button and no silent restart after failure. This preserves narrative stakes and prevents fast players from farming a preferred outcome. Developer practice may restart freely because it writes no classroom evidence.

| **Condition**             | **Required behavior**                                                                                                                                  |
|---------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Success**               | Record the success result, stop simulation, show the personal result, and move the student to the waiting state.                                       |
| **Gameplay failure**      | Record a cartridge-specific terminal result, stop simulation, show an age-appropriate personal consequence, and move the student to the waiting state. |
| **Accessible completion** | Use the same run ID and preserved resources. Record accessibility mode without academic penalty.                                                       |
| **Teacher advance**       | Settle the run as advanced by teacher, retain completed objectives and resources, and permit the team to continue.                                     |
| **Reconnect**             | Restore the latest accepted snapshot. Never replenish health, ammunition, equipment charges, pickups, or cleared hazards.                              |
| **Team completion**       | Advance the team when every rostered student has a terminal run or the teacher ends or advances the phase.                                             |

Gameplay outcomes are engagement and narrative evidence only. They never alter answer correctness, mastery, assigned difficulty, or academic grades. The teacher may view and export them separately.

## **2.6 Universal game result contract**

| **Field**           | **Rule**                                                                                                                  |
|---------------------|---------------------------------------------------------------------------------------------------------------------------|
| **status**          | not_started, active, or terminal                                                                                          |
| **outcome**         | Cartridge-declared stable ID such as success, captured, lost, assisted, timed_out, or teacher_advanced                    |
| **objectives**      | Completed and optional objective IDs with accepted sequence numbers                                                       |
| **activeElapsedMs** | Active simulation time only; paused and background time excluded                                                          |
| **resources**       | Starting loadout, pickups, consumption, remaining quantities, and visible effects                                         |
| **accessibility**   | Modes used and switch time; never treated as academic deficiency                                                          |
| **telemetry**       | Bounded cartridge-specific engagement values such as detections, shots, hits, damage, doors, distractions, or checkpoints |
| **revision**        | Game, map, asset, and configuration revision pinned when the run is issued                                                |

# **3 Teacher experience and live control**

## **3.1 Consistent game selection and developer tools**

Game Select must present Vault 7 and Nightfall through the same cartridge-card component. Remove Nightfall’s duplicate descriptive line and direct “Play Nightfall practice” link below Developer tools. Practice access for both cartridges exists only inside the shared collapsed Developer tools section.

| **Practice entry**         | **Minimum controls**                                                                                         |
|----------------------------|--------------------------------------------------------------------------------------------------------------|
| **Vault 7 extraction**     | Route, equipment, adverse-event count, starting checkpoint, action or accessible mode, media check, restart  |
| **Nightfall city mission** | Threat level, equipment, objective checkpoint, survivor state, audio check, action or assisted mode, restart |
| **Shared scene viewer**    | Cartridge, scene, branch variables, sample aliases, viewport and asset status                                |

Practice mode displays a permanent Practice only banner, uses no teacher key, creates no room, calls no live-session command endpoint, and writes no classroom evidence.

## **3.2 Per team Nightfall threat setting**

The teacher receives a private Threat Level control for each Nightfall team. Students do not see the setting name. The teacher may set it after students join and before any member of that team starts the minigame. The value locks when the first team member starts a run so all members receive the same conditions.

| **Preset**    | **Placed enemies** | **Active cap** | **Intent**                                                                       |
|---------------|--------------------|----------------|----------------------------------------------------------------------------------|
| **Guided**    | 24                 | 6              | New or hesitant players; generous recovery and shorter pursuit                   |
| **Standard**  | 34                 | 9              | Default classroom experience; tense but normally beatable without full equipment |
| **Tense**     | 44                 | 12             | Experienced players seeking sustained pressure                                   |
| **Dangerous** | 56                 | 16             | High challenge with denser objective approaches                                  |
| **Nightmare** | 72                 | 22             | Optional expert mode approximating or exceeding v0.8 pressure                    |

Threat Level may tune population, active cap, objective ambush size, search duration, door damage, and pickup generosity within bounded presets. It may not give enemies sight or hearing through solid walls, bypass objective dependencies, alter math difficulty, or change purchased equipment after a run starts.

## **3.3 Completion dashboard**

The teacher must be able to tell at a glance whether a team is still working, inside the minigame, complete, or waiting on one student. A color change alone is insufficient.

- Show room-level counts for Waiting, Active, and Complete teams.

- Show a prominent team banner such as “CIPHER TEAM COMPLETE” when all members are terminal.

- Show every student as Not started, Active, Success or Extracted, Captured or Lost, Assisted, Timed out, or Advanced by teacher.

- For active students, show the current objective or checkpoint and elapsed active time without exposing private academic difficulty to classmates.

- Completion updates through the existing synchronization path and survives teacher refresh.

## **3.4 End session and activity extension**

The universal End session and append-only Extend activity features established in v0.8 remain mandatory. End session is visible in every teacher-owned room state, requires confirmation, settles unresolved games as teacher advanced, freezes further commands, and preserves reports. Extensions never rewrite completed attempts or resolved choices.

Nightfall may additionally expose a teacher-enabled Supply Contract extension before the final market. This is a labeled use of the existing append-only question-extension system, not an independent question engine.

| **Supply Contract rule** | **Requirement**                                                                                              |
|--------------------------|--------------------------------------------------------------------------------------------------------------|
| **Availability**         | Teacher enabled and offered only before the Nightfall market is committed                                    |
| **Question source**      | Selected session modules or eligible imported items through the Question Provider                            |
| **Award**                | Bounded team credits from correct first attempts; default bonus cap 20 credits per team                      |
| **Preview**              | Show question count, affected students, maximum credits, resulting purchase combinations, and estimated time |
| **Integrity**            | Do not alter earlier accuracy, mastery, votes, routes, or completed gates                                    |
| **Purpose**              | Permit a class that finished quickly to earn one additional meaningful preparation choice                    |

The market warns: “The final evacuation will be difficult without equipment. Complete a Supply Contract if your crew needs more credits.” The baseline Standard mission must still be completable without grinding or purchasing every item.

# **4 Narrative sequencing and resolution**

## **4.1 Universal narrative rule**

A minigame must enact a specific story action. It belongs after the team has made the logistical decisions that shape the action and before the moral, political, or strategic decision that reacts to its outcome. Cartridges must not attach a generic code puzzle or action game merely because the engine supports one.

## **4.2 Vault 7 sequence**

| **Order** | **Stage**                       | **Narrative function**                                                                   |
|-----------|---------------------------------|------------------------------------------------------------------------------------------|
| **1**     | Mission briefing                | Introduce Asterion, Helix, the facility, and the reason for infiltration.                |
| **2**     | Academic gates and route choice | Breach the facility and establish the chosen path.                                       |
| **3**     | Resource market                 | Equip the team for the remaining infiltration and escape.                                |
| **4**     | Cipher and AI decision          | Decode the secret message, gain core access, and decide Asterion’s fate.                 |
| **5**     | Extraction minigame             | The facility reacts; each student attempts to escape the collapsing containment route.   |
| **6**     | Epilogue                        | Resolve the AI decision, team outcome, and each agent’s extraction and personnel status. |

Required extraction handoff: “The core has accepted your command. The facility reacts. Alarms sound, containment shutters cycle, and the extraction route begins to collapse. Get your crew out.” Equivalent branch-aware wording may replace this sentence, but the cause-and-effect relationship must remain explicit.

## **4.3 Nightfall sequence**

| **Order** | **Stage**                | **Narrative function**                                                                                                                   |
|-----------|--------------------------|------------------------------------------------------------------------------------------------------------------------------------------|
| **1**     | Opening briefing         | Establish the city collapse, evacuation bus, and unanswered calls.                                                                       |
| **2**     | Gate 1 and route vote    | Restore contact and choose the clinic or depot emphasis.                                                                                 |
| **3**     | Remaining academic gates | Secure information, access, and supplies.                                                                                                |
| **4**     | Resource market          | Equip the crew and optionally complete a Supply Contract.                                                                                |
| **5**     | Complication             | Reveal that the bus cannot leave without power, keys, and a replacement battery.                                                         |
| **6**     | Individual city mission  | Each player contributes to the repair and evacuation operation; the survivor remains optional.                                           |
| **7**     | Final team decision      | After seeing who returned and what was accomplished, vote to depart, return, broadcast, or use the cartridge’s configured final choices. |
| **8**     | Epilogue                 | Resolve the team decision and individual survival records.                                                                               |

The v0.8 order placed Nightfall’s final moral choice before the city mission. v0.9 must move that vote after the minigame. The choice should react to concrete losses, the optional rescue, remaining resources, and the repaired bus rather than predict events the students have not yet played.

## **4.4 Individual play inside a shared story**

Both cartridges use individual action runs while preserving one shared team narrative. The cartridge must not imply that three students each recovered the same unique fuse or changed the same AI core independently. Student screens represent parallel field assignments or personal operational records. The epilogue states that the crew collectively achieved the shared objectives, then identifies how each agent’s assignment ended.

## **4.5 Optional resolution mechanism**

Cipher assembly remains a Vault 7 mechanic, not a platform requirement. The cartridge schema must allow a resolution mechanism of cipher, evidence conclusion, repaired system, extraction zone, final decision, or none. Future cartridges may finish through their own authentic mechanic, and the teacher dashboard—not a forced final code—confirms completion.

# **5 Nightfall gameplay revision**

## **5.1 Design target**

Retain the v0.8 authored city, four required objectives, optional survivor, manual firing, original art, and bundled audio. The revision should preserve tension while making Standard reasonably beatable by first-time students who understand the controls. The minigame remains a short engagement reward rather than the academic center of the cartridge.

## **5.2 Enemy perception and state machine**

| **State**            | **Required behavior**                                                                                     |
|----------------------|-----------------------------------------------------------------------------------------------------------|
| **Wander or patrol** | Remain near an authored anchor and follow low-cost local paths.                                           |
| **Investigate**      | Move toward the last audible event or observed disturbance without knowing the player’s current position. |
| **Chase**            | Pursue only while line of sight or recently refreshed evidence supports pursuit.                          |
| **Search**           | Sweep near the last known position for a bounded time after contact is lost.                              |
| **Return**           | Disengage and travel back toward the local anchor when search expires.                                    |
| **Attack recovery**  | Complete a telegraphed lunge, miss or strike recovery, then resume perception checks.                     |

Enemies may never chase forever solely because they once detected the player. Shamblers have the shortest search memory, runners a longer but still finite memory, and brutes the slowest pursuit. Search duration scales modestly with Threat Level.

## **5.3 Sight and sound occlusion**

- Vision uses line-of-sight checks against walls, closed doors, large vehicles, and opaque building geometry.

- Running, gunfire, alarms, gates, and machinery create sound events at a world position with a radius and duration.

- Sound propagation follows connected navigation space or performs wall and door occlusion checks. Solid walls block sound; closed doors strongly attenuate it; open doorways pass it.

- Gunfire does not alert the entire map. Only eligible enemies reached by the bounded sound event investigate.

- Enemies that hear a sound investigate its source position, not the player’s live position, unless they subsequently see the player or hear a newer event.

## **5.4 Doors and temporary safety**

Contextual Search or Use opens and closes ordinary doors. A closed door blocks line of sight, reduces sound, and blocks movement. It is temporary safety, not a permanent safe room. Enemies that have evidence of the player may strike the door until its cartridge-configured integrity reaches zero. Door durability and enemy door damage may vary by Threat Level; every break event requires visible damage states and a distinct sound cue.

Enemies may not attack a door they cannot reasonably associate with the player. A closed door with no recent sight or audible event does not become a global target. Doors needed for progress must not become permanently impassable because an enemy blocks the interaction point.

## **5.5 Distractions and environmental choices**

| **Interaction**                                 | **Effect**                                                                                    | **Tradeoff**                                                                   |
|-------------------------------------------------|-----------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------|
| **Car alarm**                                   | Creates a strong timed lure at the vehicle and draws nearby enemies through valid paths       | Opens a route but makes the surrounding district dangerous for several seconds |
| **Breaker or public address control**           | Creates a directional machinery or announcement lure                                          | Requires close interaction and may activate lights or hazards                  |
| **Volatile fire barrel or damaged fuel source** | A shot triggers a small bloodless blast or persistent fire hazard that damages nearby enemies | Consumes ammunition, is loud, and may temporarily block the same route         |
| **Opening or closing a door**                   | Breaks sight, delays pursuers, or redirects pathing                                           | Door can be destroyed and may trap the player if used carelessly               |

At least one reliable distraction must be available near each required high-density doorway or bottleneck. Distractions are limited and readable; they do not trivialize every encounter.

## **5.6 Collision and pathfinding repair**

- Replace broad art-bounds collision with authored or inset collision shapes that match the visible footprint of cars, trash, signs, billboards, doors, and building corners.

- Use a circular or rounded player collider and axis-separated resolution so movement slides along obstacles instead of sticking to invisible corners.

- Use swept collision for fast movement and bullets. Running may not tunnel through thin objects.

- Enemy movement uses local avoidance, doorway queues, and a stuck detector that recomputes or nudges a route without teleporting through walls.

- Developer practice includes a collision-overlay toggle showing physical shapes, navigation cells, sound occlusion, line of sight, and stuck state.

- No normal route may contain a visually open passage that is narrower than the player collider plus a reasonable clearance margin.

## **5.7 Resource economy**

Remove the Trauma Kit as a purchasable market item. Its automatic behavior is too similar to the Reinforced Vest and its use is unclear. Ordinary first-aid pickups may remain in the level because they are immediate world resources rather than invisible insurance.

| **Item**            | **Required effect**                                                                   | **Proof to player**                                                             |
|---------------------|---------------------------------------------------------------------------------------|---------------------------------------------------------------------------------|
| **Ammo Pouch**      | Adds 24 starting rounds and raises reserve capacity by 24                             | Starting ammunition, capacity, icon, and pickup behavior visibly change         |
| **Reinforced Vest** | Blocks the first two damaging contacts                                                | Two armor pips disappear when used; hit cue differs from health damage          |
| **Police Carbine**  | Deals two damage per shot with a slightly faster projectile and a larger sound radius | Weapon art, damage label, shot sound, recoil, and louder attraction are visible |

- Default team budget remains compatible with existing rooms, but the market preview must state which combinations are affordable.

- The standard market permits at most two distinct items unless the cartridge configuration is explicitly revised later.

- A Supply Contract can add up to 20 team credits, enough to unlock one stronger two-item combination without enabling every upgrade.

- No item skips a required objective. Every item changes action play and its assisted equivalent.

- Standard must be completable with the base kit or one sensible purchase. Nightmare may reasonably require strong equipment and experienced play.

## **5.8 Objective and map continuity**

The existing dependency chain remains: recover the fuse, restore power, recover the bus keys, obtain and install the garage battery, then start the bus. Keys may be found before power restoration. The clinic survivor remains optional and should provide a concrete advantage such as treatment, route information, or reduced terminal pressure.

The level remains approximately 2560 by 1280. v0.9 changes density and behavior by preset rather than shrinking the map. Core objective doors and approaches must be deliberately tested at every Threat Level so a dense preset cannot create an impossible body-block.

## **5.9 Nightfall outcomes and epilogue**

| **Outcome**          | **Student-facing meaning**                                                        | **Required epilogue direction**                                                                                                              |
|----------------------|-----------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------|
| **success**          | Returned to the bus after completing the operation                                | Agent Alias returned through the garage gate as the engine caught and made it aboard before departure.                                       |
| **lost**             | Health reached zero and the student did not return                                | Agent Alias disappeared into the rain while completing the repair. The radio went silent, and their seat remained empty when the bus left.   |
| **assisted**         | Completed the equivalent route with accessibility support                         | The crew redirected Agent Alias through a protected evacuation route, and they reached the bus after the main repair team secured departure. |
| **timed_out**        | Only an explicit internal safety ceiling or teacher action may produce this state | The evacuation window closed before contact was restored; the record remains unresolved.                                                     |
| **teacher_advanced** | Teacher closed or advanced the run                                                | Mission Control closed the field record and retained completed objectives.                                                                   |

The failure text must be unequivocal without being gruesome. Nightfall may state in the full record that the character did not make it out alive. Do not describe injury, blood, or the manner of death. The emotional emphasis is bravery, loss, and the crew continuing the evacuation.

# **6 Vault 7 extraction upgrade**

## **6.1 Design target**

Vault 7’s minigame already fits the story: the team has infiltrated the facility, cracked the code, decided Asterion’s fate, and must now exfiltrate. v0.9 should make that logic explicit and improve the existing escape without turning it into a second large action game.

## **6.2 Three beat exfiltration**

| **Beat**               | **Required play**                                                                             | **Narrative purpose**                                                 |
|------------------------|-----------------------------------------------------------------------------------------------|-----------------------------------------------------------------------|
| **Break containment**  | Hold Interact at a security panel while avoiding or interrupting a scanner cycle              | The AI decision triggers the lockdown and commits the agent to escape |
| **Cross the sector**   | Navigate moving camera cones, sensors, patrol drones, cover, and a temporary lockdown shutter | Route and equipment choices determine how exposed the agent becomes   |
| **Reach the elevator** | Acquire or confirm elevator access and hold Interact during a final closing-door sequence     | Create a short climax and a clear extraction endpoint                 |

## **6.3 Route identity**

| **Route**             | **Play identity**                                                                                             |
|-----------------------|---------------------------------------------------------------------------------------------------------------|
| **Ventilation Shaft** | Tighter traversal, lower visibility, fewer patrols, more precise jumps, and maintenance access                |
| **Security Corridor** | Wider movement, more cameras and laser sensors, stronger sight lines, and more cover or terminal interactions |

The two routes must differ in geometry, hazards, and resource value rather than only changing background art or one line of ending text.

## **6.4 Alert behavior**

Display a readable alert meter with three named states: Undetected, Searching, and Lockdown. Patrol drones investigate a last-known position, search for a bounded time, and return to patrol when evidence expires. Cameras and spotlights may trigger temporary shutters or route pressure. They may not track through opaque geometry.

Vault 7 retains its current three-detection terminal threshold unless a later cartridge revision explicitly changes it. The default individual active limit remains 180 seconds. Teacher pause freezes the phase deadline. The student sees pressure and status but not a distracting countdown unless the cartridge chooses to reveal the final warning.

## **6.5 Equipment effects**

| **Equipment**       | **v0.9 action effect**                                                                        | **Accessible effect**                                            |
|---------------------|-----------------------------------------------------------------------------------------------|------------------------------------------------------------------|
| **Scanner**         | Shows patrol direction, camera sweep timing, or the next active sensor within a bounded range | Reveals one hazard pattern or removes one ambiguous route choice |
| **Silent Toolkit**  | Jams one sensor, camera, panel, or shutter per configured checkpoint                          | Cancels one detection-producing consequence                      |
| **Maintenance Map** | Shows the safer route, a maintenance bypass, or a hidden resource cache                       | Reveals the lower-risk branch and one recovery option            |

Every activation receives visible HUD confirmation and an event message. Equipment changes the route or hazard response; it may not alter math results or guarantee extraction.

## **6.6 Visual and text cleanup**

- Move all instructions, objectives, alerts, and ending prose out of the low-resolution canvas into the shared crisp UI layer.

- Retain the science-fiction visual identity but add animated warning lights, terminal glow, moving doors or shutters, readable camera cones, sensor states, and alert audio.

- Render short world labels only when they remain legible at the actual iPad viewport. Essential information must also appear in the HUD.

- Use the shared bottom-corner touch layout and Controls panel. Vault 7 does not inherit Nightfall’s Fire or Run buttons unless its adapter declares them.

## **6.7 Vault 7 outcomes and personal fate**

| **Gameplay result**    | **Personal extraction text**                                                                                                                                          |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **extracted**          | Agent Alias reached the surface elevator and made the rendezvous.                                                                                                     |
| **captured**           | Helix security cut off Agent Alias’s beacon inside the facility. The crew received one final distorted transmission, then silence. Their status is missing in action. |
| **timeout**            | The extraction window closed while Agent Alias was still below Vault 7. Search teams found no confirmed trace. Their status is missing in action.                     |
| **fallback_extracted** | Mission Control redirected Agent Alias through a carefully planned emergency route. The agent reached the rendezvous.                                                 |
| **teacher_advanced**   | Mission Control closed Agent Alias’s extraction record. Completed checkpoints remain on file, but the final route is unconfirmed.                                     |

Vault 7 also retains the established first-attempt academic fate bands: below 50 percent is dead or missing in action, 50 through 79.99 percent is wounded, and 80 percent or higher escapes alive. Gameplay result and academic personnel record remain separately reported, but the composed epilogue must not contradict itself.

| **Precedence** | **Composition rule**                                                                                                                                                                                         |
|----------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **1**          | Captured or timed out always produces a final missing-in-action narrative regardless of academic band.                                                                                                       |
| **2**          | If extraction succeeds and first-attempt accuracy is 80 percent or higher, the agent escapes alive.                                                                                                          |
| **3**          | If extraction succeeds and accuracy is 50 through 79.99 percent, the agent escapes wounded.                                                                                                                  |
| **4**          | If the action route is reached but accuracy is below 50 percent, state that the agent reached the extraction route but was lost before the final rendezvous. Do not simultaneously claim confirmed survival. |
| **5**          | Accessible completion is a valid extraction result and follows the same academic fate bands.                                                                                                                 |

Student-facing language uses Missing in action rather than KIA. The teacher report may retain a configurable canonical status ID, but no graphic or celebratory death language appears in the student interface.

# **7 Cartridge and data contracts**

## **7.1 Required cartridge fields**

| **Field**               | **Purpose**                                                                                                                     |
|-------------------------|---------------------------------------------------------------------------------------------------------------------------------|
| **narrativeFlow**       | Ordered nodes with explicit placement of briefing, gates, votes, market, action game, final decision, epilogue, and ended state |
| **gamePlacement**       | pre_final_decision, post_final_decision, or none                                                                                |
| **resolutionMechanism** | cipher, evidence, repaired_system, extraction_zone, final_decision, or none                                                     |
| **inputProfile**        | Touch zones, labels, keyboard bindings, simultaneous-input rules, and utility controls                                          |
| **difficultyProfile**   | Teacher-visible presets, default, lock point, allowed tuning fields, and student visibility                                     |
| **attemptPolicy**       | Live attempt count, terminal outcomes, accessible completion, teacher advancement, and practice reset rules                     |
| **outcomeTemplates**    | Team and personal text keyed by gameplay, academic fate, branch, optional objective, and equipment                              |
| **assetManifest**       | Images, atlases, audio, dimensions, revisions, fallbacks, and preload policy                                                    |
| **evidenceSchema**      | Permitted bounded telemetry and report labels separate from academic evidence                                                   |

## **7.2 Run immutability and migration**

A run freezes cartridge revision, game revision, map revision, asset revision, Threat Level, route, team inventory, final or pending decision state, and roster. The teacher may not change Threat Level or equipment after the first member begins. Old v0.8 local Nightfall or Vault 7 minigame saves are not migrated into v0.9 runs; active classroom sessions must be completed or ended before deployment.

## **7.3 Evidence and reports**

| **Academic evidence**                                                                                                                | **Gameplay engagement evidence**                                                                                                                                 |
|--------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Question ID, module, standard, difficulty, response, normalized answer, correctness, attempt number, hint, time, extension batch** | Run ID and revisions, mode, threat preset, objectives, optional rescue, time, route, equipment, resource use, detections or damage, distractions, doors, outcome |
| **Used for mastery, reports, and future GradePal writeback**                                                                         | Used for engagement, balancing, narrative, and teacher status; never used to infer mastery                                                                       |

CSV and JSON exports identify MathQuest as the product and the selected cartridge separately. Reports include terminal reason, teacher advancement, accessibility mode, and any Supply Contract batch. Unanswered extension items are not silently scored wrong unless a future explicit assessment policy says so.

## **7.4 Security and authority**

- Teacher-only commands remain authorized by teacherKey and idempotent by commandId.

- The server validates stage, run ID, configuration revision, monotonic sequence, objective dependencies, resource ceilings, and terminal outcome envelope.

- The server does not accept client requests to change threat, equipment, roster, academic difficulty, or cartridge revision during a run.

- No per-frame network transport is introduced. Progress uses meaningful events, bounded snapshots, and a low-frequency heartbeat.

# **8 Implementation plan**

| **Package**               | **Deliverable**                                                                                     | **Exit gate**                                                                           |
|---------------------------|-----------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------|
| **1 Shared contracts**    | Adapter-declared controls, attempt policy, outcomes, schema fields, and version pins                | Both cartridges mount without new cartridge branches in the shared host                 |
| **2 Shared interface**    | iPad corner controls, keyboard help, DPR rendering, crisp DOM HUD, practice symmetry                | No stuck inputs; Vault 7 text readable on school iPad                                   |
| **3 Teacher control**     | Threat presets, completion dashboard, Supply Contract preview and commit                            | Settings lock correctly and survive refresh                                             |
| **4 Nightfall systems**   | Finite pursuit, occluded sight and sound, doors, distractions, collision and pathing repair         | Standard is beatable and no required doorway deadlocks                                  |
| **5 Nightfall narrative** | Move final choice after action run and add personal outcome writing                                 | Every success, failure, assisted, and teacher-advanced path reaches a coherent epilogue |
| **6 Vault 7 upgrade**     | Three-beat exfiltration, alert meter, route differences, equipment proof, personal fate composition | Both routes and all terminal states pass regression                                     |
| **7 Hardening**           | Recovery, audio, performance, reports, automated tests, physical iPad matrix                        | All release gates pass with no severity-one or severity-two defects                     |

## **8.1 Stability rule after release**

After v0.9 passes classroom validation, freeze its public contracts for a stabilization period. Subsequent 0.9.x releases should contain bug fixes, accessibility improvements, balance values, text corrections, and asset repairs only. New game modes, networking, learner accounts, or schema-breaking changes move to a later minor or major version.

# **9 Verification and release gates**

## **9.1 Automated platform regression**

- Run Vault 7 and Nightfall with 1, 2, and 5 students and with 3, 4, and 5 academic gates.

- Cover preset questions, imported questions with images, mixed modules, and individual player difficulty overrides.

- Verify pause, reconnect, teacher refresh, live extension, Supply Contract, End session, CSV, and JSON exports.

- Reject unauthorized, stale, duplicated, impossible-stage, and post-end commands without double-awarding credits or duplicating questions.

- Verify inactive configured teams are removed at launch and never block a briefing or ending.

- Verify both cartridge practice entries write no classroom evidence and can restart safely.

## **9.2 Shared input and presentation tests**

- Press movement and action simultaneously with two thumbs; release each pointer inside and outside its button.

- Background Safari, rotate the iPad, open Control Center, return, and confirm no input remains held.

- Open and close Controls, Pause, Sound, and Map without resetting progress or duplicating audio.

- Inspect Vault 7 at the actual iPad viewport. Essential text must remain crisp, readable, unobscured, and at or above specified sizes.

- Test devicePixelRatio changes and resize without blurring the HUD or misaligning touch targets.

## **9.3 Nightfall system tests**

- For every Threat Level, verify the configured population and active cap and prove required objectives remain reachable.

- Prove enemies cannot see or hear through solid walls and that closed doors attenuate sound and block sight.

- Fire in multiple districts and confirm only enemies reached by the bounded sound event investigate.

- Break line of sight and verify enemies search the last-known area, then return rather than chase indefinitely.

- Open, close, damage, and break doors; verify enemies do not attack unrelated doors.

- Use every distraction and verify the lure position, duration, pathing response, and environmental damage where applicable.

- Trace every visible obstacle with the player collider and verify there are no invisible corners or extended snag walls.

- Stress doorways and corners with groups of enemies and verify local avoidance or stuck recovery.

- Complete Standard with base equipment and with each legal purchase combination. Confirm each item visibly matters.

- Fail by health depletion and verify the run becomes terminal, the student advances to waiting, and the correct personal epilogue is used.

## **9.4 Vault 7 system tests**

- Complete the cipher and AI decision, then verify the extraction handoff clearly explains why the escape begins.

- Complete both routes and verify distinct geometry, hazards, and equipment opportunities.

- Trigger Undetected, Searching, and Lockdown; break contact and confirm patrol return behavior.

- Use Scanner, Silent Toolkit, and Maintenance Map in action and accessible modes and verify visible effects and report evidence.

- Reach three detections, individual timeout, accessible extraction, normal extraction, and teacher advance; verify each terminal result and epilogue.

- Test academic fate boundaries at 49.99 percent, 50 percent, 79.99 percent, and 80 percent and verify composed prose never claims both survival and MIA.

## **9.5 Performance and media budgets**

| **Measure**         | **Release target**                                                                                              |
|---------------------|-----------------------------------------------------------------------------------------------------------------|
| **Frame rate**      | 30 fps floor during the configured Standard stress scene; target 60 fps in normal play                          |
| **Main thread**     | No repeated stall above 50 ms during ordinary movement                                                          |
| **Touch response**  | Visible press feedback in the next rendered frame; no sticky input after cancellation                           |
| **Network**         | No per-frame transport; event snapshots and low-frequency heartbeat only                                        |
| **Memory**          | No continuing growth across three practice restarts; listeners, audio nodes, frames, and observers released     |
| **Media**           | Every required image and audio file returns nonzero bytes, decodes on Safari, and matches the manifest revision |
| **Audio lifecycle** | No doubled music after pause, background, reconnect, polling update, or restart                                 |

## **9.6 Human acceptance on school iPads**

| **Scenario**                   | **Pass condition**                                                                                                                                       |
|--------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Guided novice**              | Can identify controls and objective without teacher intervention and can make meaningful progress without immediate mob collapse                         |
| **Standard first-time player** | Can finish through avoidance, doors, distractions, and limited combat without requiring every upgrade                                                    |
| **Experienced player**         | Tense through Nightmare provides materially higher pressure without cheating perception or creating impossible objectives                                |
| **Teacher supervision**        | Teacher can see every team and student state, change pre-run Threat Level privately, extend questions, end the session, and export evidence              |
| **Narrative comprehension**    | Students can explain what they did in the minigame, why it occurred at that point, what their final choice changed, and what happened to their character |

## **9.7 Release checklist**

- [ ] All automated tests pass and the build reports v0.9.0 consistently.

- [ ] No missing images, blue question-mark placeholders, undecodable audio, or unresolved exponent-rendering regression remains.

- [ ] Teacher and student flows pass on a teacher computer and at least two school iPads on Devices Wi-Fi.

- [ ] A one-team session launches even when unused teams were configured.

- [ ] Both game practice modes open only through shared Developer tools.

- [ ] Vault 7 essential text is crisp at normal iPad viewing distance.

- [ ] Nightfall Standard is completed by test players without all upgrades.

- [ ] Every terminal outcome produces coherent, age-appropriate text and advances the student.

- [ ] CSV and JSON reports contain academic and gameplay sections without conflating them.

- [ ] Previous deployment package and backend remain available for rollback.

# **10 Frozen decisions and deferred work**

| **Decision**              | **v0.9 position**                                                                                 |
|---------------------------|---------------------------------------------------------------------------------------------------|
| **Primary device**        | Landscape iPad with labeled corner controls and multitouch                                        |
| **Live attempts**         | One primary action run per student; no ordinary retry                                             |
| **Accessibility**         | Assisted or accessible completion is valid and preserves state                                    |
| **Nightfall default**     | Standard at 34 placed enemies and 9 active; teacher may set per team before the run               |
| **Enemy knowledge**       | No sight or hearing through solid walls; gunfire does not attract the entire map                  |
| **Doors**                 | Closable, sight-blocking, sound-attenuating, and breakable under justified pursuit                |
| **Nightfall market**      | Remove Trauma Kit; keep Ammo Pouch, Reinforced Vest, and Police Carbine; optional Supply Contract |
| **Nightfall sequence**    | Action mission before final team choice                                                           |
| **Vault 7 sequence**      | Cipher and AI choice before extraction minigame, then epilogue                                    |
| **Cipher**                | Vault 7 specific; not required in other cartridges                                                |
| **Academic relationship** | Gameplay affects narrative and engagement evidence only                                           |
| **Multiplayer**           | Deferred to a dedicated network feasibility spike                                                 |
| **Infrastructure**        | No live service or URL rename in this release                                                     |
| **Post-release policy**   | Freeze contracts; use 0.9.x for fixes and balance rather than expansion                           |

## **10.1 Multiplayer placeholder**

Keep identifiers and state schemas capable of later associating several players with one shared game instance, but do not synchronize positions, enemies, bullets, objectives, or damage in v0.9. A future spike must first test WebSocket availability on Devices Wi-Fi and compare authoritative-server, peer-hosted, and asynchronous cooperation models. No interface copy should promise co-op play.

## **10.2 Final implementation instruction**

Build v0.9 from this specification against the current v0.8 codebase. Preserve working academic, hosting, reporting, and cartridge behavior unless this document explicitly changes it. When a requirement cannot be implemented without contradicting another frozen decision, stop and record the conflict before substituting a different behavior. Do not silently narrow the acceptance criteria to match the existing code.
