// Explicit scene roles: no keyword guessing or changes to the narrative data.
export function reviewParagraphs(scene, stage, cartridge, escape) {
  const paragraphs = scene.paragraphs;
  const last = paragraphs.length - 1;
  const roles = {
    ironbreak: {briefing:[last], decision:[1], market:[0,1], minigame:[0,1], gate:[last], finale:[last]},
    blackline: {briefing:[last], decision:[last], market:[last], gate:[last]},
    coastal: {briefing:[last], market:[1,2], gate:[last], minigame:[0], finale:[last]},
    haven: {briefing:[last], market:[last], gate:[last], minigame:[0]}
  };
  const indexes = roles[cartridge]?.[stage] || [];
  const narrative = [], instructions = [];
  paragraphs.forEach((p, i) => (indexes.includes(i) ? instructions : narrative).push(`<p>${escape(p)}</p>`));
  return narrative.join('') + (instructions.length ? `<aside class="mission-instructions" aria-label="Mission instructions"><h2>Mission instructions</h2>${instructions.join('')}</aside>` : '');
}
