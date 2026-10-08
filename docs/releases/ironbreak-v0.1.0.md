# Ironbreak v0.1.0 — cartridge candidate verification

1 October 2026 · A WILLIAM MCADA PRODUCT

**Status:** Implemented cartridge candidate, not a deployed or verified classroom release. Owner requested cartridge development after accepting shooter alpha.2 as playable. **Ironbreak** and the factory-lockdown story are the proposed title/content for owner review.

## Source and preserved checkpoints

Canonical repository: `williammcada/Math-Quest---Vault-7-`. Branch: `feature/ironbreak-cartridge-v0.1`. Integration base: `6631cda52593fde611a3352489814f7d4bfbe3d3`; accepted shooter source: `b67cd57bcaa09c7bb733c91ab8a24f50b2415dde`. Initial implementation checkpoint saved to GitHub: `aa6141a38386b89662a21b34ba73bea7c61cfd9c`. Subsequent local implementation checkpoints were preserved before the final test pass. The final source manifest identifies the tested runtime/package bytes independently of packaging or upload.

Handbook consulted: `c50115ba1fea9cb552f3ad1415e670a219118b56`, AI-START-HERE.md, UNIVERSAL-RULES.md, CONDITIONAL-STANDARDS.md S-02/S-03/S-03-A/S-04, RELEASE-CHECKLIST.md. Approved U-09 and U-10 apply. No handbook edit in this cartridge task. MathQuest's existing math settings remain intact; synchronized Olivia/Mega Man settings migration is not claimed. The Math Arcade application is outside scope.

## Implemented scope

- Explicit trusted registry and manifest, teacher selector, cover/emblem, three/four/five gate narratives, priority vote, three final decisions and epilogues.
- Existing teacher mathematics, independent student evidence, Event Lead voting, and one base equipment slot plus one per completed optional question block. Spread, four-health armor and experimental agility are implemented; no duplicate upgrades or free extra live equipment.
- Accepted alpha.2 simulation, authored world, graphics and audio preserved byte-for-byte. Shared contact ownership replaces shooter-specific ownership. Cartridge adapter/host provides automatic fire, touch/keyboard, pause/help, sound, clear controls and landscape action layout.
- Server-issued run/phase/attempt identities, monotonic updates, bounded validated snapshots, known authored entity configuration, three lives, server-issued retries and frozen loadouts. Boss success requires the boss defeated in the recorded state. This is envelope validation, not a full physics replay or cheat-proof combat.
- Shared five-minute crew deadline starts at action-stage entry; alarm handles unstarted/disconnected students. Teacher pause shifts the deadline; personal pause/help/retry/reload do not. Early completion or teacher closure leads to final voting. All students retain their narrative vote.
- Irreversible guided alternative, three server-recorded tactical decisions, distinct assisted result, no alteration to academic scoring.
- Local pending updates retain stable command/attempt IDs; reconnect restores acknowledged state, preserving time/lives/health. Transient bullets/effects are cleared on recovery. Network failure pauses action. Existing room deletion clears registered recovery records; offline review disables persistent run recovery.
- Separate JSON/CSV engagement fields and cartridge-specific personal outcomes, including neutral unstarted/time/teacher closure records.

## Checks actually run

Environment: Linux, Node 24.19.0, happy-dom 20.14.5; browser checks use headless Chromium 153.0.8010.0. The final browser report records its actual browser version.

| Check | Result | Evidence / limits |
| --- | --- | --- |
| Full automated suite | Passed | 207 tests; includes existing Vault 7, Nightfall, aerial, math, privacy and shared input regressions. `ironbreak-tests.txt`. |
| Cartridge flow | Passed | 3/4/5 gates × both priorities × all three final decisions; actual teacher/student commands. Required and optional mathematics, frozen equipment, terminal outcomes and separate academic evidence. |
| Lifecycle and validation | Passed | Server alarm without client polling; teacher pause; unstarted/disconnected closure; three lives and stale attempts; retries; invalid snapshots; guided switch; idempotency; student projection isolation; server persistence and session deletion. |
| Real boss simulation through server validator | Passed | Ordinary combat controls from an isolated issued boss-checkpoint fixture to action success; separate MID retry preserves completed guard section. This is not a human full-level playtest. |
| Shared/shooter input | Passed in automation | Capture failure/loss, native touch reconciliation, both thumb release orders, cancellation, outside pad, sustained holds, keyboard aliases, interruption, fresh input, native-menu suppression and editable-field exemptions. |
| Actual MathQuest browser host | Passed in emulation | Desktop 1280×800, phone 852×393, tablet 1024×768; action launch, direction+Jump release, simulated failed save and successful retry, reload, guided completion, final vote, no horizontal overflow or page errors. |
| Action-only single HTML | Passed in browser | Opens and starts practice from generated shared input/game code. |
| Full cartridge single HTML | Passed in browser | Sample required math → priority vote → extra math → two resources → guided action → final vote → epilogue. Confirmed no persistent `mq-ironbreak-*` run records. |
| Build/package integrity | Passed | Existing release validator (assets/catalog/recursive syntax); Worker bundles successfully; runtime/source and generated package hashes recorded. Rebuilding requires pinned development esbuild, not a player-side service. |
| Visual inspection | Passed for inspected scope | Phone action host, final vote and offline personal record inspected. Uses existing alpha.2 pixel art and a new original SVG cover. |
| Physical iPhone/iPad stuck controls | Not run | Owner must test the new shared-input candidate on actual devices; earlier alpha.2 acceptance does not verify changed input. |
| Physical iPhone/iPad native menus | Not run | Long-press/selection/callout release gate remains open. |
| Physical iPhone/iPad viewport stability | Not run | Browser bars, rotation, keyboard and sustained play remain real-device release checks. |
| Hosted frontend/Worker deployment | Not run | Main and live deployment were not changed. |
| School network / classroom concurrency | Not run | No claim of classroom readiness or 23-device verification. |

During verification, the server initially rejected a valid negative boss recovery clock while waiting for its previous bullets to clear. The validator was corrected to accept the simulation's bounded clock behavior; the ordinary-control boss test now guards it. The first offline review used a too-short demo credential; the review now generates a valid random room credential through the same authentication rules. No live authentication rule was weakened.

## Review and deployment

Download `public/Ironbreak-v0.1.0-cartridge-review.html` for a complete single-person offline walkthrough. It contains the actual session engine and cartridge in memory, with sample GCF questions, and sends no classroom data. Its Review controls expose three/four/five-gate setup, reset confirmation, teacher pause and closing the action window. It is a review artifact, not a multi-device backend.

`public/Ironbreak-v0.1.0-practice.html` is action-only. Do not use the former generic filename to distinguish versions. Regenerate with `npm ci` then `npm run build:ironbreak`; source packages are already preserved and do not need regeneration for downloading.

For live use: review this branch, complete physical-device checks, then deploy the matching Worker and canonical `public/` frontend through the existing relay/Pages process. Confirm `/api/catalog` includes `ironbreak-0.1.0`, create a fresh Ironbreak room, run teacher and multiple students through math/preparation/action/reconnect/final vote, test session deletion and verify on school networks. Preserve the existing v0.9.4 engine identity and separate cartridge revision. No infrastructure replacement, main merge or automatic deployment is performed here.
