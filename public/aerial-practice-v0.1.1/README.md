# Coastal Escape — aerial practice v0.1.1

Open `index.html` through a web server. The repository root entry is `/aerial-shooter-practice.html`.

This directory is a complete, isolated practice build: readable JavaScript in `games/aerial-shooter/` and `engine/`, styles, artwork, audio, and the practice save/export interface. It is not registered as a classroom cartridge and sends no classroom evidence.

The v0.1.1 UI fixes landscape phones being blocked by browser bars reducing the visible height. Simulation versions remain compatible with v0.1.0 practice saves. Automated start, touch movement, layout and rotation checks pass; physical iOS retesting remains pending.

Serve the repository root with `python -m http.server 8000`, then visit `/public/aerial-practice-v0.1.1/`. To expose development diagnostics, append `?dev`.
