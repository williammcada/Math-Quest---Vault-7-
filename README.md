# MathQuest

**A WILLIAM MCADA PRODUCT**

MathQuest is a cartridge-based classroom mathematics game platform. Teachers configure academic content and a shared classroom session; students complete mathematics, team decisions, resource choices, and individual action-game sequences inside cartridge-specific narratives.

The combined candidate includes **Vault Seven**, **Nightfall: Last Bus Out**, **False Haven**, **Ironbreak** and **Coastal Escape**.

## Canonical project status

**Candidate:** MathQuest v0.9.6, branch `release/combined-cartridges-v0.9.6`. This combines the cartridge work into one frontend and Worker deployment. Cloudflare has not been updated; hosted classroom validation remains pending.

**Review now:** [Open the cartridge review hub](https://williammcada.github.io/Math-Quest---Vault-7-/public/cartridge-review.html). These static previews work independently of the classroom backend. Ironbreak includes offline sample math; Coastal Escape and False Haven previews skip math.

See the [combined release report and single Windows deployment handoff](docs/releases/combined-cartridges-v0.9.6.md) and [change specification](docs/change-specs/combined-cartridges-v0.9.6.md). Use **Code → Download ZIP** on the combined branch when ready. Do not deploy separate cartridge branches in succession.

The canonical frontend remains `public/`; session engine remains `src/`. Existing Pages and relay addresses remain unchanged. Earlier candidate reports are historical; the separate [address migration](docs/migrations/v0.9.3-addresses.md) remains inactive.

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

## Coastal Escape aerial practice v0.2.0

[Play the aerial practice](https://williammcada.github.io/Math-Quest---Vault-7-/aerial-shooter-practice.html) · [Change specification](docs/change-specs/aerial-shooter-v0.2.0.md) · [Verification and limits](docs/releases/aerial-shooter-v0.2.0.md)

Five-minute flight, double regular enemies, +10% player movement, and shared touch-release/native-menu prevention. See root AGENTS.md and handbook U-10 for required shared input checks. Physical iPhone/iPad retesting remains pending.

## Ironbreak v0.1.0 cartridge candidate

New industrial robot cartridge, based on the accepted shooter alpha.2. Source work is on `feature/ironbreak-cartridge-v0.1`; not deployed to the classroom site. Read the [cartridge specification](docs/change-specs/ironbreak-v0.1.0.md) and [candidate verification record](docs/releases/ironbreak-v0.1.0.md).

For a complete offline walkthrough, download `public/Ironbreak-v0.1.0-cartridge-review.html`. It uses one simulated student and sample mathematics; it does not create a real classroom session. `public/Ironbreak-v0.1.0-practice.html` is action-only. Build these with `npm ci` and `npm run build:ironbreak`.

Live deployment requires both this branch's `public/` frontend and `src/` Worker. Keep the existing relay/Pages architecture and existing sessions; do not copy legacy root files over `public/`. Review and device/network gates precede classroom release.

Release preparation: [coordinated deployment handoff](docs/releases/ironbreak-v0.1.0-deployment.md). Keep the frontend unpublished until the matching Worker has been deployed and checked.

## Coastal Escape cartridge candidate

[Coastal Escape story preview](public/coastal-escape-preview.html) includes the fictional-island story, choices, original artwork/music and existing five-minute flight. It skips math explicitly for owner review and records no classroom evidence. The full v0.3.0 cartridge / v0.9.5 platform candidate is on `coastal-escape-v0.3-candidate`; see [deployment and verification](docs/releases/coastal-escape-v0.3.0.md). The current classroom frontend stays paired with its backend until the candidate Worker is deployed.

## Nightfall II: False Haven — v0.1.0 practice candidate

[Play Chapter 2](https://williammcada.github.io/Math-Quest---Vault-7-/public/practice-false-haven.html) · [Specification](docs/change-specs/nightfall-chapter-2-v0.1.0.md) · [Verification and limits](docs/releases/false-haven-v0.1.0.md)

Escape a compromised safe zone using power, drainage, a speaker trap, movable cargo and the original Nightfall weapons/enemies. Map footprint is 2.25× Chapter 1; measured reachable area is 2.34×. Five active minutes. Practice has no math gate or student evidence; classroom/Arcade integration remains separate. Candidate 0124d53 passed 178 automated tests and hosted smoke checks; physical iPhone/iPad and sustained combat playtesting remain pending.
