/** AI agent capabilities, routing, and dynamic actions */

export const AGENT_CAPABILITIES = {
  moe: ['Life coaching', 'Accountability', 'Morning briefs', 'Weekly reviews', 'Priority sorting'],
  abw: ['Franchise research', 'FDD analysis', 'P&L modeling', 'Steve outreach', 'Go/no-go decisions'],
  islamic: ['Aqeedah', 'Hadith', 'Quran tafsir', 'Seerah', 'Daily action prompts'],
  finance: ['Trading thesis', 'Risk management', 'ABW fund tracking', 'Macro analysis', 'Halal compliance'],
  builder: ['Life OS features', 'React/Vite', 'UI/UX', 'Bug fixes', 'Architecture'],
};

export const AGENT_QUICK_ACTIONS = {
  moe: [
    { label: 'Morning brief', prompt: 'Full morning brief: schedule block, lift, study, top 3 priorities. Be direct.' },
    { label: 'What now?', prompt: 'Based on my day so far — what should I do RIGHT NOW? One action only.' },
    { label: 'Accountability', prompt: 'Hold me accountable. What am I avoiding? Call it out.' },
    { label: 'Weekly review', prompt: 'Weekly review: streak, goals, wins, misses, course corrections.' },
  ],
  abw: [
    { label: 'Week plan', prompt: 'ABW franchise: what are my 3 highest-leverage actions this week?' },
    { label: 'FDD check', prompt: 'Walk me through FDD red flags I should verify before go decision.' },
    { label: 'Pitch practice', prompt: 'I am pitching ABW to a lender. Ask hard questions. Grade my answers.' },
    { label: 'Fund progress', prompt: 'ABW fund status vs $75K target. Am I on pace? What to cut or add?' },
  ],
  islamic: [
    { label: 'Today\'s topic', prompt: "Teach today's Islamic study topic. End with: how does this change how I act TODAY?" },
    { label: 'Dua focus', prompt: 'Help me craft specific dua for my top 3 life priorities right now.' },
    { label: 'Hadith deep dive', prompt: 'Pick one hadith relevant to discipline and explain it deeply.' },
    { label: 'Seerah lesson', prompt: 'Seerah lesson connected to my current struggles with impostor syndrome.' },
  ],
  finance: [
    { label: 'Thesis check', prompt: 'Before I trade: force me to write thesis, stop loss, and risk %. No thesis = no trade.' },
    { label: 'Macro scan', prompt: 'SPY QQQ IWM trend + any FOMC/CPI this week. Observe only unless thesis clear.' },
    { label: 'ABW fund', prompt: 'ABW savings progress. Monthly run rate needed to hit $75K by open date.' },
    { label: 'Rules audit', prompt: 'Audit my trading rules. Did I break any this week? Consequences.' },
  ],
  builder: [
    { label: 'Feature idea', prompt: 'Suggest 3 high-impact Life OS features I should build next. Be specific.' },
    { label: 'Bug hunt', prompt: 'Review common Life OS patterns — what could break with localStorage or PWA cache?' },
    { label: 'UI critique', prompt: 'Critique Neural OS UI. What feels off? What would make it more futuristic?' },
    { label: 'Ship plan', prompt: 'I want to ship a feature today. Give me a 2-hour implementation plan.' },
  ],
};

/** Route context keywords → best agent */
export const AGENT_ROUTING = [
  { agent: 'abw', keywords: ['abw', 'franchise', 'wing', 'manchester', 'fdd', 'steve', 'business'] },
  { agent: 'islamic', keywords: ['islam', 'quran', 'hadith', 'prayer', 'dua', 'fajr', 'isha', 'seerah', 'aqeedah'] },
  { agent: 'finance', keywords: ['trade', 'spy', 'stock', 'fund', 'money', 'budget', 'capital', 'finance'] },
  { agent: 'builder', keywords: ['build', 'code', 'react', 'feature', 'bug', 'app', 'deploy'] },
  { agent: 'moe', keywords: ['life', 'goal', 'streak', 'discipline', 'motivation', 'priority'] },
];

export function routeToAgent(text = '', timePhase = 'day') {
  const lower = text.toLowerCase();
  for (const rule of AGENT_ROUTING) {
    if (rule.keywords.some((k) => lower.includes(k))) return rule.agent;
  }
  const phaseMap = { dawn: 'islamic', morning: 'moe', midday: 'abw', afternoon: 'finance', evening: 'islamic', night: 'moe' };
  return phaseMap[timePhase] || 'moe';
}

export function getRecommendedAgent({ timePhase, currentBlock, criticalGoals, checks }) {
  const blockTitle = (currentBlock?.title || '').toLowerCase();
  if (blockTitle.includes('islam') || blockTitle.includes('fajr') || blockTitle.includes('quran') || blockTitle.includes('isha')) return 'islamic';
  if (blockTitle.includes('finance') || blockTitle.includes('trading')) return 'finance';
  if (blockTitle.includes('business') || blockTitle.includes('abw')) return 'abw';
  if (blockTitle.includes('tech') || blockTitle.includes('jpmc')) return 'builder';
  if (criticalGoals?.some((g) => g.cat === 'business')) return 'abw';
  if (criticalGoals?.some((g) => g.cat === 'fitness') && !checks?.lift) return 'moe';
  return routeToAgent('', timePhase);
}
