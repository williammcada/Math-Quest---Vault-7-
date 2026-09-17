# Project Brief — MathQuest

**Brief status:** Draft for project migration
**Brief version:** 0.1
**Last updated:** 18 September 2026
**Owner:** William McAda
**Product credit:** A WILLIAM MCADA PRODUCT

**Handbook repository:** `williammcada/mcada-project-handbook`
**Handbook baseline:** `6de4cbf33c3b9860125c412359fb64ef3d0b20d1`
**Baseline adoption:** Selected for MathQuest development

**Canonical project repository:** `williammcada/Math-Quest---Vault-7-`
**Canonical source checkpoint:** `601184761b8247999b731a9720261788c79f3c66`
**Current repository baseline:** MathQuest v0.9.0
**Hosted running version:** Not re-verified during this documentation migration
**Requested next version:** MathQuest v0.9.1

---

## 1. Purpose and audience

MathQuest is a reusable classroom mathematics game platform.

The teacher configures mathematics content, teams, session settings, and cartridge options. Students complete mathematics and shared team decisions, earn or spend resources, and participate in cartridge-specific narrative events and individual action-game sequences.

The platform is intended primarily for teacher-supervised classroom use.

The present cartridges are:

1. **Vault Seven** — science-fiction infiltration/extraction cartridge with team decisions, equipment, security systems, cipher elements, and an individual stealth extraction.
2. **Nightfall: Last Bus Out** — urban survival cartridge with resource pressure, objectives, exploration, environmental interactions, and an individual survival action sequence.

MathQuest is the product. Cartridge names must not replace the MathQuest platform identity in shared engine code or shared product documentation.

---

## 2. Current task

The current development target is **MathQuest v0.9.1**.

Version 0.9.1 is a stabilization, gameplay-repair, presentation, reliability, and pilot-privacy release.

The approved change specification is:

`docs/change-specs/v0.9.1.md`

The current task does **not** authorize:

* a new cartridge;
* real-time multiplayer combat;
* persistent hosted learner accounts;
* GradePal integration;
* TestForge integration;
* DataDiver integration;
* a replacement hosting provider;
* an infrastructure rename or migration;
* a general rewrite of the MathQuest engine.

---

## 3. Standards selection

### Universal rules

Apply the relevant McAda Project Handbook universal rules:

* **U-01** — Identify the product and delivered version
* **U-02** — Explain consequential controls in place
* **U-03** — Validate inputs at the point of use
* **U-04** — Make mathematics and text unambiguous
* **U-05** — Design for the actual reader and device
* **U-06** — Preserve accepted behavior during iteration
* **U-07** — Verify the real workflow and report the limits
* **U-08** — Reuse shared principles without exporting local restrictions

### Conditional standards

Apply:

* **S-02 — Curriculum, assessment, and evidence**
* **S-03 — Live classroom and educational games**
* **S-04 — Distribution, deployment, and classroom operation**

### Project-adopted safeguard

For the v0.9.1 classroom pilot, adopt the S-03 learner-data safeguard.

Pilot privacy requirements are defined in the v0.9.1 change specification and include generated aliases, data minimization, short retention, hosted-session deletion, credential expiration, and no persistent learner identity.

---

## 4. Project-specific requirements

### Product architecture

MathQuest must remain cartridge-driven.

Shared engine responsibilities include:

* classroom/session lifecycle;
* team structure;
* mathematics delivery;
* teacher controls;
* voting;
* resource-market framework;
* reporting framework;
* action-game lifecycle interfaces;
* reconnect/state synchronization;
* common accessibility and input behavior.

Cartridge-specific responsibilities include:

* narrative;
* cartridge-specific assets;
* locations;
* items;
* events;
* endings;
* action-game maps;
* cartridge-specific mechanics.

Do not place new Vault Seven- or Nightfall-specific assumptions inside the shared MathQuest shell unless the behavior is genuinely part of the shared cartridge contract.

### Teacher role

The teacher must be able to:

* configure the classroom session;
* select or import mathematics;
* configure question count and difficulty where supported;
* launch the room;
* supervise student/team state;
* extend mathematics during an active session where supported;
* end the session;
* review/export evidence;
* use applicable developer/practice tools;
* manage hosted-session deletion during the pilot.

### Student role

Students must:

* join the assigned room/team;
* complete required mathematics;
* participate in the intended team decision structure;
* experience cartridge narrative and resource consequences;
* complete one meaningful individual action-game run where specified;
* receive understandable success, failure, recovery, and ending states.

Gameplay failure must not silently rewrite academic mastery.

### Mathematics and evidence

Mathematics must remain unambiguous.

Prompts, response controls, accepted answers, scoring, units, fractions, exponents, signs, percentages, and any required rounding must agree.

Academic evidence and gameplay evidence remain distinct.

Gameplay evidence may inform engagement, cartridge balancing, or supervision but must not silently become mathematical mastery evidence.

### Devices and controls

Primary classroom targets:

* teacher Windows computer;
* student iPads, primarily landscape orientation.

Desktop/keyboard operation remains useful for development, teacher use, and supported play.

Required student actions must have usable touch controls on the target iPads. Hover-only help or controls are insufficient.

In-game text must remain crisp and readable. Retro presentation is not permission for blurry instructional or objective text.

### Classroom network

MathQuest is a networked classroom product.

Hosted testing is not equivalent to school-network testing.

A full simultaneous approximately 23-iPad school-network trial remains the final classroom device/network gate for the pilot.

### Hosting

Preserve the existing hosting/infrastructure path during v0.9.1:

* GitHub Pages front end;
* existing relay/service infrastructure;
* existing Worker/Durable Object or equivalent established session infrastructure.

Infrastructure migration requires its own specification, verification, and rollback plan.

### Cost

Do not introduce a paid recurring dependency without explicit approval.

### Privacy — v0.9.1 pilot target

The pilot must not require student real names.

The server assigns short-lived generated aliases.

The pilot uses:

* opaque room identity;
* separate teacher credentials;
* minimized stored data;
* default 48-hour retention;
* teacher-controlled hosted-session deletion;
* automatic expiration;
* credential invalidation after deletion or expiry;
* no advertising;
* no analytics SDK;
* no third-party behavioral telemetry;
* no GradePal or persistent learner identity.

---

## 5. Preserve from the current release

Unless explicitly changed by the approved version specification, preserve:

* MathQuest product identity;
* Vault Seven cartridge identity;
* Nightfall cartridge identity;
* modular cartridge/engine boundaries established before v0.9;
* mathematics engine;
* teacher classroom setup;
* team structure;
* shared team decisions;
* voting;
* resource-market framework;
* existing reporting separation;
* one live action run per student;
* academic evidence independent of action-game survival;
* reconnect/state restoration;
* End Session control;
* supported live question extension behavior;
* existing hosted classroom architecture;
* bundled cartridge assets;
* applicable accessibility fallback behavior;
* existing report compatibility unless an approved schema revision explicitly changes it.

Accepted functionality must not disappear merely because it is absent from the current change list.

---

## 6. Relationship to other projects

The intended long-term ecosystem is:

**TestForge** → assessment intelligence
**GradePal** → learner mastery model
**MathQuest** → engagement/gameplay delivery and gameplay evidence
**DataDiver** → institutional analytics

This is an architecture vision, not proof of working integration.

### Current integration status

**TestForge:** no required live integration
**GradePal:** disconnected during the v0.9.1 pilot
**DataDiver:** no required live integration

Do not invent account exchange, learner identity, question-provider APIs, or evidence writeback simply because they are plausible future integrations.

---

## 7. Exceptions and conflicts

| Shared rule or proposal                            | MathQuest requirement                     | Reason                                                      | Status                    |
| -------------------------------------------------- | ----------------------------------------- | ----------------------------------------------------------- | ------------------------- |
| S-03 learner-data safeguard                        | Apply during v0.9.1 pilot                 | Classroom pilot uses hosted session data                    | Adopted for v0.9.1        |
| Standalone/offline patterns used by other projects | Not applicable as a MathQuest requirement | MathQuest is intentionally networked for classroom sessions | Project-specific boundary |
| AAC assessment restrictions                        | Do not apply globally                     | AAC form rules are unrelated to MathQuest gameplay/practice | Not applicable            |

No other approved handbook exceptions are currently recorded.

---

## 8. Release workflow

For substantial revisions use:

**DESIGN → CHANGE SPEC → IMPLEMENT → CHECKPOINT → VERIFY → VERIFIED CHECKPOINT → RELEASE → DEPLOY → CLASSROOM VALIDATION**

### Implementation stage

Implement only the approved change specification against the identified canonical source.

Do not package a final release before implementation has reached a recoverable checkpoint.

### Verification stage

Run the applicable automated, gameplay, reconnect, hosted-flow, rendering, privacy, and deployment checks.

Use only:

* Passed
* Failed
* Not run
* Not applicable

A passed build does not establish a passed hosted workflow.

### Release stage

Once verification is satisfactory:

* preserve the verified source checkpoint;
* update application version;
* update documentation;
* package the verified source;
* deploy the same verified candidate;
* verify the hosted application.

Do not introduce new gameplay features during packaging.

### Classroom stage

Perform the real approximately 23-iPad classroom-network trial.

Classroom testing is a separate status from automated and hosted testing.

---

## 9. Definition of done

| Requirement                          | Test or inspection                                      | Required evidence                          |
| ------------------------------------ | ------------------------------------------------------- | ------------------------------------------ |
| Correct product/version              | Inspect running application, README, source and package | All identify same release                  |
| Mathematics remains correct          | Representative and boundary-case testing                | Recorded passed tests                      |
| Existing accepted behavior preserved | Regression comparison against baseline                  | No unexplained feature loss                |
| Vault Seven works end to end         | Teacher + student hosted flow                           | Successful completion and report           |
| Nightfall works end to end           | Teacher + student hosted flow                           | Successful completion and report           |
| Touch controls work                  | Target iPad inspection                                  | Required controls usable                   |
| Text is readable                     | Inspect action-game and instructional screens           | No critical blurry/illegible text          |
| Reconnect works                      | Interrupt/rejoin active session                         | State restored correctly                   |
| Privacy mode works                   | Alias, retention, deletion, expiry tests                | Required pilot behavior demonstrated       |
| Reports remain separated             | Inspect JSON/CSV/UI reports                             | Academic/gameplay evidence distinguishable |
| Deployment is correct                | Open actual hosted release                              | Correct version/assets running             |
| Classroom network is ready           | Approximately 23-iPad test                              | Real school-network result                 |

---

## 10. Known issues and unverified claims

### Current repository baseline

The canonical repository currently represents the v0.9.0 baseline at:

`601184761b8247999b731a9720261788c79f3c66`

### v0.9.1 recovery

A v0.9.1 implementation candidate was developed and tested in a separate prior workspace, but the completed source/package has not yet been established as the canonical GitHub release.

Do not rebuild v0.9.1 merely because the final packaging operation failed if the completed candidate can be recovered.

Once recovered:

1. identify the exact candidate source;
2. compare it against the canonical v0.9 baseline;
3. verify that the approved v0.9.1 specification is represented;
4. rerun or confirm required verification against that exact candidate;
5. create an identifiable verified checkpoint;
6. package and deploy from that checkpoint.

### Hosted release

The hosted running version was not independently re-verified during this documentation migration.

### Classroom gate

The full approximately 23-iPad school-network trial remains pending until actually performed.

### Repository name

The repository retains the historical name `Math-Quest---Vault-7-`.

This does not change the product identity: the product is **MathQuest** and Vault Seven is a cartridge.

A repository rename is not part of v0.9.1.

---

## 11. Handoff files

An implementation handoff should include or retrieve:

1. current canonical MathQuest repository/source checkpoint;
2. this `PROJECT-BRIEF.md`;
3. approved version change specification;
4. McAda Project Handbook:

   * `AI-START-HERE.md`
   * `UNIVERSAL-RULES.md`
   * relevant sections of `CONDITIONAL-STANDARDS.md`
   * `RELEASE-CHECKLIST.md`;
5. required cartridge assets;
6. applicable deployment configuration.

A historical conversation summary is useful context but is not a substitute for the actual source code or approved specification.

---

## 12. Ownership

**William McAda**
**A WILLIAM MCADA PRODUCT**
