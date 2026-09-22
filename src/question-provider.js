import { generatePresetItem } from "./math.js";

// This is the v0.6 question-provider seam. The session engine asks for the next
// eligible item; it does not let the Vault 7 cartridge choose curriculum. A
// future TestForge adapter can implement this same request without changing the
// cartridge or gameplay state machine.
export function provideQuestion({ modules, student, assignment }) {
  if (!assignment) return null;
  if (assignment.prompt) return assignment; // Compatibility with pre-v0.4.2 rooms.
  if (assignment.source === "preset") {
    const policy = assignment.difficultyOverride || student.difficultyPolicy || "session";
    const band = policy === "foundation" ? "beginner"
      : policy === "challenge" ? "advanced"
        : policy === "standard" ? "intermediate"
          : assignment.band;
    return {
      ...generatePresetItem(assignment.moduleId, assignment.seed, band),
      seed: assignment.seed,
      assignedDifficulty: policy === "session" ? assignment.band : policy
    };
  }
  const selected = modules.find(module => module.id === assignment.moduleId && module.source === "custom");
  const record = selected?.items?.[assignment.itemIndex];
  return record ? { ...record, id: `${record.id}-${assignment.seed}`, assignedDifficulty: "teacher-authored" } : null;
}
