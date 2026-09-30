# Shooter practice implementation and check record

30 September 2026 · Build `shooter-0.1.0-alpha.1` · A WILLIAM MCADA PRODUCT.

Authored-map parent: `7be0061943f9a4087145a845ddb8258f5f31c612`. Initial implementation preserved before extended checks: `23c588a80748ca182e8508f5663f7cf83cf6e795`. Branch: `design/industrial-shooter-v0.1`. Handbook baseline: `00cbde605ab08203b6b5fd2374d225155608fc29`; applicable U-01–U-09 and locally selected S-02/S-03/S-04.

The owner's Continue advances the authored map into a standalone practice candidate. Candidate mechanics, provenance, deliberately deferred design proposals and integration limits are described in [the practice README](../../public/games/shooter/README.md). No live room, student record, shared runtime or deployment configuration is changed.

## Checks actually run

Environment: Linux, Node 24.19.0, happy-dom 20.14.5, headless Chromium 153.0.8010.0 through Playwright. A missing browser initially blocked review; an independent temporary Chromium test installation resolved that tooling issue. These tools are not game dependencies.

| Check | Result | Evidence and scope |
| --- | --- | --- |
| Authored map static reachability | Passed previously | Source map's 16 checks; hazards inactive. Not a production-engine playthrough. |
| Simulation/input suite | Passed | 23 tests in `test/shooter.test.mjs`. All eight equipment combinations initialize and step; jump/drop/ladder/swim/prone transitions, required gap, repair overlap, mandatory gate, three-life damage protection, section reset, deadline precedence, swept bullet collision, spread damage cap, boss activation/reset and boss counterplay. |
| Packaged interface lifecycle | Passed | 2 tests in `test/shooter-ui.test.mjs`; setup/start, armor HUD, keyboard, fire toggle, help/pause/resume, blur cleanup, restart cancellation and confirmed reset using the actual generated HTML. |
| Browser entry, layouts and controls | Passed in emulation | Desktop 1280×800, touch phone 852×393, touch tablet 1024×768. No horizontal document overflow, page errors or failed asset loads. Simultaneous pad+Jump, diagonal slide, release, pause/resume and restart cancellation passed. Phone portrait blocks action and requires Resume on return. |
| Timer while paused / terminal expiry | Passed in emulation | Browser clock offset checks confirm pause does not extend deadline; expiry produces Time window closed. Does not establish live server authority. |
| Audio lifecycle | Passed in emulation | A single AudioContext resumes after start/pause/restart cancellation. Distinct event mappings exist. No listening or Apple audio claim. |
| Standalone HTML | Passed | Generated script syntax checked; actual browser starts from selected boss checkpoint with no page errors. Contains no external runtime assets. |
| Render inspection | Passed for candidate scope | Start, foundry and boss Canvas renders plus browser setup/play/portrait screens inspected. Phone setup actions made sticky to remain reachable. This is initial pixel art, not completed final animation. |
| Baseline boss completion | Passed | Scripted ordinary controls, no upgrades or injected immunity: success, one health lost, three lives retained. |
| Boss pacing target | Not met in scripted check | Approximately 13.72 active seconds from boss checkpoint against a proposed 30–45-second target. Keep 80 HP as the documented initial tuning; rebalance in the next tuning revision. |
| Whole-level 2–3-minute pacing and all routes with active threats | Not run | Static route evidence does not substitute for complete playable route and representative-player review. |
| 60-second heavy-scene render performance | Not run | No 60 Hz performance certification. |
| Actual iPhone/iPad Safari, sound listening, school network | Not run | Requires real devices and hosted delivery. |
| Live authority, persistence, preparation, narrative and assisted route | Not applicable to this practice checkpoint | Still required before live integration. |
| Existing classroom cartridge regressions | Not run | No shared code/entry point edited; broader integration regression gate remains open. |
| Hosted delivery | Not run | Candidate is on the design branch; classroom site not updated. |
| Saved work deletion | Not applicable to persisted run records | Runs/results are in memory only. Restart cancellation/confirmation passed; reload discards practice. Only sound preference persists. |

Raw evidence: [25-test output](shooter-test-output.txt), [browser result report](shooter-browser/report.json), [phone play screenshot](shooter-browser/phone-play.png), [boss screenshot](shooter-browser/standalone-boss.png), [tested source hashes](shooter-source-hashes.json).

## Fixes during review

Direction-aware ladder selection resolves neighboring upper/lower connectors. Terminal outcome is guarded against later projectiles in the same step. Restart cancellation now returns to a usable paused screen. Enemies require their full body and warning area to be onscreen before starting attacks. Phone setup action buttons remain visible while the explanatory content scrolls. A first swimming test advanced only six falling frames and had not yet reached the water; corrected to allow the actual crossing, with no physics change.

## Reproduce

Run `python tools/build_shooter_practice.py`, then `node --test test/shooter.test.mjs test/shooter-ui.test.mjs` after installing the repository's existing happy-dom development dependency. `tools/check_shooter_browser.mjs` requires an externally installed Playwright/Chromium; it starts a temporary local static server. Set `SHOOTER_BROWSER` to a nondefault Chromium executable when needed. It regenerates its browser report and screenshots.

This is a checked implementation candidate, not a verified or deployed release. Remaining priorities are boss/whole-level pacing, more complete pixel animation, full active-threat route playthroughs, hosted practice and real Apple-device review. No handbook amendment is proposed.
