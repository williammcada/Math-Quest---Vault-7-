# Journey stage 1 — shared controls and multiplayer verification

Authorized by the owner's proceed on 1 October 2026. Scope is one bounded continuation checkpoint.

Baseline: remote recovery commit `316189b94dd2e0d73fd1dc605242ef40bb5167ff`, tree `49b5d1e1769bee5029b844d4ff0d92fa43f888c2`; identical files to local `b9e6ad5`. Preserve the recovery branch. Save this work on `implement/journey-stage1-controls`.

Import the canonical shared `public/engine/held-input.js` at blob `f8bc3762ba73359c0ad017d37f60312ca0762e2c`. Journey provides a directional pad and action-button profile. Retain keyboard controls and simultaneous contacts, native-touch reconciliation, interrupted-input neutralization and normal optional-math field editing. Clear pending Jump/Magic commands and require fresh input after death/respawn or interruption. Prevent gameplay HUD/world callouts; avoid introducing a timeout on legitimate stationary touches.

Verify the existing readiness/handoff scenarios plus input interruption and multiplayer transport where the local runtime permits. Save the implementation checkpoint before extended verification, with the exact test command and limits in a subsequent evidence commit. Real iOS and school-network checks remain separate requirements.

Full host merging, five-minute retiming, full level/Nezha, artwork expansion, narrative, deployment and Math Arcade integration are outside this checkpoint. The existing approved Journey 180-second exception remains intact. Future full-level work must explicitly resolve it against the newer five-minute default.

Handbook re-read via GitHub: AI-START-HERE `6557a45aaa6d29d7d1abde808e6d0ac248b08820`; UNIVERSAL-RULES `6bde7c1f4ccdf5ed2163955e553379ba55186e2f`; CONDITIONAL-STANDARDS `1a794984142f3702c027a28e492a310aaba9f096` (S-02, S-03, S-04). Current AGENTS `f10fce171b0d9afa8b3c5fb5e15423f2c81c676d`. Shared principles and U-10 apply; no handbook amendment.
