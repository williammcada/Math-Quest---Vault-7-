# False Haven cartridge v0.2.0 — verified source / hosted preview

This completes the source-level MathQuest cartridge integration specified in `../change-specs/false-haven-cartridge-v0.2.0.md`. It preserves the existing engine/enemies/weapons and the 2.34× walkable compound. Story includes three required gates, two optional inserts, two investigations and three endings. Artwork and audio reuse the approved Nightfall package.

Entry points: `public/false-haven-preview.html` (owner review, no academic evidence), `public/practice-false-haven.html` (saved practice), and the MathQuest cartridge selector (requires updated Worker).

New server validation is an envelope around client-reported action evidence, not authoritative combat replay. Academic evidence remains separate. The tests exercise journeys via authenticated commands; they do not prove live hosting or human combat balance.

Deployment: canonical GitHub Pages frontend / existing relay / Cloudflare Worker. Cloudflare CLI reports no authenticated account, so live classroom deployment remains pending. Do not create a substitute backend or temporary account. Deploy the candidate with the existing authorized Cloudflare account using `npm run deploy`, then confirm `/catalog` exposes `nightfall-false-haven` revision `false-haven-cartridge-0.2.0` and run a fresh classroom session.

Physical iPhone/iPad held-controls/rotation/audio tests, sustained human combat balance, and live classroom service smoke remain pending. Existing shared controls and privacy/deletion flows are retained.

## Verification record (2026-10-01)

Exact final application candidate: `f42563f791e0309e6de91e1cf68625596ae16d28` (initial implementation `42126742dc5d1bc9cacbe3b4b21e2da3f515cfa0`). Both are preserved in GitHub history; final candidate differs only in owner-preview control cleanup and sample crew names. Main was fast-forwarded without replacing concurrent work.

- Exact final candidate: all 182 tests passed, including new authenticated Chapter 2 integration tests; `npm run build` passed recursive syntax and asset checks. Full test output is in `evidence/false-haven-cartridge-v0.2.0/tests.txt`.
- Worker `wrangler deploy --dry-run` succeeded on the implementation candidate: 222.76 KiB, gzip 61.76 KiB. No backend bytes changed in the preview cleanup.
- Hosted browser: five-gate dispatch route, both optional inserts, all preview equipment, embedded action start/pause, ten-step guided completion, return to final vote and Broadcast the Truth ending passed. This was on the initial application candidate; the final candidate also passed the three-gate shelter path and the targeted embedded-mission check confirming removal of the redundant restart button.
- Screenshot `evidence/false-haven-cartridge-v0.2.0/hosted-ending.jpg` shows the hosted ending and separate guided record. Browser extension metadata errors were present; no claim of a completely clean browser console is made.
- Live relay catalog could not be established from this runtime (HTTP 403). Cloudflare deployment credentials are absent. Source integration and the published owner preview are verified; live classroom activation is not.

Handbook consulted: AI-START-HERE `6557a45`, UNIVERSAL-RULES `6bde7c1`, CONDITIONAL-STANDARDS `1a79498`.

Eight critical hosted frontend files byte-match the final application candidate; hashes are recorded in `evidence/false-haven-cartridge-v0.2.0/hosted-files.json`.
