# Shooter alpha.2 — owner-playtest revision

1 October 2026 · `shooter-0.1.0-alpha.2` · A WILLIAM MCADA PRODUCT.

Source parent: `ed4b877b0ed6e0d9f39a6af17256be1b40163d5b`. Implementation preserved before extended browser checks: `839134a56fc05124d86383988e448ee0781288a7`. Owner feedback and exact candidate changes are in §18 of the shooter specification. Music and audio source are unchanged after the owner clarified the phone was silent. Handbook U-10 is preserved at `1d4a64ea8a23149cae483cb5f60bb4c94f2c2a05` and its canonical content was read back.

## Owner evidence and scope

The owner reports about 120 seconds on the first alpha.1 completion, 60 seconds on the second, an approximately 15-second easy boss, and one stuck touchscreen control. The phone model/browser and exact release sequence were not supplied. This revision hardens multiple concrete failure paths; it does not claim that the precise original incident was reproduced or that actual-phone resolution has been confirmed.

Three authored cover obstacles at x1312, x3056 and x4832 interrupt straight middle-route firing and retain upper/water alternatives. Hazards now begin their full warning on approach instead of waiting long enough to be passed. Later robots have stronger candidate tuning. Boss HP is 180, with double low sweeps and separately warned repeated overhead strikes below half health. No shortening of warning intervals, new mandatory upgrade, extra damage per hit, new lives, hidden invulnerability or music replacement is introduced.

## Verification

Environment: Linux, Node 24.19.0, happy-dom 20.14.5 and headless Chromium 153.0.8010.0. Browser tools are temporary test dependencies, not shipped game dependencies.

| Check | Result | Evidence / limits |
| --- | --- | --- |
| Authored geometry | Passed | 16 static checks after all three obstacles; upper/middle/water paths and all four repair caches reachable at baseline. Dynamic hazards inactive for this check. |
| Simulation and packaged interface | Passed | 32 automated tests: 27 simulation/input-sector checks and 5 packaged UI checks. Includes baseline jumping over new obstacles, complete hazard warning, boss second phase, retries, timer priority and existing movement/upgrade rules. |
| Stuck-control regressions | Passed in automation | Capture failure, lost capture, outside drag/release, zero-button movement, 20 repeated slide/tap cycles, cancellation, both thumb-release orders, missing pointer-release recovery via native touch state, focus/page/orientation/resize cleanup, fresh input and independent keyboard aliases. No hold-expiry timeout is used. |
| Desktop and touch browser workflow | Passed in Chromium emulation | Desktop 1280×800, phone 852×393, tablet 1024×768. Simultaneous direction+Jump, diagonal slide, both partial-release orders, touchCancel, drag outside, pause/resume/restart cancellation, timer expiry and phone portrait/landscape recovery. No page errors, asset failures or horizontal overflow. |
| Audio lifecycle | Passed in emulation | One resumed AudioContext after pause/restart cancellation. No music-source change; real listening/mix and Safari behavior not certified by this check. |
| Packaged standalone entry | Passed | Actual browser opens the generated HTML and starts the boss checkpoint. |
| Responsive baseline boss strategy | Passed, scripted | Ordinary control inputs, no upgrades or injected immunity: success at about 30.72 active seconds from boss checkpoint, 3 health and 3 lives remaining. This validates a counterplay path and meets the scripted 30–45-second target, not representative-player difficulty. |
| Stationary firing exploit | Blocked in scripted check | Standing/firing at the same arena position is downed at about 9.12 s with boss HP remaining. |
| Art/layout inspection | Passed for changed scope | Phone gameplay and revised authored map inspected; three new cover beats appear in the map. Full final-art inventory remains incomplete. |
| Real phone stuck-control resolution | Not run | Owner must try this revision on the affected phone. Device lock/unlock and actual Safari interruption behavior remain a release gate under U-10. |
| New full-level pacing, active-threat route review, novice balance | Not run | Prior owner timings describe alpha.1. No claim that every alpha.2 route now takes 2–3 minutes. |
| 60-second heavy-scene performance | Not run | No stable-60-Hz or classroom-load certification. |
| Live narrative, authoritative team timer, saved-run recovery, preparation and assisted route | Not applicable here | Standalone practice only; required before live integration. |
| Hosted/classroom deployment | Not run | Design branch and downloadable candidate only. |

Evidence: [32-test output](shooter-alpha2-test-output.txt), [browser report](shooter-0.1.0-alpha.2-browser/report.json), [phone screenshot](shooter-0.1.0-alpha.2-browser/phone-play.png), [boss screenshot](shooter-0.1.0-alpha.2-browser/standalone-boss.png), [source hashes](shooter-alpha2-source-hashes.json).

The expanded browser test initially used CDP's touchEnd contact list as if it contained the remaining fingers. An event trace showed that it names the released contacts; the harness was corrected and both release orders then passed. No game-code change was made to conceal that harness error.

This remains a checked practice candidate. U-10 is now a shared handbook requirement; other projects have not been automatically audited or patched. Next owner check: repeated direction/Jump combinations, releasing each thumb first, dragging off the pad, pause/return, then the boss and alternate routes.
