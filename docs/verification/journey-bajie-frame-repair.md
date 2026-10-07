# Bajie animation repair verification

Baseline: remote f5b2612; source candidate 29be454 (implementation 86ad210 plus alpha verification script). Twelve Bajie poses replaced with a separate original atlas; no gameplay, input, math or timing changes. Renderer and mapping are the tested source bytes.

- Passed: 202 Node tests, zero failures.
- Passed: build/release-validator command (does not constitute release or deployment).
- Passed: Chromium 138 local art harness, five heroes, 15 clip selections, two facings, 2,464 draw calls in source bounds; repaired atlas consumed; twelve repairs additionally drawn at game scale in both directions; zero browser exceptions. Contact sheet and attack screenshot visually inspected.
- Passed: RGBA 1536×1024; twelve occupied frames with >=12px margin at alpha >50, so no visible content crosses grid boundaries.
- Not run this chunk: full classroom session replay (no session/gameplay changes), physical devices, Cloudflare and school network. Prior checkpoint's session result is historical evidence only.

Temporary browser/dependencies were missing. Restored test-only packages under /tmp; extracted Chromium after package extraction failed on filesystem ownership. No dependency or lockfile change shipped.

Current coverage: 94 original isolated poses plus 12 replacements =106/120. Fourteen ambiguous original poses remain, and complete level/Nezha/story/audio remain pending. These are development checks, not production-art or classroom acceptance. Original assets preserved. No main merge or deployment.
