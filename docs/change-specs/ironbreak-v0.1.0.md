# Ironbreak cartridge v0.1.0 — implementation specification

1 October 2026 · A WILLIAM MCADA PRODUCT

Owner authorized cartridge development around the accepted playable alpha.2 level. Proposed title: **Ironbreak**. Narrative below is the authored candidate for owner review; its writing is not described as separately approved. Source: MathQuest main `6631cda52593fde611a3352489814f7d4bfbe3d3`; shooter `b67cd57bcaa09c7bb733c91ab8a24f50b2415dde`. Work on `feature/ironbreak-cartridge-v0.1`; do not deploy or replace main automatically.

Consulted handbook `c50115ba1fea9cb552f3ad1415e670a219118b56`: AI-START-HERE, UNIVERSAL-RULES, CONDITIONAL-STANDARDS S-02/S-03/S-03-A/S-04, RELEASE-CHECKLIST. Apply U-01–U-08 as selected by MathQuest; approved U-09/U-10. Existing classroom teacher math selection stays intact: S-03-M's synchronized Olivia/Mega Man settings migration is outside this cartridge addition, not claimed implemented. A future Math Arcade host is separate from this MathQuest cartridge.

## Narrative and academic flow

Briefing → required gate 1 → team priority vote (pump district / foundry workers) → gates 2 through 3–5 → equipment preparation → individual Ironbreak action runs → final team vote → epilogue. Reuse current teacher math modules, per-student assignments, difficulty, answer validation, Event Lead voting/ties and optional preparation blocks. Every member completes required mathematics. No new math generator, account system or mastery metric.

A runaway foundry controller has sealed the factory and threatened the district flood pumps. Students remotely pilot armored maintenance suits against robots. Priority vote changes narrative emphasis and ending acknowledgement, not level geometry or hidden difficulty. Final options: isolate the controller (safe manual restart but reduced production), restore supervised local operation (jobs and power with continuing oversight), or publish its control designs (shared repair capacity with coordination costs). Personal suit success/defeat/assistance never overrides the team's narrative vote or mathematical evidence. Three, four and five-gate variants have authored connective text.

## Preparation and action contract

One initial equipment slot. Each additional teacher-sized completed question block grants one extra distinct slot, max three. Existing team recommendation/readiness/lead-confirmation equips each member independently. Spread blaster, reinforced suit (four health), vector boots (+10% locomotion and double jump). Default gun/three health remain viable. No piercing beam, ammo limits, dash or underwater diving. Preserve alpha.2 map, robot tuning, hazards, boss, three lives, midpoint/boss checkpoints and original music.

Team stage opening starts an authoritative 300-second window for all issued runs, including unstarted/disconnected players. Local pause/help/rotation/reload never extend it. Whole-session teacher pause shifts the deadline once. Alarm closes absent players without polling. All terminal runs open final voting early. Teacher can close remaining runs or end/delete the session. Late messages cannot reopen it.

Issued run/attempt/config/map identities; frozen loadout; monotonic sequence and cumulative active time. Server accepts bounded action snapshots with known entities, finite numbers, valid health/upgrade/life/counter/checkpoint transitions. Server alone retries a recorded downed suit, using the actual simulation reset and a new attempt ID. Three total lives. Retries preserve elapsed time and equipment. A boss defeat must accompany action success. This is envelope validation, not authoritative physics replay or cheat-proof combat.

Guided mode is an irreversible per-run alternative, available at start or during action: choose a safe response to a marked crane drop, an exposed corridor and the boss floor sweep. Incorrect choices explain and allow another choice, with no academic record or health penalty. Server records each correct tactical step; three yield `assisted_success`, distinct from arcade success. Existing spent time/lives/loadout remain; no action-mode return or full replay.

## Client, recovery and presentation

Use shared `public/engine/held-input.js` for shooter pad and Jump, including native touch reconciliation and interference suppression. Bundle practice from the same implementation. Safe pause/clear on interruptions, overlays, death, retry and teardown. Reconnect restores last acknowledged server snapshot; bounded transient projectiles/effects are removed on restore without refilling health/lives/time. Pending snapshots retain command ID and attempt identity for idempotent resubmission. Pause on failed network update. Server terminal state wins. Session deletion clears registered local recovery records through existing privacy UI.

Explicit Ironbreak metadata, cartridge selector/cover, narrative scenes, practice entry, game adapter/host, server dispatch, equipment provider, outcome labels and JSON/CSV report fields. Preserve Vault 7/Nightfall behavior and aerial practice. Keep visible engine v0.9.4 identity plus separate Ironbreak v0.1.0 candidate identity; do not label the whole engine a new release. No new recurring service. Frontend and Worker must both ship together before live use.

## Verification and release gates

Preserve implementation checkpoint before extended checks. Test actual teacher/student command flow across 3/4/5 gates; each narrative choice; extra preparation; frozen gear; retries/stale IDs; invalid snapshots; assist; deadline without polling; pause; reconnect; closure; report privacy and deletion. Run shared-input and existing cartridge suites. Browser-check actual host at desktop/phone/tablet viewports and packaged practice. Keep physical iPhone/iPad stuck input, native menus and viewport stability as three separate Not run checks until device evidence exists. School network and classroom concurrency remain Not run. Deliver a source candidate and test entry; no verified classroom release or deployment claim.
