# MathQuest v0.9.6 combined cartridge candidate

2 October 2026. Saved for review; **Cloudflare has not been updated**. This is the single deployment candidate for Ironbreak and Coastal Escape, preserving Vault Seven, Nightfall and False Haven. Do not deploy the individual cartridge branches in succession.

## Source and review

- Candidate branch: `release/combined-cartridges-v0.9.6`.
- Tested implementation commit: `425f9f894b4acdc68aba573a4d5bb7c0c5741e20`; exact Git tree `ec36e2c7a13ed7f691ecbebc02221b5ac774797d`. Subsequent documentation/evidence commits do not change this runtime.
- Baselines: main `abc183b3f2dd9fe2bd52e4676e03b3e49170729c`, Ironbreak `285c2119d825eeea784e84248c9c509668b16269`, Coastal `5e755fb1d276553dec92ffa1743eaf4609056013`.
- [Live review hub](https://williammcada.github.io/Math-Quest---Vault-7-/public/cartridge-review.html). Ironbreak provides the complete offline sample-math walkthrough; Coastal Escape and False Haven provide their existing story/action previews, skipping math. These do not create classroom records.
- Only the review hub and self-contained Ironbreak review were published to main, at `0b4852009651edbdaf238276148416184e3036be`. The classroom frontend was not published.
- [Change specification and handbook provenance](../change-specs/combined-cartridges-v0.9.6.md).

## Combined behavior

All five cartridges share one catalog and Worker with explicit cartridge dispatch. Integration preserves existing game revisions, accepted artwork, music, maps and combat. It reconciles host selection, deadlines, teacher pause/closure, personal outcomes, exports and backend compatibility checks. Coastal uses its issued room engine version. False Haven and Coastal retain their own result labels, and Coastal has a separate CSV engagement section. Older issued room versions are retained; commands for another cartridge are rejected. Frontend, backend and package identify platform v0.9.6.

| Cartridge ID | Expected revision |
| --- | --- |
| `vault-7` | `vault7-0.9` |
| `nightfall` | `nightfall-city-5` |
| `nightfall-false-haven` | `false-haven-cartridge-0.2.0` |
| `ironbreak` | `ironbreak-0.1.0` |
| `coastal-escape` | `coastal-escape/1` |

## Verification

Evidence is saved in [combined-v0.9.6-evidence](combined-v0.9.6-evidence/).

- Automated Node suite: 226 tests passed; includes catalog/version parity, cross-cartridge isolation, old-room version retention and report labels.
- `npm run build`: passed recursive JavaScript syntax and release asset validation.
- `npx wrangler deploy --dry-run`: passed Worker bundling, 303.91 KiB (84.72 KiB gzip). This did not deploy.
- Ironbreak browser harness: desktop, phone and tablet passed start/input release, network failure/retry, reload, guided route and final vote, with no overflow or page errors. Offline sample math, extra question, upgrades and ending passed.
- Coastal browser harness: story/music gesture, records/exchange, classroom math/equipment/start/touch/pause/save, teacher pause/reload, assisted route, absent-player closure and final/personal outcomes passed without page errors.
- Combined review browser harness: hub and all three linked review pages passed local desktop/phone/tablet layout and error checks. Old and incomplete backend catalogs blocked launch with no room creation request.
- Hosted hub and Ironbreak review: HTTPS HTTP 200 and exact byte parity verified. Hosted Chromium navigation was blocked by the execution environment proxy certificate (`ERR_CERT_AUTHORITY_INVALID`); hosted browser interaction is not claimed. Local browser reports use Chromium 138.0.7204.0.
- Physical iPhone/iPad Safari/Edge input release, native menus and viewport behavior: **Not run**.
- Hosted combined classroom round trip, production Worker behavior and school concurrency: **Not run**, pending deployment.

## One deferred Windows deployment

Nothing in this section needs doing for static review.

1. Open the repository's `release/combined-cartridges-v0.9.6` branch. Choose **Code → Download ZIP**, then extract the whole folder. This single source package includes all five cartridges, frontend, Worker, tests and this handoff.
2. Finish active classroom sessions. Keep the existing Worker name, Durable Object binding/storage and migration configuration. Keep current Pages and relay addresses.
3. Run `Deploy_Backend_Windows.bat`. It installs locked tools, runs tests and build, then deploys the existing Worker. If Cloudflare authentication is required, run `npx wrangler login` in that extracted folder and rerun the script. Stop if any check fails.
4. Verify the relay catalog reports platform v0.9.6 and every cartridge/revision above. Do not publish the matching classroom frontend until this succeeds.
5. Publish this same combined candidate through the established GitHub Pages process. Pages stays `main` and `/ (root)`; canonical frontend stays in `public/`. Do not copy `public/` over the repository root. The existing Netlify relay normally needs no upload.
6. Open `public/connection-test.html`; confirm frontend and server v0.9.6. Create fresh rooms and exercise all five cartridges, particularly new-cartridge math → preparation → action → guided/ending flows, teacher pause, reconnect, expiry, closure and reports. Check retained older rooms separately.
7. Complete target physical-device and hosted classroom checks above before treating this as a classroom-validated release.

Individual earlier candidate reports remain historical records. The combined branch supersedes their separate deployment instructions for this release. No infrastructure rename, address migration, handbook amendment or standalone academic-provider migration is included.
