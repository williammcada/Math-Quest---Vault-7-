// Content provider only. Cartridges never import this file.
export const ADDITIONAL_MODULES = [
  ['word.multistep', 'Mixed Multi-Step Word Problems', 'dynamic'],
  ['algebra.word-problems', 'Algebraic Word Problems', 'dynamic'],
  ['exponent.scientific-operations', 'Scientific Notation Operations', 'scientific'],
  ['measurement.conversions', 'Unit Multiplier Conversions', 'unit'],
  ['number.properties', 'Properties of Operations', 'choice'],
  ['geometry.polygons', 'Quadrilaterals and Polygons', 'choice'],
  ['percent.tax-tip', 'Sales Tax and Tip', 'money'],
  ['number.real-family', 'Real Number Classification', 'choice']
];
const gcd=(a,b)=>{a=Math.abs(a);b=Math.abs(b);while(b)[a,b]=[b,a%b];return a||1;};
const rat=(n,d=1)=>{if(d<0){n=-n;d=-d;}const g=gcd(n,d);return [n/g,d/g];};
const add=(a,b)=>rat(a[0]*b[1]+b[0]*a[1],a[1]*b[1]);
const mul=(a,b)=>rat(a[0]*b[0],a[1]*b[1]);
const frac=a=>`${a[0]}/${a[1]}`;
const shown=a=>a[1]===1?String(a[0]):frac(a);
const mixed=a=>`${a[0]<0?'-':''}${Math.floor(Math.abs(a[0])/a[1])} ${Math.abs(a[0])%a[1]}/${a[1]}`;
const round=(x,p=2)=>Number(x.toFixed(p));

export function expandedQuestion(moduleId, band, random) {
  const level=band==='beginner'?0:band==='advanced'?2:1;
  const int=(a,b)=>a+Math.floor(random()*(b-a+1));
  const pick=a=>a[int(0,a.length-1)];
  const item=(prompt,answerType,answer,subskillId,extra={})=>({prompt,answerType,answer:String(answer),subskillId,...extra});
  const choice=(prompt,answer,options,skill)=>item(prompt,'choice',answer,skill,{options});
  if(moduleId==='algebra.two-step') {
    if(level===0){const x=int(-9,9),a=int(2,6),b=int(1,12);return item(`Solve: ${a}x + ${b} = ${a*x+b}`,'number',x,'two-step.integer');}
    const x=rat(int(1,9)*(random()<.4?-1:1),pick([2,3,4]));
    const a=rat(int(1,5)*(random()<.4?-1:1),pick([2,3]));
    const b=int(1,5), c=int(1,4), rhs=mul(a,add(x,[b-c,1]));
    const coefficient=level===2&&Math.abs(a[0])>a[1]&&a[1]>1?`(${mixed(a)})`:shown(a);
    const eq=level===1?`${shown(a)}(x + ${b}) = ${shown(mul(a,add(x,[b,1])))}`:`${coefficient}[x + (${b} − ${c})] = ${shown(rhs)}`;
    const useMixed=level===2 && Math.abs(x[0])>x[1] && x[1]>1;
    return item(`Solve: ${eq}. ${useMixed?'Enter a mixed number.':'Enter a fraction (use denominator 1 for an integer).'}`,useMixed?'mixed':'fraction',useMixed?mixed(x):frac(x),level===1?'rational.distribution':'rational.nested-grouping',{expectedForm:'simplified'});
  }
  if(moduleId==='number.part-of-whole') {
    const p=pick(level===0?[10,25,50]:[12.5,20,25,37.5,60,75]),w=pick([40,80,120,160,240]),part=w*p/100;
    const k=level===0?int(0,1):int(0,3);
    if(k===0)return item(`A library has ${w} books. ${p}% are science books. How many science books are there?`,'number',part,'percent.find-part');
    if(k===1){const f=pick([[1,2],[1,4],[3,4],[2,5]]);return item(`A tank holds ${w} litres. ${frac(f)} of the water is used. How many litres are used?`,'unit',w*f[0]/f[1],'fraction.find-part',{unit:'L'});}
    if(k===2)return item(`${part} students are ${p}% of a club. How many students are in the club?`,'number',w,'percent.find-whole');
    return item(`A team completed ${part} of ${w} tasks. What percent did it complete?`,'percent',p,'percent.find-rate');
  }
  if(moduleId==='word.multistep') {
    const k=int(0,2),a=int(3,9),b=int(4,12),c=int(1,3);
    if(k===0)return item(`A library receives ${a} boxes with ${b} books each. It lends ${c*b} books. The remaining books go equally on ${b} shelves. How many books go on each shelf?`,'integer',a-c,'context.multiply-subtract-divide');
    if(k===1){const price=level?int(12,45)/4:int(2,9),paid=Math.ceil(a*price)+10;return item(`Each notebook costs ${price} credits. You buy ${a} notebooks and pay ${paid} credits. How much change do you receive?`,'number',round(paid-a*price),'context.cost-change');}
    const f=pick([[1,2],[2,3],[3,4]]),total=b*f[1];return item(`${total} litres of juice fill ${b} equal containers. Then ${frac(f)} litre is removed from each container. How much juice remains in one container?`,'fraction',frac(add([f[1],1],[-f[0],f[1]])),'context.divide-subtract-fraction');
  }
  if(moduleId==='algebra.word-problems') {
    const x=level===0?[int(2,12),1]:rat(int(9,35),pick([2,4])),a=int(2,6),b=int(2,12),total=add(mul([a,1],x),[b,1]);
    const prompt=pick([`A number multiplied by ${a}, then increased by ${b}, equals ${shown(total)}. Find the number.`,`A taxi charges ${b} credits to start and ${a} credits per kilometre. The total fare is ${shown(total)} credits. How many kilometres were travelled?`,`After ${b} litres are added to ${a} identical bottles of water, there are ${shown(total)} litres. How much water was originally in each bottle?`]);
    const useMixed=level===2&&x[1]>1&&x[0]>x[1];
    return item(`${prompt}${level?' Enter '+(useMixed?'a mixed number.':'a fraction.') :''}`,level?(useMixed?'mixed':'fraction'):'number',level?(useMixed?mixed(x):frac(x)):x[0],'word.linear-two-operation');
  }
  if(moduleId==='exponent.scientific-operations') {
    const a=pick([2,3,4,6,8]),b=pick([2,4,5]),e=int(level? -6:2,6),f=int(level?-4:1,5),divide=random()<.5;
    let coeff=divide?a/b:a*b,exp=divide?e-f:e+f;
    while(coeff>=10){coeff/=10;exp++;}while(coeff<1){coeff*=10;exp--;}
    return item(`Calculate (${a} × 10^(${e})) ${divide?'÷':'×'} (${b} × 10^(${f})). Give normalized scientific notation.`,'scientific',`${round(coeff,8)}e${exp}`,divide?'scientific.divide':'scientific.multiply');
  }
  if(moduleId==='measurement.conversions') {
    const metric=[['m','cm',100,'1 m = 100 cm'],['kg','g',1000,'1 kg = 1,000 g'],['L','mL',1000,'1 L = 1,000 mL']];
    const customary=[['ft','in',12,'1 ft = 12 in'],['yd','ft',3,'1 yd = 3 ft'],['lb','oz',16,'1 lb = 16 oz'],['US gal','US qt',4,'1 US gallon = 4 US quarts']];
    const cross=[['in','cm',2.54,'1 in = 2.54 cm'],['lb','kg',.45359237,'1 lb = 0.45359237 kg'],['US gal','L',3.785411784,'1 US gallon = 3.785411784 L']];
    const pool=level===0?metric:level===1?[...metric,...customary]:[...metric,...customary,...cross];
    const [from,to,factor,rule]=pick(pool),reverse=random()<.5,amount=int(2,30)*(level? .5:1),answer=reverse?amount/factor:amount*factor;
    return item(`Convert ${amount} ${reverse?to:from} to ${reverse?from:to}. Use ${rule}. Round to the nearest hundredth.`,'unit',round(answer),'unit.'+(cross.some(r=>r[3]===rule)?'cross-system':metric.some(r=>r[3]===rule)?'metric':'customary'),{unit:reverse?from:to,decimalPlaces:2});
  }
  if(moduleId==='number.properties') {
    const a=int(2,9),b=int(2,9),c=int(2,9);
    const rows=[['Commutative property',`${a} + ${b} = ${b} + ${a}`],['Associative property',`(${a} + ${b}) + ${c} = ${a} + (${b} + ${c})`],['Distributive property',`${a}(${b} + ${c}) = ${a}×${b} + ${a}×${c}`],['Additive identity',`${a} + 0 = ${a}`],['Multiplicative identity',`${a} × 1 = ${a}`],['Additive inverse',`${a} + (−${a}) = 0`],['Multiplicative inverse',`${a} × (1/${a}) = 1`],['Zero property of multiplication',`${a} × 0 = 0`]];
    const [ans,example]=pick(level===0?rows.slice(0,5):rows);return choice(`Which property is shown? ${example}`,ans,rows.map(r=>r[0]),'properties.identify');
  }
  if(moduleId==='geometry.polygons') {
    const polys=['Triangle','Quadrilateral','Pentagon','Hexagon','Heptagon','Octagon','Nonagon','Decagon','Hendecagon','Dodecagon'];
    if(level===0 || random()<.4){const sides=int(3,level===0?8:12);return choice(`A polygon has ${sides} straight sides. What is its name?`,polys[sides-3],polys,'polygon.side-count');}
    const shapes=[['Square','four equal sides and four right angles'],['Rectangle','four right angles and unequal adjacent sides'],['Rhombus','four equal sides and no right angles'],['Parallelogram','two pairs of parallel sides, unequal adjacent sides, and no right angles'],['Trapezoid','exactly one pair of parallel sides'],['Kite','two distinct pairs of equal adjacent sides, and no parallel sides']];
    const [ans,props]=pick(shapes);return choice(`Choose the most specific name for a quadrilateral with ${props}. Here, a trapezoid has exactly one pair of parallel sides.`,ans,shapes.map(r=>r[0]),'quadrilateral.properties');
  }
  if(moduleId==='percent.tax-tip') {
    const cents=int(1000,12000),base=level===0?int(10,80):cents/100,rate=pick(level===0?[10,20]:[5,7.5,8,12.5,15,18]),kind=pick(['sales tax','tip']),final=random()<.5;
    const baseCents=Math.round(base*100),rateBasisPoints=Math.round(rate*100),taxCents=Math.floor((baseCents*rateBasisPoints+5000)/10000);
    const amount=taxCents/100,ans=final?(baseCents+taxCents)/100:amount;
    return item(`A bill is $${base.toFixed(2)} before ${kind}. ${kind==='tip'?'Add':'The tax rate is'} ${rate}%. Find ${final?'the final total':'the '+kind+' amount'}. Round the ${kind} to the nearest cent${final?', then add it to the bill':''}.`,'money',ans.toFixed(2),final?'money.final-total':'money.tax-tip-amount',{currency:'$',decimalPlaces:2});
  }
  if(moduleId==='number.real-family') {
    const n=int(2,12),rows=[['Natural',String(n)],['Whole','0'],['Integer',String(-n)],['Rational',`${n}/${n+1}`],['Irrational',pick(['√2','√3','√5','π'])]];
    const [ans,v]=pick(rows);return choice(`Choose the smallest number family containing ${v}. Natural numbers begin at 1; whole numbers include 0.`,ans,['Natural','Whole','Integer','Rational','Irrational'],'real.smallest-family');
  }
  if(moduleId==='number.order-of-operations'&&level===2){const a=int(-8,8),b=int(2,6),c=int(2,5),d=int(1,8);return item(`Evaluate: ${a} − {${b} × [${c} + (−${d})]}`,'integer',a-b*(c-d),'operations.nested-integers');}
  return null;
}
