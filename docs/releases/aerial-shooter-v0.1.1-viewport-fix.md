# Aerial practice v0.1.1 — landscape viewport fix

The owner reported that Edge on iPhone, opening the standalone HTML in landscape, still displayed “Turn to landscape” and prevented play. v0.1.0 incorrectly required the usable viewport to be at least 667×375. Browser chrome can make a landscape phone shorter than 375 CSS pixels.

The opt-in ActionHost now determines portrait from the visible width/height, listens to window/orientation/visual-viewport resize events, and sizes the shell and battlefield within the available area. Short landscape layouts retain 56px D-pad buttons and suppress decorative rail labels. The obsolete minimum-size message is removed. Portrait still pauses action; returning to landscape exposes Start or Resume, preserving the active clock.

This is UI build 0.1.1. The game simulation/configuration revision remains 0.1.0 so existing practice snapshots remain compatible. No classroom game registration, Worker endpoint, narrative, grading, or existing game host changes are included.

Verification: 19 aerial core/session/asset tests pass; release validation passes; the standalone regression script checks starting and touch movement at 844×300, 667×300, 812×295, 568×260, 667×375, and 1024×768. It checks portrait/landscape recovery, paused-clock continuity, changing browser-bar height, independently changing visual viewport height, contained HUD/field/footer, 56px controls, zero external requests, and no uncaught errors. Evidence is in `aerial-v0.1.1-evidence/`. Physical iOS retest is still required; Chromium emulation does not establish Safari/WebKit behavior.

Publication scope authorized by the owner: the corrected self-contained practice build and a separate GitHub Pages entry. Existing classroom pages and backend remain as-is.
