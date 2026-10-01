# Journey Stage 1 controls checkpoint — 2026-10-01

Tested local source commit: `fd819361981e9f0a476f356fb4da51e6c2b79e5d`.

Shared held-input integration, neutral reset on interruption/death/respawn, and five-client transport coverage are implemented. The approved 180-second match remains unchanged.

## Evidence

- `npm test`: 179 passed, 0 failed. Full output: journey-stage1-controls-tests.log.
- Chromium browser harness: five connected JourneyHost clients using real WebSockets to production BrawlRun through a Node bridge and in-memory storage. Passed unique heroes, all-ready launch, authoritative movement/release, blur clearing queued magic, teacher pause/resume, reconnect retaining five players, artwork loading, and exactly one result.
- Command: `JOURNEY_CHROMIUM=/tmp/chromium JOURNEY_WS_PACKAGE=/tmp/arcade-browser-tools/node_modules/ws/index.js node scripts/verify-journey-browser.mjs` (use equivalent local paths).
- Screenshot: journey-stage1-controls-browser.png. This is a full-page capture with 844×390 mobile emulation; content extends below the short landscape viewport. It is not evidence of viewport-fit compliance.

## Limits and next work

This is a development checkpoint, not a verified release. Cloudflare local runtime could not start: `uv_interface_addresses returned Unknown system error 1`. Browser verification used a Node bridge, not workerd or the full QuestSession browser flow. Physical iOS and school-network checks remain outstanding.

Next bounded task: fit the match and controls into a short landscape viewport, then exercise the complete teacher/student session flow in a supported Cloudflare runtime. Remaining hero artwork, full level/boss, audio, and narrative remain deferred under the approved staged specification.
