# MathQuest

**A WILLIAM MCADA PRODUCT**

MathQuest is a cartridge-based classroom mathematics game platform. Teachers configure academic content and a shared classroom session; students complete mathematics, team decisions, resource choices, and individual action-game sequences inside cartridge-specific narratives.

The current cartridges are:

* **Vault Seven**
* **Nightfall: Last Bus Out**

## Canonical project status

**Candidate:** MathQuest v0.9.4, branch `release/v0.9.4`. Nightfall First Response inserts a personal rescue/escort between the first team vote and Gate 2. Unlimited retries share one server-controlled five-minute team window.

**Starting main source:** merged v0.9.3, `c7ea42d7e54402357b5c56c52c44856666e4c2b9`. Canonical frontend `public/`; session engine `src/`. Both components identify v0.9.4. This feature requires the updated Worker.

**Existing addresses:** repository `williammcada/Math-Quest---Vault-7-`; Pages `https://williammcada.github.io/Math-Quest---Vault-7-/`; Netlify relay `https://vault7mathquest.netlify.app/api/`. The separate address migration remains inactive.

See the [v0.9.4 candidate report](docs/releases/v0.9.4-candidate.md), [change specification](docs/change-specs/v0.9.4.md), and [address migration handoff](docs/migrations/v0.9.3-addresses.md). Earlier candidate reports and specifications remain historical evidence.

## Test/deploy this candidate at the existing addresses

1. Download `release/v0.9.4` from its repository Code page using **Code → Download ZIP**, then extract the full directory.
2. Finish active classroom sessions. Run `Deploy_Backend_Windows.bat` to check and update the **existing** Cloudflare Worker to v0.9.4. Keep its Worker name, storage binding and migration unchanged. Publishing only the frontend cannot enable First Response.
3. Publish the frontend through the established Pages process when ready for hosted review. Pages remains `main` and `/ (root)`; root entry points forward into `public/`. Do not copy `public/` over the repository root.
4. Run `public/connection-test.html`; expect frontend and server v0.9.4. Create fresh teacher/student rooms for the new sequence. Existing v0.9.2 rooms remain compatible and retain their original sequence, without a retroactive rescue insertion.
5. Open Nightfall practice and select **First Response · five-minute rescue window**, then Clinic or Depot Garage. The practice timer includes delayed Start and local pauses; Restart practice is outside classroom evidence. Later-city equipment/threat/checkpoint controls are disabled for this chapter.
6. Verify live rescue → Gate 2, pause/reconnect/expiry, later city independence, and both cartridges on target devices. The unchanged Netlify relay needs no upload. No repository/address rename is part of this feature.

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
