import { useMemo } from 'react';
import { SCHEDULE_BLOCKS } from '../data/schedule';
import { NON_NEGOTIABLES } from '../data/defaults';
import { getCurrentBlockIndex, getDayMeta } from '../utils/schedule';
import { calcGoalProgress } from '../data/goals';
import { getRecommendedAgent } from '../data/agentConfig';
import { AGENTS } from '../data/defaults';

function getTimePhase(hour) {
  if (hour >= 3 && hour < 6) return 'dawn';
  if (hour >= 6 && hour < 11) return 'morning';
  if (hour >= 11 && hour < 14) return 'midday';
  if (hour >= 14 && hour < 18) return 'afternoon';
  if (hour >= 18 && hour < 22) return 'evening';
  return 'night';
}

const PHASE_LABELS = {
  dawn: 'Dawn Protocol',
  morning: 'Morning Surge',
  midday: 'Midday Execute',
  afternoon: 'Deep Work Mode',
  evening: 'Evening Push',
  night: 'Night Wind-Down',
};

const AGENT_TIPS = {
  moe: [
    'Your streak is your identity. Protect it before anything else.',
    'If you feel like a fraud at JPMC — do one hard thing before noon.',
    'Discipline in the car experiment is load-bearing. Don\'t break it.',
  ],
  abw: [
    'Contact Steve this week. Momentum beats perfect research.',
    'Every dollar saved is a vote for Manchester NH.',
    'Go decision needs FDD + financial model. What\'s missing?',
  ],
  islamic: [
    'How does today\'s study change how you act TODAY?',
    'Tahajjud dua is the highest ROI 20 minutes of your day.',
    'Faith is load-bearing — let it drive the schedule, not fit around it.',
  ],
  finance: [
    'No thesis = no trade. Non-negotiable.',
    '50-minute timer on trading. Hard stop.',
    'ABW fund needs monthly run rate tracking.',
  ],
  builder: [
    'Ship small. Neural OS grows one feature at a time.',
    'localStorage is truth — migrate carefully on version bumps.',
    'PWA cache causes stale deploys. Build badge is your friend.',
  ],
};

export function useNeuralContext({ checks = {}, schk = {}, goals = [], todos = [], agentLog = [] }) {
  return useMemo(() => {
    const now = new Date();
    const hour = now.getHours();
    const timePhase = getTimePhase(hour);
    const blockIdx = getCurrentBlockIndex(now);
    const currentBlock = SCHEDULE_BLOCKS[blockIdx];
    const nextBlock = SCHEDULE_BLOCKS[blockIdx + 1];
    const meta = getDayMeta(now);

    const nnPending = NON_NEGOTIABLES.filter((n) => !checks[n.id]);
    const nnDone = NON_NEGOTIABLES.length - nnPending.length;
    const scheduleDone = SCHEDULE_BLOCKS.filter((b) => schk[b.id]).length;

    const activeGoals = goals.filter((g) => !g.done);
    const criticalGoals = activeGoals.filter((g) => g.priority === 'critical');
    const lowProgressCritical = criticalGoals
      .filter((g) => calcGoalProgress(g) < 40)
      .slice(0, 3);

    const pendingTodos = todos.filter((t) => !t.done);
    const criticalTodos = pendingTodos.filter((t) => t.priority === 'critical');

    const recommendedAgentId = getRecommendedAgent({ timePhase, currentBlock, criticalGoals, checks });
    const recommendedAgent = AGENTS.find((a) => a.id === recommendedAgentId) || AGENTS[0];
    const tipIdx = Math.floor(now.getMinutes() / 10) % (AGENT_TIPS[recommendedAgentId]?.length || 1);
    const agentTip = AGENT_TIPS[recommendedAgentId]?.[tipIdx] || 'Execute the plan. No excuses.';

    const missions = [];
    if (currentBlock && !schk[currentBlock.id]) {
      missions.push({
        id: `block-${currentBlock.id}`,
        type: 'schedule',
        priority: 'now',
        label: `NOW: ${currentBlock.title}`,
        detail: currentBlock.items[0],
        agent: routeBlockAgent(currentBlock),
        action: '/calendar',
      });
    }
    nnPending.slice(0, 2).forEach((nn) => {
      missions.push({
        id: `nn-${nn.id}`,
        type: 'nn',
        priority: nn.id === 'fajr' || nn.id === 'push' ? 'critical' : 'high',
        label: nn.label,
        detail: 'Non-negotiable',
        agent: nn.cat === 'prayer' ? 'islamic' : nn.cat === 'study' ? 'moe' : 'moe',
        action: '/home',
      });
    });
    lowProgressCritical.forEach((g) => {
      missions.push({
        id: `goal-${g.id}`,
        type: 'goal',
        priority: 'critical',
        label: g.text.slice(0, 50),
        detail: `${calcGoalProgress(g)}% complete`,
        agent: g.cat === 'business' ? 'abw' : g.cat === 'finance' ? 'finance' : 'moe',
        action: '/life',
      });
    });
    criticalTodos.slice(0, 1).forEach((t) => {
      missions.push({
        id: `todo-${t.id}`,
        type: 'todo',
        priority: 'critical',
        label: t.text.slice(0, 50),
        detail: 'Critical task',
        agent: 'moe',
        action: '/todo',
      });
    });

    const pulseItems = [
      {
        id: 'block',
        icon: currentBlock?.emoji || '⏰',
        label: 'CURRENT BLOCK',
        text: currentBlock ? `${currentBlock.time} — ${currentBlock.title}` : 'Day complete',
        sub: currentBlock?.items[0] || '',
        color: recommendedAgent.color,
      },
      {
        id: 'agent',
        icon: recommendedAgent.emoji,
        label: `${recommendedAgent.name.toUpperCase()} AGENT`,
        text: agentTip,
        sub: `Recommended for ${PHASE_LABELS[timePhase]}`,
        color: recommendedAgent.color,
      },
      {
        id: 'nn',
        icon: '🔥',
        label: 'NON-NEGOTIABLES',
        text: nnPending.length ? `Next: ${nnPending[0].label}` : 'All 15 complete — legendary',
        sub: `${nnDone}/15 done today`,
        color: '#fbbf24',
      },
      {
        id: 'goal',
        icon: '🎯',
        label: 'CRITICAL GOALS',
        text: lowProgressCritical[0]?.text?.slice(0, 60) || `${criticalGoals.length} critical goals active`,
        sub: lowProgressCritical[0] ? `${calcGoalProgress(lowProgressCritical[0])}% progress` : 'On track',
        color: '#f87171',
      },
      {
        id: 'next',
        icon: nextBlock?.emoji || '🌙',
        label: 'UP NEXT',
        text: nextBlock ? `${nextBlock.time} — ${nextBlock.title}` : 'Sleep protocol',
        sub: nextBlock?.items[0] || '',
        color: '#22d3ee',
      },
    ];

    const tickerMessages = [
      `${PHASE_LABELS[timePhase]} · Block ${blockIdx + 1}/35`,
      `${recommendedAgent.emoji} ${recommendedAgent.name} agent recommended`,
      `${nnDone}/15 non-negotiables · ${scheduleDone}/35 blocks`,
      criticalGoals.length ? `${criticalGoals.length} critical goals need attention` : 'All critical goals on track',
      agentTip.slice(0, 60),
    ];

    return {
      now,
      timePhase,
      phaseLabel: PHASE_LABELS[timePhase],
      blockIdx,
      currentBlock,
      nextBlock,
      meta,
      nnPending,
      nnDone,
      scheduleDone,
      criticalGoals,
      recommendedAgentId,
      recommendedAgent,
      agentTip,
      missions: missions.slice(0, 6),
      pulseItems,
      tickerMessages,
      recentAgentActivity: (agentLog || []).slice(0, 8),
    };
  }, [checks, schk, goals, todos, agentLog]);
}

function routeBlockAgent(block) {
  const t = (block.title || '').toLowerCase();
  if (t.includes('islam') || t.includes('fajr') || t.includes('quran')) return 'islamic';
  if (t.includes('finance') || t.includes('trading')) return 'finance';
  if (t.includes('business') || t.includes('abw')) return 'abw';
  if (t.includes('tech') || t.includes('jpmc')) return 'builder';
  return 'moe';
}

export default useNeuralContext;
