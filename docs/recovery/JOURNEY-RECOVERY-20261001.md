# Journey to the West — recovery and continuation

Recovery date: 1 October 2026. Status: recovered implementation candidate; not a verified release.

## Exact recovered state

Canonical repository: `williammcada/Math-Quest---Vault-7-`.
Recovered source commit: `421e7da2f2d667c24c83d4af9d30330c6c200e99`.
Parent/design checkpoint: `688433bcce9184cc03f434690d2bc33b6bbd5462`.
Observed remote main: `6631cda52593fde611a3352489814f7d4bfbe3d3`.
Observed remote `implement/journey-to-the-west-v0.1-stage1` still points to the design checkpoint. The local implementation contains 29 changed files, including three PNG assets, and was clean when recovered. An independent local clone preserves its history and bytes.

Source includes normal MathQuest identity/handoff, five-player cap, personal optional questions/upgrades, readiness and launch timing, BrawlRun backend, ticket/socket handling, sample combat, teacher control, reconnect/result handling, Wukong/raider atlases and tests. See `docs/verification/journey-stage1.md` for limitations. These are recovered implementations, not all independently behavior-verified features.

The consolidated specification was marked approved in the recovered source; its stage-1 record identifies owner approval at 09:00 on 1 October. Preserve automatic respawn, unique individual hero choices, existing MathQuest teams, all-ready early launch, otherwise ready-subset launch after 60 seconds, and the accepted 90% player / 110% boss art proportions.

## Verification actually performed in recovery

`npm test` was rerun on the clean recovered source: 160 tests, 160 passed, zero failed/skipped. Full output: `journey-stage1-tests-20261001.log`. This confirms the local Node test suite only. Browser synchronization, animation quality, real Cloudflare transport, physical iPhone/iPad controls and school concurrency remain Not run in this recovery. Full level, Nezha, remaining hero art, soundtrack and reserved narrative content remain unfinished.

## Small continuation stages

1. **Preserve recovery:** publish the unchanged recovered source plus this record and test log to `recovery/journey-stage1-20261001`. Confirm the remote tree contains all three artwork files. Do not merge or deploy the unfinished cartridge.
2. **Reconcile host and controls:** compare with current main and other active cartridge branches; bring in the shared held-input mechanism required by current AGENTS/U-10. Keep existing cartridges intact. Record the exact baseline and scoped change specification. Preserve a source checkpoint.
3. **Verify the small multiplayer scene:** test two then five local clients, early/deadline/zero-ready cases, reconnect, teacher pause/end, authorization, expiry/deletion and result return. Repair only this stage's failures and preserve test evidence with its exact commit.
4. **Complete a playable level:** implement remaining hero kits and authored encounters, then Nezha as a separate checkpoint. Keep combat and academic outcomes distinct. Inspect actual animation and sound before expanding asset production.
5. **Integrate and release:** complete the reserved narrative/content pass; configure and verify the WebSocket endpoint; run hosted/device/school checks. Preserve the exact verified candidate before release packaging and deployment.

Each stage ends with a Git checkpoint and a short record of implemented work, checks run, failures/pending checks and the single next task. Stop at a stage boundary rather than combining networking, full asset production and deployment into one turn. Packaging/upload failure resumes from that checkpoint.

## Decisions and blockers to retain

- Recovered approval and code use 180 seconds. Current handbook S-03-A defaults new MathQuest action games to 300 seconds while preserving existing cartridge-specific rules until deliberately revised. Keep 180 seconds for exact recovery; explicitly resolve scope before full-level authoring. Do not silently change only the countdown.
- The newer shared-input rule postdates this source. Its separate input module must be reconciled during stage 2; passing the old suite does not establish current U-10 compliance.
- Production `COMBAT_PUBLIC_BASE` and school WebSocket reachability remain unresolved. Do not assume the HTTP relay supports WebSockets or change hosting providers.
- GitHub push was rejected by automatic approval review because publishing recovered source to the public repository lacked destination-specific authorization. Ask the owner to approve this concrete recovery branch; no retry through another upload path before approval.
- Do not discard the original conversation/source or recreate artwork merely because an upload failed.

## Handbook consulted during recovery

Current connected GitHub reads, file blob revisions (not repository commits): AI-START-HERE.md `6557a45aaa6d29d7d1abde808e6d0ac248b08820`; UNIVERSAL-RULES.md `6bde7c1f4ccdf5ed2163955e553379ba55186e2f`; CONDITIONAL-STANDARDS.md `1a794984142f3702c027a28e492a310aaba9f096` (S-02, S-03, S-04 and timing/settings additions); RELEASE-CHECKLIST.md `8aeb2207fb48b65ed9454da370c6021499fcd7d0`. Also read current main PROJECT-BRIEF.md and AGENTS.md. No handbook rules were changed.
