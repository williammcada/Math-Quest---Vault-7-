# False Haven v0.3.0 — performance and chapter identity

Application candidate: GitHub commit `64fe2959588411b6aa53b5c23ff4e5f2be91e85d`, tree `794e66d7465fbdc83ec4d1c13b1d14792ed96b12`. Local implementation checkpoint `db0e6a1` has the identical tree. Baseline main `05b29e5332cb56adc7a48010318491b06611452c`. Git HTTPS write credentials were unavailable; connected GitHub tools preserved the exact tree instead. No user intervention required.

## Changes
- Cache derived collision rectangles and navigation occupancy; reuse fields until geometry changes. Door state, windows, water, shortcuts, shutters, trolley and barricades invalidate cached data. Derived state is not serialized. Existing map/saved-run and classroom envelope revisions remain unchanged.
- Cache static ground chunks, prepare appropriately sized decoded atlases, skip off-camera props/buildings/pickups, and avoid writing unchanged HUD text every animation frame. No enemy reduction, level shrink, altered puzzle order, timer extension or simulation time dropping.
- Mandatory opening now explains that officials knew of the intake breach, withdrew guards, diverted transports and left civilians behind locked gates while the false welcome kept playing. Optional investigations add witnesses and documentary evidence.
- Four new illustrated story scenes and an illustrated compound texture atlas. Shared actor/weapon sprites and audio retained. Assets in `public/assets/false-haven/`; built-in image generation, WebP delivery encoding. See asset manifest for art directions and hashes.
- Presentation/adapter version 0.3.0; platform 0.9.4, session envelope `false-haven-cartridge-0.2.0` and map `false-haven-0.1.0` retained deliberately for compatibility. Cache-busted imports select the new frontend.

## Verification
| Check | Result |
| --- | --- |
| Full repository suite | Passed: 186 tests, including Chapter 1/rescue, no-ammunition physical puzzle route, area, classroom branches/equipment/evidence and new geometry invalidation |
| Release validation | Passed: recursive JS syntax and asset checks |
| Real-time comparative profile | Passed in Linux headless Chromium 153.0.8010.0, 2x canvas, 360 frames per scenario; not Windows/iOS hardware FPS |
| Story browser flow | Passed: five gates, dispatch route, guided mission, three endings; images decode; instructions separate |
| Actual GameHost action | Passed: 724 measured simulation updates, movement, 11 shots, speaker, pause/neutral input, saved reload; no page errors |
| Viewports | Passed: 1280×800, 1024×768 and 844×390; no horizontal story overflow |
| Windows Chrome owner replay | Not run; reported constant-lag experience still requires owner confirmation |
| Physical iPhone/iPad | Not run; no physical-device verification claim |
| Hosted Pages | Passed: v0.3.0 story, all new art, mission movement/fire/speaker, guided ending, pause/reload, and 32/32 changed frontend file SHA-256 hashes |
| Live classroom Worker | Not deployed in this revision. Existing classroom activation remains separately pending; this frontend repair does not establish its deployment |

### Measured real-time comparison
Same test script and Chromium environment, moving-player position, gunshot noises and authored enemies:

| Scenario | Baseline worst simulation update | Candidate worst update | Baseline longest frame interval | Candidate longest interval |
| --- | ---: | ---: | ---: | ---: |
| Chapter 1 city | 48.7 ms | 5.5 ms | 66.7 ms | 33.3 ms |
| False Haven utility combat | 51.1 ms | 3.5 ms | 50.1 ms | 16.8 ms |
| False Haven speaker trap | 137.7 ms | 2.9 ms | 150.0 ms | 16.8 ms |

The actual host test (separate from the comparison) measured simulation p95 1.0 ms / max 18.7 ms and drawing p95 0.5 ms / max 6.7 ms. Cold navigation setup can still consume a frame budget. These finite tests do not guarantee every encounter/device meets 60 FPS.

The earlier non-real-time batch benchmark accumulated canvas commands without refreshes, exaggerating drawing stalls. It is retained as exploratory evidence, not a real-world drawing/FPS claim. Real-time baseline idle already ran smoothly in this environment; the user's constant Windows slowdown was not fully reproduced. The measured enemy-navigation stalls were reproduced and materially reduced.

Evidence: `docs/releases/evidence/false-haven-v0.3.0/`. Reproduce with `npm test`, `npm run build`, `REALTIME=1 node scripts/profile-nightfall.mjs`, and `node scripts/verify-false-haven-v3.mjs` (runtime Playwright and Chromium path documented in scripts).

## Deployment follow-up — 8 October 2026

Published source commit `1c3786b7d35b9065226701be6f5b446550de3fac` (tree `4446a6cb6711ff269ca7674b63932859740de773`) incorporates concurrent main `41aed09` without losing its Ironbreak/Blackline illustrations. Local merge checkpoint `1a93acf` has the identical tree. The merged candidate passed the full 186-test suite and release validation again (`merged-tests.txt`, `merged-build.txt`). No False Haven application changes followed the candidate browser verification.

Live Pages browser checks passed: five story gates, dispatch investigation, all three endings, new images decoded, guided mission, actual action movement/fire/speaker, neutral paused input, active-clock pause and saved reload. All 32 frontend files changed by this repair match local SHA-256 hashes. Hosted action sampled 726 simulation updates, p95 1.3 ms / max 22 ms; draw p95 0.5 ms / max 6.5 ms. This is a Linux Chromium sample, not a guarantee or Windows hardware test. Cold geometry work can still exceed one frame. No live Worker deployment is claimed.

The public-site test required ignoring this environment’s proxy certificate in the isolated Playwright context; SHA-256 confirmed public delivered asset identity. No user browser/security settings were changed. Hosted evidence is `hosted-browser.json` and `hosted-files.json`.

Owner replay: open the story preview or direct practice, confirm v0.3.0 (Ctrl+Shift+R if an older label appears), and play on the same Windows Chrome machine. Report any persistent slowdown and location. Do not clear stored progress merely to refresh assets.
