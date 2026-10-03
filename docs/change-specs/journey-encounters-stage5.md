# Journey stage 5 — authored combat checkpoint

Owner continuation: 3 October 2026. Baseline remote f93b9f6a15ead3a13b0c88f309d6ffc6f2f81716; local equivalent tree b061e23290ecdffe173a527f9719383062f6d952.

Implement the approved v0.1 sections 8–9: mountain, cave, shrine, courtyard and Nezha; deterministic role waves (2+N, 2+2N, 3+2N), at most min(8,N+3) ordinary enemies, warning before arrival damage, boss warning at 117 seconds and forced boss at 120. Preserve 180-second Journey exception, roster scaling, readiness, math evidence, controls and recovery. Five magic pickups and one health pickup per starter across the authored stages; full meters do not consume supplies. Supplies and enemies have stable IDs. Stage advance never refills players or grants kills.

Nezha: 650N health, spear/ring/rush warnings 600/700/900ms, damage 14/12/20, recovery 800/900/1000ms. Rotate targets, lock committed attacks, shorten only reposition gaps below half health, no normal-hit stun, bounded special stagger. Victory wins simultaneous pre-deadline elimination; deadline remains exclusive. No ordinary reinforcements at boss.

This is combat implementation, not finished visual/audio production. Existing raider artwork remains only for raiders; other roles and Nezha use clearly labeled technical collision proxies, with exact telegraphs/projectiles drawn from authoritative state. Production enemy/boss/environment art, four non-horse special choreographies, audio, narrative, balance acceptance and live deployment remain separate.

Read AGENTS, PROJECT-BRIEF, consolidated approved v0.1. Current handbook blobs: AI-START-HERE 6557a45, UNIVERSAL-RULES 6bde7c1, CONDITIONAL-STANDARDS 1a79498 (S-02–S-04), RELEASE-CHECKLIST 8aeb220. U-10 input implementation unchanged; new warnings must remain readable. No main merge, deployment or handbook edits.

Verify: deterministic wave counts/cap, entry safety, stage/forced transition, supplies, pause/reconnect, boss warning/lock/recovery/target cycling, shield/health effects, immutable result/deadline tie-break; existing Node suite/build; actual frontend browser bridge where available. Save source checkpoint before extended tests; preserve failed checks and limits honestly.
