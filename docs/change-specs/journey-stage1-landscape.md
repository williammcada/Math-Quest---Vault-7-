# Journey Stage 1 — landscape viewport

Authorized by the owner’s proceed on 2026-10-01. Baseline GitHub commit: 794a6b47cb2f30c7d8c0390785e8c9f1cf6f2fc6 (same tree as local d82edd2).

Bounded scope: fit the active match, five-player HUD, battlefield, D-pad, Attack/Jump/Magic and recovery/help controls within short landscape screens. Preserve canvas aspect ratio and keep controls outside the arena. Use dynamic viewport height and safe-area padding; preparation/math stays scrollable with normal field editing. Retain shared reset behavior on viewport changes. Preserve 180-second timing, server behavior and all existing cartridges. No deployment or full host merge.

Verify in Chromium at 844×390, 667×375, 568×320, portrait 390×844 and tablet 1024×768; assert control bounds, minimum 44px action targets, nonzero battlefield, aspect preservation, rotation/resize neutralization and fresh input. Inspect screenshots. Run the existing suite and five-client bridge harness on a preserved source checkpoint. Physical Safari/iPad/iPhone, safe-area hardware, browser chrome/keyboard behavior, actual Cloudflare and school networks remain separate unrun gates.

Handbook consulted: AI-START-HERE.md 6557a45; UNIVERSAL-RULES.md 6bde7c1 (especially U-05/U-06/U-07/U-10); CONDITIONAL-STANDARDS.md 1a79498, relevant S-02–S-04. No handbook changes.
