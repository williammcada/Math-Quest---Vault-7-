# Journey existing Worker endpoint verification — 8 October 2026

Implementation checkpoint: d49171c (parent 8f1a812).
Canonical repository: williammcada/mathquest, ID 1369013008.
This is a deployment candidate, not a verified live release.

| Check | Result |
| --- | --- |
| Node regression suite | Passed: 250 tests, zero failures |
| Release build validation | Passed: 25 modules, required assets, recursive JS syntax |
| Wrangler deployment dry-run | Passed: bundles Worker and preserves SESSIONS/BRAWLS bindings and migrations; configured COMBAT_PUBLIC_BASE appears in output |
| Exact approved workers.dev URL yields wss ticket | Passed in session test; no session key in URL |
| Invalid/missing/insecure endpoint, other workers.dev host, credentials, query, fragment, path and nonstandard Worker port | Passed: rejected without changing run or academic answers; correction recovers |
| Local classroom browser harness | Passed: Chromium, teacher dashboard, two student contexts, required gates, optional upgrade, hero selection, pause/resume/end, reload/reconnect, terminal reports and preserved academic evidence |
| Public Cloudflare documentation | Confirms WebSocket/Durable Object applications can use workers.dev |
| Cloudflare authentication | Not available: wrangler whoami reports unauthenticated |
| Live backend/frontend publication and socket validation | Not run |
| Physical devices, actual school network, classroom concurrency | Not run |

Browser harness uses in-memory storage and a Node WebSocket bridge, not Cloudflare
workerd. Creation config was supplied through the API; teacher builder not tested.
No claim of live connectivity or classroom readiness follows from these tests.

## Owner-operated deployment route

With the existing Worker mathquest-prototype selected in the signed-in Cloudflare
dashboard, use Settings > Builds > Connect to connect the existing GitHub repo.
Select williammcada/mathquest, production branch integrate/journey-stage9-mathquest,
root directory repository root, build command `npm test && npm run build`, deploy
command `npx wrangler deploy`. Leave non-production branch builds disabled.
Cloudflare's built-in authorization should remain in Cloudflare; no token goes
in chat or the repository. Confirm the selected Worker remains mathquest-prototype.

This publishes the backend candidate when the owner completes deployment. Verify
`/api/health` at the existing Worker reports Journey Stage 9, then check actual
room/socket operation before merging the matching frontend to main. Preserve
existing storage; do not delete/recreate the Worker or its Durable Objects.

References consulted:
- https://developers.cloudflare.com/workers/tutorials/deploy-a-realtime-chat-app/
- https://developers.cloudflare.com/workers/ci-cd/builds/
- https://developers.cloudflare.com/workers/ci-cd/builds/configuration/
