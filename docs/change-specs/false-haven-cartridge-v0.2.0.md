# False Haven cartridge v0.2.0

## Purpose and contract
Turn the published Nightfall Chapter 2 practice mission into a complete MathQuest cartridge, retaining the existing engine, enemy roster and pistol/carbine/shotgun. Retain the verified 3840 × 1920 compound (2.25× footprint and 2.34× walkable area of Chapter 1). No new weapon or enemy types.

Cartridge ID: `nightfall-false-haven`; content revision: `false-haven-cartridge-0.2.0`; map revision: `false-haven-0.1.0`; game ID: `false-haven`. Keep the platform engine contract at 0.9.4; the catalog's new cartridge ID and revision are the backend capability check. Older Workers must reject launch through the existing catalog guard.

## Story and learning journey
Briefing: the bus reached an evacuation compound and was repaired. Its gates are locked; the apparent safe zone is being abandoned. The crew discovers that the backup power supports only one circuit at a time. Three required story/math gates, with two optional narrative inserts for four/five-gate sessions. Use the existing teacher-selected question provider, first-attempt evidence, review and equipment-earning rules.

First gate → team vote (account for shelter residents or recover dispatch records) → remaining gates → earned equipment → independent action runs → final team vote → three distinct endings. The route alters narrative follow-through, not combat balance. All students retain their final vote, including unsuccessful or absent action players. No Chapter 1 early-rescue stage is inserted. No automatic cross-session import is required.

Required gates: The Welcome Signal; A Circuit Too Few; The Exit Procedure. Inserts: Shelter Four; The Transfer Ledger. Equipment remains ammo pouch, vest, carbine; shotgun is a field pickup. Required math unlocks one slot; existing optional supply mathematics unlocks up to two more.

## Run lifecycle and timing
One issued run per student. 300 seconds active gameplay; teacher pause, local pause and backgrounding stop the local active clock. Separately, a shared authoritative 300-second team window begins when equipment is committed to the field mission. Local pause, late entry, disconnect and reload do not extend that window; teacher pause does. All terminal records or window expiry open the final vote. Server deadline expiry produces `timed_out`, never invented success. Teacher advancement remains distinct. Assisted completion is recorded distinctly and does not change mathematics evidence.

Validate run ownership, issued configuration and map revisions, threat/loadout, monotonic sequence/time/objectives/resources/counters, valid enemy roster and dependency order. Client action evidence remains explicitly client-reported with a server-validated envelope; it is not a deterministic server replay.

## Presentation and persistence
Reuse the approved Nightfall art, music, sprites and effects with accurate scene captions. This release creates new writing and integration, not new commissioned artwork. Provide an owner story preview with explicit math bypass labels and a playable action mission. Preserve the independent practice page. Generic host changes must not change Chapter 1 behavior.

Consulted handbook: AI-START-HERE `6557a45`, UNIVERSAL-RULES `6bde7c1`, CONDITIONAL-STANDARDS `1a79498`; canonical public/ source; durable GitHub checkpoints; U09 deletion and U10 held-input/viewport controls; S03A five-minute active action default. Existing classroom math provider remains in use.

## Acceptance evidence
Run all regressions and build validation. Add authenticated 3/4/5-gate journeys, both routes, all endings, success/loss/assisted/time/teacher outcomes, deadline/pause/alarm tests, ownership/tampering rejection, reload counter preservation and math-evidence invariance. Validate exact checkpoint. Publish Pages preview and attempt Worker deployment only with authorized credentials. Keep live backend and physical iPhone/iPad checks explicitly pending if unavailable.
