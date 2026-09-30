# Project Brief — MathQuest

**Brief version:** 0.5 — v0.9.4 First Response implementation
**Owner:** William McAda · **Credit:** A WILLIAM MCADA PRODUCT  
**Status:** v0.9.4 frontend and session-engine candidate. Hosted/device verification pending; address migration remains separate.
**Repository:** `williammcada/Math-Quest---Vault-7-`, branch `main`.  
**Current source baseline:** merged v0.9.3 at `c7ea42d7e54402357b5c56c52c44856666e4c2b9`; canonical frontend `public/`, session engine `src/`. Actual running frontend/Worker bytes were not established during this revision. The v0.9.1 observation below is historical.
**Source/baseline:** v0.9.0 baseline commit `601184761b8247999b731a9720261788c79f3c66`; recovered v0.9.1 implementation checkpoint `576b711c10b28b6d8491495c90f37c42bb57c8d9`; canonical v0.9.1 source directory `public/`; deployment repair commit `66a0f59c17309398084bdfb831cc02a9eebeb75d`.  
**Next work:** Verify the new early rescue lifecycle and both cartridge regressions on hosted desktop, landscape iPad and iPhone Safari. Complete school-network and classroom concurrency checks before claiming readiness.

## 1. Purpose, audience and detailed scope

- Reusable teacher-led classroom engine with discrete cartridges, initially Vault Seven and Nightfall: Last Bus Out. Teacher Windows PC; approximately 23 student landscape iPads. Mathematics is the primary activity, narrative second, short individual minigame reward third.
- Teacher selects academic modules, question counts, difficulty and teams; retain custom question-bank import and math-native answer controls. Every student contributes mathematical evidence. Allocate selected topics across gates; mixed modules per gate are allowed.
- Retain teacher dashboard, launch/briefing flow, QR/join, voting and Event Lead, resources/market, hints, end-session reports, diagnostic export, pause/reconnect/recovery and supported question extensions. Academic accuracy and action-game success must remain separate.
- Vault Seven combines infiltration narrative, gates, resource decisions, cipher-piece assembly and final choice/epilogue. Prior requested ending thresholds were <50%, <80%, and >=80%; reconcile their current scope against source before editing. Preserve variable cipher solutions rather than a fixed predictable word.
- v0.9.1 accepted changes include clearer objectives, removal of Maintenance Map, Scanner as cipher insurance, one-use five-second Cloak; Nightfall collision/interactions, alarms, GAS barrels, breakable windows, key-collection-triggered horde, fire half damage to player/lethal damage to mobs with animation/warnings. The consolidated specification controls exact implementation.
- One meaningful live action run per student where specified. Do not silently add retries or classroom multiplayer combat. Keep cartridge-specific mechanics, assets and outcomes distinct.
- Pilot privacy target: generated aliases, no identifying metadata, 48-hour retention in the consolidated target, teacher deletion and credential expiration; verify exact rules against v0.9.1 spec. No GradePal connection, learner accounts, telemetry or new recurring paid dependency.
- Preserve existing GitHub Pages frontend and relay/service architecture. School teacher/student Wi-Fi differ; prior Netlify success does not establish current end-to-end connectivity. Do not replace service infrastructure or rename repository during stabilization.
- Future cartridge roadmap: Temple runner, Starfall Express vehicle shooter, Blackout Protocol circuit puzzle, Lost Observatory precision platformer. Roadmap is not current release scope.

## 2. This task and boundaries

Current revision follows [v0.9.4](change-specs/v0.9.4.md). New v0.9.4 Nightfall rooms insert First Response after the first vote and before Gate 2. The one-live-action-run wording is superseded only for this chapter: unlimited validated downed retries share one authoritative five-minute window. Teacher whole-session pause freezes it once; local pause, delayed Start, disconnect and retry do not extend it. All personal records resolved or expiry/teacher closure opens shared Gate 2 without completing any mathematics.

Route chooses Imani’s clinic or Tomas’s Depot Garage. Twenty authored zombies (5/10/5), one gas hazard, one alarm, pistol with 15 rounds, no earned gear, one +1-health and one +10-round pickup. Initial 3-health baseline, two coherent retry checkpoints, broader noncombatant immunity, locked door/two windows and fixed narrative closure bridge are selected candidate tuning from the draft. Actual escort success and unstarted/time/teacher closure remain separate engagement evidence. No early inventory, retry or outcome leaks into the later city run.

Retain U-04 fraction validation, academic evidence, equipment slots, Vault 7, v0.9.3 neutral branding/alarm indicators and existing hosting/storage/privacy. Old v0.9.2 saved rooms retain their original sequence and credentials. New feature tests require fresh v0.9.4 rooms. Backend deployment is required; no live deployment or address rename is implied by a source candidate. Teacher extensions skip live rescue teams and resume at academic stages.

## 3. Standards and adoption

[Canonical handbook](https://github.com/williammcada/mcada-project-handbook). File blob revisions consulted: AI-START-HERE.md `6557a45aaa6d29d7d1abde808e6d0ac248b08820`; UNIVERSAL-RULES.md `aed6fe311aa2e88983f862a30a2d8f05d2ffc04d`; CONDITIONAL-STANDARDS.md `dad2d3a05ca0f18260196ea51ac6351bffffdc1c`; PROJECT-TEMPLATE.md `574f4c6fcf19ecc2f9e27582fd856fb08123e8da`; RELEASE-CHECKLIST.md `4f18c51998e7188ac5b4b4243bd2695056fb6ace`. These are file blobs, not repository commit SHAs.

Relevant rules: U-01 identity, U-02 help, U-03 input validation, U-04 unambiguous math/text where applicable, U-05 reader/device, U-06 preservation, U-07 verification, U-08 local scope. Conditional selection: S-02, S-03, S-04.  
Baseline adoption: selected for this documentation and deployment-reconciliation task within existing user instructions. Handbook still labels shared scope/modules seeded/draft; no new global rule ratification is inferred. Project-specific approved decisions control their own scope.

## 4. Must-retain behavior

The detailed scope above is the feature-preservation inventory. Preserve existing settings, data, accepted content, assets, exports and compatibility confirmed in source. Distinguish implemented behavior, accepted pending changes and historical requests during intake. A missing entry in this brief is not authorization to remove working behavior. Preserve valid user work during migrations and failures.

## 5. Source, release and deployment discipline

The canonical v0.9.0 baseline is commit `601184761b8247999b731a9720261788c79f3c66`. The recovered v0.9.1 implementation checkpoint is commit `576b711c10b28b6d8491495c90f37c42bb57c8d9`; its canonical source is the existing `public/` tree. The root deployment repair is commit `66a0f59c17309398084bdfb831cc02a9eebeb75d`. It redirects the standard Pages URL to `public/` and preserves session/query parameters and URL fragments.

The hosted candidate identified itself as v0.9.1 on 18 September 2026. Its shipped JavaScript and CSS entry assets also declared v0.9.1, and the hosted connection diagnostic passed against session-server v0.9.1 with 25 modules and two-way access. This establishes a reachable hosted candidate and basic service connectivity; it does not establish the full teacher/student flow, reconnect behavior, privacy expiration, reporting, Safari/iPad compatibility, or classroom-scale reliability.

DESIGN → CHANGE SPEC → IMPLEMENT → CHECKPOINT → VERIFY → VERIFIED CHECKPOINT → RELEASE → DEPLOY.

Use “implementation checkpoint,” “hosted candidate,” or “release candidate” before verification. Preserve candidate bytes and logs before packaging; recover that checkpoint after a ZIP/upload failure. Do not rebuild a verified implementation to fix delivery. Repository upload and website deployment are different operations; existing automatic deployments may run when `main` changes.

## 6. Known issues, conflicts and open evidence

Historical defects include blurred text/exponents, launch/empty-team behavior and mobile controls. Their current resolved status still requires exact-source checks. The live version and connection diagnostic have now been verified; the complete teacher/student path, two-device reconnect checks, Safari behavior, deletion/expiration, reporting, approximately 23-device school trial, and school-network behavior remain unverified.

| Conflict or risk | Required handling |
| --- | --- |
| Historical claim versus current source | Inspect exact source; keep historical claim labeled until verified. |
| Proposed next scope versus working baseline | Use the approved version-specific specification; do not silently promote proposals. |
| Other project rules | Do not import AAC quotas, other-game retry counts, or a shared backend without explicit scope. |
| Handbook proposals | No additional exception or proposal is adopted by this brief. |

## 7. Verification contract

Run teacher + students through both cartridges; disconnect/rejoin at gates and action stages; verify one-run enforcement, answers, reports and privacy expiry; record hosted URLs/commit and actual 23-iPad results.

| Evidence required | Result as of 18 September 2026 |
| --- | --- |
| Exact source candidate/commit identified and preserved | Passed — `public/` at recovered checkpoint `576b711c10b28b6d8491495c90f37c42bb57c8d9`; root deployment repair `66a0f59c17309398084bdfb831cc02a9eebeb75d` |
| Hosted root version and entry assets | Passed — root redirected with query and fragment preserved; page and shipped entry assets identified v0.9.1 |
| Hosted connection diagnostic | Passed — session-server v0.9.1, 25 modules, two-way access |
| Previously reported automated suite | Not rerun — 112 passes are historical context only; durable logs have not yet been preserved in the repository |
| Complete teacher/student flow, both cartridges, reconnect, reports and privacy expiry | Not run |
| Save/import/export and malformed-input regression | Not run |
| Intended iPads, Safari, school network and approximately 23-device concurrency | Not run |
| Version, release notes and delivered bytes agree for a verified release | Partial — hosted candidate/specification identity is reconciled; verified-release gate remains open |

The next verification report must name the candidate, environment and actual results. Historical reports of passing tests do not transfer to a changed candidate.

## 8. Handoff and provenance

The indispensable `MathQuest_v0.9_Technical_Specification` and `MathQuest_v0.9.1_Technical_Specification` are preserved as repository-readable Markdown in `docs/specifications/`, with a manifest describing their source documents and checksums. The approved v0.9.1 change specification remains at `docs/change-specs/v0.9.1.md`, and exact source/deployment identity is recorded in `docs/MIGRATION-BASELINE.md`.

Remaining retrieval targets are the original automated-test logs and any other durable evidence associated with the recovered v0.9.1 checkpoint. The exact hosted app, version markers, entry assets, query/fragment redirect behavior and connection diagnostic were inspected directly during this reconciliation. No full room/session or real-device test was performed.

Before substantive implementation, read this brief, the migration baseline, the current source, approved change specification, applicable technical specification and applicable handbook. If an indispensable record is inaccessible, report the gap instead of filling it with invented details. Do not delete unique historical chats/assets until their contents are independently preserved.

## 9. Ecosystem boundary

Shared principles do not establish shared code, accounts or interfaces. MathQuest is engagement, TestForge assessment design, GradePal learner-level evidence, and DataDiver institutional analytics. Integration remains separately specified unless confirmed in source. Other projects remain independent unless their brief explicitly says otherwise.

## 10. v0.9.2 implementation intake — 22 September 2026

Owner authorized implementation of [Consolidated Draft 5](change-specs/v0.9.2.md). This supersedes the earlier Nightfall key ambush, optional clinic encounter, market acquisition and device scope as detailed in §3 of that specification. Its historical no-write statements describe preparation of the supplied draft, not this implementation authorization. Proposals and the future Vault redesign backlog remain distinct from approved requirements.

Source starts at `d081997e363255389dff8ca0e891c975ca2c2a1b`. Handbook re-read at `6de4cbf33c3b9860125c412359fb64ef3d0b20d1`: AI-START-HERE.md, UNIVERSAL-RULES.md, CONDITIONAL-STANDARDS.md S-02–S-04, RELEASE-CHECKLIST.md. No handbook amendment.

The GitHub history omitted the backend, tests and build tools. Recovered these from MathQuest_v0.9.1_GitHub.zip (SHA-256 `3b5aa3c1b3e7f1d7c8222424b635af9ae63bc7130fb8f99f251b777d7f5afa48`). Its public files are byte-identical to GitHub public/ except the missing zero-byte public/.nojekyll marker. Recovered server identity is source provenance, not proof of the exact currently deployed Worker bytes. Preserve the existing Worker and Netlify relay architecture.

Owner evidence: 22 connected iPads with working mathematics/synchronization; seven intentionally sampled action starts, not 15 failed launches. Extend activity received a positive owner smoke test. These are v0.9.1 observations, not candidate verification. Purchased Cloak and Silent Toolkit missing-item reports remain release blockers pending end-to-end audit of all six equipment resources.

Required v0.9.2 changes: one base equipment slot plus one per completed optional block, up to three distinct team items; raw-form simplest-fraction validation (MATH-FRAC-01) with explicit representation exceptions; Nightfall encounters/audio/presentation; iPhone Safari owner-review support for both cartridges. Retain Vault Seven 180-second active maximum and 300-second authoritative team window; unattended clients cannot stall the team.

Windows and landscape classroom iPads remain targets. iPhone Safari action layout targets landscape with portrait setup/help and a rotate prompt. Real iPhone model/iOS/Safari version and smallest supported physical device are pending real-device verification. A candidate is not verified iPhone or classroom support. Hosted practice, complete touch inputs, sound, interruption, recovery, Wi-Fi/mobile-network checks and exact source identity are required per cartridge and for future cartridges.


## 11. Aerial shooter v0.1.0 preproduction — 30 September 2026

**Stage:** CHANGE SPEC; approved gameplay/art consolidated, proposed technical defaults under owner review. **Design branch:** design/aerial-shooter-v0.1.0. **Code baseline:** 7ac12fb98f7ccda591be4ee0bd6baa2f0ee81c28 (merged v0.9.4 candidate). **Pre-consolidation design checkpoint:** 4ac6d8a896361e3dd512cc1987c17bdcb9e3fc75. This section does not change the existing running-release status above.

Active specification: [Aerial Shooter v0.1.0](change-specs/aerial-shooter-v0.1.0.md). Decision provenance: [design log](change-specs/aerial-shooter-v0.1.0-design-draft-1.md).

Approved scope: one top-down WWII-style propeller-aircraft level, automatic forward fire, free movement, three-minute cumulative active play, three lives, midpoint/boss checkpoints, health 100 with normal/heavy damage 10/20, math-earned Agility/Armor/Weapons upgrades, authored supplies and a two-phase aircraft boss. Individual combat/escape outcomes preserve the team narrative choice and all academic evidence. The corrected arcade pixel-art concept, flight/boss music, one Standard difficulty, assisted tactical choices and five-minute shared classroom window are approved. Exact technical defaults and tuning are identified as proposals in the specification.

Immediate target is a reusable shooter module and hosted owner practice, followed by session-adapter/harness verification. Narrative identity and placement will be added later under an explicit integration scope. Do not register a fabricated finished cartridge or change existing cartridges' attempt/equipment rules. No multiplayer synchronization or infrastructure migration is included. The module's v0.1.0 is independent of the platform release number.

Consulted handbook baseline remains 00cbde605ab08203b6b5fd2374d225155608fc29: AI-START-HERE.md, UNIVERSAL-RULES.md, CONDITIONAL-STANDARDS.md S-02/S-03/S-04, RELEASE-CHECKLIST.md and PROJECT-MAP.md. Apply existing MathQuest adoption plus approved U-09 saved-work controls; no universal handbook rule changes. Read the specification's exact source findings before adapting the shared host. Recheck current canonical source before implementation and preserve concurrent work.

No shooter implementation, runtime production assets, deployment or device/classroom verification has occurred at this documentation checkpoint. Required evidence and release stages are listed in the specification. Preserve implementation and verified checkpoints separately.


### Aerial implementation authorization — 30 September 2026

The consolidated v0.1.0 specification and all twelve initial technical defaults are approved. Implementation proceeds on `implementation/aerial-shooter-v0.1.0`, practice first. Do not publish an unverified classroom integration or invent narrative placement.
