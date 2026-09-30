# Industrial Shooter — first playable practice candidate

Build: `shooter-0.1.0-alpha.1`. A WILLIAM MCADA PRODUCT.

Entry: `public/practice-shooter.html`. Optional self-contained review package: `public/practice-shooter-standalone.html`. Run `python tools/build_shooter_practice.py` after changing a module or the authored map. Serve `public/` with the existing frontend host or a local static HTTP server. No build framework, account, service, or downloaded dependency is required to play.

This is a separate practice candidate. It does not connect to rooms, publish student evidence, award live upgrades, or change Vault Seven/Nightfall. It has not been deployed to the existing classroom site. iPhone/iPad Safari and school-network verification remain pending.

## Implementation

- `world.js`: deterministic semantic export from the authored level, including 24 robots, boss, six hazards, four repair caches and checkpoint geometry. Disabled design proposals are excluded.
- `simulation.js`: DOM-free fixed-step model. Movement, directional continuous fire, one-way drops, ladders, surface swimming, stationary prone, double jump, warnings, robot/boss attacks, damage protection, pickups, checkpoint resets and three lives.
- `config.js`: version and proposed numerical tuning. Spread is three rays with one damage per target per volley. Armor is four health. Agility is +10% movement and a second jump.
- `renderer.js`: original code-drawn pixel graphics following the approved palette and silhouettes. This is initial playable art, not the complete final sprite/animation inventory from the design specification.
- `input.js`: a sliding eight-sector pointer pad, independent Jump pointer, keyboard parity and cancellation handling. Directions are cleared on pause, blur, visibility loss and orientation changes.
- `audio.js`: original synthesized level/boss scores and named effects. No copied franchise audio. Warnings have visible counterparts. The audio class is isolated for practice; shared GameAudio and GameHost remain unchanged.

The existing shared GameHost assumes tank controls and live result submission. This practice controller is small and independent; it does not duplicate its session/network/persistence code. Live integration still requires the planned adapter, server authority, narrative choice, assisted route and regression checks.

## Candidate choices and retained open decisions

The owner's Continue after the delivered map is used to proceed with a reviewable practice implementation. Numerical values and placements remain tuning candidates. No claim is made that unseen design details were individually approved.

Stationary prone works; crawling and its optional roof remain disabled. Checkpoints do not heal on first arrival, matching the map's proposed setting; respawns restore full health. The optional midpoint backtracking door remains disabled. Earlier-section pickups stay collected across later-checkpoint retries, so they cannot be refreshed through backtracking. Boss choreography uses the simple high/low/overhead loop at every health level; the unreviewed second-phase reversal is deferred.

Practice supports all eight upgrade combinations and three launch positions. Timed practice uses a five-minute wall-clock deadline from Start and three lives; local pause/backgrounding/retry never extends it. Untimed practice retains three lives. A new manually started practice run may reset both, explicitly outside classroom evidence. Live team-window authority is unimplemented and must not be inferred from this local review timer.

No run progress or results are persisted. Reload discards the current practice run. Restart identifies this scope and offers cancellation; only the Sound on/off preference is retained locally. No user-data deletion or recovery migrations are needed for this candidate. Exact interrupted-run persistence is still required before live integration.

## Art and sound manifest

Player collider: 20×28 standing, 20×16 crouched, 20×10 prone. Separate drawn body/weapon poses cover idle/run/jump, crouch/prone, climb, swim, damage protection and downed. Robot states expose warning, attack, recovery, hit and destruction. Boss palette is violet/silver/lime, independent of factory orange/steel. Final frame counts, richer animation, arrival/destruction choreography and victory poses remain art-production work.

`SOUND_MANIFEST` in audio.js is the exact event-to-synth mapping, including separate base/spread shots, robot launch/hit/destruction, jump/double-jump/landing/splash, hurt/downed, repair/checkpoint/respawn, hazard warnings/impacts, three boss cues, boss fire/destruction and timeout. `level` and `boss` use separate original sequences and tempos. These synthesized assets need listening/mix review on actual Apple devices.

See `docs/checkpoints/shooter-0.1.0-alpha.1.md` for actual checks and limitations. This candidate is not a classroom-ready or verified release.

## Current check summary

Twenty-five simulation/interface tests passed, followed by actual headless Chromium desktop/phone/tablet emulation and standalone-entry checks. The browser checks cover simultaneous pointer input, rotation, pause/resume, timeout and one resumed audio context. Real Safari/audio listening remain untested. A baseline scripted boss run completed in about 13.72 seconds, shorter than the planned 30–45 seconds; pacing needs a tuning revision before calling this a satisfactory finished level. Full active-threat route completion and a 60-second performance run remain pending.
