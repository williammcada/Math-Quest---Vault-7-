# Journey existing Worker endpoint — 8 October 2026

Owner authorization: after confirming no purchased domain, owner said “proceed”
to review and revise the workers.dev restriction using the existing endpoint.
Canonical base: williammcada/mathquest, integration commit
8f1a81275df9477077bde22093c458ad57acbbfc. Handbook consulted: AI-START-HERE.md,
UNIVERSAL-RULES.md, CONDITIONAL-STANDARDS.md (S-02/03/04), RELEASE-CHECKLIST.md
at c50115ba1fea9cb552f3ad1415e670a219118b56 (v0.1.3).

## Approved narrow exception

Supersede Journey v0.1 section 13 and Stage 9 integration's custom-host-only
requirement for https://mathquest-prototype.willmcada-apps.workers.dev, confirmed
in the owner's Cloudflare screenshot. Cloudflare documents WebSockets on
workers.dev in https://developers.cloudflare.com/workers/tutorials/deploy-a-realtime-chat-app/.
This is platform support, not evidence of school-network reachability.

Configure COMBAT_PUBLIC_BASE to that origin and explicitly retain workers_dev.
Permit only that exact workers.dev hostname with the default HTTPS port. Retain
HTTPS custom hosts and HTTP localhost development; reject malformed URLs,
credentials, query/fragment/path components and insecure remote URLs before
issuing a ticket. Keep other workers.dev hosts excluded. Invalid setup must
preserve the run and academic progress and recover after configuration repair.

Preserve SESSIONS, BRAWLS and migrations, Netlify academic relay, Pages hosting,
all current cartridges/artwork, input/audio, Journey's 180-second exception,
authentication, origin validation, teacher deletion, expiry and reconnect.
No domain purchase, paid subscription or replacement Worker is authorized here.

## Verification and deployment

Checkpoint before tests; run endpoint/academic regression suite, release build,
Worker packaging dry-run and local classroom browser path. Record exact source.
Live deployment still requires Cloudflare authentication or owner-operated
Cloudflare Git integration. Do not merge the frontend to main until the matched
backend is deployed and its health/room/socket path can be checked.

Before classroom readiness: test the actual teacher/student school network,
authenticated WebSocket upgrade and interruption/rejoin, then supported devices
and intended concurrency. If blocked, do not claim the HTTP relay or polling
solves WebSockets; retain academic work and investigate the measured failure.

## Reconcile newer live cartridges before first Git build

At owner setup, main advanced to 6cd4953 (v0.9.7 six-cartridge deployment).
Merge that exact source into Journey 9125cc2 before triggering the connected
production branch. Preserve all six existing cartridge paths, reports, artwork,
room compatibility and cache revisions; add Journey as the seventh cartridge.
Keep platform v0.9.7 with the separate Journey Stage 9 build marker. Checkpoint
and rerun Node/build/dry-run and local teacher/student browser flow. The owner
authorized backend/frontend publication and connected this branch to Cloudflare.
