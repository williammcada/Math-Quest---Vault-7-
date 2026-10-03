# Journey authored combat checkpoint — 3 October 2026

Baseline: remote `f93b9f6`; implementation `6e62aaf`; browser harness `51f99d2`; final test candidate `e120c62` (same runtime source, added authoritative-victory regression). First remote source checkpoint `26ade58523ec615a8468a1562c002a18db01f584`; its tree matches local `51f99d2` exactly. Evidence is about this isolated development source, not main or a deployment.

## Implemented

Mountain → cave → shrine → courtyard → Nezha progression; deterministic waves, five ordinary enemy roles, bounded live counts and harmless entrances. Authored crate/ground supplies have stable IDs, full-meter protection and personal 25-HP healing. At 117 active seconds warn; at 120 force the boss, withdraw unresolved enemies without kill awards and carry remaining authored supplies into the arena. Total authored stock is 5N magic + N health, including forced advancement, without resetting heroes. Existing 180-second Journey exception retained; no retiming.

Nezha scales to the original starter count, rotates targets and spear/ring/rush, locks warning targets/lanes, and shortens only movement gaps below half health. Ordinary hits cannot cancel boss attacks; specials can add at most 250ms recovery per two seconds. Victory before deadline is authoritative and immutable, with exactly-once result delivery. Existing academic evidence, readiness, teacher controls, shared input and horse behavior remain.

## Checks

- Passed: 218 Node tests, including 15 authored-encounter tests and an additional transport victory regression. Build validator and `git diff --check` pass.
- Passed: Chromium local bridge using the production BrawlRun and frontend, five authenticated clients, stage snapshots synchronized across all five, movement/release, queued-magic blur clearing, teacher pause/resume, reconnect, result delivery and five viewport/control layouts. Stage fixtures advance the world deliberately; they are not end-to-end balancing evidence.
- Passed: actual MathQuest frontend and Worker-class teacher/student flow through a local bridge: team PIN joining, six required answers, optional personal upgrade, hero selection, all-ready start, teacher pause/resume/end, reload reconnect, unchanged academics and authenticated report.
- Passed: visual inspection of shrine roles, boss rush warning/health bar, and 568×320 layout screenshots. Enemies are explicitly labeled technical proxies, not accepted production art. Small-screen arena text and crowded proxy labels still need the production presentation pass.
- Not run: sustained human gameplay, each hero's full-level solo/team balance, production art/audio acceptance, live Cloudflare, physical iOS controls/viewport/native-menu behavior, school network or classroom concurrency.

Environment: Node 24.19.0, happy-dom 20.14.3, headless Chromium 153.0.8010.0 provided by @sparticuz/chromium; Node WebSocket bridge and in-memory storage, not workerd. Temporary packages installed under /tmp; no package/lockfile changes. Chromium package extraction encountered an ownership limitation; the same archive was extracted without changing ownership. No permission bypass, account or paid service changes.

Initial old timer unit test failed because its empty-world fixture now spawned real enemies. The fixture now disables the encounter director; a separate full-level test verifies boss arrival and the real 180-second deadline with a protected survivor. Initial missing dependency errors were resolved with test-only packages.

## Remaining work

The complete classroom cartridge is NOT finished. Existing scene scenery and labeled enemy/boss collision proxies need original production assets. Wukong/Bajie/Wujing/Tang specials still use earlier authority samples; only Prince's horse has its full timed choreography. Story, sound, measured difficulty, current-host merge and deployment remain separate. No classroom-ready or verified-release claim.

Handbook read: AI-START-HERE `6557a45`, UNIVERSAL-RULES `6bde7c1`, CONDITIONAL-STANDARDS `1a79498`, RELEASE-CHECKLIST `8aeb220`; AGENTS, project brief and approved consolidated v0.1 sections 8–9. No handbook edits.
