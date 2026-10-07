# Review presentation repair — 8 October 2026

Baseline main: 9550ede. Implementation checkpoint: c4f103c. Canonical source remains public/. This repairs the static review delivery only; no classroom Worker or game mechanics changed.

## Findings and changes

Ironbreak already had cover artwork. Its SVG data URL contained literal quotes and was interpolated unescaped into an HTML attribute. The browser ended the attribute early and rendered the remaining SVG as text. Escaping the attribute fixes the image without replacing accepted artwork.

All four linked reviews now put instructional scene paragraphs in a contrasting, labeled Mission instructions box. Shared source: public/review-presentation.js and .css; identical helpers/styles are embedded in Ironbreak and Blackline to retain self-contained delivery. Coastal and False Haven import them. Preview-only notes remain distinct. Existing DEV action shortcuts and math behavior are retained.

## Optional mathematics audit

All six completed classroom cartridges implement required math → one equipment slot, plus up to two optional completed math blocks → two/three slots. The Event Lead requests extra preparation; all crew members finish it. Teacher-selected question source/count and imported-question reuse permission still apply. Coastal requires an explicit question count when gate loads differ. This is a source audit, not proof of current live Worker deployment.

| Cartridge | Audited source | Linked review behavior |
| --- | --- | --- |
| Vault Seven | main 9550ede, src/engine/equipment.js and test/v092.test.mjs | DEV practice bypasses mathematics |
| Nightfall | same shared equipment path and actual command tests | DEV practice bypasses mathematics |
| False Haven | main 9550ede, cartridge and shared equipment dispatch | Preview switches select upgrades; mathematics skipped |
| Ironbreak | release/combined-cartridges-v0.9.6, tested runtime 425f9f8 | Sample mathematics includes two optional blocks |
| Coastal Escape | same combined candidate, coastal-cartridge tests | Preview switches select upgrades; mathematics skipped |
| Blackline | implement/blackline-v0.2.0, cartridge registry, Worker and shared equipment path | Preview switches select upgrades; mathematics skipped |

Journey to the West is outside this completed-cartridge audit. Vault Seven's Code Scanner assists its cipher; its Cloak and Silent Toolkit assist extraction. Other cartridges' items have their existing action effects. No new earning mechanic was introduced.

## Verification

- Passed: actual image decoding, instruction boxes, navigation and no horizontal overflow for all four review pages at 1280×800, 393×852 and 1024×768 in desktop Chromium. Three previews reached equipment selection and endings; Ironbreak reached its sample answer form.
- Passed: preserved Ironbreak/Blackline DEV action entries mount their game canvases.
- Passed: visual inspection of Ironbreak artwork and Blackline narrative/instructions screenshots.
- Passed: 22 focused existing tests on the unchanged combined candidate (v092 equipment/loadouts, Ironbreak and Coastal). These are source regression evidence, not live classroom checks.
- Passed: release build/syntax validation.
- Physical iPhone/iPad control release, native menus and viewport stability: Not run; no held-input changes.
- Hosted classroom and school network: Not run; no Worker deployment.

Browser report and focused test output are in review-presentation-2026-10-08/. Handbook provenance and authorized scope are in the matching change specification. No handbook amendment.
