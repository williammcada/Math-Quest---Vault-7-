# Ironbreak v0.1.0 — coordinated deployment handoff

1 October 2026. Release candidate; not a deployed or verified classroom release.

## Source reconciliation

Owner requested proceeding with PR #5. Integrate Ironbreak `2d42f3b64196cc7d9c852602e68edaa0350a846a` with current main `59c11c90c2f0893333dfe30b62578fd73deb9bbf`. The only merge conflict is the README's appended project sections; retain both. Preserve all Coastal Escape preview files and assets unchanged. Its complete classroom cartridge remains on `coastal-escape-v0.3-candidate` and is not included in this integration. Do not deploy these two separate backend candidates successively expecting both cartridges to remain installed; a combined runtime requires a separate integration and verification pass.

No Ironbreak gameplay, math, engine version, standalone bytes, or shared input changes are intended. Preserve the accepted source and generated downloads; this reconciliation does not require rebuilding them.

Handbook re-read: AI-START-HERE.md blob `6557a45aaa6d29d7d1abde808e6d0ac248b08820`; UNIVERSAL-RULES.md blob `6bde7c1f4ccdf5ed2163955e553379ba55186e2f`; CONDITIONAL-STANDARDS.md blob `1a794984142f3702c027a28e492a310aaba9f096` (S-02/S-03/S-03-A/S-04); RELEASE-CHECKLIST.md blob `8aeb2207fb48b65ed9454da370c6021499fcd7d0`. No handbook amendments. Existing shared-math migration remains outside this cartridge integration.

## Deployment blocker and exact manual route

No Cloudflare credentials or configured deployment connection were available during release preparation. No backend or frontend deployment was performed. Do not paste tokens into chat.

1. On the Windows teacher computer, open [PR #5](https://github.com/williammcada/Math-Quest---Vault-7-/pull/5) and use its head branch, `feature/ironbreak-cartridge-v0.1`. In the repository's **Code** tab, select that branch, then **Code → Download ZIP**. Extract the ZIP. Confirm the branch's latest commit agrees with this PR's integration checkpoint before proceeding.
2. Test the versioned review on physical iPhone/iPad. Record browser/OS and separate results for stuck input, native menus, and viewport stability. Earlier alpha.2 acceptance does not verify this cartridge's changed shared input.
3. Run `Deploy_Backend_Windows.bat` in the extracted folder. This uses the locked dependencies and existing `mathquest-prototype` Worker configuration. If login is required, open a terminal in that folder, run `npx wrangler login`, and approve your own existing Cloudflare account; rerun the batch file. Stop on any error. Do not create a replacement Worker or alter its Durable Object bindings.
4. Check [the existing relay catalog](https://vault7mathquest.netlify.app/api/catalog) reports a cartridge with `id: ironbreak` and `revision: ironbreak-0.1.0`. A successful upload alone does not establish this. Preserve the existing Netlify relay.
5. Only after the backend and release checks succeed, mark PR #5 ready and merge through the normal GitHub review process. If main has advanced again, reconcile and rerun checks first. GitHub Pages remains on `main` / root; canonical frontend is `public/`. Do not copy public files over the legacy root.
6. Verify [the hosted application](https://williammcada.github.io/Math-Quest---Vault-7-/public/) and its loaded Ironbreak assets against the merged candidate. Use fresh test rooms for teacher and multiple students: required math, optional extra-question upgrades, action, pause/reconnect, retry/deadline, final vote and report. Delete only those test rooms after checking results. Verify the actual school-network path and classroom concurrency before calling it classroom-ready.

Engine identity stays v0.9.4 with Ironbreak v0.1.0 identified separately. Keep a record of the exact deployed Worker and frontend commits. A previous-source rollback must also be a matched pair and must preserve existing room storage; do not delete Durable Objects to undo deployment.

## Verification

Integration-specific results will be recorded after the merge checkpoint. Historical 207-test and browser results are in [the original candidate report](ironbreak-v0.1.0.md); they do not substitute for rerunning checks on this tree. Hosted checks, physical-device checks and school-network/concurrency checks remain Not run.
