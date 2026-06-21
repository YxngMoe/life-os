/** Complete goal catalog from CONTEXT.md — migrated into localStorage on first load */

export const GOALS_VERSION = 3;

export const GOAL_PRIORITIES = {
  critical: { label: 'Critical', color: '#f87171' },
  high: { label: 'High', color: '#fb923c' },
  normal: { label: 'Normal', color: '#6366f1' },
};

function g(id, text, cat, opts = {}) {
  return {
    id,
    text,
    cat,
    done: false,
    progress: 0,
    priority: opts.priority || 'normal',
    deadline: opts.deadline || '',
    why: opts.why || '',
    milestones: (opts.milestones || []).map((m, i) => ({ id: `${id}-m${i}`, text: m, done: false })),
    metric: opts.metric || null,
    created: Date.now(),
  };
}

export const FULL_GOALS = [
  // ── FITNESS (14) ──
  g('fit-1', 'Reach 165 lbs lean from 140 lbs', 'fitness', { priority: 'critical', deadline: '2026-12', metric: { current: 140, target: 165, unit: 'lbs' }, why: 'Foundation for confidence, health, marriage readiness', milestones: ['145 lbs checkpoint', '155 lbs checkpoint', '160 lbs checkpoint', '165 lbs lean'] }),
  g('fit-2', 'Bench press 315 lbs', 'fitness', { priority: 'high', metric: { current: 0, target: 315, unit: 'lbs' }, milestones: ['225', '275', '315'] }),
  g('fit-3', 'Mile time 7:30 → 6:00', 'fitness', { priority: 'high', milestones: ['7:00', '6:30', '6:00'] }),
  g('fit-4', 'Basketball league-ready — full court, no fatigue', 'fitness', { milestones: ['30 min straight', 'Full pickup games', 'League ready'] }),
  g('fit-5', 'V-taper physique — wide shoulders, arm definition', 'fitness', { milestones: ['Lateral raise consistency', 'Visible definition', 'V-taper visible'] }),
  g('fit-6', 'Full beard — Rogaine + dermaroll 90 days', 'fitness', { milestones: ['30 days', '60 days', '90 days consistent'] }),
  g('fit-7', 'Clear skin face and back', 'fitness', { milestones: ['Routine locked', 'Visible improvement', 'Maintenance mode'] }),
  g('fit-8', 'Sharp jawline — mewing, gua sha, chin tucks daily', 'fitness', { milestones: ['30 day streak', '90 day streak'] }),
  g('fit-9', 'Fix ptosis — daily eye exercises 6 months', 'fitness', { deadline: '2026-12', milestones: ['Month 1', 'Month 3', 'Month 6'] }),
  g('fit-10', 'Hairline thickening — minoxidil + dermaroll', 'fitness', { milestones: ['90 days', '6 months'] }),
  g('fit-11', 'Hair recovery — zero heat tools 6 months', 'fitness', { deadline: '2026-12' }),
  g('fit-12', 'Stomach line treatment — dermaroll + Tretinoin', 'fitness', { milestones: ['Routine established', 'Visible results'] }),
  g('fit-13', 'Dental work — gummy smile + missing teeth before engagement', 'fitness', { priority: 'critical', deadline: '2027-06', milestones: ['Consultation', 'Treatment plan', 'Complete'] }),
  g('fit-14', '100 pushups outside every morning', 'fitness', { priority: 'critical', milestones: ['7 day streak', '30 day streak', '365 day streak'] }),

  // ── BUSINESS (10) ──
  g('biz-1', 'Open ABW franchise Manchester NH — first unit', 'business', { priority: 'critical', deadline: '2027', milestones: ['FDD reviewed', 'Financial model', 'Go decision', 'Open'] }),
  g('biz-2', 'Save $70-80K liquid before opening day', 'business', { priority: 'critical', metric: { current: 0, target: 75000, unit: '$' }, milestones: ['$25K', '$50K', '$75K'] }),
  g('biz-3', 'Complete full 3-month ABW research roadmap', 'business', { priority: 'high', milestones: ['Month 1', 'Month 2', 'Month 3 decision'] }),
  g('biz-4', 'Scale to second ABW unit once first is profitable', 'business', { deadline: '2029' }),
  g('biz-5', 'Add laundromats — passive income stream', 'business', { deadline: '2030' }),
  g('biz-6', 'Add Dunkin Donuts long-term', 'business', { deadline: '2032' }),
  g('biz-7', 'Delaware real estate — Section 8 housing (19801, 19802, 19805)', 'business', { milestones: ['Research', 'First property', 'LLC structure'] }),
  g('biz-8', 'Build SaaS product using AI engineering skills', 'business', { priority: 'high', milestones: ['Problem defined', 'MVP', 'First paying user'] }),
  g('biz-9', 'Build Substack audience and authority', 'business', { milestones: ['100 subs', '500 subs', 'Monetize'] }),
  g('biz-10', 'Delaware LLC for every property and business', 'business', { milestones: ['LLC formed', 'All assets under LLC'] }),

  // ── CAREER (10) ──
  g('car-1', 'Master JPMC role completely — stop waving through', 'career', { priority: 'critical', milestones: ['Spark SQL solo', 'Databricks solo', 'Prophecy solo'] }),
  g('car-2', 'AWS Solutions Architect cert within 60 days of buying course', 'career', { priority: 'high', milestones: ['Course purchased', 'Half done', 'Certified'] }),
  g('car-3', 'Deep Spark SQL — complex queries from scratch', 'career', { priority: 'high', milestones: ['10 queries solo', 'Production pipeline solo'] }),
  g('car-4', 'Master Databricks — workflows, clusters, Delta Lake', 'career', { milestones: ['Clusters', 'Delta Lake', 'Production workflows'] }),
  g('car-5', 'Master Prophecy.io visual pipelines', 'career', { milestones: ['First pipeline', 'Production pipeline'] }),
  g('car-6', 'Understand MDRM regulatory data end to end', 'career', { milestones: ['MDRM mapped', '10-Q pipeline owned'] }),
  g('car-7', 'LeetCode #595+ — 1 easy daily, write PATTERN', 'career', { priority: 'high', metric: { current: 595, target: 700, unit: '#' }, milestones: ['#620', '#650', '#700'] }),
  g('car-8', 'Role making $200K+ annually', 'career', { deadline: '2028', milestones: ['Promotion path', 'Offer $200K+'] }),
  g('car-9', 'Build AI agents at JPMC as differentiator', 'career', { priority: 'high', milestones: ['First agent demo', 'Production use'] }),
  g('car-10', 'Long-term transition to AI/ML engineering', 'career', { deadline: '2029', milestones: ['Andrew Ng done', 'Karpathy done', 'ML role'] }),

  // ── FINANCE (14) ──
  g('fin-1', 'Eliminate all credit card debt', 'finance', { priority: 'critical', milestones: ['Highest APR paid', 'All cards zero'] }),
  g('fin-2', 'Resolve SoFi fraud situation THIS WEEK', 'finance', { priority: 'critical', deadline: '2026-06' }),
  g('fin-3', 'Pay off student loans', 'finance', { priority: 'high', milestones: ['Plan made', 'Half paid', 'Paid off'] }),
  g('fin-4', 'Open Schwab brokerage + Roth IRA ($7K/year)', 'finance', { priority: 'critical', milestones: ['Schwab open', 'Roth open', '$583/mo auto'] }),
  g('fin-5', 'Open HYSA — Marcus/Ally 4-5% APY', 'finance', { milestones: ['Account open', 'Emergency fund started'] }),
  g('fin-6', 'Credit utilization below 10%', 'finance', { milestones: ['Below 30%', 'Below 10%'] }),
  g('fin-7', 'Monthly savings $2,000 minimum consistently', 'finance', { priority: 'high', metric: { current: 0, target: 2000, unit: '$/mo' } }),
  g('fin-8', 'Net worth growing every month — track publicly', 'finance', { milestones: ['Tracking system', '3 months growth', '12 months growth'] }),
  g('fin-9', 'Financially stable to propose Alaa by Aug 2027', 'finance', { priority: 'critical', deadline: '2027-08' }),
  g('fin-10', 'ABW franchise fund — separate labeled account', 'finance', { priority: 'high', milestones: ['Account created', 'First deposit', '$25K'] }),
  g('fin-11', 'Wells Fargo checking — $300-500 bonus', 'finance', { milestones: ['Account open', 'Bonus received'] }),
  g('fin-12', 'Chase checking — $300 bonus', 'finance', { milestones: ['Account open', 'Bonus received'] }),
  g('fin-13', 'All investing halal-screened via Zoya', 'finance', { milestones: ['Zoya installed', 'Portfolio screened'] }),
  g('fin-14', 'Zero riba — murabaha/musharakah only', 'finance', { priority: 'critical' }),

  // ── ISLAM (9) ──
  g('isl-1', 'Memorize Juz Amma → full Quran eventually', 'islam', { priority: 'critical', metric: { current: 0, target: 100, unit: '%' }, milestones: ['Surah An-Nas', 'Half Juz Amma', 'Full Juz Amma'] }),
  g('isl-2', 'Write Islamic foundation doc — why I believe, why I pray', 'islam', { priority: 'critical', milestones: ['Draft v1', 'Final in own words'] }),
  g('isl-3', 'Never miss Jummah for any reason', 'islam', { priority: 'critical' }),
  g('isl-4', 'Arabic — read Quran fluently without translation', 'islam', { priority: 'high', milestones: ['Alphabet mastery', 'Basic reading', 'Fluent reading'] }),
  g('isl-5', 'Complete rotating Islamic curriculum', 'islam', { milestones: ['Aqeedah', 'Hadith', 'Seerah', 'Fiqh', 'Tafsir'] }),
  g('isl-6', 'Genuine student of knowledge — deep not surface', 'islam', { priority: 'high' }),
  g('isl-7', 'Give dawah confidently when opportunities arise', 'islam', { milestones: ['First conversation', 'Regular dawah'] }),
  g('isl-8', 'Connect every concept to daily practical life', 'islam', { priority: 'high' }),
  g('isl-9', 'Fully halal financial life — zero riba', 'islam', { priority: 'critical' }),

  // ── KNOWLEDGE (8) ──
  g('know-1', 'Andrew Ng → Karpathy → DeepLearning.AI', 'knowledge', { priority: 'critical', milestones: ['Andrew Ng done', 'Karpathy done', 'DeepLearning.AI done'] }),
  g('know-2', 'Publish 12 Substack essays this year', 'knowledge', { priority: 'high', metric: { current: 0, target: 12, unit: ' essays' }, deadline: '2026-12' }),
  g('know-3', 'Toastmasters Competent Communicator milestone', 'knowledge', { milestones: ['5 speeches', '10 speeches', 'CC complete'] }),
  g('know-4', 'Personal encyclopedia — biographies, history, own words', 'knowledge', { milestones: ['50 entries', '100 entries', '200 entries'] }),
  g('know-5', 'Vocabulary — 1 word/day, morphology-first, Quizlet', 'knowledge', { priority: 'high', metric: { current: 0, target: 365, unit: ' words' } }),
  g('know-6', 'Chess — work toward 1500 ELO', 'knowledge', { metric: { current: 0, target: 1500, unit: ' ELO' } }),
  g('know-7', 'Read 10 pages non-fiction daily minimum', 'knowledge', { priority: 'high', milestones: ['7 day streak', '30 day streak', '365 day streak'] }),
  g('know-8', 'Master 10-min stop + NSDR as default study mode', 'knowledge', { priority: 'critical', milestones: ['1 week consistent', '30 days', 'Automatic habit'] }),

  // ── PERSONAL (includes communication + social) (16) ──
  g('per-1', 'Fix lisp — daily work, EAP speech therapy if needed', 'personal', { priority: 'critical', milestones: ['30 days', 'Noticeable improvement', 'Confident speech'] }),
  g('per-2', 'Obama-level articulation — calm, measured, powerful', 'personal', { priority: 'high' }),
  g('per-3', 'Voice resonance — chest-based, never nasal', 'personal', { milestones: ['Breath support', 'Consistent resonance'] }),
  g('per-4', 'American Talker program every Friday', 'personal', { milestones: ['4 weeks', '12 weeks'] }),
  g('per-5', 'Sudanese Talker program every Sunday', 'personal', { milestones: ['4 weeks', '12 weeks'] }),
  g('per-6', '30-second elevator pitch without hesitation', 'personal', { priority: 'high', milestones: ['Memorized', 'Natural delivery'] }),
  g('per-7', 'STAR behavioral answer in 90 seconds', 'personal', { priority: 'high', milestones: ['3 stories ready', '10 stories ready'] }),
  g('per-8', 'Daily freestyle rap for language retrieval', 'personal', { milestones: ['7 days', '30 days'] }),
  g('per-9', 'Make a real best friend — not acquaintances', 'personal', { priority: 'high' }),
  g('per-10', 'Talk to 1 random person every day', 'personal', { priority: 'high', milestones: ['7 days', '30 days', '365 days'] }),
  g('per-11', 'Build basketball crew at TSC', 'personal', { milestones: ['3 regulars', 'Weekly crew'] }),
  g('per-12', 'Exchange contact with 1 new person per week', 'personal', { milestones: ['4 weeks', '12 weeks'] }),
  g('per-13', 'Reconnect with old Delaware friends', 'personal', { milestones: ['5 reached out', '2 meetups'] }),
  g('per-14', 'Family consistent check-ins — accountability partner', 'personal', { priority: 'high' }),
  g('per-15', 'Learn to dance — TikTok private account', 'personal', { milestones: ['First video', '10 videos', 'Confident moves'] }),
  g('per-16', 'Stop catastrophizing appearance — work the plan', 'personal'),

  // ── RELATIONSHIPS (7) ──
  g('rel-1', 'Become the man Alaa is marrying — build before performing', 'relationships', { priority: 'critical', deadline: '2027-08' }),
  g('rel-2', 'Engagement ready August 2027 — age 25', 'relationships', { priority: 'critical', deadline: '2027-08', milestones: ['Financial stable', 'Physically ready', 'Emotionally ready', 'Propose'] }),
  g('rel-3', 'Marriage by December 2028 — age 26', 'relationships', { priority: 'critical', deadline: '2028-12' }),
  g('rel-4', 'Health disclosed honestly before serious conversation', 'relationships', { priority: 'high', milestones: ['Document prepared', 'Conversation had'] }),
  g('rel-5', 'Real talks: faith, character, family roles, vision', 'relationships', { priority: 'high', milestones: ['Faith talk', 'Vision talk', 'Roles talk'] }),
  g('rel-6', 'Know what I need from a partner — not just offering', 'relationships', { milestones: ['Written list', 'Discussed with trusted advisor'] }),
  g('rel-7', 'Dental work complete before engagement', 'relationships', { priority: 'high', deadline: '2027-06' }),
];

export const LIFE_MILESTONES = [
  { year: '2026', label: 'Discipline Experiment', items: ['60-day car living', '165 lbs trajectory', 'ABW Month 1-3 research', 'AWS cert', '12 Substack essays'] },
  { year: '2027', label: 'Engagement Year', items: ['Engagement ready Aug 2027', 'ABW go/no-go', '$70-80K saved', 'Dental complete', 'Financial stability'] },
  { year: '2028', label: 'Marriage Year', items: ['Marriage Dec 2028', 'ABW open or scaling', '$200K career path', 'First SaaS revenue'] },
  { year: '2029+', label: 'Empire Build', items: ['ABW unit 2', 'Laundromats', 'Delaware real estate', 'AI/ML engineering role'] },
];

export function migrateGoals() {
  try {
    const v = JSON.parse(localStorage.getItem('los_goals_v') || '0');
    if (v >= GOALS_VERSION) return;
    const raw = localStorage.getItem('los_goals');
    const existing = raw ? JSON.parse(raw) : [];
    const byId = Object.fromEntries(existing.map((g) => [g.id, g]));
    const merged = FULL_GOALS.map((fg) => {
      const old = byId[fg.id];
      if (!old) return fg;
      return {
        ...fg,
        done: old.done ?? fg.done,
        progress: old.progress ?? fg.progress,
        text: old.text || fg.text,
        milestones: fg.milestones.map((m) => {
          const om = old.milestones?.find((x) => x.id === m.id);
          return om ? { ...m, done: om.done } : m;
        }),
      };
    });
    const extras = existing.filter((e) => !FULL_GOALS.find((f) => f.id === e.id));
    localStorage.setItem('los_goals', JSON.stringify([...merged, ...extras]));
    localStorage.setItem('los_goals_v', String(GOALS_VERSION));
  } catch { /* ignore */ }
}

export function calcGoalProgress(goal) {
  if (goal.done) return 100;
  if (goal.metric?.target) {
    const { current, target } = goal.metric;
    if (goal.metric.unit === 'lbs' || goal.metric.unit === '$' || goal.metric.unit === '#') {
      return Math.min(100, Math.round((current / target) * 100));
    }
    if (goal.metric.unit === ' sec') {
      return Math.min(100, Math.max(0, Math.round(((450 - current) / (450 - target)) * 100)));
    }
    return Math.min(100, Math.round((current / target) * 100));
  }
  if (goal.milestones?.length) {
    const done = goal.milestones.filter((m) => m.done).length;
    return Math.round((done / goal.milestones.length) * 100);
  }
  return goal.progress || 0;
}

export function getGoalsStats(goals) {
  const active = goals.filter((g) => !g.done);
  const done = goals.filter((g) => g.done);
  const critical = active.filter((g) => g.priority === 'critical');
  const avgProgress = active.length
    ? Math.round(active.reduce((s, g) => s + calcGoalProgress(g), 0) / active.length)
    : 100;
  return { total: goals.length, active: active.length, done: done.length, critical: critical.length, avgProgress };
}
