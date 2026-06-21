/** Full dashboard configurations — tabs + rich widgets */

const mkCheck = (text, id) => ({ text, done: false, id });

export const DASHBOARD_VERSION = 2;

export const DASHBOARD_CONFIGS = {
  fin: {
    tabs: [
      {
        id: 'routine',
        label: 'Routine',
        icon: '⏰',
        widgets: [
          { id: 'w-r-banner', type: 'banner', title: 'Daily Trading Block', subtitle: '9:55–10:55am · 50-min hard stop', progressKey: 'routine' },
          {
            id: 'w-r1', type: 'section-checklist', title: '1. Open Up (5 min)', color: '#fbbf24',
            items: ['Open Stocktwits + watchlist', 'Open Schwab / paper account', 'Open TradingView layout', 'Set 50-min timer — no extensions'].map((t, i) => mkCheck(t, i)),
          },
          {
            id: 'w-r2', type: 'section-checklist', title: '2. Macro Context (5 min)', color: '#38bdf8',
            items: ['SPY / QQQ / IWM trend today', 'Pre-market gaps or catalysts?', 'FOMC/CPI/OPEX day? → stay small', 'Benzinga calendar scan'].map((t, i) => mkCheck(t, i)),
          },
          {
            id: 'w-r3', type: 'section-checklist', title: '3. Known Tickers (10 min)', color: '#2dd4bf',
            items: ['AAPL — trend + key level', 'TSLA — trend + key level', 'NVDA — trend + key level', 'SPY levels for today', '1-sentence update per mover'].map((t, i) => mkCheck(t, i)),
          },
          {
            id: 'w-r4', type: 'section-checklist', title: '4. Chart Study (5 min)', color: '#8b5cf6',
            items: ['Pick 1 ticker with significant move', 'Weekly → daily → 15m → 5m', 'Pattern identified?', 'Ideal entry / stop / target written'].map((t, i) => mkCheck(t, i)),
          },
          {
            id: 'w-r5', type: 'section-checklist', title: '5. Trade / Paper (10 min)', color: '#34d399',
            items: ['Thesis written BEFORE entry', 'Entry · Stop · Target defined', 'Max loss ≤ 1-2% account', 'Execute OR observe and skip'].map((t, i) => mkCheck(t, i)),
          },
          {
            id: 'w-r6', type: 'section-checklist', title: '6. Close Out (2 min)', color: '#f87171',
            items: ['Log trade result if any', '1 sentence learned today', 'Close tabs — timer done'].map((t, i) => mkCheck(t, i)),
          },
        ],
      },
      {
        id: 'overview',
        label: 'Overview',
        icon: '💰',
        widgets: [
          { id: 'w-o1', type: 'metrics-row', items: [
            { label: 'Net Worth', value: '$—', key: 'netWorth', accent: '#34d399' },
            { label: 'Total Assets', value: '$—', key: 'assets', accent: '#38bdf8' },
            { label: 'Total Debt', value: '$—', key: 'debt', accent: '#f87171' },
          ]},
          { id: 'w-o2', type: 'editable-list', title: 'Assets', fields: [
            { label: 'JPMC Checking', value: '' }, { label: 'JPMC Savings', value: '' },
            { label: 'Schwab Brokerage', value: '' }, { label: 'Roth IRA', value: '' },
            { label: 'Cash on Hand', value: '' }, { label: 'Crypto', value: '' },
          ]},
          { id: 'w-o3', type: 'editable-list', title: 'Liabilities', fields: [
            { label: 'Student Loans', value: '' }, { label: 'Credit Card 1', value: '' },
            { label: 'Credit Card 2', value: '' }, { label: 'Car Note', value: '' },
          ]},
        ],
      },
      {
        id: 'trading',
        label: 'Trading',
        icon: '📈',
        widgets: [
          { id: 'w-t1', type: 'note', title: 'Non-Negotiable Rules', content: '1. Never trade without written thesis\n2. Stop loss set BEFORE entry\n3. Max 1-2% risk per trade\n4. No FOMO — missed move = missed\n5. Halal instruments only (Zoya screen)\n6. Paper trade new strategies 30 days' },
          { id: 'w-t2', type: 'watchlist', title: 'Watchlist', items: [
            { ticker: 'AAPL', notes: '' }, { ticker: 'TSLA', notes: '' },
            { ticker: 'NVDA', notes: '' }, { ticker: 'SPY', notes: '' },
          ]},
          { id: 'w-t3', type: 'trade-log', title: 'Trade Log', entries: [] },
        ],
      },
      {
        id: 'invest',
        label: 'Invest',
        icon: '💎',
        widgets: [
          { id: 'w-i1', type: 'progress-group', items: [
            { label: 'Emergency Fund', current: 0, target: 15000, unit: '$' },
            { label: 'Roth IRA (2026)', current: 0, target: 7000, unit: '$' },
            { label: 'ABW Franchise Fund', current: 0, target: 75000, unit: '$' },
            { label: 'Brokerage', current: 0, target: 10000, unit: '$' },
          ]},
          { id: 'w-i2', type: 'task-list', title: 'Account Setup', items: [
            { text: 'Open Charles Schwab brokerage', done: false, cat: 'Accounts' },
            { text: 'Open Roth IRA — $7K/year max', done: false, cat: 'Accounts' },
            { text: 'Open HYSA — Marcus/Ally/SoFi', done: false, cat: 'Accounts' },
            { text: 'Set $500 auto-transfer per paycheck', done: false, cat: 'Savings' },
            { text: 'Download Zoya — halal screening', done: false, cat: 'Investing' },
            { text: 'Check JPMC 401k match', done: false, cat: 'Benefits' },
          ]},
        ],
      },
    ],
  },

  abw: {
    tabs: [
      {
        id: 'roadmap',
        label: 'Roadmap',
        icon: '🗺️',
        widgets: [
          { id: 'w-a-banner', type: 'banner', title: 'ABW Manchester NH', subtitle: 'American Best Wings · Target $70-80K liquid' },
          { id: 'w-a1', type: 'progress-group', items: [
            { label: 'Capital Saved', current: 0, target: 75000, unit: '$' },
            { label: 'Research Complete', current: 15, target: 100, unit: '%' },
          ]},
          { id: 'w-a2', type: 'section-checklist', title: 'Month 1 — Foundation', color: '#fb923c', items: [
            'Review FDD cover to cover', 'Calculate total startup costs', 'Build Year 1 P&L model',
            'Build Year 2 P&L model', 'Contact Steve — weekly check-in', 'Site visit Manchester NH',
          ].map(mkCheck) },
          { id: 'w-a3', type: 'section-checklist', title: 'Month 2 — Validation', color: '#fbbf24', items: [
            'Competitive analysis 5-mile radius', 'Labor cost model', 'Equipment vendor quotes',
            'Lease terms review', 'Multi-unit expansion path', 'SBA loan pre-qualification',
          ].map(mkCheck) },
        ],
      },
      {
        id: 'financials',
        label: 'Financials',
        icon: '📊',
        widgets: [
          { id: 'w-af1', type: 'metrics-row', items: [
            { label: 'Startup Range', value: '$150K–$200K' },
            { label: 'Your Contribution', value: '$70K–$80K' },
            { label: 'Monthly Overhead Est.', value: 'TBD' },
          ]},
          { id: 'w-af2', type: 'editable-list', title: 'Startup Cost Breakdown', fields: [
            { label: 'Franchise Fee', value: '' }, { label: 'Equipment', value: '' },
            { label: 'Buildout', value: '' }, { label: 'Working Capital', value: '' },
            { label: 'Training + Travel', value: '' }, { label: 'Legal + Accounting', value: '' },
          ]},
          { id: 'w-af3', type: 'note', title: 'Ray Kroc Principles', content: 'System beats heroics. Location matters. Unit economics before scale. Steve is your lifeline — call weekly.' },
        ],
      },
      {
        id: 'research',
        label: 'Research',
        icon: '🔍',
        widgets: [
          { id: 'w-ar1', type: 'section-checklist', title: 'FDD Review Checklist', color: '#fb923c', items: [
            'Initial franchise fee', 'Royalty % + marketing fund', 'Territory rights',
            'Training duration + cost', 'Supplier restrictions', 'Renewal terms',
            'Average unit volume (AUV)', 'Franchisee satisfaction data',
          ].map(mkCheck) },
          { id: 'w-ar2', type: 'note', title: 'Location Notes', content: 'Manchester, NH\nContact: Steve\nDemographics · traffic · competition · parking · delivery radius' },
        ],
      },
    ],
  },

  fit: {
    tabs: [
      {
        id: 'today',
        label: 'Today',
        icon: '💪',
        widgets: [
          { id: 'w-f-banner', type: 'banner', title: 'Daily Physical Protocol', subtitle: 'Log every set · beat last week' },
          { id: 'w-f1', type: 'section-checklist', title: 'Non-Negotiable Physical', color: '#f472b6', items: [
            '100 pushups outside (post-Fajr)', 'Full lift session logged', 'Voice routine complete',
            'Evening basketball / sport', 'Cold plunge + hot tub', '1 mile run — log time',
          ].map(mkCheck) },
          { id: 'w-f2', type: 'lift-today', title: "Today's Lift Program" },
          { id: 'w-f3', type: 'mile-log', title: 'Mile Times', entries: [] },
        ],
      },
      {
        id: 'metrics',
        label: 'Metrics',
        icon: '📏',
        widgets: [
          { id: 'w-fm1', type: 'progress-group', items: [
            { label: 'Weight', current: 140, target: 165, unit: ' lbs' },
            { label: 'Bench Press', current: 0, target: 315, unit: ' lbs' },
            { label: 'Mile Time', current: 450, target: 360, unit: ' sec', invert: true },
          ]},
          { id: 'w-fm2', type: 'metrics-row', items: [
            { label: 'Calories/day', value: '3,200–3,400' },
            { label: 'Protein', value: '210–228g' },
            { label: 'Timeline', value: '6 mo lean' },
          ]},
          { id: 'w-fm3', type: 'note', title: 'Medical Flags', content: 'EOE — monitor swallowing with eggs/tuna\nUC remission — white rice only, no raw veg\nPSC liver — creatine pending hepatologist approval' },
        ],
      },
      {
        id: 'program',
        label: 'Program',
        icon: '🏋️',
        widgets: [
          { id: 'w-fp1', type: 'week-split', title: 'Weekly Split' },
          { id: 'w-fp2', type: 'pr-table', title: 'Personal Records', rows: [
            { lift: 'Bench Press', pr: '', goal: '315' },
            { lift: 'Squat', pr: '', goal: '405' },
            { lift: 'Deadlift', pr: '', goal: '495' },
            { lift: 'OHP', pr: '', goal: '185' },
            { lift: 'Pull-ups', pr: '', goal: '20+' },
          ]},
        ],
      },
    ],
  },

  islam: {
    tabs: [
      {
        id: 'daily',
        label: 'Daily',
        icon: '🕌',
        widgets: [
          { id: 'w-i-banner', type: 'banner', title: 'Daily Islamic Protocol', subtitle: 'Faith is load-bearing — not nominal' },
          { id: 'w-id1', type: 'section-checklist', title: 'Prayers + Worship', color: '#fbbf24', items: [
            'Fajr on time + sunnah', 'Dhuhr complete', 'Asr complete', 'Maghrib complete', 'Isha + Witr complete',
            'Ultimate Dua — every word slowly', 'Quran portion from memory',
          ].map(mkCheck) },
          { id: 'w-id2', type: 'note', title: 'Ultimate Dua Reminder', content: 'Read after Fajr and Tahajjud. Every word slowly. Write what you asked for.' },
        ],
      },
      {
        id: 'study',
        label: 'Study',
        icon: '☾',
        widgets: [
          { id: 'w-is1', type: 'study-rotation', title: 'Weekly Rotation' },
          { id: 'w-is2', type: 'section-checklist', title: 'Study Block Protocol', color: '#fbbf24', items: [
            'PRIME sentence written', '10-min stop × 3 rounds', 'Brain dump after each round',
            'NSDR 10-15 min after block', 'How does this change how I act TODAY?',
          ].map(mkCheck) },
        ],
      },
      {
        id: 'quran',
        label: 'Quran',
        icon: '📿',
        widgets: [
          { id: 'w-iq1', type: 'progress-group', items: [
            { label: 'Juz Amma Memorization', current: 0, target: 100, unit: '%' },
          ]},
          { id: 'w-iq2', type: 'note', title: 'Muraja\'ah', content: 'Daily Quran review from memory — 6 ayahs minimum. Recite today\'s portion before sleep.' },
        ],
      },
    ],
  },

  essay: {
    tabs: [
      {
        id: 'writing',
        label: 'Writing',
        icon: '✍️',
        widgets: [
          { id: 'w-e1', type: 'section-checklist', title: 'Daily Writing', color: '#8b5cf6', items: [
            'Morning journal — 10 questions', 'Rough draft essay on MacBook', 'Handwrite final in journal',
            'Substack 2-3 min summary', 'Story in own words',
          ].map(mkCheck) },
          { id: 'w-e2', type: 'note', title: 'Essay Pipeline', content: 'Morning journal → draft → handwritten final → Substack distillation. Every piece in your voice.' },
        ],
      },
      {
        id: 'voice',
        label: 'Voice',
        icon: '🎙️',
        widgets: [
          { id: 'w-ev1', type: 'section-checklist', title: 'Voice Routine', color: '#38bdf8', items: [
            'Breath support — lungs not throat', 'Tongue twisters 5 min', 'Elevator pitch 30 sec',
            'STAR behavioral answer 90 sec', 'Recall recording — no replay', 'Lisp correction drills',
          ].map(mkCheck) },
        ],
      },
    ],
  },

  vocab: {
    tabs: [
      {
        id: 'today',
        label: 'Today',
        icon: '📖',
        widgets: [
          { id: 'w-v1', type: 'section-checklist', title: 'Daily Vocab Protocol', color: '#34d399', items: [
            'Yesterday vocab from memory', 'New word — root BEFORE lookup', '3 sentences with new word',
            'Quizlet review session', 'Night journal vocab integration',
          ].map(mkCheck) },
          { id: 'w-v2', type: 'word-bank', title: 'Word Bank', words: [] },
        ],
      },
      {
        id: 'method',
        label: 'Method',
        icon: '🧬',
        widgets: [
          { id: 'w-vm1', type: 'note', title: 'Root-Based Etymology', content: 'Always: root + prefix + suffix BEFORE looking up.\nDefine in YOUR words.\nConnect to Arabic roots when possible.\nUse in morning + night journal.' },
        ],
      },
    ],
  },
};

export function getDashboardConfig(dashId) {
  return DASHBOARD_CONFIGS[dashId] || { tabs: [{ id: 'main', label: 'Main', icon: '📊', widgets: [] }] };
}

/** Flat widget list for legacy storage migration */
export function getFlatWidgets(dashId) {
  const cfg = getDashboardConfig(dashId);
  return cfg.tabs?.flatMap((t) => t.widgets) || [];
}
