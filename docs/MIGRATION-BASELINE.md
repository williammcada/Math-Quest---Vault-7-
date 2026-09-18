# Migration Baseline — MathQuest

**Recorded:** 18 September 2026  
**Status:** Canonical repository source and deployment record. This is not a claim of full release verification or classroom testing.

## Source identity

- **Canonical v0.9.0 baseline:** `601184761b8247999b731a9720261788c79f3c66`
- **Recovered v0.9.1 implementation checkpoint:** `576b711c10b28b6d8491495c90f37c42bb57c8d9`
- **v0.9.1 canonical source directory:** `public/`
- **Deployment repair commit:** `66a0f59c17309398084bdfb831cc02a9eebeb75d`
- **Live entry point:** https://williammcada.github.io/Math-Quest---Vault-7-/
- **Deployment behavior:** the root `index.html` preserves query parameters and fragments while redirecting to the recovered `public/` candidate.

The application was not rebuilt during this repair. The deployed source is the previously committed v0.9.1 candidate.

## Indispensable specifications

- [MathQuest v0.9 Technical Specification](specifications/MathQuest_v0.9_Technical_Specification.md)
- [MathQuest v0.9.1 Technical Specification](specifications/MathQuest_v0.9.1_Technical_Specification.md)
- [MathQuest v0.9.1 Change Specification](change-specs/v0.9.1.md)
- [Specification manifest and source hashes](specifications/README.md)

## Verification recorded in this migration

| Check | Result | Evidence / limitation |
| --- | --- | --- |
| GitHub Pages deployment of repair commit | Passed | Pages run `35292684510` completed successfully for `66a0f59`. |
| Normal root URL selects v0.9.1 candidate | Passed | Root redirected to `/public/` while preserving `?audit=v091#deployment`. |
| Running product/version identity | Passed | Hosted application displayed `Prototype v0.9.1`. |
| v0.9.1 entry assets | Passed | Hosted page loaded `qrcode.js?v=0.9.1`, `app.js?v=0.9.1`, and the v0.9.1 stylesheet set. |
| Hosted connection diagnostic | Passed | Diagnostic reported session server v0.9.1, 25 modules, and two-way access passed. It created no room and transmitted no student details. |
| Previously reported 112 automated tests | Not run | Not rerun during this migration; durable logs are not currently committed. |
| Full teacher/student hosted session | Not run | Creating and completing a classroom room remains a separate check. |
| Reconnect, deletion, expiry, and reporting workflows | Not run | Require deliberate end-to-end verification. |
| School iPads and approximately 23-device concurrency | Not run | Remains the classroom/network gate. |

## Release wording

The accurate current description is **MathQuest v0.9.1 hosted release candidate**.

Do not describe this record as classroom-tested. Do not call a later commit a verified release until the exact committed candidate has completed the required automated, hosted-workflow, device, and classroom checks that apply to that claim.
