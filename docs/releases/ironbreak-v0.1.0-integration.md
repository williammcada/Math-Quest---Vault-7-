# Ironbreak v0.1.0 — main integration verification

1 October 2026. Candidate only; no hosted or physical-device verification claim.

## Exact source

GitHub checkpoint: `e9cc5ab1fb8643522878f85c0c5754fd8e93fbd5`. Tested Git tree: `44646ea292a8a72f2ef8e42da77451f0a1564854`. Local checkpoint `3a4f3d8` has this exact same tree; the GitHub merge commit preserves both remote parents, Ironbreak `2d42f3b64196cc7d9c852602e68edaa0350a846a` and main `59c11c90c2f0893333dfe30b62578fd73deb9bbf`.

The only merge conflict was the README append. Both project sections are retained. Deployment instructions and project state were updated; runtime code was not changed. The Cloudflare batch file only gained explanatory messages.

## Checks rerun on the integrated tree

| Check | Result | Evidence and limits |
| --- | --- | --- |
| `npm test` | Passed | 207 tests, 207 passes, 0 failures, 0 skipped. Includes Ironbreak lifecycle/academic paths and existing game/input regressions. |
| `npm run build` | Passed | Release validator: 25 modules, retained assets and recursive JavaScript syntax. |
| `node scripts/check-ironbreak-browser.mjs` | Passed | Headless Chromium 153.0.8010.0, Linux. Desktop 1280×800, touch phone 852×393 and touch tablet 1024×768. Actual local frontend/Worker-class harness checks start, input release, failed save/retry, reload, guided completion, final vote, overflow and page errors. |
| Versioned action-only HTML | Passed | Fresh browser start check; artifact was not rebuilt. |
| Complete offline review | Passed | Required math, priority vote, extra math, second upgrade, equipment confirmation, guided play, final vote/epilogue; no persistent Ironbreak run records. |
| Ironbreak preservation | Passed | Git byte comparison against `2d42f3b`: public/app.js, public/games/shooter/, public/engine/, src/, public/cartridges.js and both versioned Ironbreak HTML downloads unchanged. |
| Coastal Escape preview preservation | Passed | Git byte comparison against `59c11c9`: assets, cartridge narrative and preview HTML/JS/CSS unchanged. Full Coastal classroom candidate is not merged. |
| Physical iPhone/iPad stuck controls | Not run | Emulation is not actual Safari/Edge evidence. |
| Physical iPhone/iPad native menus | Not run | Record separately on target devices. |
| Physical iPhone/iPad viewport stability | Not run | Record separately on target devices. |
| Cloudflare and Pages deployment | Not run | No Cloudflare credentials/deployment connection. Main was not changed. |
| School network / classroom concurrency | Not run | No classroom-ready claim. |

The browser script's report content matched the previous report; newly captured action images differ in animation frames. Historical evidence remains intact. This record associates the fresh checks with the exact integrated tree. This documentation-only commit does not alter the tested runtime.

## Next step

Follow [the coordinated deployment handoff](ironbreak-v0.1.0-deployment.md). PR #5 stays draft until the device/release checks and matched Worker deployment are ready. Never publish the frontend alone. Do not deploy the separate Coastal Escape and Ironbreak Workers in succession expecting a combined cartridge set; that requires an explicit runtime integration.
