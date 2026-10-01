# Journey hero animation development checkpoint

Source candidate `a11e52e8547cb68277e0ff986f1f2cbec231a8a2`. Production source unchanged since 2cc8526; a11e52e corrects screenshot timing in the verification script only.

Implemented original generated atlases for Bajie, Wujing, Tang and White Dragon Prince, replacing the four labeled markers. Nine action clips use the existing state machine; the prince holds the horse frame during special. Wukong clone treatment remains exclusive to Wukong. All atlases use 104px render cells; authoritative collision/damage unchanged.

Passed: 198 tests and build on 2cc8526; five heroes × nine clips × two facing directions exercised in Chromium, 1,504 draw calls with valid source bounds and no script exceptions, on a11e52e. PNG validation: 1536×1024 RGBA, alpha 0–254, 24 nonempty cells each. Inspected idle, attack and special in the actual renderer. Frame manifests include source rectangles, thresholded opaque bounds and draw pivot; these are visual metadata, not collision boxes.

Art remains a development candidate: some oversized weapon/effect tips meet cell boundaries and show clipping, most visible in the sweeping attacks and horse special. Further atlas margin/pivot polish is required before calling these production-ready. Two-frame specials do not constitute the complete required horse run/turn/impact/return choreography. No combat balance, complete encounter, physical-device or hosted verification claim. New PNG payload is roughly 10.5 MiB before any delivery optimization; load performance remains unverified.

Review locally at public/journey-art-review.html through an HTTP server. No academic state is created. Source/scope: docs/change-specs/journey-hero-animation.md. Next: polish frame seams and horse choreography before expanding the authored encounter/Nezha. Preserve original generated files in this checkpoint; do not rebuild the tested integration to recover delivery.
