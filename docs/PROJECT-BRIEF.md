# MathQuest

**A WILLIAM MCADA PRODUCT**

MathQuest is a cartridge-based classroom mathematics game platform. Teachers configure academic content and a shared classroom session; students complete mathematics, team decisions, resource choices, and individual action-game sequences inside cartridge-specific narratives.

The current cartridges are:

* **Vault Seven**
* **Nightfall: Last Bus Out**

## Canonical project status

**Current canonical release:** MathQuest v0.9.0
**Canonical source checkpoint:** `601184761b8247999b731a9720261788c79f3c66`
**Current development target:** MathQuest v0.9.1
**Repository:** `williammcada/Math-Quest---Vault-7-`

The repository retains its historical name for the present deployment. The product is **MathQuest**; Vault Seven is one cartridge within MathQuest.

MathQuest v0.9.1 is currently treated as a release target/candidate until the completed source is recovered, verified against the canonical repository, and committed. A specification, README, test report, or filename alone does not establish that a release has been delivered.

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
7. **Release** — update versioning, documentation, packaging, and deployment files without adding new features.
8. **Deploy and verify** — check the actual hosted application rather than assuming a successful build or README update proves deployment.
9. **Classroom validation** — perform real-device/network testing when required.

A packaging or deployment failure should not require reconstruction of an already verified implementation.

## Classroom readiness

MathQuest distinguishes between:

* **Implemented**
* **Automated tests passed**
* **Hosted tests passed**
* **Classroom tested**

The planned full classroom-network gate is a simultaneous test using approximately 23 student iPads plus the teacher computer.

A version must not be described as classroom-tested until that real-device test has actually occurred.

## Product boundaries

MathQuest is the engagement and gameplay layer of a larger intended educational ecosystem.

Possible future relationships include:

* **TestForge** — assessment and question-generation intelligence
* **GradePal** — learner mastery model
* **DataDiver** — institutional assessment analysis

These relationships describe intended roles only. No integration, shared identity system, or common data interface should be assumed unless it has actually been implemented and documented.

## Ownership

**William McAda**
**A WILLIAM MCADA PRODUCT**

