# MathQuest Platform Boundaries — v0.6

MathQuest is the engagement and game-delivery surface. It does not own the
long-term educational logic.

| Surface | Owns | Does not own |
|---|---|---|
| GradePal | Stable learner identity, historical mastery, learner profile | Cartridge state or question authoring |
| TestForge | Question packages, learning outcomes, standards, DOK, validation, selection policy | Narrative, teams, currency, endings |
| MathQuest | Cartridge state, delivery, teams, resources, choices, attempts, gameplay evidence | Persistent mastery decisions |
| DataDiver | Aggregated institutional patterns | Individual live differentiation |

The future runtime request is `next eligible question for studentId in this
assignment context`. TestForge and GradePal decide the item. MathQuest records
the delivery and response evidence, then writes that evidence back.

v0.6 keeps this seam visible through discipline IDs, source-tagged modules,
per-player difficulty policy, item IDs, and assigned-difficulty evidence. Its
local generators are a prototype question provider, not a permanent claim that
the game engine should own curriculum intelligence.

Student display names are presentation data. A future `studentId` is the stable
GradePal identity; the current device ID is only a room-scoped prototype key.
