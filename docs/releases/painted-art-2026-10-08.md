# Illustrated Ironbreak and Blackline stories — 8 October 2026

Baseline main 05b29e5332cb56adc7a48010318491b06611452c. Implementation checkpoint 3af79de. Eight new generated raster narrative illustrations replace the geometric story artwork. Four per cartridge: cover, communication/cargo preparation, equipment workshop and neutral final-decision scene. Ironbreak now displays its appropriate scene art beyond the briefing. Mission instructions remain visually separate. No Worker, academic rules, arcade renderer or held-input changes.

## Assets and production

Final project assets: `public/assets/ironbreak/{cover,radio,market,ending}.webp` and `public/assets/blackline/{cover,radio,market,ending}.webp`. Raster conversion only: original generated composition retained, WebP quality 82. Built-in image generation was used; no procedural/vector image substitutes. Reference inputs were the actual Coastal Escape cover.webp, Nightfall cover.png and Vault Seven scenes/cover.webp. Later scenes used their new cover for continuity.

Prompt set: detailed cinematic painted realism, fine textures, atmospheric cool-blue shadows and warm amber practical lighting, landscape 16:9, full bleed, school-appropriate, no typography/UI/borders/logos, no geometric vector or low-poly treatment. Scene instructions:

- Ironbreak cover: night rain and floodwater at canal-side robot foundry; adult engineer Mara safely operates a remote teal-visored maintenance machine from a sheltered station.
- Ironbreak radio: Mara checks analogue radio, gauges and pump-circuit plans overlooking wet gantries and floodwater.
- Ironbreak equipment: engineers prepare spread emitter, reinforced armor plate and powered boot modules beside the same unoccupied maintenance machine.
- Ironbreak ending: workers thoughtfully gather at central controls overlooking the pump district at dawn; neutral across final choices.
- Blackline cover: Mara and a weathered graphite interceptor under railway-garage arches; wet industrial district below a still-lit government wall.
- Blackline radio: Mara considers two compact evidence/evacuation data cartridges at an abandoned dispatch desk; same car outside.
- Blackline equipment: interceptor with open engine bay, impact plating, boost capacitor and repair reserve in a railway workshop.
- Blackline ending: car and Mara at an outer checkpoint radio at blue dawn, civilian vehicles waiting and countryside road ahead; neutral final choice.

Re-embed approved assets using `python scripts/embed-painted-story-art.py`. The script asserts the expected baseline bundle patterns on first conversion, then updates only its marked art payload. Re-running is idempotent. Both standalone HTML reviews embed all four WebP images (approximately 1.84 MB Ironbreak / 2.65 MB Blackline). Their artwork requires no external network load.

## Verification

Passed: all eight embedded images decode at full resolution; narrative/mission instructions and navigation remain functional at desktop 1280×800, phone 393×852 and tablet 1024×768; no horizontal overflow; existing Ironbreak/Blackline DEV entries mount their action canvases. Inspected actual page screenshots for both covers. Build/syntax validation passed. Re-embedding produces no change in the tested HTML. Browser evidence in painted-art-2026-10-08/browser.json.

Physical iOS controls/viewport/native menus and hosted classroom behavior: Not run, unchanged by this story-art revision. Arcade graphics retain their existing renderers; this release replaces narrative illustrations. Handbook provenance is in the matching change specification. No handbook amendment.
