# Coastal Escape v0.3.0 — integration candidate

Approved fictional-island cartridge around flight v0.2.0; matched platform candidate v0.9.5. Implementation checkpoint `91dfa38` preserves the source used for verification. This is not a physical-iOS or deployed-Worker verification claim.

Implemented: 3–5 teacher-selected story gates; operator/records crew choice; optional math-earned aircraft slots; independent authenticated escort flights; three lives and a five-minute cumulative clock; separate crew deadline, pause, expiry and teacher closure; all-player final vote; deliver/exchange/destroy endings; six route/ending combinations; separate personal flight and academic evidence; three original illustrations and two original story music cues. Saved flight recovery is registered with the room's existing local deletion/expiry controls. The owner preview stores no progress and does not award math completion.

## Evidence

- 175/175 Node tests passed, including existing Vault/Nightfall, academics, privacy and held-input regressions plus Coastal 3/4/5-gate journeys, both routes, every ending, ownership, entitlement, teacher pause, expiry alarm and persistence.
- `npm run build` passed: original assets preserved, question catalog parity, recursive JavaScript syntax.
- Actual frontend + Worker class in a local browser harness: mobile illustrated preview; teacher-earned loadout; authenticated native-touch flight; pause; teacher pause/resume; same-run reload; guided completion; absent-player closure; final voting and correct personal epilogue. No JavaScript errors. See `coastal-v0.3.0-evidence/browser-checks.json` and `scripts/verify-coastal-browser.mjs`.
- Chromium native-touch emulation is not physical iPhone/iPad Safari/Edge evidence. Those checks, school-network concurrency and hosted Worker flow remain **Not run**.

## Delivery and deployment

The complete candidate is preserved on GitHub branch `coastal-escape-v0.3-candidate`. Public `main` receives only the standalone story-preview page, its narrative/assets and release documentation. The current classroom frontend/Worker pairing remains untouched until the matched backend is deployed. The preview includes the actual existing five-minute flight but skips mathematics explicitly for owner story review.

Cloudflare deployment was not possible in this workspace: `wrangler whoami` reports no authenticated account. No temporary account or replacement Worker was created.

To install the classroom cartridge:

1. Open the candidate branch on GitHub. Choose **Code → Download ZIP**, then extract it on the Windows teacher computer.
2. Run **Deploy_Backend_Windows.bat**. It installs locked dependencies, runs the tests/build, then deploys to the existing `mathquest-prototype` Worker. If authentication is needed, open a terminal in that extracted folder, run `npx wrangler login`, approve your own Cloudflare account, then rerun the batch file.
3. After backend deployment succeeds, merge the candidate pull request into `main` so Pages publishes the matched v0.9.5 frontend. This is deliberately a separate deployment step.
4. Check the live connection diagnostic and select Coastal Escape in a fresh room. Verify teacher + student gates, equipment, flight, pause/reconnect, final vote and report. Test iPhone/iPad controls, native menus and viewport behavior physically before classroom-ready claims.

Do not use a preview walkthrough as evidence that the multiplayer classroom backend is deployed. Existing saved v0.9.2/v0.9.4 rooms keep their original behavior. The accepted Math Arcade start/replay gating work is a separate host integration and is not substituted for this approved MathQuest cartridge flow.
