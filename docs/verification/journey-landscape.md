# Journey landscape development checkpoint — 2026-10-01

Source candidate: `4ab952f48910482aaf8efa3449af4c66c5306424`. Browser harness passed on this exact commit. The 179-test suite passed on 7c5d32d; the only subsequent source-candidate change adds a browser geometry assertion (production files unchanged).

## Passed

- 179 automated tests, zero failures; output in journey-landscape-tests.log.
- Five-client Chromium WebSocket bridge checks; output in journey-landscape-browser.log. Production JourneyHost and BrawlRun with in-memory storage/Node bridge, not Cloudflare workerd.
- Viewport geometry at 844×390, 667×375, 568×320, 390×844 and 1024×768: all six control targets inside viewport, at least 44px in both dimensions, no overlapping targets, battlefield separate from controls and aspect ratio preserved through contain sizing.
- Browser-dispatched touch activates movement after resizing. A resize during the hold neutralizes input. Help text fits at 844×390.
- Inspected all five screenshots. Short landscape toolbar shares the control row, adding 47px to battlefield height. At 568×320, battlefield region is 141px high. Portrait retains controls and letterboxes the wide arena; landscape remains preferred for play. Four heroes still use approved stage-one labeled placeholders.

## Not run / limitations

Physical iPhone/iPad Safari/Edge, actual safe-area hardware, browser bars, software-keyboard transitions, lock/unlock, school networks and actual Cloudflare/QuestSession browser flow. The prior Cloudflare runtime startup blocker remains unresolved. No release/deployment claim. Long interruption messages may reduce battlefield space; accessible zoom and text sizing beyond default were not verified.

Preparation/math remains normal document flow; only phases after preparation receive the fixed match layout. Dynamic viewport height and safe-area CSS are implemented but physical behavior remains unverified.

## Next bounded task

Reconcile this Journey branch with the current host on a separate integration branch, resolve source conflicts without overwriting other cartridges, and verify the complete teacher/student handoff on a supported Cloudflare runtime. Full level, remaining hero animation, Nezha, narrative and audio remain deferred under the consolidated specification.
