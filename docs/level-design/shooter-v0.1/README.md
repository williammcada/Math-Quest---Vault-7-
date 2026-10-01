# Industrial Shooter — authored level blockout v0.2

30 September 2026 · A WILLIAM MCADA PRODUCT

The level has now been authored as exact geometry and object placements, ahead of the game engine. This is a **blockout**: a functional map made of simple shapes that establish platforms, collision, routes and encounters. Approved production artwork will dress this geometry later. This is not a playable game, a verified release, or an image-generated approximation of collision.

## Open and inspect

- [Review map](level-review.png): three consecutive strips, left to right then next row. Vertical scale is compressed for readability. It is one continuous level, not three levels.
- [Tiled map](industrial-level.tmj): standard finite orthogonal JSON, 400 × 40 tiles at 16 × 16 pixels; 6,400 × 640 world coordinates.
- [Editor tiles](blockout-tiles.png): keep beside the TMJ. These simple editor tiles are not final game art.
- [Geometry export](level.geometry.json): semantic rectangles, positions and properties for the later engine adapter.
- [Static check report](static-checks.json) and [baseline route traces](baseline-route-traces.json).

Open `industrial-level.tmj` in Tiled with its adjacent PNG present. Tile layers provide an editable overview; object layers contain authoritative semantic geometry and metadata. PendingDesign objects are disabled, not colliders. The proposed later engine must explicitly consume those semantic layers; this file is not already connected to MathQuest.

The export follows the [Tiled JSON map format](https://doc.mapeditor.org/en/stable/reference/json-map-format/): orthogonal tile layers, zlib/base64 tile data, typed object layers and custom properties. Tiled itself is not installed in the authoring environment, so opening the file in the actual Tiled application remains untested.

## Layout and encounter placement

| Section | Exact x range | Purpose |
| --- | --- | --- |
| A | 0–800 | Safe introduction, first patrols, upper health ledge, jump/drop and ladder access. |
| B | 800–2,208 | Gantry gaps, central combat, surface-water route, alternate connectors and optional R02 alcove. |
| C | 2,208–2,704 | Full-height convergence bulkhead, H01 mandatory guard, cover, gate and MID checkpoint. |
| D | 2,704–4,208 | Branching foundry routes with falling loads, press, electrical water pulse and optional repair island. |
| E | 4,208–5,408 | Raised/lowered gantries and water bypass the central H02/H03 pair. R04 sits beyond a falling-load zone. |
| F | 5,408–6,400 | Safe BOSS checkpoint, full-height arena trigger, low platform and boss arena. |

World y grows downward. Most upper decks are y=192, middle decks y=336 and water surfaces y=496. The approach varies upper deck height to 224 and 176. Actor `feet_x`/`feet_y` properties locate spawn feet; rectangles locate actor bodies. Checkpoint activation uses x crossing with its prerequisite, so jumping across the marker does not silently miss it.

One-way decks are drawn orange; solid collision is steel. Ladders pass through one-way decks when engaged. Water supports only surface movement. Bulkheads force both upper and water players into the same central guard/checkpoint opening. MID gate spans the full world height and opens only after H01 is defeated; changing routes cannot bypass it. The boss trigger also spans the full height, so jumping cannot skip activation.

Authored population: 8 patrols, 5 ceiling turrets, 4 drones, 3 heavies, 2 lobbers, 2 skimmers and one boss. There are 4 fixed repair caches, 3 checkpoint spawn positions including START, 3 falling-load sites, 1 press and 2 electrical-water zones. The map uses the roster and behavioral specification in [the design](../../change-specs/side-scrolling-shooter-v0.1.md).

## Scope of checks

The authored data passed 16 static checks: unique identifiers, exact roster/cache/checkpoint counts, decoded tile payload dimensions, bounds, grounded enemy support, clear checkpoint spawns, mandatory gate blocking, all three route waypoint chains and all four caches reachable under baseline movement.

Reachability uses a 20 × 28 body, 180 px/s horizontal movement, −380 px/s jump velocity and 1,000 px/s² gravity, sampling jump arcs every 10 ms against the actual solid rectangles. It includes ladders, thin-platform drops and water surfaces; it merges touching same-height surfaces when testing support. The guard is assumed defeated for forward route tests; a separate closed-gate test confirms it blocks passage. Dynamic hazards are inactive for these geometry checks. No agility is used.

This establishes a useful geometric baseline, not production-engine parity. Combat fairness, actual hazard avoidance, camera behavior, input feel, sound, live session lifecycle, real-device performance and the 2–3-minute target require later playable verification. The route trace is evidence of static reachability, not a recorded playthrough or proof of a no-damage run.

## Decisions deliberately left open

- R02 is reachable through an open side alcove. A possible low crawl roof is present only as a disabled proposal. Slow crawling has not been approved; no required route depends on it.
- A proposed anti-backtracking door is disabled until that policy is reviewed. Existing mandatory guard and boss boundaries are explicitly represented.
- No-heal-on-first-checkpoint remains proposed in properties. Full-health respawning is already agreed.
- Enemy HP, hazard cycles and boss timing remain initial tuning. Placement here is a concrete proposal for owner review, not evidence of balanced gameplay.

## Reproduce or revise

From the repository, run `python tools/author_shooter_level.py` with Python 3 and Pillow. The script regenerates the TMJ, tiny tileset, geometry, review image, route traces and checks. Current source of truth is that authored script; editing the generated TMJ alone will be overwritten on regeneration. If Tiled becomes the primary editor later, explicitly reverse that ownership and make the engine export read the TMJ instead.

The approved image remains an art reference; the simple blockout should not be mistaken for the final visual quality. No application entry point, gameplay module, live room or deployed site is changed by this level-authoring checkpoint.

## Geometry v0.2 / alpha.2 update

The 1 October owner playtest prompted three authored middle-route machinery/cover obstacles: x1312 (32 px high), x3056 (48 px high), x4832 (32 px high). Baseline route and repair-cache reachability checks were regenerated and passed. The actor HP metadata now matches alpha.2 candidate tuning, including the 180-HP boss. Dynamic combat and owner pacing remain separate playtest checks. Earlier source checkpoints retain the original v0.1 geometry.
