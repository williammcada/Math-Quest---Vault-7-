# Coastal Escape v0.2.0 — practice release

Implements the owner's five-minute flight, 64 regular enemies (formerly 32), +10% player movement, shared stuck-control recovery and iPhone gameplay-selection/callout prevention. Midpoint/boss checkpoints are 2:30/3:45. Three lives, one boss, six supply opportunities, damage/health, upgrades, audio, artwork and academic/narrative boundaries are retained.

The control source is `public/engine/held-input.js`, consumed by both button and directional profiles. Existing canonical Vault/Nightfall hosts receive the shared release handling; their game timing and backend are unchanged. Versioned practice directories are generated from the canonical source. Earlier saves are retained separately and can still be exported.

Handbook U-10 and MathQuest timing standard S-03-A are saved to the canonical handbook in commit `c449f9abd191a989056dd64fd18bfe242d3ce59f`. Requirements apply to future work/revisions; this release does not claim all older games in other repositories were repaired.

Validation: 172 local Node tests passed, including existing MathQuest behavior, 10 shared input regressions, and five-minute level/count/clock/boss checks. The existing release validator passed. Standalone and HTTP-module native-touch Chromium checks cover holds, finger release order, leaving/reentering the pad, cancellation, HUD long-press/selection, menu interception, death, blur, rotation, resume, legacy-save preservation and guided play. Six viewport sizes and visual-viewport/rotation regressions are also checked. Machine-readable evidence is in `aerial-v0.2.0-evidence/`.

Physical iPhone/iPad Safari/Edge retesting is still pending. These browser checks use Chromium 153 on Linux with emulated touch; they do not establish physical WebKit behavior or classroom readiness. No live narrative/Worker integration is deployed by this practice revision.
