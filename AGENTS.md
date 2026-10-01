# MathQuest implementation rules

Read `docs/PROJECT-BRIEF.md`, the applicable change specification, and the canonical [McAda handbook](https://github.com/williammcada/mcada-project-handbook) before changing a game. Current user instructions govern scope.

For every held-input change or new action game, apply approved handbook U-10. Reuse `public/engine/held-input.js` through the button or directional profile. Generated versioned practice/standalone copies must match that source. Prevent native selection/callouts on gameplay HUD and controls; preserve ordinary form and non-game browser behavior. Never fix stuck input by timing out a legitimate stationary held touch.

Retain regression checks for capture failure/loss, missed pointer release, native touch-list reconciliation, multi-touch release order, drag outside, cancellation, overlays, pause, backgrounding, rotation, death/retry, teardown, and fresh input afterward. Run relevant shared-input and existing-game tests. Report physical iOS checks as pending until actually performed; emulator tests do not prove them.

New or explicitly retimed MathQuest action levels default to 300 seconds of cumulative active play (handbook S-03-A). Retiming must update encounters, checkpoints, boss timing, HUD and expiry together. Existing cartridge exceptions remain until explicitly revised; do not silently change their backend or academic/narrative rules.

Canonical frontend source is `public/`; root legacy files and prior versioned releases are not the editing source. Keep the existing GitHub Pages/Worker architecture and preserve saved work. Publish verified practice updates without registering an unfinished classroom cartridge.
