export const PIN = '2232';

export const NN_COLORS = {
  prayer: 'var(--amber)',
  physical: 'var(--pink)',
  study: 'var(--indigo)',
  default: 'var(--violet)',
};

export const NON_NEGOTIABLES = [
  { id: 'fajr', label: 'Fajr prayer ✓', cat: 'prayer' },
  { id: 'push', label: '100 pushups outside', cat: 'physical' },
  { id: 'dua', label: 'Ultimate Dua (every word)', cat: 'prayer' },
  { id: 'voice', label: 'Full voice routine', cat: 'default' },
  { id: 'jour', label: 'Morning journal + vocab', cat: 'study' },
  { id: 'lift', label: 'Lift session complete', cat: 'physical' },
  { id: 'study', label: '4 study blocks done', cat: 'study' },
  { id: 'nsdr', label: '4 NSDR sessions', cat: 'study' },
  { id: 'ball', label: 'Evening basketball / sport', cat: 'physical' },
  { id: 'pray5', label: 'All 5 prayers complete', cat: 'prayer' },
  { id: 'quran', label: 'Quran from memory', cat: 'prayer' },
  { id: 'fam', label: 'Family check-in call', cat: 'default' },
  { id: 'nj', label: 'Night journal + Quizlet', cat: 'study' },
  { id: 'cold', label: 'Cold plunge + hot tub', cat: 'physical' },
  { id: 'car9', label: 'In car by 9pm', cat: 'default' },
];

export const LIFT_DAYS = ['Push', 'Pull', 'Legs Power', 'Chest & Back', 'Chest & Back HEAVY', 'Shoulders & Arms', 'Deadlift & Unilateral'];
export const ISLAMIC_TOPICS = ['Aqeedah / Hadith', 'Quran Tafsir / Hadith', 'Seerah', 'Hadith Sciences', 'Quran Arabic', 'Seerah / Tafsir', 'Weekly Review'];

export const DEFAULT_QUICK_TILES = [
  { id: 't1', dest: '/brain', icon: '📚', label: 'Study' },
  { id: 't2', dest: '/todo', icon: '✅', label: 'To-Do' },
  { id: 't3', dest: '/dashboards', icon: '📊', label: 'Dash' },
  { id: 't4', dest: '/calendar', icon: '📅', label: 'Cal' },
  { id: 't5', dest: '/agents', icon: '🤖', label: 'Agents' },
  { id: 't6', dest: '/life', icon: '🎯', label: 'Goals' },
];

export const DEFAULT_SUBJECTS = [
  { id: 'tech', n: 'Tech / AI & ML', i: '🤖', c: '#6366f1', d: 'Andrew Ng → Karpathy → DeepLearning.AI' },
  { id: 'jpmc', n: 'JPMC / Data Eng', i: '💻', c: '#38bdf8', d: 'Databricks · Spark SQL · LeetCode #595+' },
  { id: 'biz', n: 'Business / ABW', i: '🍗', c: '#fb923c', d: 'Wharton · ABW · SaaS' },
  { id: 'islam', n: 'Islamic Studies', i: '☾', c: '#fbbf24', d: 'Aqeedah · Hadith · Quran · Seerah' },
  { id: 'arabic', n: 'Arabic', i: '🌙', c: '#2dd4bf', d: 'Quran fluency · Sudanese · Ahmed' },
  { id: 'hist', n: 'History', i: '📜', c: '#a78bfa', d: 'Biographies · Geopolitics' },
  { id: 'vocab', n: 'Vocabulary', i: '📖', c: '#34d399', d: 'Root · Prefix · Suffix · Quizlet' },
  { id: 'fit', n: 'Fitness', i: '💪', c: '#f472b6', d: 'Lifts · PRs · Body metrics' },
  { id: 'essay', n: 'Essay & Story', i: '✍️', c: '#8b5cf6', d: 'Daily writing · Substack' },
];

export const DEFAULT_DASHBOARDS = [
  { id: 'abw', i: '🍗', l: 'ABW / Business', c: '#fb923c', d: 'Franchise · SaaS · Multi-unit ops' },
  { id: 'fin', i: '💰', l: 'Finance', c: '#2dd4bf', d: 'Budget · Net worth · Trading' },
  { id: 'fit', i: '💪', l: 'Fitness & Health', c: '#f472b6', d: 'Lifts · PRs · Metrics · Medical' },
  { id: 'essay', i: '✍️', l: 'Essay & Story', c: '#8b5cf6', d: 'Essays · Stories · Substack' },
  { id: 'vocab', i: '📖', l: 'Vocabulary', c: '#34d399', d: 'Daily words · Etymology · Quizlet' },
  { id: 'islam', i: '☾', l: 'Islamic Studies', c: '#fbbf24', d: 'Dua · Quran progress · Notes' },
];

export const GOAL_CATEGORIES = [
  { id: 'fitness', label: 'Fitness', emoji: '💪', color: '#f472b6' },
  { id: 'business', label: 'Business', emoji: '🍗', color: '#fb923c' },
  { id: 'finance', label: 'Finance', emoji: '💰', color: '#2dd4bf' },
  { id: 'islam', label: 'Islam', emoji: '☾', color: '#fbbf24' },
  { id: 'knowledge', label: 'Knowledge', emoji: '📚', color: '#6366f1' },
  { id: 'personal', label: 'Personal', emoji: '✨', color: '#8b5cf6' },
  { id: 'relationships', label: 'Relationships', emoji: '❤️', color: '#f87171' },
  { id: 'career', label: 'Career', emoji: '💻', color: '#38bdf8' },
];

import { FULL_GOALS, GOAL_PRIORITIES, migrateGoals } from './goals';

export { GOAL_PRIORITIES };
export const DEFAULT_GOALS = FULL_GOALS;

export const DEFAULT_ENC = {
  quotes: [
    { id: 'q1', t: 'Do not grieve; indeed Allah is with us.', a: 'Quran 9:40' },
    { id: 'q2', t: 'The strong man controls himself when angry.', a: 'Prophet Muhammad ﷺ' },
    { id: 'q3', t: 'For indeed, with hardship will be ease.', a: 'Quran 94:5' },
    { id: 'q4', t: 'Allah does not burden a soul beyond what it can bear.', a: 'Quran 2:286' },
    { id: 'q5', t: 'Discipline is the bridge between goals and accomplishment.', a: 'Jim Rohn' },
    { id: 'q6', t: 'Work 80 hours while others work 40 — you will outpace them.', a: 'Elon Musk' },
    { id: 'q7', t: 'The cave you fear to enter holds the treasure you seek.', a: 'Joseph Campbell' },
    { id: 'q8', t: 'You miss 100% of the shots you don\'t take.', a: 'Wayne Gretzky' },
    { id: 'q9', t: 'Strong in body. Sharp in mind. Grounded in faith.', a: 'Self' },
    { id: 'q10', t: 'The best of people are most beneficial to people.', a: 'Hadith' },
    { id: 'q11', t: 'Speak good or remain silent.', a: 'Hadith, Bukhari' },
    { id: 'q12', t: 'Verily, with hardship comes ease.', a: 'Quran 94:6' },
    { id: 'q13', t: 'The blueprint is not the building.', a: 'Self — anti-overplanning' },
    { id: 'q14', t: 'Whoever puts his trust in Allah, He will be enough for him.', a: 'Quran 65:3' },
    { id: 'q15', t: 'Take advantage of five before five: your youth before old age.', a: 'Hadith' },
    { id: 'q16', t: 'Grind now. Glory later.', a: 'Self' },
    { id: 'q17', t: 'He who knows himself knows his Lord.', a: 'Islamic wisdom' },
    { id: 'q18', t: 'The struggle to remember IS the encoding.', a: 'Neuroscience' },
  ],
  tv: [
    { id: 'tv1', title: 'Attack on Titan', rating: '10/10', note: 'Greatest story ever told' },
    { id: 'tv2', title: 'Avatar: The Last Airbender', rating: '10/10', note: 'Timeless masterpiece' },
    { id: 'tv3', title: 'Naruto', rating: '9/10', note: 'Grew up on it' },
    { id: 'tv4', title: 'One Piece', rating: '9/10', note: 'Nakama energy' },
    { id: 'tv5', title: 'Breaking Bad', rating: '10/10', note: 'Character study masterclass' },
    { id: 'tv6', title: 'The Wire', rating: '9/10', note: 'Systems thinking' },
    { id: 'tv7', title: 'Succession', rating: '9/10', note: 'Power dynamics' },
    { id: 'tv8', title: 'Vinland Saga', rating: '10/10', note: 'Transformation arc' },
  ],
  mov: [
    { id: 'm1', title: 'The Dark Knight', rating: '10/10', note: 'Heath Ledger' },
    { id: 'm2', title: 'Malcolm X', rating: '10/10', note: 'Identity and transformation' },
    { id: 'm3', title: 'Gladiator', rating: '9/10', note: 'Honor under pressure' },
    { id: 'm4', title: 'Interstellar', rating: '10/10', note: 'Time, love, sacrifice' },
    { id: 'm5', title: 'The Pursuit of Happyness', rating: '9/10', note: 'Relentless discipline' },
    { id: 'm6', title: 'Rocky', rating: '9/10', note: 'Underdog mentality' },
  ],
  mus: [
    { id: 'mu1', title: "God's Plan", artist: 'Drake', note: 'Motivational' },
    { id: 'mu2', title: 'HUMBLE.', artist: 'Kendrick Lamar', note: 'Mentality' },
    { id: 'mu3', title: 'Love Yourz', artist: 'J. Cole', note: 'Gratitude' },
    { id: 'mu4', title: 'Alright', artist: 'Kendrick Lamar', note: 'Resilience' },
    { id: 'mu5', title: 'Dreams and Nightmares', artist: 'Meek Mill', note: 'Intro energy' },
  ],
  rap: [
    { id: 'r1', name: 'Kendrick Lamar', note: 'GOAT — storytelling + depth' },
    { id: 'r2', name: 'J. Cole', note: 'Introspection' },
    { id: 'r3', name: 'Drake', note: 'Consistency' },
    { id: 'r4', name: 'Meek Mill', note: 'Philly energy' },
    { id: 'r5', name: 'Nas', note: 'Lyrical mastery' },
  ],
  food: [
    { id: 'f1', category: 'Sudanese', item: 'Ful Medames', note: 'Home, first love' },
    { id: 'f2', category: 'Daily', item: 'Rotisserie Chicken (skin off)', note: 'Always PSC rule' },
    { id: 'f3', category: 'Daily', item: 'White rice + oats', note: 'UC-safe carbs only' },
    { id: 'f4', category: 'Daily', item: 'Dates + bananas', note: 'Training fuel' },
    { id: 'f5', category: 'Sudanese', item: 'Kisra', note: 'Family staple' },
    { id: 'f6', category: 'Halal', item: 'Tuna packets', note: 'Monitor EOE' },
  ],
  books: [
    { id: 'b1', title: 'Grinding It Out', author: 'Ray Kroc', note: 'ABW blueprint' },
    { id: 'b2', title: 'Atomic Habits', author: 'James Clear', note: 'Identity-based change' },
    { id: 'b3', title: "Can't Hurt Me", author: 'David Goggins', note: 'Mental toughness' },
    { id: 'b4', title: 'Deep Work', author: 'Cal Newport', note: 'Focus protocol' },
    { id: 'b5', title: 'The Prophet', author: 'Kahlil Gibran', note: 'Wisdom' },
    { id: 'b6', title: 'Zero to One', author: 'Peter Thiel', note: 'Startup thinking' },
    { id: 'b7', title: 'The Alchemist', author: 'Paulo Coelho', note: 'Purpose journey' },
  ],
};

export const AGENTS = [
  { id: 'moe', emoji: '🧠', name: 'Moe', color: '#6366f1', desc: 'Personal life coach' },
  { id: 'abw', emoji: '🍗', name: 'ABW', color: '#fb923c', desc: 'Franchise research' },
  { id: 'islamic', emoji: '☾', name: 'Islamic', color: '#fbbf24', desc: 'Islamic studies' },
  { id: 'finance', emoji: '💰', name: 'Finance', color: '#2dd4bf', desc: 'Trading & money' },
  { id: 'builder', emoji: '🔨', name: 'Builder', color: '#8b5cf6', desc: 'App builder' },
];

export const AGENT_PROMPTS = {
  moe: `You are Mohamed's personal AI life coach. Mohamed is 23, Sudanese-American Muslim, JPMC data engineer Philadelphia, lives in car at The Sporting Club. Goals: 165 lbs, ABW franchise, marry Alaa 2027. Medical: EOE, UC remission, PSC liver. Be direct. Push back when needed.`,
  abw: `You are Mohamed's ABW franchise research specialist. American Best Wings in Manchester NH. Startup $150-200K, contribution $70-80K, contact Steve weekly.`,
  islamic: `You are Mohamed's Islamic studies agent. Rotating curriculum. Always end with: how does this change how you act TODAY?`,
  finance: `You are Mohamed's finance agent. Never trade without thesis, stop loss non-negotiable, max 1-2% risk. Track ABW fund toward $70-80K.`,
  builder: `You are Mohamed's Life OS builder agent. Stack: React 18, Vite, Framer Motion, localStorage los_ prefix, Apple Liquid Glass design.`,
};

export const TODO_CATS = {
  today: { label: 'Today', color: '#6366f1' },
  jpmc: { label: 'JPMC', color: '#38bdf8' },
  business: { label: 'Business', color: '#fb923c' },
  personal: { label: 'Personal', color: '#8b5cf6' },
  health: { label: 'Health', color: '#34d399' },
  finance: { label: 'Finance', color: '#2dd4bf' },
};

export const EVENT_COLORS = ['#6366f1', '#8b5cf6', '#34d399', '#fbbf24', '#f87171', '#2dd4bf', '#f472b6', '#fb923c', '#38bdf8'];

export function getDefaultDashboardComponents(dashId) {
  if (dashId === 'fin') {
    return [
      { id: 'dc1', type: 'checklist', title: 'Daily Trading Routine', items: ['Open Stocktwits', 'Check SPY QQQ IWM', 'FOMC/CPI — observe only', 'Write thesis before trade', '50-min hard timer'].map((text, i) => ({ text, done: false, id: i })) },
      { id: 'dc2', type: 'note', title: 'Trading Rules', content: '1. Never trade without thesis\n2. Stop loss non-negotiable\n3. Max 1-2% risk per trade\n4. Halal instruments only' },
      { id: 'dc3', type: 'metric', title: 'ABW Fund Saved', value: '$0' },
      { id: 'dc4', type: 'metric', title: 'Target Capital', value: '$75,000' },
    ];
  }
  if (dashId === 'abw') {
    return [
      { id: 'dc1', type: 'checklist', title: 'Month 1 — Foundation', items: ['Review FDD', 'Calculate startup costs', 'Build Year 1 P&L', 'Contact Steve weekly', 'Site visit Manchester NH'].map((text, i) => ({ text, done: false, id: i })) },
      { id: 'dc2', type: 'metric', title: 'ABW Fund Saved', value: '$0' },
      { id: 'dc3', type: 'metric', title: 'Startup Range', value: '$150K–$200K' },
      { id: 'dc4', type: 'note', title: 'Location', content: 'American Best Wings — Manchester, NH\nContact: Steve\nTarget liquid: $70-80K before opening' },
    ];
  }
  if (dashId === 'fit') {
    return [
      { id: 'dc1', type: 'metric', title: 'Weight', value: '140 lbs → 165' },
      { id: 'dc2', type: 'metric', title: 'Bench Goal', value: '315 lbs' },
      { id: 'dc3', type: 'metric', title: 'Mile Time', value: '7:30 → 6:00' },
      { id: 'dc4', type: 'checklist', title: 'Daily Physical', items: ['100 pushups outside', 'Lift session', 'Voice routine', 'Cold plunge + hot tub', 'Evening basketball'].map((text, i) => ({ text, done: false, id: i })) },
    ];
  }
  if (dashId === 'islam') {
    return [
      { id: 'dc1', type: 'checklist', title: 'Daily Islamic', items: ['Fajr on time', 'Ultimate Dua every word', 'Quran from memory', 'All 5 prayers', 'Islamic study block'].map((text, i) => ({ text, done: false, id: i })) },
      { id: 'dc2', type: 'note', title: 'Study Rotation', content: 'Mon: Aqeedah/Hadith\nTue: Tafsir\nWed: Seerah\nThu: Hadith Sciences\nFri: Quran Arabic\nSat: Seerah/Tafsir\nSun: Weekly Review' },
      { id: 'dc3', type: 'metric', title: 'Juz Amma', value: 'In progress' },
    ];
  }
  if (dashId === 'essay') {
    return [
      { id: 'dc1', type: 'checklist', title: 'Writing Routine', items: ['Morning journal', 'Night journal', '500 words Substack draft', 'Story in own words'].map((text, i) => ({ text, done: false, id: i })) },
      { id: 'dc2', type: 'note', title: 'Voice', content: 'Daily voice training — lisp correction, articulation, elevator pitch 30 sec.' },
    ];
  }
  if (dashId === 'vocab') {
    return [
      { id: 'dc1', type: 'checklist', title: 'Daily Vocab', items: ['Morning journal vocab', 'Root/prefix/suffix', 'Quizlet review', 'Night journal vocab'].map((text, i) => ({ text, done: false, id: i })) },
      { id: 'dc2', type: 'note', title: 'Method', content: 'Root-based etymology. Always define in own words. Connect to Arabic roots when possible.' },
    ];
  }
  return [];
}
