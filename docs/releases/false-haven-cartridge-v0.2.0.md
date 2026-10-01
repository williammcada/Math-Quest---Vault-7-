# False Haven cartridge v0.2.0 — implementation candidate

This completes the source-level MathQuest cartridge integration specified in `../change-specs/false-haven-cartridge-v0.2.0.md`. It preserves the existing engine/enemies/weapons and the 2.34× walkable compound. Story includes three required gates, two optional inserts, two investigations and three endings. Artwork and audio reuse the approved Nightfall package.

Entry points: `public/false-haven-preview.html` (owner review, no academic evidence), `public/practice-false-haven.html` (saved practice), and the MathQuest cartridge selector (requires updated Worker).

New server validation is an envelope around client-reported action evidence, not authoritative combat replay. Academic evidence remains separate. The tests exercise journeys via authenticated commands; they do not prove live hosting or human combat balance.

Deployment: canonical GitHub Pages frontend / existing relay / Cloudflare Worker. Cloudflare CLI reports no authenticated account, so live classroom deployment remains pending. Do not create a substitute backend or temporary account. Deploy the candidate with the existing authorized Cloudflare account using `npm run deploy`, then confirm `/catalog` exposes `nightfall-false-haven` revision `false-haven-cartridge-0.2.0` and run a fresh classroom session.

Physical iPhone/iPad held-controls/rotation/audio tests, sustained human combat balance, and live classroom service smoke remain pending. Existing shared controls and privacy/deletion flows are retained.
