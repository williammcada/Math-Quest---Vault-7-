# Horse charge and frame extraction checkpoint

Authorized continuation 2026-10-01, baseline remote c2835461d89c94a366ed3f10218809ec2a8c4163 (local tree-equivalent 798ea0d). Implement approved steerable horse charge: 300ms transform, 3000ms charge, 300ms return; one magic charge, per-target max two 30-damage impacts at least600ms apart, Focus +20%. Server owns movement/collisions/time; charge does not grant invulnerability, ordinary attacks or jumps. No instant area damage. Pause freezes the action; death cancels it; dropped input stops steering/hits. Use new horse transformation/gallop/turn/impact/return art. Timings around the approved three-second charge are implementation tuning.

Replace assumed uniform source cuts with explicit frame bounds where the complete isolated pose is recoverable. Preserve generated PNG originals and document any unsafe cuts that still need artwork revision. No claim all atlas clipping is resolved unless visual evidence supports it.

Tests: cast cost/replay, steering/hit limits/interval, Focus, pause, input lease/disconnect, death, return; render horse state sequence and existing five-hero clips. Run full suite/build on a checkpoint. Existing 180-second match remains. Full encounter, boss, audio/narrative, live deployment and physical devices remain out of scope.

Read handbook AI-START-HERE6557a45, UNIVERSAL-RULES6bde7c1, CONDITIONAL-STANDARDS1a79498; relevant S-02–S-04. Current brief/AGENTS and approved v0.1 special/art requirements read. No handbook amendment.
