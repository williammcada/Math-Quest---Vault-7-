# BLACKLINE v0.2.0 cartridge verification

Tested MathQuest source: `2b8adea20407bb8b77a211f2211172830bf658b9`, tree `c79acd246d3b04fa3f39acc07b12d8e4d545e095`. GitHub connector commit and local candidate have the same tree. Source baseline: MathQuest `0b4852009651edbdaf238276148416184e3036be`, racer `0877ce64d6811742d28cfcf309293686aabdad43`. Handbook v0.1.3 `c50115ba1fea9cb552f3ad1415e670a219118b56`: AI-START-HERE, UNIVERSAL-RULES, CONDITIONAL-STANDARDS and RELEASE-CHECKLIST read. U-10, S-03-A, existing native S-02/S-03/S-04 apply. No handbook edit.

| Check | Result | Evidence |
| --- | --- | --- |
| Full MathQuest regression | Passed | `npm test`: 193 tests, zero failures |
| Build and recursive syntax/assets | Passed | `npm run build` |
| Preserved alpha.2 racer | Passed | 16 original simulation tests; baseline source retained |
| Classroom journey | Passed | Authenticated local server fixture: 3/4/5 gates, both cargo routes, all endings, earned equipment, separate evidence and persisted session |
| Run ownership and validation | Passed | Foreign run, stale sequence, configuration, invalid clock/distance/resources rejected |
| Timing | Passed | Teacher pause extends shared deadline; absent students expire neutrally; teacher closure distinct |
| Equipment / reconnect | Passed | First hit absorbed, one Foundry boost refill, one Underpass repair; consumed flags and state survive restore |
| Story-to-race-to-ending | Passed | Local headless Chromium, 1280×800 and 844×390; five-gate evidence route, guided finish, cargo ending, zero page errors, empty preview storage |
| Complete browser race | Passed | Fixed-step binary driver through real browser adapter/renderer, 266.0956 seconds, 3 jumps, 33 bursts, 3 rams; not a physical human playtest |
| Held inputs | Passed (synthetic) | BLACKLINE profile added to shared release/cancel, failed/lost capture, touch reconciliation, simultaneous release orders, stationary holds, blur/hide/rotation and teardown tests |
| Native menus | Passed (synthetic) | Shared profile tests suppress HUD/control menus/selection; form editing retained |
| Guided audio | Passed | Switching to guided route pauses racing audio; distinct guided result |
| Layout | Passed (Chromium viewport) | Story, equipment, racing, guided and ending rendered; caption crop corrected |
| Physical iPhone/iPad: stuck input, zoom/viewport, native menus | Not run | Requires actual devices; no verified-device claim |
| Live Worker and school network / 23 iPads | Not run | Candidate branch only; no deployment requested/performed |

Action evidence is client-reported with a server-validated envelope, not an authoritative server replay. Academic questions, grading, equipment entitlement, privacy deletion and classroom retention use existing MathQuest services. The owner preview creates no saved records. No paid service or telemetry was added.

## Recovery / deployment

Preserve this candidate. Merge it with the intended MathQuest release candidate and resolve any registry conflicts without replacing other cartridges. Deploy the matching frontend and Worker together. The catalog revision rejects unsupported old backends. Verify an authenticated hosted classroom journey after deployment; do not infer deployment from this GitHub save. No feature change is required to package or recover this tested source.
