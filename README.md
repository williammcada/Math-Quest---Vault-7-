# MathQuest

**A WILLIAM MCADA PRODUCT**

MathQuest is a cartridge-based classroom mathematics game platform. Teachers configure academic content and a shared classroom session; students complete mathematics, team decisions, resource choices, and individual action-game sequences inside cartridge-specific narratives.

The current cartridges are:

* **Vault Seven**
* **Nightfall: Last Bus Out**

## Canonical project status

**Candidate:** MathQuest v0.9.3, branch `release/v0.9.3`. Neutral platform branding and readable alarm-car indicators; address migration prepared but inactive.

**Starting main source:** merged v0.9.2, `e7da71ba349cada401f0ec2f22deb4223d50d41d`. Source merge is not proof of hosted verification.

**Canonical source:** front end `public/`; compatible session engine v0.9.2 in `src/`. This frontend revision preserves the session protocol and saved-room identity. A v0.9.2 Worker does not need redeploying for the UI/light changes.

**Current repository/address configuration:** `williammcada/Math-Quest---Vault-7-`, GitHub Pages at `https://williammcada.github.io/Math-Quest---Vault-7-/`, relay at `https://vault7mathquest.netlify.app/api/`. The proposed `mathquest` repository and `mcada-mathquest.netlify.app` addresses are not live migration claims.

See the [v0.9.3 candidate report](docs/releases/v0.9.3-candidate.md), [address migration handoff](docs/migrations/v0.9.3-addresses.md), and [approved change specification](docs/change-specs/v0.9.3.md). Historical v0.9.1 deployment observations remain in [Migration Baseline](docs/MIGRATION-BASELINE.md); v0.9.2 evidence remains in its [candidate report](docs/releases/v0.9.2-candidate.md).

## Test/deploy this candidate at the existing addresses

1. Download the `release/v0.9.3` branch from its repository Code page using **Code → Download ZIP**, then extract it. Keep the full repository layout.
2. If the existing Worker already reports session engine v0.9.2, no backend update is needed for this revision. Otherwise `Deploy_Backend_Windows.bat` checks and deploys the compatible v0.9.2 engine to the existing Worker. It is a production backend update; finish active rooms first.
3. Publish the candidate frontend through the repository's Pages process when ready for hosted review. Keep Pages at `main` and `/ (root)` in the established arrangement. The root entry points forward to `public/`. Do not copy `public/` files over the repository root.
4. Open `public/connection-test.html`, then test fresh teacher/student sessions and both practice pages. Expect front end v0.9.3 and session server v0.9.2. That pairing is intentional.
5. The existing Netlify proxy requires no upload for these frontend changes. Do not rename the repository or Netlify project until the migration handoff's account checks and timing are resolved.

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
