# Journey to the West v0.1 — Stage 1 checkpoint

Owner approved the consolidated specification and this stage at 09:00 on 1 October 2026 (Asia/Shanghai).

## Implemented scope

- Existing MathQuest team-code joining, five-member cap, required gates and automatic handoff.
- Per-student optional math, earned upgrades and authoritative readiness/countdown.
- Separate Cloudflare BrawlRun Durable Object with single-use tickets, WebSocket inputs, shared movement/sample combat, teacher pause/start/end, reconnect and result outbox.
- Existing session expiry/deletion cascades to combat state; reports keep engagement separate from math accuracy.
- Interactive canvas with Wukong and mountain-raider animation atlases. The other four hero models have explicit labeled markers. No final-art claim for those heroes.

## Stage limits

This is the first integration and animation sample, not the full level. The sample has raiders and breakable crates; full encounter progression, Nezha, final character animation sets, exact special choreography and soundtrack integration remain later-stage work. The development cartridge uses ordinary required gates but has no newly authored narrative decisions or cutscenes. Those reserved slots must be completed before classroom release.

Host source remains v0.9.4; the visible cartridge build is `jttw-0.1.0-stage1`. A new host release number and matching cache revisions are assigned during integration/release work, not by pretending this isolated branch is deployed.

## Local review

Run `npm ci`, then `npm run dev:journey`. Open `http://127.0.0.1:8787/`, choose Journey to the West · Stage 1, create a room, and join from separate browser profiles with the ordinary team code. Each participant must complete their required questions. The optional-math/readiness minute then opens automatically. Teacher team controls appear on the dashboard.

This local command configures only loopback. Production requires an explicitly configured HTTPS `COMBAT_PUBLIC_BASE` on a WebSocket-capable hostname. Existing Pages/relay addresses are unchanged. No new domain, paid plan, DNS setting or live deployment has been made.

## Verification record

Initial implementation checkpoint is preserved before extended tests. Exact commits and actual test results are appended after testing. No physical-device or school-network result is yet available.

Cloudflare API references consulted: https://developers.cloudflare.com/durable-objects/best-practices/websockets/ and https://developers.cloudflare.com/durable-objects/api/state/ (1 October 2026). Local runtime version and command output are recorded with the test results.
