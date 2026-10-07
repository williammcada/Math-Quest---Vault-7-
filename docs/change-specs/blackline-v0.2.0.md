# BLACKLINE cartridge v0.2.0

Authorized by the owner's Proceed following alpha.2. Preserve the 14.5 km racer, pursuit, three gaps, original music and 300-second active limit. Source: BLACKLINE 0877ce64d6811742d28cfcf309293686aabdad43; MathQuest 0b4852009651edbdaf238276148416184e3036be; handbook c50115ba1fea9cb552f3ad1415e670a219118b56.

## Story
The Directorate is closing the last civilian road. Courier Mara carries either a district evacuation register or evidence of deliberate power cuts. Three required preparation gates: Dead Grid, The Cargo We Carry, Last Green Light. Two optional inserts: The Missing Addresses and Signal Through the Smoke. After the first gate the crew chooses the cargo. The route changes narrative evidence, not physics or academic difficulty. Earn equipment, drive the escape, then decide to broadcast the evidence, escort waiting vehicles, or protect the passengers already through. Three distinct endings acknowledge the cargo and individual field outcomes. A failed race never changes mathematics or excludes a student from the final vote.

## Native integration
Register blackline / blackline-racer in MathQuest's existing cartridge and adapter registries. Reuse native teacher-assigned question delivery, 3/4/5-gate allocation, hints, answer validation, team voting, equipment slots, reports, privacy and reconnect. This revision does not replace MathQuest's catalog with a newly invented catalog or migrate other cartridges to the Olivia component. A cross-platform settings migration needs its own scope; native classroom mathematics stays authoritative here.

One action run per student; guided completion separately labeled. Shared 300-second crew window starts at market.continue; teacher pause extends it, local pause/reconnect do not. Action time is cumulative and at most 300 seconds. Preserve run ID, configuration revision, monotonic sequence and snapshot on reconnect. Validate outcome prerequisites, time, distance, integrity, jumps and equipment counters server-side as client-reported evidence, not authoritative replay. Unstarted/expired/teacher-closed records remain neutral.

Equipment: impact plating absorbs the first damaging hit; boost capacitor replenishes 25% boost once on entering the Foundry; repair reserve adds 10 integrity once on entering the Underpass. All effects have consumed flags and visible descriptions, and cannot recharge on reconnect. Standard racer has no upgrades.

Use MathQuest shared held-input.js via the button profile. Add optional adapter audio hooks for the original synthesized score; existing games retain GameAudio unchanged. Original code-native SVG story illustrations accompany the existing canvas artwork. Owner preview skips math explicitly and sends no academic evidence; classroom gates use the existing real question provider. No new persistent preview records.

## Acceptance
Preserve implementation checkpoint before extended tests. Run native authenticated journeys with both cargo choices, all endings and gate counts; malformed/foreign/stale run checks, deadline/teacher pause, restore and equipment consumption; existing host/input regressions; browser story-to-race-to-ending, guide path, action start/pause and layout. Preserve exact tested commits and delivery ZIP. Live Worker deployment and physical iOS checks remain pending if credentials/devices are unavailable. Keep host work on a candidate branch until matched frontend/backend release.
