# MathQuest v0.9.1 Technical Specification

> Repository preservation copy converted from `MathQuest_v0.9.1_Technical_Specification.docx` on 18 September 2026.  
> Original DOCX SHA-256: `01e894dca06aadc72ff11f6183a683d979af98b9c73d0ce9f72a57203345da9c`.  
> Conversion changes the container format only; this document remains a build specification and is not proof of implementation or verification.

Vault Seven and Nightfall repair and redevelopment specification

Prepared for implementation from the v0.9 classroom test. This document consolidates the v0.9.1 decisions, observed defects, and required visual and gameplay changes. It is a build specification, not a claim that these changes are already implemented.

# Release purpose

Version 0.9.1 is a repair and clarity release after the first hosted review of v0.9. It addresses failures that prevent students from understanding objectives, navigating safely, using equipment meaningfully, and completing Nightfall. The release preserves the math engine, classroom session structure, reporting separation, one live action run per student, and existing GitHub Pages to relay architecture.

# Verified interpretation of the current Vault Seven mechanics

The current implementation confirms that A, B, and C are checkpoint labels, but they do not currently communicate their functions well. A is reached after holding Interact at the initial amber security panel. B is an automatic progress checkpoint reached while crossing the sector; it is not a terminal and does not require an interaction. C is reached after holding Interact at the access-card objective. The player then reaches the elevator and holds Interact to extract.

The Silent Toolkit can be activated at A, B, or C because the code treats each as a checkpoint slot for a one-use jam. That does not mean B is a terminal. It means B is a recovery and equipment checkpoint. The player-facing design must make this distinction explicit.

The current game has no invisible door in the intended sense, but it does have movement gates that stop the player at x positions until the panel or access card objective is complete. Those gates are visually and mechanically opaque to the player. v0.9.1 must replace them with visible locked doors or shutters that clearly show the missing requirement.

# Vault Seven required changes

## Checkpoint and objective language

| **Current label** | **Actual function**                                         | **Required player-facing replacement**                                                               |
|-------------------|-------------------------------------------------------------|------------------------------------------------------------------------------------------------------|
| A                 | Initial security panel completed; first recovery point      | SECURITY PANEL / CHECKPOINT A. Hold Interact at the amber terminal to break containment.             |
| B                 | Automatic mid-route recovery point; no terminal interaction | SECTOR CHECKPOINT B. Reached automatically after crossing the first sector. No interaction required. |
| C                 | Access-card objective completed; final recovery point       | ACCESS CARD / CHECKPOINT C. Hold Interact to secure the card.                                        |
| Elevator          | Final extraction endpoint                                   | SURFACE ELEVATOR. Hold Interact to board after the access card is secured.                           |

Checkpoint letters may remain as compact identifiers for reports, but they must never be the only explanation. Each checkpoint needs a named objective, a visible state, and a short confirmation message.

## Terminal, door, drone, and sensor redevelopment

The current amber terminal, floating door icon, drone, sensor bars, and checkpoint markers are visually too abstract and read as Atari-era placeholders. They require a coherent art pass with strong silhouettes, readable states, and explicit cause and effect.

- Replace the small floating door icon with a full-width visible security door or shutter spanning the actual blocked passage.

- Show the door state directly: locked, opening, open, closing, or jammed. When locked, display the missing requirement on or beside the door.

- Give terminals a recognizable console shape with screen glow, panel frame, interaction radius, and an obvious “HOLD E / INTERACT” prompt when active.

- Redesign drones as identifiable patrol devices with body, lens, search beam, and clear patrol or investigation animation.

- Redesign sensors as physical emitters, beams, floor grids, or wall-mounted scanning gates. Their active and inactive states must be visible before contact.

- Remove every invisible collision wall. Replace it with a visible door, shutter, barrier, or other story object whose collision matches its art.

- Use DOM or crisp overlay text for objective and state information; do not rely on tiny canvas lettering.

## Route and Maintenance Map correction

The Maintenance Map is currently described as showing live timing, but the implementation does not present useful timing in the normal action view. Its green rectangles are not reliable safe areas: some are merely decorative or route-independent, and at least one can appear safe while a corridor beam still reaches it. This is a design defect, not a player misunderstanding.

- Remove the green rectangle safe zones unless each zone has been validated against every relevant emitter, route, and time state.

- Replace them with an actual map overlay or HUD strip showing each sensor’s state and time-to-change in plain language, for example “Vertical beam: ON 0.8 s” or “OFF 1.2 s.”

- Ensure route-specific forecasts use the actual geometry and emitter state. A marked safe position must be safe for the stated interval.

- For the action mode, display sensor timing next to the corresponding physical sensor, with a consistent icon for ON, OFF, and timing window.

- For accessible extraction, retain answer choices only when the correct choice is grounded in the same validated timing model.

## Equipment redesign

| **Item**                   | **v0.9 status**                                                                                               | **v0.9.1 decision**                                                                                                                                                                                                                                                                                                         |
|----------------------------|---------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Silent Toolkit             | Works as a manual three-second security jam, one charge per checkpoint.                                       | Keep and make central. Display loadout, charge state, activation feedback, and affected device clearly.                                                                                                                                                                                                                     |
| Code Scanner               | Restores a corrupted cipher mapping; its beam forecast is redundant because players can already see the beam. | Keep only as narrative insurance for a corrupted cipher. Remove or replace the extraction forecast effect.                                                                                                                                                                                                                  |
| Maintenance Map            | Intended to mark safe areas and timing; current presentation is unreliable.                                   | Redesign as a validated timing and route-information tool, or remove the purchase until it is truthful.                                                                                                                                                                                                                     |
| New resource: Ghost Beacon | Not currently implemented.                                                                                    | Add as the second meaningful action power-up. A single charge deploys a false signal that draws the patrol drone and nearby search attention away for a bounded period. It must show a visible decoy pulse, affected enemies, duration, and consumed charge. It does not disable sensors and does not guarantee extraction. |

The Ghost Beacon is deliberately different from the Toolkit: the Toolkit suppresses a security device at a checkpoint; the Ghost Beacon changes enemy attention and creates a temporary movement opportunity. It should be available on either route.

## Loadout visibility and audio

- Show the team’s purchased loadout in the pre-run briefing and a persistent compact loadout HUD during Vault Seven and Nightfall.

- For Toolkit, show remaining checkpoint charges and whether the current checkpoint charge is READY, ACTIVE, or USED.

- For Ghost Beacon, show one charge and its READY or USED state.

- For Code Scanner, show “Cipher insurance active” rather than implying that its extraction forecast is essential.

- Add a Vault Seven music track or ambient score. Sound effects alone do not satisfy the intended audiovisual presentation. Provide mute and sound-status controls.

# Nightfall required changes

## Navigation and collision cleanup

The large purple billboard collision rectangles create artificial barriers where the ground appears passable. Remove billboards from the playable map and replace them with burnt-out cars. Shrink or remove environmental colliders that do not correspond to visible solid geometry. If the ground texture is continuous and no physical obstacle is drawn, the player should be able to pass.

- Use burnt-out cars as recognizable cover and navigation landmarks.

- Place at least three car alarms. Only some burnt-out cars should contain alarms.

- Each alarm must be visually identifiable as a car with a flashing red light, not an orange or yellow circle.

- Car alarms attract nearby enemies from approximately half the map, subject to wall and door sound propagation. Do not attract enemies through solid walls.

- Place at least three generic flammable fuel barrels labeled “GAS.” Use strong fire and smoke art.

- A lit or exploding barrel damages or kills anything it touches, including the player. The player must receive a clear warning and damage cue.

- Environmental interactions must use authored objects, animation, sound, and state changes rather than colored placeholder circles.

## Quest interaction repair

The current Search or Use interaction is reported as broken for quest objects, including the survivor, making the mission unbeatable. This is a release-blocking defect.

- Audit every Nightfall quest object through the full hosted flow: fuse, power system, dispatch keys, battery, installation point, bus, survivor, and any final interaction.

- Use one consistent Search / Use interaction contract: visible prompt, correct proximity, hold duration where required, progress feedback, completion confirmation, and server acknowledgement.

- Ensure the survivor can be reached, interacted with, and resolved without relying on a narrow or invisible collision region.

- Add automated tests for each quest object and a manual end-to-end completion test on the hosted page.

## Windows, survivor, and forced route pressure

- Give every Nightfall room one or two breakable windows.

- A window can be broken by shooting or by holding Search / Use. Both methods create noise equivalent to running.

- Make the window visibly change from intact to broken and make the passage physically usable after breaking.

- When the survivor obtains the keys in dispatch, spawn a large horde at the dispatch door.

- If the door is open, the horde enters immediately. If it is closed, the group is briefly delayed while breaking it down; the group should function as a force multiplier rather than a single-file queue.

- The event should create a clear reason to use the newly available window. The window route must be traversable and must not depend on an invisible wall.

# What requires correction in the current understanding

- B is not currently a terminal requiring interaction. It is an automatic checkpoint reached during traversal. The current design makes this too opaque, so the specification changes the presentation rather than treating the confusion as player error.

- The Maintenance Map does contain code for sensor timing and map safe zones, but the timing is not communicated effectively in the normal play view, and the safe-zone geometry is not reliable enough to be called safe.

- The Code Scanner’s extraction forecast is implemented, but it is redundant in practice because the beams are already visible. Its useful effect should be limited to cipher insurance.

- The current Vault Seven runtime uses a three-minute active limit, three total detections, and checkpoint recovery after the first two detections. This remains the base attempt policy unless changed in a later release.

- The loadout is included in the mission briefing, but it is not persistent enough during play. v0.9.1 makes the loadout a visible in-game HUD element in both cartridges.

# Acceptance gates

| **Area**               | **Pass condition**                                                                                                                  |
|------------------------|-------------------------------------------------------------------------------------------------------------------------------------|
| Vault objectives       | A, B, C, and elevator have distinct names, visuals, prompts, and state confirmations.                                               |
| Vault doors            | Every progression block is a visible door or shutter; no invisible door wall remains.                                               |
| Vault equipment        | Toolkit effect is observable; Code Scanner only protects cipher; Ghost Beacon changes patrol attention; loadout remains visible.    |
| Vault map              | Map timing is readable and every marked safe position is validated against the actual beam model.                                   |
| Vault audio            | Music or ambient score plays with mute control and sound effects remain functional.                                                 |
| Nightfall collisions   | No billboard colliders remain; visible cars correspond to collision footprints; passable ground is passable.                        |
| Nightfall interactions | All quest objects, including the survivor, complete through Search / Use and persist through reconnect.                             |
| Nightfall objects      | At least three car alarms and three GAS barrels exist, with authored visual states and tested effects.                              |
| Nightfall windows      | Each room has one or two breakable windows; shooting and holding Search / Use both work; noise equals running.                      |
| Nightfall horde        | Dispatch key event produces the intended open-door or delayed-breakdown behavior and leaves a traversable window escape.            |
| Pilot readiness        | Automated tests pass, hosted teacher and student flows complete, and the planned 23-iPad school test remains the final device gate. |

# Version and scope

This specification targets MathQuest v0.9.1 as a stabilization repair release. It includes the gameplay, presentation, reliability, and pilot privacy requirements below. It does not add real-time multiplayer, new hosted learner accounts, GradePal integration, or a new hosting service.

A WILLIAM MCADA PRODUCT · MathQuest v0.9.1 · Gameplay and pilot privacy specification · Prepared 17 September 2026

# Pilot privacy mode

Pilot privacy mode is required for the first classroom trials. It is a MathQuest pilot setting, not a claim that the project is anonymous or that the hosting provider supplies privacy by itself. The implementation must minimize collection, limit retention, provide teacher deletion, and invalidate access when the session expires or is deleted.

## Privacy requirements

| **Control**             | **Required behavior**                                                                                                                                                                                                                        | **Acceptance evidence**                                                                                                    |
|-------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------|
| Alias generation        | The student does not enter a real name. The server assigns a non-identifying alias such as “Nova-37” when the device joins. The alias is unique within the room and is used in the teacher dashboard and reports.                            | Join with blank or arbitrary display text; verify the stored roster contains generated aliases only.                       |
| Opaque room identity    | Use a random room code and separate random teacher credential. Do not expose student names, email addresses, class names, or other identifying fields in URLs, QR payloads, logs, or reports.                                                | Inspect the teacher URL, student URL, QR data, network payloads, and exported reports.                                     |
| Data minimization       | Collect only device/session identifiers, generated alias, team assignment, math evidence, and bounded gameplay evidence required by the classroom report. No free-text student fields, analytics SDK, advertising, or third-party telemetry. | Search source and network requests; verify no third-party analytics requests and no free-text roster field is stored.      |
| Short retention         | Default pilot retention is 48 hours from room creation, within the approved 24–72-hour window. The expiry timestamp is stored with the room and is shown to the teacher. Expiry must not be extended by polling or ordinary use.             | Create a room with a controlled clock, cross the expiry boundary, and verify access is rejected and stored data is purged. |
| Hosted-session deletion | The teacher has a clearly labeled Delete hosted session control. After confirmation, the server deletes session state, reports, roster, credentials, and gameplay evidence. Deletion is irreversible.                                        | Delete a live and ended room; verify state, JSON report, CSV report, and credentials no longer work.                       |
| Credential expiration   | Teacher credentials and room access become invalid at the retention deadline or immediately after deletion. A deleted or expired credential must not recreate or reveal a room.                                                              | Attempt state, command, report, and delete requests with expired and deleted credentials.                                  |
| Post-expiry response    | Expired sessions return a clear 410-style message: “This pilot session has expired and was deleted.” Deleted sessions return an equivalent deletion message. Student tabs must not continue polling indefinitely.                            | Open old teacher and student URLs after expiry/deletion and verify the UI explains the closure.                            |
| External integrations   | GradePal remains disconnected. No learner account, persistent identity, school directory integration, or external educational writeback is used during the pilot.                                                                            | Review configuration and network requests; no GradePal or account endpoint is called.                                      |

## Privacy-aware teacher workflow

Before class, the teacher creates a fresh room and records its expiration time. Students join with the team code; the server assigns aliases. The teacher may export reports during the retention window, then uses Delete hosted session after the pilot or allows automatic expiry. The teacher should not reuse rooms between classes. A new class receives a new room and new aliases.

## Privacy and gameplay reporting

Academic evidence and gameplay evidence remain separate in the report. Generated aliases may appear in both sections so the teacher can connect a student’s results within the short-lived room. Reports must not contain real names, device hardware identifiers, IP addresses, or unrestricted event logs. Bounded gameplay fields remain limited to route, equipment, objectives, detections, outcome, timing, accessibility mode, and revision data needed for supervision and balancing.

# Combined v0.9.1 release gates

| **Gate**            | **Pass condition**                                                                                                                                                                                                                            |
|---------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Gameplay            | Vault Seven and Nightfall meet the repair requirements in this document, including visible progression objects, reliable interactions, meaningful equipment, collision repairs, authored environmental objects, and tested terminal outcomes. |
| Privacy             | Pilot mode generates aliases, collects no real names or free text, uses opaque room credentials, retains data for 48 hours or less, supports teacher deletion, and invalidates credentials after expiry/deletion.                             |
| Reports             | Exports remain available to the teacher during the retention window, contain generated aliases and separate academic/gameplay sections, and disappear after deletion or expiry.                                                               |
| Security behavior   | Expired, deleted, stale, or mismatched room credentials cannot access state or issue commands.                                                                                                                                                |
| Classroom readiness | Automated tests pass, hosted teacher/student flows pass, and the planned 23-iPad test remains the final device gate.                                                                                                                          |
