/** Rich life context pulled from CONTEXT.md — shown across Home & Life screens */

export const IDENTITY = {
  name: 'Mohamed (Moe)',
  age: 23,
  birthday: 'July 1, 2002',
  ethnicity: 'Sudanese-American',
  religion: 'Muslim',
  location: 'Philadelphia, PA',
  base: 'The Sporting Club @ The Bellevue',
  living: 'Car discipline experiment',
  job: 'Software & Data Engineer',
  company: 'JPMorgan Chase',
  office: 'Philly (remote) · Wilmington Wed/Thu',
  partner: 'Alaa — engagement target Aug 2027',
  pin: '2232',
};

export const IDENTITY_CHIPS = [
  { emoji: '🕌', label: 'Muslim', color: 'var(--amber)' },
  { emoji: '💻', label: 'JPMC Y2', color: 'var(--cyan)' },
  { emoji: '🚗', label: '60-Day Exp', color: 'var(--violet)' },
  { emoji: '🍗', label: 'ABW NH', color: 'var(--orange)' },
  { emoji: '💪', label: '140→165', color: 'var(--pink)' },
  { emoji: '☾', label: 'Islam First', color: 'var(--amber)' },
  { emoji: '❤️', label: 'Alaa 2027', color: 'var(--rose)' },
  { emoji: '📚', label: 'Polymath', color: 'var(--indigo)' },
];

export const DISCIPLINE_EXPERIMENT = {
  label: '60-Day Car Discipline Experiment',
  start: '2026-05-01',
  days: 60,
  location: 'The Sporting Club, Philadelphia',
  rules: [
    'Sleep in car — mattress, eye mask, white noise',
    'TSC: gym, shower, sauna, basketball base',
    'Hotel lobby (DoubleTree) for early AM when TSC closed',
    'In car by 9pm every night',
  ],
};

export const DAILY_AFFIRMATION = 'Strong in body. Sharp in mind. Grounded in faith. Building the man Alaa is marrying.';

export const BODY_METRICS = {
  weightCurrent: 140,
  weightTarget: 165,
  weightUnit: 'lbs',
  timeline: '6 months lean gain',
  calories: '3,200–3,400',
  protein: '210–228g',
  benchGoal: 315,
  mileCurrent: '7:30',
  mileGoal: '6:00',
  medical: ['EOE — monitor swallowing', 'UC remission — white rice, no raw veg', 'PSC liver — creatine pending approval'],
};

export const ABW_TRACKER = {
  location: 'Manchester, NH',
  contact: 'Steve (franchise)',
  startupRange: '$150K–$200K',
  capitalTarget: '$70K–$80K',
  capitalSaved: 0,
  milestones: [
    { id: 'm1', label: 'Review FDD thoroughly', done: false },
    { id: 'm2', label: 'Calculate total startup costs', done: false },
    { id: 'm3', label: 'Build Year 1 & 2 P&L model', done: false },
    { id: 'm4', label: 'Weekly Steve check-in', done: false },
    { id: 'm5', label: 'Site visit Manchester NH', done: false },
    { id: 'm6', label: '$70K liquid saved', done: false },
  ],
};

export const JPMC_FOCUS = {
  leetcode: '#595+',
  stack: ['Databricks', 'Spark SQL', 'AWS', 'Bitbucket'],
  wedThu: 'Wilmington office days',
  weekly: [
    'Spark SQL deep work block',
    'LeetCode 2 problems minimum',
    'Big Data Building Blocks — 1 section',
    'Frank Kane Hadoop — 1 video',
    'Build internal AI agent differentiator',
  ],
};

export const WEEKLY_THEMES = [
  { day: 'Mon', theme: 'Push + Faith Foundation', lift: 'Push', study: 'Aqeedah / Hadith' },
  { day: 'Tue', theme: 'Pull + Deep Work', lift: 'Pull', study: 'Quran Tafsir' },
  { day: 'Wed', theme: 'Legs Power + Office', lift: 'Legs Power', study: 'Seerah' },
  { day: 'Thu', theme: 'Chest & Back + Wilmington', lift: 'Chest & Back', study: 'Hadith Sciences' },
  { day: 'Fri', theme: 'HEAVY Day + Jumuah', lift: 'Chest & Back HEAVY', study: 'Quran Arabic' },
  { day: 'Sat', theme: 'Shoulders & Aesthetics', lift: 'Shoulders & Arms', study: 'Seerah / Tafsir' },
  { day: 'Sun', theme: 'Deadlift + Weekly Review', lift: 'Deadlift & Unilateral', study: 'Weekly Review' },
];

export const LIFT_DETAILS = {
  Push: ['Bench Press 5x3-5', 'OHP 4x5-7', 'Incline DB 3x8-10', 'Tricep Pushdown 3x12', 'Lateral Raises 4x15-20'],
  Pull: ['Deadlift 4x4-5', 'Barbell Row 4x6-8', 'Pull-ups 4x max', 'Face Pulls 3x15', 'Barbell Curl 3x8-10'],
  'Legs Power': ['Box Jumps 4x5', 'Back Squat 4x4-6', 'RDL 3x8-10', 'Walking Lunges 3x10/leg', 'Calf Raises 4x15-20'],
  'Chest & Back': ['Bench 3x6', 'Barbell Row 3x8', 'Pull-ups 3x max', 'Incline DB 3x10', 'Face Pulls 2x15'],
  'Chest & Back HEAVY': ['Bench 5x3-5 HEAVY', 'Row 4x5-7', 'Pull-ups 4x max + belt', 'Incline DB 3x8-10', 'Rear Delt Fly 2x15'],
  'Shoulders & Arms': ['OHP 4x5-7', 'Arnold Press 3x10', 'Lateral Raises 4x15-20', 'Barbell Curl 3x8-10', 'Dips 2x max'],
  'Deadlift & Unilateral': ['Conventional DL 4x4-5 HEAVIEST', 'Bulgarian Split Squat 3x8/leg', 'Single-Leg RDL 3x10/leg', 'Hip Thrust 3x12-15', 'Calf Raises 4x15-20'],
};

export const STUDY_PROTOCOLS = [
  { icon: '⏱', title: '10-Min Stop Protocol', desc: 'Study 10 min → STOP → brain dump 2 min. Never peek at notes during dump.' },
  { icon: '🧘', title: 'NSDR After Every Block', desc: '10-15 min Huberman NSDR. Skipping loses ~33% of the block.' },
  { icon: '✍️', title: 'PRIME Sentence', desc: '"I am studying X today because [personal reason]" — 40% stickier encoding.' },
  { icon: '🏀', title: 'BDNF Seal', desc: 'Evening basketball seals all 4 afternoon study blocks into long-term memory.' },
];

export const MEAL_SUMMARY = [
  { time: '5:00a', meal: 'Wake — water + salt + lemon, banana/dates', cal: '~100' },
  { time: '5:30a', meal: 'Pre-training carbs — banana, berries', cal: '~130' },
  { time: '9:20a', meal: 'Post-workout — eggs/wrap + oats + honey (BIG)', cal: '~580' },
  { time: '12:15p', meal: 'Lunch — HALF rotisserie chicken SKIN OFF + white rice', cal: '~650' },
  { time: '3:30p', meal: 'Afternoon — tuna + apple + rice cakes', cal: '~280' },
  { time: '5:40p', meal: 'Pre-evening — banana + dates (CARBS ONLY)', cal: '~150' },
  { time: '9:45p', meal: 'Dinner — other HALF chicken SKIN OFF + rice/oats', cal: '~700' },
  { time: '10:00p', meal: 'Bed — collagen peptides + small fruit', cal: '~130' },
];

export const SUPPLEMENTS = {
  morning: ['D3 5000 IU', 'Fish Oil 2-4g EPA/DHA', 'Zinc 15-25mg', 'B12 sublingual', 'Probiotic', 'Ashwagandha KSM-66'],
  postWorkout: ['Collagen 10g', 'Biotin', 'Multivitamin iron-free', 'Creatine (PSC pending)'],
  night: ['Magnesium glycinate 400mg', 'Melatonin 0.5-1mg'],
};

export const LIFE_PRIORITIES = [
  { rank: 1, area: 'Faith', focus: '5 prayers, Quran memory, Islamic studies daily, Ultimate Dua' },
  { rank: 2, area: 'Body', focus: '165 lbs lean, 315 bench, fix lisp/voice, hair/skin protocol' },
  { rank: 3, area: 'Mind', focus: 'Andrew Ng → Karpathy → DeepLearning.AI, history, vocab roots' },
  { rank: 4, area: 'Career', focus: 'Master Spark SQL/Databricks, LeetCode, AI agents at JPMC' },
  { rank: 5, area: 'Business', focus: 'ABW franchise NH, SaaS product, Substack authority' },
  { rank: 6, area: 'Finance', focus: 'Halal only, Schwab + Roth IRA, ABW fund $70-80K' },
  { rank: 7, area: 'Relationships', focus: 'Family calls, Alaa, TSC basketball crew, become engagement-ready' },
];

export const COACH_QUICK_ACTIONS = [
  { label: '🌅 Morning Brief', prompt: 'Give me my full morning brief: schedule, lift, study topic, top 3 priorities.' },
  { label: '🧪 Quiz Me', prompt: 'Quiz me hard on what I studied today. Feynman style.' },
  { label: '🍗 ABW Update', prompt: 'ABW franchise progress check. What should I do this week?' },
  { label: '📝 Log Day', prompt: 'Help me log today: wins, misses, tomorrow setup.' },
  { label: '💪 Lift Coach', prompt: "Today's lift breakdown with form cues and rest times." },
  { label: '🕌 Islamic', prompt: "Today's Islamic study topic — teach me and end with how I act TODAY." },
  { label: '💰 Finance', prompt: 'Trading rules check + ABW fund progress.' },
  { label: '🎯 Weekly Review', prompt: 'Weekly review: streak, goals, course corrections needed.' },
];

export function getExperimentProgress(today = new Date()) {
  const start = new Date(DISCIPLINE_EXPERIMENT.start + 'T00:00:00');
  const dayMs = 86400000;
  const elapsed = Math.max(0, Math.floor((today - start) / dayMs) + 1);
  const total = DISCIPLINE_EXPERIMENT.days;
  const pct = Math.min(100, Math.round((elapsed / total) * 100));
  const remaining = Math.max(0, total - elapsed);
  return { elapsed, total, pct, remaining, active: elapsed <= total };
}

export function getTodayTheme(dayIdx) {
  return WEEKLY_THEMES[dayIdx] || WEEKLY_THEMES[0];
}
