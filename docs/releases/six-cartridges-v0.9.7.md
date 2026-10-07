# MathQuest v0.9.7 — six-cartridge candidate

Status: saved candidate, Cloudflare deployment pending. The repository rename is already live at https://williammcada.github.io/mathquest/. GitHub Pages run 37699326621 succeeded for address commit cd96eb2ba40dfd587459f35d060efd4b73d4b540; root, hosting configuration and review hub returned HTTP 200.

## Included games

Vault Seven; Nightfall: Last Bus Out; Nightfall: False Haven; Ironbreak; Coastal Escape; BLACKLINE: Last Exit. This combines the prior five-cartridge candidate with Blackline, retaining current main's False Haven work and the eight approved painted Ironbreak/Blackline story images. Journey to the West is outside this release.

Frontend and Worker identify platform 0.9.7. Existing 0.9.2/0.9.4/0.9.5/0.9.6 rooms remain supported. Worker name mathquest-prototype, SESSIONS binding, migration v1 and relay URL are retained. The public repository/Pages name is mathquest; historical documents and infrastructure hostnames retain their provenance.

## Verification

Implementation checkpoint c4fb63d. Automated tests: 241 passed, zero failures. Build: passed. Wrangler deployment dry run: passed, 338.06 KiB bundle. Wrangler reported no authenticated account, so no live Worker deployment occurred. The Blackline simulation retains a guarded CommonJS compatibility export alongside its ESM export; Wrangler warns about it, but the ESM export bundles and is exercised in tests and the browser.

Local browser evidence is in six-v0.9.7-evidence. Ironbreak exercised desktop, phone and tablet emulation, network failure/retry, reload, guided completion, final vote, and extra math for a second upgrade. Coastal Escape exercised earned loadout, action start, touch input, teacher pause/resume, reload and guided ending. Blackline exercised the actual shared classroom host, start, control release, pause/resume, custom audio initialization and a saved guided completion. The review checks passed at desktop/phone/tablet sizes, all eight embedded raster images decoded, both DEV action shortcuts worked, and the six-game setup blocked an unsupported backend before any create POST. These use the actual Worker class with in-memory storage, not the live Cloudflare account. Physical iOS, school network and live classroom smoke checks remain pending.

## One Windows deployment

1. Open https://github.com/williammcada/mathquest/tree/release/six-cartridges-v0.9.7 and choose Code → Download ZIP. Extract the entire ZIP.
2. Finish any active classroom sessions. Double-click Deploy_Backend_Windows.bat in the extracted folder. It installs locked tools, runs tests/build and deploys the existing Worker. Complete Cloudflare sign-in if prompted. If authentication fails, open a terminal in that folder, run npx wrangler login, then rerun the BAT.
3. Wait for BACKEND DEPLOYMENT SUCCEEDED. If it fails, retain the error and do not publish the matching frontend.
4. Verify the existing relay catalog reports version 0.9.7 and all six cartridge IDs: vault-7, nightfall, nightfall-false-haven, ironbreak, coastal-escape, blackline.
5. Merge this candidate to main and verify the Pages deployment. Keep Pages main / (root); do not copy public over the root. Verify create/join, one math gate, earned upgrade, action/guided result and report on the live site.

The draft release must remain unmerged until the Worker step succeeds. Earlier five-cartridge deployment instructions are superseded by this package. No new repository or Cloudflare Worker is required.
