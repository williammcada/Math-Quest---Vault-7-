# Aerial shooter v0.2.0 — controls and five-minute flight

Owner instruction: 1 October 2026 (Asia/Shanghai), following physical iPhone Edge testing of v0.1.1. The screenshot shows HULL text selected with the native Copy/Search/Ask Copilot/Translate/Look Up menu open; the owner also reported intermittently latched movement.

## Approved changes

- Five-minute cumulative active maximum (300 seconds / 18,000 fixed ticks), replacing the earlier three-minute aerial target. Success/defeat can end the flight sooner. Clock time does not rewind on life loss.
- Player speed +10%: 198 logical units/second baseline; 237.6 with the retained +20% Agility upgrade. Enemy/projectile speed, damage and health are retained.
- Double regular combatants from 32 to 64 through a second mirrored formation three seconds after each authored combat formation. Keep one boss and the six unique supply carriers: one spread, rapid-fire and wingman opportunity plus three repairs. No duplicate rewards or checkpoint farming.
- Midpoint checkpoint at 150 seconds; boss checkpoint at 225 seconds; boss support waves and scenery move with the longer level. The boss receives a 75-second final section.
- Shared automatic input release, native contact-list reconciliation, protected gameplay text/HUD, and native-menu prevention. Keep three lives, touch/keyboard parity, diagonal normalization, accessible play, art/audio, math-earned upgrade policy, and separate academic/narrative outcomes.

## Shared controls

`public/engine/held-input.js` owns physical keyboard/contact state for directional and button profiles. Native touch identifiers and the complete active-touch list recover releases even when a pointer-up path is absent. Pointer Events support mouse/pen and browsers without native Touch Events. Capture failure is tolerated; up/cancel/lost capture are handled at window capture phase. Sliding outside releases that contact's action; reentry remains possible while still held. Multiple fingers and keyboard aliases are independent. No stationary-hold timeout is used.

Blur, hiding, page exit, rotation, geometry changes, pause/blocking overlays, death/respawn and teardown clear held state. Fresh input is required after interruption. Explicit Reset controls always emits neutral state even if the host previously retained a stale flag. Gameplay surfaces suppress selection, image drag and iOS callouts; HUD/world touch handling prevents native long-press gestures. Ordinary forms/editable fields and non-game content retain normal browser behavior.

Both the aerial ActionHost and existing MathQuest button-control hosts consume this shared implementation. This is not a claim that other repositories or historical downloaded files have been changed. Future hosts must reuse it or meet the same tested contract.

## Persistence and integration

v0.2.0 uses `coast/2` and `standard/2`, plus a separate practice save key. The earlier `mq-aerial-practice-run` remains preserved and included in export/clear-all scope. Existing v0.1.1 remains available at its versioned practice directory for old-flight recovery. New and old snapshots are not silently reinterpreted across different enemy schedules.

The unregistered aerial session harness validates the new active limit from tuning. Its existing five-minute shared classroom window remains separately defined; late starts/local pauses do not extend that window. Classroom narrative registration and live backend deployment remain a later integration task.

## Universal requirement

The owner's recurring-control instruction strengthens approved handbook U-10 with native-menu prevention, shared implementation and regression checks. Handbook commit: `c449f9abd191a989056dd64fd18bfe242d3ce59f`. S-03-A records five minutes as the default maximum active duration for new or deliberately revised MathQuest action levels. Other current cartridges' timing is not silently changed by this control repair.

## Verification contract

Test hosted and standalone touch flows, multi-touch in both release orders, missed pointer release/native touch cleanup, capture failure/loss, drag outside, cancellation, stationary holds, HUD long-press, blur/rotation/pause, death/retry, fresh input, and preserved saves. Verify all 64 regular spawns, six unique supply IDs, checkpoints, 300-second expiry, boss feasibility, existing MathQuest regressions, and readable controls with browser bars present. Physical iOS Safari/Edge results must be recorded separately from automated Chromium/native-touch emulation.
