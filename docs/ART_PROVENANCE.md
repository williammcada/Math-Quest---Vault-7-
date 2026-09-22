# Vault 7 v0.6 original artwork

Created 2026-09-11 with the built-in `image_gen.imagegen` tool. Each of the fifteen story scenes was generated from its own scene prompt. No stock imagery or web-retrieved artwork was used. The previous project's four-panel image was inspected for context but was not reused as a scene asset.

The visual brief uses cinematic SNES-inspired pixel art, retro-futurist covert-science architecture, navy and teal shadows, mint instrumentation, amber warnings, and readable human silhouettes. No narrative, interface, branding, cipher letters, or cipher numerals were composited into the images.

`ART_PROMPTS.json` contains the complete scene prompt set, tool output source paths, reference use, and targeted correction prompts. The Core required a targeted built-in edit to correct six fins to seven. The finale used the corrected Core as a machine-identity reference in a distinct composition, followed by a targeted edit from five visible fins to seven. A small stray corner mark was removed from the cipher scene with a targeted built-in edit.

## Runtime story assets

All files below are standalone 960×540, 16:9 WebP images encoded at quality 90. Each file is below 200,000 bytes. Total story-image payload: 2,017,892 bytes. All fifteen SHA-256 hashes are distinct.

| File | Bytes | Scene |
| --- | ---: | --- |
| scenes/cover.webp | 124,536 | Hidden mountain facility at night |
| scenes/briefing.webp | 135,386 | Fractured emergency transmission |
| scenes/gate1.webp | 147,284 | Awakening power tunnel |
| scenes/gate2.webp | 121,954 | Biometric gantry and false identity |
| scenes/gate3.webp | 159,088 | Abandoned containment catastrophe |
| scenes/gate4.webp | 141,734 | Self-deleting data archive |
| scenes/gate5.webp | 108,088 | Seven-fin Isolation Core |
| scenes/route.webp | 128,708 | Vent and security corridor route decision |
| scenes/market.webp | 119,822 | Covert equipment kiosk |
| scenes/cipher.webp | 106,686 | Fragmented message, abstract blocks only |
| scenes/finale.webp | 162,314 | Awakened intelligence in seven-fin Core |
| scenes/ending-isolate.webp | 147,686 | Sealed mountain at dawn |
| scenes/ending-destroy.webp | 138,422 | Dead scorched Core |
| scenes/ending-copy.webp | 129,964 | Carried shard and escaping secondary transfer |
| scenes/ending-release.webp | 146,220 | Coordinated city awakening |

The original generation sources are retained with the image-generation work; this runtime package contains the optimized masters and responsive derivatives. Mechanical preparation used Pillow for centered 16:9 fitting, Lanczos downscaling and WebP encoding. No scene-sheet crops were used. Asset preparation fits the original scene to 16:9 before resizing. `public/assets/vault7/art-manifest.json` records dimensions, bytes, full source and runtime hashes, descriptions and QA status.

## Agent sprites

`sprites/agent-16x24.png` is a transparent 64×72 RGBA atlas containing twelve frames, each 16×24. The four columns are down, left, up and right. The three rows are idle, walk-a and walk-b. Suggested walk order is idle → walk-a → idle → walk-b, with about 140 ms per frame. `sprites/agent.json` provides exact rectangles. Individual transparent frames are supplied beside the atlas.

The original generated transparent atlas is `sources/agent-sprite-source.png`; its complete prompt is in `sprites/prompt.json`. `prepare_sprites.py` extracts its grid cells, applies one common scale, downsizes with nearest-neighbor sampling, and aligns feet to a shared baseline. Generated alpha is retained with hard native pixel edges. No sprite parts were painted or synthesized with code. No tileset is included.

## Visual verification

Every generated source and final story tile was inspected. The Core, finale and cipher were additionally inspected at final image resolution. Both Core scenes show seven separate fins, the cipher contains abstract blank blocks, and the images contain no UI or narrative text. All runtime WebPs decode and have the required dimensions. All twelve agent frames were inspected at 8× nearest-neighbor enlargement for silhouettes, transparency and alignment. `contact-sheet.jpg` and `sprite-preview.png` are QA previews; they are not runtime assets.
