import test from "node:test";
import assert from "node:assert/strict";
import { PRESET_MODULES, generatePresetItem, checkItem, normalizeCustomItem } from "../src/math.js";

test("all 25 preset generators are deterministic and self-checking", () => {
  assert.equal(PRESET_MODULES.length, 25);
  for (const module of PRESET_MODULES) {
    for (const band of ["beginner", "intermediate", "advanced"]) {
      for (let seed = 1; seed <= 25; seed += 1) {
        const first = generatePresetItem(module.id, seed, band);
        const second = generatePresetItem(module.id, seed, band);
        assert.deepEqual(first, second);
        assert.equal(checkItem(first, first.answer).correct, true, `${module.id} should accept its generated answer`);
      }
    }
  }
});

test("math checker supports every v0.4 answer contract", () => {
  const cases = [
    ["integer", "-7", "−7"], ["number", "2.5", "2.50"], ["decimal", "0.25", ".25"],
    ["fraction", "1/2", "1/2"], ["percent", "25", "25%"], ["ratio", "2:3", "4:6"],
    ["scientific", "3.2e5", "3.2e5"], ["choice", "Rhombus", "rhombus"]
  ];
  for (const [answerType, answer, submitted] of cases) assert.equal(checkItem({ answerType, answer }, submitted).correct, true, answerType);
});

test("teacher questions are validated before a session begins", () => {
  const valid = normalizeCustomItem({ prompt: "Simplify 6/8.", answer_type: "fraction", answer: "3/4" }, 0, "My Fractions");
  assert.equal(valid.moduleTitle, "My Fractions");
  assert.equal(checkItem(valid, "6/8").correct, false);
  assert.throws(() => normalizeCustomItem({ prompt: "Question", answer_type: "graph", answer: "x" }), /unsupported answer type/i);
  assert.throws(() => normalizeCustomItem({ prompt: "Question", answer_type: "choice", answer: "A" }), /pipe-separated choices/i);
});

test("negative exponents render the entire signed exponent as superscript", () => {
  const item = generatePresetItem("exponent.negative", 42, "intermediate");
  assert.match(item.prompt, /\^\(-\d+\)/);
  assert.match(item.promptMarkup, /<sup>−\d+<\/sup>/);
});

test("teacher questions can include a validated HTTPS image", () => {
  const item = normalizeCustomItem({
    prompt: "Use the diagram.", answer_type: "integer", answer: "7",
    image_url: "https://example.com/diagram.png", image_alt: "Seven marked tiles", image_caption: "Count the marked tiles."
  }, 0, "Visual Set");
  assert.equal(item.media.src, "https://example.com/diagram.png");
  assert.equal(item.media.alt, "Seven marked tiles");
  assert.throws(() => normalizeCustomItem({ prompt: "Unsafe", answer: "1", image_url: "javascript:alert(1)" }), /HTTPS/);
});

test("simplification modules reject an equivalent unreduced fraction", () => {
  const item = generatePresetItem("fraction.simplify", 27, "intermediate");
  const [numerator, denominator] = item.answer.split("/").map(Number);
  assert.equal(checkItem(item, `${numerator * 2}/${denominator * 2}`).correct, false);
  assert.equal(checkItem(item, item.answer).correct, true);
});

test('new answer forms grade exact rational values and reject unsafe/ambiguous formats',()=>{
  assert.equal(checkItem({answerType:'mixed',answer:'-2 1/3'},'-2 1/3').correct,true);
  assert.equal(checkItem({answerType:'mixed',answer:'-2 1/3'},'-2 2/6').correct,false);
  assert.equal(checkItem({answerType:'mixed',answer:'-2 1/3'},'-2 4/3').valid,false);
  assert.equal(checkItem({answerType:'fraction',answer:'1/3'},'3333333333333333/9999999999999999').valid,false);
  assert.equal(checkItem({answerType:'number',answer:'0.00000000001'},'0').correct,false);
  assert.equal(checkItem({answerType:'money',answer:'19.90'},'19.9').correct,true);
  assert.equal(checkItem({answerType:'unit',answer:'2.54'},'2.54').correct,true);
  assert.equal(checkItem({answerType:'scientific',answer:'3e-4'},'30e-5').valid,false);
  assert.equal(checkItem({answerType:'scientific',answer:'1e9999'},'1e9999').valid,false);
});

test('scientific operation answers equal the operands and normalize across positive/negative powers',()=>{
  for(let seed=0;seed<100;seed++){
    const q=generatePresetItem('exponent.scientific-operations',seed,'advanced');
    const match=q.prompt.match(/\((\d+) × 10\^\((-?\d+)\)\) ([÷×]) \((\d+) × 10\^\((-?\d+)\)\)/);
    assert.ok(match);const a=Number(match[1])*10**Number(match[2]),b=Number(match[4])*10**Number(match[5]),value=match[3]==='×'?a*b:a/b;
    assert.ok(Math.abs(Number(q.answer)-value)/Math.abs(value)<1e-12);assert.ok(Math.abs(Number(q.answer.split('e')[0]))>=1&&Math.abs(Number(q.answer.split('e')[0]))<10);
  }
});

test('tax and tip use cent-based half-up rounding and give unambiguous amount/total prompts',()=>{
  for(let seed=0;seed<100;seed++){
    const q=generatePresetItem('percent.tax-tip',seed,'advanced'),base=Number(q.prompt.match(/\$(\d+\.\d{2})/)[1]),rate=Number(q.prompt.match(/ (\d+(?:\.\d+)?)%/)[1]);
    const cents=Math.round(base*100),tax=Math.floor((cents*Math.round(rate*100)+5000)/10000),want=(q.prompt.includes('final total')?cents+tax:tax)/100;
    assert.equal(Number(q.answer),want);assert.match(q.prompt,/nearest cent/);
  }
});

test('imported unit/mixed/choice items retain assessment tags and reject missing option answers',()=>{
  const q=normalizeCustomItem({prompt:'A conversion',answerType:'unit',answer:'2.54',unit:'cm',standards:['custom-target'],DOK:2,subskillId:'length'});
  assert.equal(q.unit,'cm');assert.equal(q.DOK,2);assert.deepEqual(q.standards,['custom-target']);assert.equal(q.subskillId,'length');
  assert.throws(()=>normalizeCustomItem({prompt:'Pick',answerType:'choice',answer:'C',options:['A','B']}),/match one choice/);
});
