# MathQuest

**A WILLIAM MCADA PRODUCT**

MathQuest is a cartridge-based classroom mathematics game platform. Teachers configure academic content and a shared classroom session; students complete mathematics, team decisions, resource choices, and individual action-game sequences inside cartridge-specific narratives.

The current cartridges are:

* **Vault Seven**
* **Nightfall: Last Bus Out**

## Canonical project status

**Current canonical release:** MathQuest v0.9.0  
**Current hosted release candidate:** MathQuest v0.9.1  
**v0.9.0 baseline commit:** `601184761b8247999b731a9720261788c79f3c66`  
**Recovered v0.9.1 implementation checkpoint:** `576b711c10b28b6d8491495c90f37c42bb57c8d9`  
**Deployment repair commit:** `66a0f59c17309398084bdfb831cc02a9eebeb75d`  
**Canonical v0.9.1 source directory:** `public/`  
**Repository:** `williammcada/Math-Quest---Vault-7-`

The repository retains its historical name for the present deployment. The product is **MathQuest**; Vault Seven is one cartridge within MathQuest.

The standard GitHub Pages URL now redirects to the already-committed `public/` v0.9.1 candidate while preserving room/query parameters and URL fragments. On 18 September 2026, the hosted page identified itself as v0.9.1 and its connection diagnostic passed. The full teacher/student workflow, real-iPad checks, and classroom concurrency gate have not yet been completed, so v0.9.1 remains a hosted release candidate rather than a verified classroom release.

## Architecture

MathQuest currently uses the established classroom hosting architecture:

* GitHub Pages front end
* existing relay/service infrastructure
* teacher-controlled classroom rooms
* student join flow
* team state and shared narrative decisions
* independent student action-game runs
* academic and gameplay evidence reported separately

Infrastructure replacement or renaming is a separate migration task and must not be introduced casually during a gameplay release.

## Project documentation

* [Project Brief](docs/PROJECT-BRIEF.md)
* [Migration Baseline](docs/MIGRATION-BASELINE.md)
* [Technical Specifications](docs/specifications/)
* [MathQuest v0.9.1 Change Specification](docs/change-specs/v0.9.1.md)
* [McAda Project Handbook](https://github.com/williammcada/mcada-project-handbook)

The project brief identifies the canonical source, must-retain behavior, applicable handbook standards, deployment constraints, and definition of done.

Version-specific change specifications record the approved changes for each release so implementation does not depend on reconstructing decisions from chat history.

## Release workflow

Substantial MathQuest revisions follow this sequence:

1. **Design** — discuss feedback, defects, and proposed changes.
2. **Change specification** — consolidate approved decisions into a versioned specification.
3. **Implement** — modify the canonical source against that specification.
4. **Implementation checkpoint** — preserve an identifiable source state before extended verification.
5. **Verify** — run applicable automated, hosted, gameplay, reconnect, device, and workflow checks.
6. **Verified checkpoint** — preserve the tested candidate.
7. **Release** — approve the verified checkpoint as a release.
8. **Deploy** — publish that exact released source.
