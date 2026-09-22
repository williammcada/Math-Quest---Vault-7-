import { ADDITIONAL_MODULES, expandedQuestion } from './math-v06.js';

export function hashSeed(text) {
  let h = 2166136261;
  for (const ch of String(text)) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

function rng(seed) {
  let value = seed >>> 0;
  return () => {
    value += 0x6D2B79F5;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const integer = (random, low, high) => low + Math.floor(random() * (high - low + 1));
const pick = (random, values) => values[integer(random, 0, values.length - 1)];
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
const lcm = (a, b) => Math.abs(a * b) / gcd(a, b);
const shown = value => value < 0 ? `(${value})` : String(value);
const limitsFor = band => band === "beginner" ? [2, 10] : band === "advanced" ? [8, 30] : [4, 20];

export const PRESET_MODULES = [
  ["number.integer-operations", "Integer Operations", "integer"],
  ["number.gcf", "Greatest Common Factor", "integer"],
  ["number.lcm", "Least Common Multiple", "integer"],
  ["number.absolute-value", "Absolute Value", "integer"],
  ["number.order-of-operations", "Integer Order of Operations", "integer"],
  ["number.part-of-whole", "Fraction or Percent of a Whole", "number"],
  ["data.mean-missing", "Mean and Missing Average", "number"],
  ["algebra.one-step", "One-Step Equations", "number"],
  ["algebra.two-step", "Equations with Rational Numbers", "dynamic"],
  ["fraction.simplify", "Simplifying Fractions", "fraction"],
  ["number.fdp-conversion", "Fraction Decimal Percent Conversion", "dynamic"],
  ["probability.simple", "Simple Probability", "fraction"],
  ["ratio.unit-rate", "Unit Rate", "number"],
  ["ratio.proportion", "Ratio and Proportion", "number"],
  ["percent.change", "Percent Change", "percent"],
  ["exponent.negative", "Negative Exponents", "fraction"],
  ["number.scientific-notation", "Scientific Notation", "scientific"]
  ,...ADDITIONAL_MODULES
].map(([id, title, answerType]) => ({ id, title, answerType, disciplineId:'mathematics', courseBankId:'prealgebra', source:'mathquest-preset' }));

export const MODULE_BY_ID = Object.fromEntries(PRESET_MODULES.map(record => [record.id, record]));

function makeItem(moduleId, title, prompt, answerType, answer, extra = {}) {
  return { moduleId, moduleTitle: title, prompt, answerType, answer: String(answer), ...extra };
}

export function generatePresetItem(moduleId, seed, band = "intermediate") {
  const random = rng(typeof seed === "number" ? seed : hashSeed(seed));
  const [low, high] = limitsFor(band);
  const meta = MODULE_BY_ID[moduleId];
  if (!meta) throw new Error(`Unknown preset module: ${moduleId}`);
  let result = expandedQuestion(moduleId, band, random);
  if (result) return { ...result, moduleId, moduleTitle:meta.title, id:`${moduleId}-${hashSeed(`${seed}:${band}`)}`, band, disciplineId:'mathematics', courseBankId:'prealgebra', source:'mathquest-preset', standards:[], DOK:1 };

  if (moduleId === "number.integer-operations") {
    const operation = pick(random, ["+", "−", "×", "÷"]);
    let a, b, answer;
    if (operation === "÷") {
      b = integer(random, low, high) * (random() < .5 ? -1 : 1);
      answer = integer(random, -12, 12) || 2;
      a = b * answer;
    } else {
      a = integer(random, low, high) * (random() < .5 ? -1 : 1);
      b = integer(random, low, high) * (random() < .5 ? -1 : 1);
      answer = operation === "+" ? a + b : operation === "−" ? a - b : a * b;
    }
    result = makeItem(moduleId, meta.title, `${shown(a)} ${operation} ${shown(b)}`, "integer", answer);
  } else if (moduleId === "number.gcf") {
    const factor = integer(random, 2, band === "advanced" ? 15 : 9);
    let m = integer(random, 2, high), n = integer(random, 2, high);
    while (gcd(m, n) !== 1) n = integer(random, 2, high);
    result = makeItem(moduleId, meta.title, `Find the GCF of ${factor * m} and ${factor * n}.`, "integer", factor);
  } else if (moduleId === "number.lcm") {
    const a = integer(random, low, high), b = integer(random, low, high);
    result = makeItem(moduleId, meta.title, `Find the LCM of ${a} and ${b}.`, "integer", lcm(a, b));
  } else if (moduleId === "number.absolute-value") {
    const a = -integer(random, low, high * 2), b = random() < .5 ? 0 : integer(random, 1, 8);
    result = makeItem(moduleId, meta.title, b ? `Evaluate |${a}| + ${b}.` : `Evaluate |${a}|.`, "integer", Math.abs(a) + b);
  } else if (moduleId === "number.order-of-operations") {
    const a = integer(random, 2, 9), b = integer(random, 2, 9), c = integer(random, 3, 9), d = integer(random, 1, c - 1);
    result = makeItem(moduleId, meta.title, `${a} + ${b} × (${c} − ${d})`, "integer", a + b * (c - d));
  } else if (moduleId === "number.part-of-whole") {
    const percent = pick(random, [10, 20, 25, 50, 75]);
    const whole = pick(random, [20, 40, 60, 80, 100, 120, 160, 200]);
    result = makeItem(moduleId, meta.title, `Find ${percent}% of ${whole}.`, "number", whole * percent / 100);
  } else if (moduleId === "data.mean-missing") {
    const count = band === "advanced" ? 6 : 4;
    const mean = integer(random, low, high);
    const values = Array.from({ length: count - 1 }, () => integer(random, low, high));
    const missing = mean * count - values.reduce((sum, value) => sum + value, 0);
    result = makeItem(moduleId, meta.title, `The mean of ${values.join(", ")}, and x is ${mean}. Find x.`, "number", missing);
  } else if (moduleId === "algebra.one-step") {
    const x = integer(random, -high, high), a = integer(random, low, high);
    result = makeItem(moduleId, meta.title, `Solve: x + ${a} = ${x + a}`, "number", x);
  } else if (moduleId === "algebra.two-step") {
    const x = integer(random, -12, 12), a = integer(random, 2, band === "advanced" ? 9 : 6), b = integer(random, -high, high);
    result = makeItem(moduleId, meta.title, `Solve: ${a}x ${b < 0 ? "−" : "+"} ${Math.abs(b)} = ${a * x + b}`, "number", x);
  } else if (moduleId === "fraction.simplify") {
    const numerator = integer(random, 1, 11), denominator = integer(random, numerator + 1, 15), factor = integer(random, 2, band === "advanced" ? 12 : 7);
    const divisor = gcd(numerator, denominator);
    result = makeItem(moduleId, meta.title, `Simplify ${numerator * factor}/${denominator * factor}.`, "fraction", `${numerator / divisor}/${denominator / divisor}`, { expectedForm: "simplified" });
  } else if (moduleId === "number.fdp-conversion") {
    const denominator = pick(random, [2, 4, 5, 10, 20, 25]);
    const numerator = integer(random, 1, denominator - 1);
    const divisor = gcd(numerator, denominator), n = numerator / divisor, d = denominator / divisor;
    const target = pick(random, ["decimal", "percent", "fraction"]);
    if (target === "decimal") result = makeItem(moduleId, meta.title, `Convert ${n}/${d} to a decimal.`, "decimal", n / d);
    else if (target === "percent") result = makeItem(moduleId, meta.title, `Convert ${n}/${d} to a percent.`, "percent", n / d * 100);
    else result = makeItem(moduleId, meta.title, `Convert ${n / d} to a simplified fraction.`, "fraction", `${n}/${d}`);
  } else if (moduleId === "probability.simple") {
    const favorable = integer(random, 1, 8), other = integer(random, 2, 10), divisor = gcd(favorable, favorable + other);
    result = makeItem(moduleId, meta.title, `A bag has ${favorable} blue and ${other} red marbles. What is P(blue)?`, "fraction", `${favorable / divisor}/${(favorable + other) / divisor}`);
  } else if (moduleId === "ratio.unit-rate") {
    const units = integer(random, 2, 12), rate = integer(random, 2, band === "advanced" ? 25 : 12);
    result = makeItem(moduleId, meta.title, `${units} identical items cost ${units * rate} credits. Find the cost per item.`, "number", rate);
  } else if (moduleId === "ratio.proportion") {
    const a = integer(random, 2, 9), b = integer(random, 2, 9), scale = integer(random, 2, high);
    result = makeItem(moduleId, meta.title, `Solve the proportion ${a}/${b} = x/${b * scale}.`, "number", a * scale);
  } else if (moduleId === "percent.change") {
    const oldValue = pick(random, [20, 25, 40, 50, 80, 100, 120, 200]);
    const rate = pick(random, [10, 20, 25, 50]);
    const increase = random() < .5;
    const newValue = oldValue * (1 + (increase ? 1 : -1) * rate / 100);
    result = makeItem(moduleId, meta.title, `A value changes from ${oldValue} to ${newValue}. Find the percent ${increase ? "increase" : "decrease"}.`, "percent", rate);
  } else if (moduleId === "exponent.negative") {
    const base = integer(random, 2, band === "advanced" ? 8 : 5), exponent = integer(random, 1, band === "advanced" ? 4 : 3);
    result = makeItem(moduleId, meta.title, `Evaluate ${base}^(-${exponent}). Give a simplified fraction.`, "fraction", `1/${base ** exponent}`, {
      expectedForm: "simplified",
      promptMarkup: `Evaluate ${base}<sup>−${exponent}</sup>. Give a simplified fraction.`
    });
  } else if (moduleId === "number.scientific-notation") {
    const coefficient = integer(random, 1, 9) + (band === "advanced" ? integer(random, 1, 9) / 10 : 0);
    const exponent = integer(random, 3, band === "advanced" ? 8 : 6);
    result = makeItem(moduleId, meta.title, `Write ${coefficient * 10 ** exponent} in scientific notation.`, "scientific", `${coefficient}e${exponent}`);
  }
  return { ...result, id: `${moduleId}-${hashSeed(`${seed}:${band}`)}`, band, disciplineId:'mathematics', courseBankId:'prealgebra', subskillId:moduleId.split('.').slice(1).join('.'), source:'mathquest-preset', standards:[], DOK:1 };
}

function parseNumber(value, integerOnly = false) {
  const text = String(value ?? "").trim().replace(/−/g, "-").replace(/%$/, "");
  if (!/^-?(?:\d+\.?\d*|\.\d+)$/.test(text)) return { valid: false, error: "Enter one numeric answer." };
  const number = Number(text);
  if (!Number.isFinite(number) || (integerOnly && !Number.isSafeInteger(number))) return { valid: false, error: integerOnly ? "Enter one whole-number answer." : "Enter a valid number." };
  return { valid: true, value: number, normalized: String(number) };
}

function parseFraction(value) {
  const text = String(value ?? "").trim().replace(/−/g, "-");
  const match = text.match(/^(-?\d+)\s*\/\s*(-?\d+)$/) || (/^-?\d+$/.test(text) ? [text,text,'1'] : null);
  if (!match || Number(match[2]) === 0 || !match.slice(1).every(n=>Number.isSafeInteger(Number(n)))) return { valid: false, error: "Enter a numerator and a nonzero denominator." };
  let numerator = Number(match[1]), denominator = Number(match[2]);
  if (denominator < 0) { numerator *= -1; denominator *= -1; }
  const divisor = gcd(numerator, denominator);
  return { valid: true, value: numerator / denominator, normalized: `${numerator / divisor}/${denominator / divisor}`, reduced: divisor === 1 };
}

function parseMixed(value) {
  const m=String(value??'').trim().replace(/−/g,'-').match(/^(-?)(\d+)\s+(\d+)\/(\d+)$/);
  if(!m || !m.slice(2).every(n=>Number.isSafeInteger(Number(n))) || +m[4]===0 || +m[3]>=+m[4]) return {valid:false,error:'Enter a whole number and a proper fraction with a positive denominator.'};
  const n=(+m[2]*+m[4]+ +m[3])*(m[1]?-1:1);
  if(!Number.isSafeInteger(n))return {valid:false,error:'The mixed number exceeds the supported exact integer range.'};
  return {...parseFraction(`${n}/${m[4]}`), reduced:gcd(+m[3],+m[4])===1, mixed:true};
}

function parseRatio(value) {
  const match = String(value ?? "").trim().match(/^(-?\d+(?:\.\d+)?)\s*:\s*(-?\d+(?:\.\d+)?)$/);
  if (!match || Number(match[2]) === 0) return { valid: false, error: "Enter both parts of the ratio." };
  return { valid: true, value: Number(match[1]) / Number(match[2]), normalized: `${Number(match[1])}:${Number(match[2])}` };
}

function parseScientific(value) {
  const match = String(value ?? "").trim().toLowerCase().match(/^(-?(?:\d+\.?\d*|\.\d+))e(-?\d+)$/);
  if (!match) return { valid: false, error: "Enter a coefficient and an integer exponent." };
  const coefficient = Number(match[1]), exponent = Number(match[2]);
  if (Math.abs(coefficient) < 1 || Math.abs(coefficient) >= 10) return { valid: false, error: "The coefficient must be at least 1 and less than 10 in absolute value." };
  if(!Number.isSafeInteger(exponent)||!Number.isFinite(coefficient * 10 ** exponent)||coefficient * 10 ** exponent===0)return {valid:false,error:"Use a finite, nonzero scientific-notation value."};
  return { valid: true, value: coefficient * 10 ** exponent, normalized: `${coefficient}e${exponent}`, coefficient, exponent };
}

function parseByType(value, type) {
  if (type === "integer") return parseNumber(value, true);
  if (["number", "decimal", "percent", "money", "unit"].includes(type)) return parseNumber(value, false);
  if (type === "fraction") return parseFraction(value);
  if (type === "mixed") return parseMixed(value);
  if (type === "ratio") return parseRatio(value);
  if (type === "scientific") return parseScientific(value);
  if (type === "choice") {
    const normalized = String(value ?? "").trim().toLowerCase();
    return normalized ? { valid: true, value: normalized, normalized } : { valid: false, error: "Choose one answer." };
  }
  return { valid: false, error: "This question uses an unsupported answer type." };
}

export function checkItem(itemRecord, input) {
  const parsed = parseByType(input, itemRecord.answerType);
  if (!parsed.valid) return parsed;
  const accepted = Array.isArray(itemRecord.acceptedAnswers) && itemRecord.acceptedAnswers.length ? itemRecord.acceptedAnswers : [itemRecord.answer];
  const correct = accepted.some(expected => {
    const target = parseByType(expected, itemRecord.answerType);
    if (!target.valid) return false;
    if (["fraction","mixed"].includes(itemRecord.answerType)) return parsed.normalized === target.normalized;
    if (itemRecord.answerType === "choice") return parsed.normalized === target.normalized;
    if (itemRecord.answerType === "scientific") return parsed.coefficient === target.coefficient && parsed.exponent === target.exponent;
    // Relative comparison: tiny scientific/numeric values must not all grade as zero.
    return parsed.value === target.value || Math.abs(parsed.value-target.value) <= Number.EPSILON*4*Math.max(Math.abs(parsed.value),Math.abs(target.value));
  });
  const fraction=['fraction','mixed'].includes(itemRecord.answerType);
  const explicit=itemRecord.fractionPolicy==='specified-denominator' && Number.isSafeInteger(itemRecord.requiredDenominator) && itemRecord.requiredDenominator>0 && !!itemRecord.representationInstruction;
  if(fraction&&explicit){
    const denominator=String(input).trim().match(/\/\s*(\d+)$/)?.[1];
    if(Number(denominator)!==itemRecord.requiredDenominator)return {...parsed,correct:false,formError:true,error:itemRecord.representationInstruction};
  } else if(fraction&&!parsed.reduced){
    return {...parsed,correct:false,formError:true,reason:correct?'equivalent-unsimplified':'wrong-value',error:correct?'Your value is correct, but the fraction is not in simplest form. Simplify it and try again.':'Not yet. Check the value and give your answer in simplest form.'};
  }
  return { ...parsed, correct };
}

export function normalizeCustomItem(raw, index = 0, moduleTitle = "Teacher Module") {
  const answerType = String(raw.answerType || raw.answer_type || "number").trim().toLowerCase();
  const supported = ["integer", "number", "decimal", "fraction", "mixed", "percent", "money", "unit", "ratio", "scientific", "choice"];
  if (!supported.includes(answerType)) throw new Error(`Question ${index + 1} uses unsupported answer type “${answerType}”.`);
  const prompt = String(raw.prompt || "").trim();
  const answer = String(raw.answer ?? "").trim();
  if (!prompt || !answer) throw new Error(`Question ${index + 1} needs both a prompt and an answer.`);
  const acceptedAnswers = Array.isArray(raw.acceptedAnswers) ? raw.acceptedAnswers.map(String) : String(raw.accepted_answers || "").split("|").map(value => value.trim()).filter(Boolean);
  const options = Array.isArray(raw.options) ? raw.options.map(String) : String(raw.options || "").split("|").map(value => value.trim()).filter(Boolean);
  if (answerType === "choice" && !options.length) throw new Error(`Question ${index + 1} needs pipe-separated choices.`);
  if(answerType==='choice'&&!options.some(v=>v.toLowerCase()===answer.toLowerCase())) throw new Error(`Question ${index+1}: the answer must match one choice.`);
  const mediaSource = String(raw.media?.src || raw.imageUrl || raw.image_url || "").trim();
  let media = null;
  if (mediaSource) {
    let parsed;
    try { parsed = new URL(mediaSource); } catch { throw new Error(`Question ${index + 1} has an invalid image URL.`); }
    if (parsed.protocol !== "https:") throw new Error(`Question ${index + 1} image must use an HTTPS URL.`);
    media = {
      type: "image",
      src: parsed.href.slice(0, 1000),
      alt: String(raw.media?.alt || raw.imageAlt || raw.image_alt || "Question image").trim().slice(0, 180),
      caption: String(raw.media?.caption || raw.imageCaption || raw.image_caption || "").trim().slice(0, 240)
    };
  }
  const record = makeItem(`custom.${hashSeed(moduleTitle)}`, moduleTitle, prompt, answerType, answer, {
    acceptedAnswers,
    options,
    hint: String(raw.hint || "").trim(),
    custom: true, disciplineId:String(raw.disciplineId||'mathematics'), courseBankId:String(raw.courseBankId||'prealgebra'), subskillId:String(raw.subskillId||'teacher-authored'), source:'teacher-import', standards:Array.isArray(raw.standards)?raw.standards.map(String):[], DOK:[1,2,3,4].includes(Number(raw.DOK))?Number(raw.DOK):1,
    unit:String(raw.unit||'').slice(0,40), currency:String(raw.currency||'$').slice(0,8), expectedForm:raw.expectedForm==='simplified'?'simplified':undefined,
    fractionPolicy:raw.fractionPolicy, requiredDenominator:raw.requiredDenominator, representationInstruction:String(raw.representationInstruction||'').slice(0,240),
    ...(media ? { media } : {})
  });
  if(raw.fractionPolicy && (raw.fractionPolicy!=='specified-denominator'||!Number.isSafeInteger(raw.requiredDenominator)||raw.requiredDenominator<1||!record.representationInstruction))throw new Error(`Question ${index+1}: a specified-denominator exception needs a positive integer requiredDenominator and visible representationInstruction.`);
  if (![answer,...acceptedAnswers].every(a=>checkItem({...record,acceptedAnswers:[a]},a).correct)) throw new Error(`Question ${index + 1}: keys must match the answer format and fractions must be reduced. For an explicit denominator task, supply its fractionPolicy, requiredDenominator and representationInstruction.`);
  return { ...record, id: `custom-${hashSeed(`${moduleTitle}:${index}:${prompt}`)}` };
}

export const generateIntegerItem = (seed, band = "intermediate") => generatePresetItem("number.integer-operations", seed, band === "foundation" ? "beginner" : band === "challenge" ? "advanced" : band);
export const parseInteger = value => parseNumber(value, true);
export const checkInteger = (itemRecord, input) => checkItem(itemRecord, input);
