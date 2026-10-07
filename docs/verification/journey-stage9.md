# Journey Stage 9 verification — 8 October 2026

Implementation checkpoint: 625c670 (baseline 975989a). Runtime jttw-0.1.0-stage9-feedback.
Scope: docs/change-specs/journey-stage9-feedback.md. This is a playtest candidate,
not a verified classroom release. No main merge or backend deployment.

Passed on preserved implementation bytes:
- 234 Node tests, including new 1–5-player supply accounting, typed crate drops,
  per-hit sound events, keyboard aliases/release/editable field isolation and Foley mute/deduplication.
- npm run build release validator.
- Five-client Chromium 153 production BrawlRun/Host via local Node WebSocket bridge:
  launch, movement/release, pause/reconnect, all five stages, five viewport sizes,
  touch-after-resize and single result. Not deployed Cloudflare.
- Teacher/two-student production frontend/Worker-class local bridge through required math,
  optional upgrade, launch, teacher controls, reload and unchanged academic evidence.
- Stage 9 standalone file-open: 25 loaded images, start, WASD, Space jump, Z attack,
  C magic, Escape pause, Enter resume, container hit/break, death/respawn input reset,
  blur pause, and three viewport layouts. No page errors.
- Actual OfflineAudioContext rendering of attack, jump, prop hit, break and hurt:
  five distinct nonzero signals; individual peaks below 0.19 (no clipping).
- Screenshot inspection: painted baozi, elixir and crate readable at intended size;
  removed range boxes/aim lines/special rings; character animations retained.

Evidence: journey-stage9/{tests.log,build.log,browser.log,session.log,solo.log,solo.json,
solo-artwork.png}, plus stage/viewport images. Tests are local Linux Chromium, not
physical Windows Chrome or iOS. Human listening/full-run balance, physical-device
stuck-input/viewport/native-menu checks, school network and classroom scale: Not run.

Source changes retained three-minute Journey timing and personal pickup rules.
U-09 not newly exercised: this standalone saves no records, and classroom storage
behavior was unchanged. No handbook edits.

Repository save status: local implementation and verification commits preserved.
GitHub repository ID 1369013008 now resolves to williammcada/Math-Quest; both old
and newly reported repository paths return redirects on branch reads. Connected
blob writes return KeyError 'sha', and direct git push lacks credentials. No
successful remote Stage 9 content save is claimed. The incremental Git bundle in
the playtest ZIP preserves the exact commits/assets for retry; do not rebuild.
