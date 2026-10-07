# Journey Stage 9 — owner playtest feedback, 8 October 2026

Approved task: remove geometric hit/attack-zone visuals; improve attack, jump, container-hit and enemy-hit sound effects; increase breakables; use pre-drawn elixir/baozi artwork; provide regular keyboard playtest controls.

Baseline: 975989afdd739b08c5f14f8556f4b1bb77ab4804, isolated Journey Stage 8. Branch: implement/journey-stage9-feedback. Runtime: jttw-0.1.0-stage9-feedback.

## Design and implementation contract

- Remove orange range rectangles/aim lines and geometric special/shield range artwork. Retain actual hero/clone/horse animation, warning exclamation marks, health HUD and real projectiles. Collision/damage and warning timing stay authoritative and unchanged.
- Replace drawn crates and diamond pickups with original transparent raster artwork: wood provision crate, mystical cyan elixir, and baozi health. Draw existing art assets, never construct those objects with canvas geometry. Retain pickup effects (+1 magic, +25 HP), capacity checks and individual ownership.
- Double crates in each of the four pre-boss arenas from N to 2N for N starters. Existing four magic crates per starter remain; add two magic and two baozi crates per starter distributed across the level. Total run stock becomes seven magic and three health per starter. Preserve unique IDs and carry unreleased supplies forward exactly once at forced boss arrival. Space supplies within the arena.
- Sound: layered filtered-noise weapon swishes with hero-specific resonances; rising airy jump; dry hollow wood knock on every successful container hit plus short splinter cascade when broken; lower body-impact thump/crunch on enemy damage to a player. Small bounded timbre variation; independent effects mute; bounded simultaneous voices, event deduplication and interruption silence. Existing synthesized music retained.
- Keyboard: WASD/arrows movement, J/Z attack, K/Space/X jump, L/C magic; Escape pauses solo, Enter resumes paused solo. Preserve touch and shared held-input ownership, fresh one-shot action edges, release, focus/background/death reset. Make controls visible during setup and play, avoid Space activating the last focused button.
- Retain approved 180-second Journey exception, three lives, cast, boss, stage progression, math/report separation, multiplayer authority and all other cartridges. No classroom deployment or overwrite of newer main.

## Verification

Checkpoint before extended checks. Run Node suite/build, meaningful supply/keyboard/audio regressions, local five-client and teacher/student bridges, standalone Chrome-equivalent file-open with assets, keyboard, pause, death/reset, and screenshot review. Record audio signal checks separately from human listening. Physical iOS, Windows Chrome, school-network and classroom acceptance remain unperformed unless actually checked.

Handbook consulted: c50115ba1fea9cb552f3ad1415e670a219118b56 (v0.1.3), AI-START-HERE.md, UNIVERSAL-RULES.md, CONDITIONAL-STANDARDS.md (S-02/S-03/S-04, existing S-03-A exception), RELEASE-CHECKLIST.md; project AGENTS.md, PROJECT-BRIEF.md, approved Journey v0.1 and Stage 8 resources. U-10 applies; no shared rule amendment.
