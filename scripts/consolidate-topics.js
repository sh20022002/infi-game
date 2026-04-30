'use strict';
/**
 * Merges 82 generated topics into ~8 broad categories,
 * and folds duplicates of topics.js topics back into their canonical IDs
 * so the IIFE in generated-topics.js merges them at runtime.
 */
const fs = require('fs');
const path = require('path');

const DATA_FILE  = path.join(__dirname, '..', 'data', 'generated-topics-data.json');
const OUTPUT_JS  = path.join(__dirname, '..', 'data', 'generated-topics.js');

const source = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));

// ── 1. Map each generated id → target canonical id ──────────────────────────

const MERGE_INTO = {
  // ── New topics from recent PDF chunks (added automatically) ──
  'set-operations':                'completeness-suprema',
  'real-field-axioms':             'completeness-suprema',
  'sequences-convergence':         'seq-foundations',
  'supremum-infimum':              'completeness-suprema',
  'functions-and-limits-basics':   'function-limits',
  'function-properties':           'function-limits',
  'limit-arithmetic-sandwich':     'seq-foundations',
  'polynomials-rational-functions':'function-limits',
  'inverse-composition':           'function-limits',
  'sandwich-limit-sin':            'squeeze',
  'one-sided-limits':              'function-limits',
  'infinite-limits':               'function-limits',
  'continuity-definition':         'continuity',
  'intermediate-value-theorem':    'ivt',
  'uniform-continuity':            'continuity',

  // Fold into existing topics.js topics (same id → runtime merge)
  'bolzano-weierstrass':           'bolzano',
  'cantor-nested-intervals':       'cantor',
  'cauchy-criterion':              'cauchy',
  'cauchy-sequences':              'cauchy',
  'monotone-convergence':          'monotone-bounded',
  'monotone-bounded-convergence':  'monotone-bounded',
  'monotone-sequences-bolzano':    'monotone-bounded',
  'sandwich-theorem':              'squeeze',
  'sandwich-theorem-trig-limits':  'squeeze',
  'sandvich-limit-sinx-over-x':   'squeeze',
  'intermediate-value-theorem':    'ivt',
  'weierstrass-theorem':           'weierstrass-evt',
  'fermat-theorem':                'fermat-thm',
  'mean-value-theorem':            'mvt',
  'mean-value-extrema':            'mvt',

  // Consolidate into new broad topics
  'sequences-limits':              'seq-foundations',
  'sequences-and-limits':          'seq-foundations',
  'sequence-definition-basics':    'seq-foundations',
  'sequence-limit-definition':     'seq-foundations',
  'limit-uniqueness-bounded':      'seq-foundations',
  'arithmetic-of-limits':          'seq-foundations',
  'sequence-convergence':          'seq-foundations',
  'bounded-sequences':             'seq-foundations',

  'subsequences-definition':             'subsequences-limsup',
  'partial-limits':                      'subsequences-limsup',
  'limsup-liminf':                       'subsequences-limsup',
  'fibonacci-sequence':                  'subsequences-limsup',
  'subsequences-partial-limits':         'subsequences-limsup',
  'geometric-mean-sequences':            'subsequences-limsup',
  'subsequences-and-partial-limits':     'subsequences-limsup',

  'bounded-sets-supremum':       'completeness-suprema',
  'supremum-infimum':            'completeness-suprema',
  'real-numbers-axioms':         'completeness-suprema',
  'real-field-axioms':           'completeness-suprema',
  'real-numbers-sets':           'completeness-suprema',
  'field-axioms-algebra':        'completeness-suprema',
  'completeness-axiom':          'completeness-suprema',
  'order-axioms-inequalities':   'completeness-suprema',
  'sets-and-operations':         'completeness-suprema',
  'set-operations-basics':       'completeness-suprema',
  'rational-irrational-numbers': 'completeness-suprema',
  'mathematical-induction':      'completeness-suprema',
  'inequalities-absolute-value': 'completeness-suprema',

  'function-limits-continuity':  'function-limits',
  'real-functions-basics':       'function-limits',
  'limit-of-function-definition':'function-limits',
  'limit-rules-arithmetic':      'function-limits',
  'one-sided-limits':            'function-limits',
  'infinite-limits':             'function-limits',
  'limit-1-to-infinity':         'function-limits',

  'continuity-of-functions':           'continuity',
  'continuity-at-point':               'continuity',
  'continuity-definition':             'continuity',
  'types-of-discontinuity':           'continuity',
  'uniform-continuity':                'continuity',
  'equal-continuity-closed-interval':  'continuity',
  'uniform-continuity-bounded':        'continuity',

  'derivative-rules':       'derivative-tools',
  'derivative-definition':  'derivative-tools',
  'chain-rule':             'derivative-tools',
  'trig-derivatives':       'derivative-tools',
  'log-exp-derivatives':    'derivative-tools',
  'tangent-linear-approx':  'derivative-tools',
  'linear-approximation':   'derivative-tools',
  'differential':           'derivative-tools',

  'convexity-inflection':          'function-analysis',
  'concavity-inflection':          'function-analysis',
  'convexity-concavity':           'function-analysis',
  'graph-sketching-steps':         'function-analysis',
  'optimization-problems':         'function-analysis',
  'proving-inequalities':          'function-analysis',
  'even-odd-periodic-functions':   'function-analysis',
  'monotonicity-derivative-sign':  'function-analysis',
  'extrema-classification':        'function-analysis',
  'asymptotes-and-limits':         'function-analysis',
  'asymptotes-function-analysis':  'function-analysis',
  'lopital-rule':                  'function-analysis',
  'lhopital-rule':                 'function-analysis',

  'exponential-logarithm-functions': 'exp-log',
  'exponential-logarithm':           'exp-log',
  'real-powers-definition':          'exp-log',
  'power-laws-continuity':           'exp-log',
};

// ── 2. Shells for the new broad topics ──────────────────────────────────────

const BROAD_SHELLS = {
  'seq-foundations': {
    id: 'seq-foundations', icon: '📐',
    title: 'יסודות הסדרות',
    sub: 'הגדרת גבול, אריתמטיקה, חסימות ויחידות',
    badge: 'סדרות', modes: ['mcq','tf','fill','order'],
    proof: {
      title: 'הגדרת גבול סדרה ($\\varepsilon$-$N$)',
      statement: '$\\lim_{n\\to\\infty}a_n=L\\iff\\forall\\varepsilon>0\\;\\exists N\\in\\mathbb{N}\\;\\forall n>N:|a_n-L|<\\varepsilon$',
      idea: 'סדרה מתכנסת ל-$L$ אם לכל דיוק $\\varepsilon$ שנרצה, מסוים ממקום $N$ ואילך כל האיברים קרובים ל-$L$ בפחות מ-$\\varepsilon$.'
    }, questions: []
  },
  'subsequences-limsup': {
    id: 'subsequences-limsup', icon: '🔭',
    title: 'תת-סדרות וגבולות קצה',
    sub: 'תת-סדרות, גבולות חלקיים, גבול עליון ותחתון',
    badge: 'סדרות', modes: ['mcq','tf','fill','order'],
    proof: {
      title: 'גבול עליון ותחתון',
      statement: '$\\limsup_{n\\to\\infty}a_n=\\lim_{n\\to\\infty}\\sup_{k\\geq n}a_k$',
      idea: 'הגבול העליון הוא הגדול ביותר בין כל הגבולות החלקיים; הגבול התחתון הוא הקטן ביותר.'
    }, questions: []
  },
  'completeness-suprema': {
    id: 'completeness-suprema', icon: '🔢',
    title: 'מספרים ממשיים: יסודות וחסמים',
    sub: 'אקסיומות השדה, סופרמום, אינפימום ואקסיומת השלמות',
    badge: 'יסודות', modes: ['mcq','tf','fill','order'],
    proof: {
      title: 'אפיון הסופרמום',
      statement: '$y=\\sup A\\iff$ $y$ חסם מלעיל של $A$ וכל $y\'<y$ אינו חסם מלעיל',
      idea: 'הסופרמום הוא המינימלי בין כל החסמים מלעיל — לכל מספר קטן ממנו קיים איבר בקבוצה הגדול ממנו.'
    }, questions: []
  },
  'function-limits': {
    id: 'function-limits', icon: '📈',
    title: 'גבולות פונקציות',
    sub: 'הגדרת גבול פונקציה, חוקי חשבון, גבולות חד-צדדיים ואינסופיים',
    badge: 'גבולות', modes: ['mcq','tf','fill','order'],
    proof: {
      title: 'הגדרת גבול פונקציה (קושי)',
      statement: '$\\lim_{x\\to a}f(x)=L\\iff\\forall\\varepsilon>0\\;\\exists\\delta>0:0<|x-a|<\\delta\\Rightarrow|f(x)-L|<\\varepsilon$',
      idea: 'לכל דיוק $\\varepsilon$ קיים קרבה $\\delta$ כך שבסביבה המנוקבת של $a$ הפונקציה קרובה ל-$L$.'
    }, questions: []
  },
  'continuity': {
    id: 'continuity', icon: '〰️',
    title: 'רציפות פונקציות',
    sub: 'הגדרת רציפות, סוגי אי-רציפות, ורציפות שווה במידה',
    badge: 'רציפות', modes: ['mcq','tf','fill','order'],
    proof: {
      title: 'הגדרת רציפות',
      statement: '$f$ רציפה ב-$x_0\\iff\\lim_{x\\to x_0}f(x)=f(x_0)$',
      idea: 'פונקציה רציפה היא פונקציה שאין בה "קפיצות" — ערכי הפונקציה בסביבת נקודה מתכנסים לערכה בנקודה.'
    }, questions: []
  },
  'derivative-tools': {
    id: 'derivative-tools', icon: '📉',
    title: 'כלי גזירה',
    sub: 'הגדרת נגזרת, כלל השרשרת, ונגזרות פונקציות יסוד',
    badge: 'גזירה', modes: ['mcq','tf','fill','order'],
    proof: {
      title: 'הגדרת הנגזרת',
      statement: "$f'(x_0)=\\lim_{h\\to 0}\\dfrac{f(x_0+h)-f(x_0)}{h}$",
      idea: 'הנגזרת היא שיעור השינוי המיידי — גבול של מנת הפרשים כאשר הפרש הנקודות שואף לאפס.'
    }, questions: []
  },
  'function-analysis': {
    id: 'function-analysis', icon: '🔬',
    title: 'חקירת פונקציה',
    sub: 'קמירות, קיצונים, אסימפטוטות וכלל לופיטל',
    badge: 'גזירה', modes: ['mcq','tf','fill','order'],
    proof: {
      title: "כלל לופיטל",
      statement: "אם $\\lim f=\\lim g=0$ (או $\\pm\\infty$) וקיים $\\lim\\dfrac{f'}{g'}$, אז $\\lim\\dfrac{f}{g}=\\lim\\dfrac{f'}{g'}$",
      idea: "לחישוב גבולות מהצורה $0/0$ או $\\infty/\\infty$ ניתן לגזור מונה ומכנה בנפרד."
    }, questions: []
  },
  'exp-log': {
    id: 'exp-log', icon: '🌿',
    title: 'פונקציות מעריכיות ולוגריתמיות',
    sub: 'חזקות ממשיות, $e^x$, $\\ln x$ ותכונותיהן',
    badge: 'פונקציות', modes: ['mcq','tf','fill','order'],
    proof: {
      title: 'הגדרת המספר $e$',
      statement: '$e=\\lim_{n\\to\\infty}\\left(1+\\dfrac{1}{n}\\right)^n$',
      idea: 'המספר $e$ מוגדר כגבול הסדרה המונוטונית החסומה $\\left(1+1/n\\right)^n$.'
    }, questions: []
  },
};

// ── 3. Merge questions ────────────────────────────────────────────────────────

// Accumulate questions per target id
const buckets = {}; // targetId → Set of prompts seen + array of questions

function addToTarget(targetId, questions) {
  if (!buckets[targetId]) buckets[targetId] = { seen: new Set(), questions: [] };
  const b = buckets[targetId];
  for (const q of questions) {
    if (!b.seen.has(q.prompt)) {
      b.seen.add(q.prompt);
      b.questions.push(q);
    }
  }
}

for (const topic of source) {
  const target = MERGE_INTO[topic.id] || topic.id; // unmapped → keep own id
  addToTarget(target, topic.questions);
}

// ── 4. Build output array ─────────────────────────────────────────────────────

const output = [];

// First: broad shells (in order)
for (const [id, shell] of Object.entries(BROAD_SHELLS)) {
  const b = buckets[id] || { questions: [] };
  output.push({ ...shell, questions: b.questions });
  delete buckets[id];
}

// Then: canonical ids that fold into topics.js (no shell needed — just questions)
const TOPICS_JS_IDS = [
  'limit-order','bolzano','cantor','ivt','rolle','cauchy',
  'monotone-limits','darboux','bernoulli','squeeze','mvt',
  'monotone-bounded','weierstrass-evt','fermat-thm',
  'primitive-continuous','ftc','epsdelta',
];
for (const id of TOPICS_JS_IDS) {
  if (buckets[id] && buckets[id].questions.length > 0) {
    // Minimal stub: IIFE will merge questions into the existing topic.js entry
    output.push({ id, questions: buckets[id].questions });
    delete buckets[id];
  }
}

// Anything still in buckets that wasn't mapped — keep as-is (shouldn't happen)
for (const [id, b] of Object.entries(buckets)) {
  if (b.questions.length > 0) {
    console.warn('Unmapped topic kept:', id, `(${b.questions.length}q)`);
    const orig = source.find(t => t.id === id);
    if (orig) output.push({ ...orig, questions: b.questions });
  }
}

// ── 5. Save ──────────────────────────────────────────────────────────────────

fs.writeFileSync(DATA_FILE, JSON.stringify(output, null, 2), 'utf8');

// Regenerate generated-topics.js
const json = JSON.stringify(output, null, 2);
const js = `// Auto-generated by scripts/generate-questions.js — do not edit manually.
// Re-run the script to add more questions from a PDF textbook.
(function () {
  var _generated = ${json};
  _generated.forEach(function (t) {
    var existing = TOPICS.find(function (x) { return x.id === t.id; });
    if (existing) {
      existing.questions.push.apply(existing.questions, t.questions);
    } else {
      TOPICS.push(t);
    }
  });
})();
`;
fs.writeFileSync(OUTPUT_JS, js, 'utf8');

// ── 6. Report ─────────────────────────────────────────────────────────────────
console.log('\n=== Consolidation complete ===\n');
output.forEach(t => {
  const label = t.title || `[merge→${t.id}]`;
  console.log(`${t.id.padEnd(22)} ${String(t.questions.length).padStart(3)}q  ${label}`);
});
console.log(`\nTopics: ${source.length} → ${output.length}`);
console.log(`Questions: ${source.reduce((s,t)=>s+t.questions.length,0)} → ${output.reduce((s,t)=>s+t.questions.length,0)} (deduped)`);
