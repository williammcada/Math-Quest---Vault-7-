# Thursday 8 October — Journey play-test

This checklist is for Journey only. Other games need their own exact build checks. Do not deploy the whole older Journey branch over current MathQuest main: reconcile current-main changes first.

## Before Cloudflare

1. Open the environment review (public/journey-environment-review.html through a local web server). Check all five buttons, crowded sprites and movement bounds. This is a visual fixture, not a playable game.
2. On the candidate source, run npm test and npm run build. Use scripts/verify-journey-browser.mjs and scripts/verify-journey-session-browser.mjs with the documented local Chromium/WebSocket bridge for automated checks.
3. A real multiplayer playtest needs the local Worker/bridge or the configured deployed combat endpoint. A static GitHub Pages upload alone does not run the combat service.

## Cloudflare / source gate

- Reconcile this isolated branch with current main without replacing other cartridges.
- Check wrangler configuration and the BRAWLS Durable Object binding/migration alongside SESSIONS. Retain the existing academic relay and parent expiry/deletion behavior.
- Configure COMBAT_PUBLIC_BASE to the approved HTTPS custom hostname, CORS origins and WebSocket route. The application deliberately rejects workers.dev for this configured combat URL; do not invent a hostname.
- Deploy matched frontend/backend build jttw-0.1.0-stage8-playtest after reconciliation. Check the running build label and connection diagnostic. Deployment is not performed by this checklist.

## Actual playtest

Use a fresh Journey room, teacher browser and at least two student devices initially; then five players. Record device/OS/browser, URL and source commit.

1. Read opening and gate text. Complete required math; verify each student's evidence stays separate. Select unique heroes, try optional upgrades, then Ready.
2. Music should start only after interaction. Stage theme changes for Nezha. Controls opens separate Music / Sound effects toggles; each operates independently. Pause, background, reconnect and end must stop unwanted audio. Check with hardware silent mode both on and off.
3. Play each hero solo, then a five-hero party. Check six clone strikes over time, delayed ground slam, forward moving river wave, lotus shield and steerable horse. Watch magic decrease once and ensure deaths do not refill it.
4. Check mountain, cave, shrine and courtyard transitions; supplies and warnings remain visible. The courtyard is reused for Nezha. This is an arena sequence, not a continuous scrolling traversal level.
5. Try standing still holding Attack against Nezha, then dodging all three patterns. Record clear time, lives and unused magic. Balance is not accepted merely because automated tests pass.
6. Hold movement plus Attack; release either first. Slide outside, rotate, background, lock/unlock, open Controls, reconnect and die. No stuck actions, native selection menus, zoom or layout drift; fresh input must work afterward.
7. Teacher pause freezes time/effects. Disconnect one player, then all. Return with the same health/magic/lives. Check victory, timeout retreat, defeat and teacher-ended interruption have distinct endings and reports.

Any stuck controls, viewport jump, native menu interference, missing audio stop or lost academic evidence blocks release on that device. School-network and classroom-scale checks remain required. Story is an original adaptation, not a claimed episode from the novel. Human listening and balance feedback are still needed.
