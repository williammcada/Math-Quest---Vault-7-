# Journey Stage 1 host integration — 2026-10-01

Tested source candidate: `443a65706ac1b1885526de78cb75fae557d82675`. Main baseline: `59c11c90c2f0893333dfe30b62578fd73deb9bbf`. Journey baseline: remote `225909fcc0ee1624f73b871f900015c31f07ffae`, tree-equivalent local `482fef7`.

## Integration

Three-way application of main’s delta from known baseline 7ac12fb, because recovered local history has a synthetic root. Resolved three conflicts: retained both project-brief histories; adopted canonical main held-input bytes (only a trailing blank line differed); adopted main’s shared adapter tests while retaining Journey-specific tests. All other main additions/changes apply unchanged. Aerial assets/practice and Coastal owner preview are retained. Full Coastal classroom integration remains separately on its candidate branch. Do not merge that candidate by overwriting the Journey changes to cartridge dispatch.

The remote save uses both published baselines as commit parents and the exact local output tree. Main remains unchanged. This is a development checkpoint, not a released or deployed classroom cartridge.

## Passed on the source candidate

- `npm test`: 198 passed, 0 failed. Existing Vault/Nightfall, aerial, academics, privacy, shared input and Journey tests included.
- `npm run build`: asset/catalog validation and recursive JavaScript syntax passed. The command’s label “Release validated” does not imply the deployment or physical-device gates passed.
- `JOURNEY_CHROMIUM=/tmp/chromium JOURNEY_WS_PACKAGE=/tmp/arcade-browser-tools/node_modules/ws/index.js node scripts/verify-journey-session-browser.mjs`: actual public frontend + Worker/QuestSession/BrawlRun classes. HTTP session creation, teacher dashboard and confirmed launch, two isolated student contexts joining by normal PIN, six required answers via keypad, one combat handoff, optional personal question/reward, distinct heroes/readiness, teacher team pause/resume/end, reload reconnect to the same run, terminal student record and authenticated JSON report. Two gameplay evidence records; academics unchanged by ending combat. No browser script exceptions.

Logs: journey-integration-tests.log, journey-integration-build.log, journey-session-browser.log.

## Limits

The HTTP Worker routing is exercised locally; WebSocket upgrade uses a Node bridge into production BrawlRun handlers with in-memory storage. Actual Cloudflare upgrade/CORS/runtime behavior, alarms/hibernation and hosted frontend/Worker pairing are not established by this harness. Session configuration was submitted through the API; the teacher’s creation builder was not exercised in this browser run. Physical iPhone/iPad, safe areas/browser chrome, school networks and classroom concurrency remain Not run. Existing local Cloudflare runtime failure remains unresolved. No live deployment attempted.

## Next checkpoints

Stage-one identity/handoff, controls, landscape layout and local integrated flow are preserved. Next production scope is the remaining hero animation/full authored encounter and Nezha under the approved consolidated spec, with explicit resolution of the existing 180-second exception before any retiming. Narrative and soundtrack remain separately deferred. Before classroom release: configure the approved secure combat hostname, verify Cloudflare frontend/backend deployment, then actual device/network testing. Do not silently deploy this incomplete sample from main.
