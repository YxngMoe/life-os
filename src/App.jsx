import { useState, useEffect } from 'react';
import { ToastProvider, useToast } from './context/ToastContext';
import { NeuralProvider } from './context/NeuralContext';
import PinLock from './components/ui/PinLock';
import TabBar from './components/ui/TabBar';
import Sidebar from './components/ui/Sidebar';
import AmbientGlow from './components/ui/AmbientGlow';
import GlobalSearch from './components/ui/GlobalSearch';
import AIStrip from './components/ui/AIStrip';
import BuildBadge from './components/ui/BuildBadge';
import Home from './components/screens/Home';
import CalendarScreen from './components/screens/Calendar';
import BrainScreen from './components/screens/Brain';
import EncyclopediaScreen from './components/screens/Encyclopedia';
import LifeScreen from './components/screens/Life';
import DashboardsScreen from './components/screens/Dashboards';
import TodoScreen from './components/screens/Todo';
import CoachScreen from './components/screens/Coach';
import AgentsScreen from './components/screens/Agents';
import BottomSheet from './components/ui/BottomSheet';
import { useTheme } from './hooks/useTheme';
import { useEditMode } from './hooks/useEditMode';
import { useOpenClaw } from './hooks/useOpenClaw';
import { initStorage, migrateLegacyKeys, lsSetLocal } from './data/storage';
import { SyncProvider } from './context/SyncContext';
import { syncToObsidian } from './utils/sync';
import { migrateGoals } from './data/goals';
import {
  DEFAULT_GOALS, DEFAULT_SUBJECTS, DEFAULT_DASHBOARDS, DEFAULT_ENC, DEFAULT_QUICK_TILES,
} from './data/defaults';

const AGENTS_INIT = ['moe', 'abw', 'islamic', 'finance', 'builder'];

function initApp() {
  migrateLegacyKeys();
  migrateGoals();
  initStorage({
    streak: { cur: 0, best: 0, last: null },
    checks: {},
    todos: [],
    goals: DEFAULT_GOALS,
    subjects: DEFAULT_SUBJECTS,
    events: {},
    dashes: DEFAULT_DASHBOARDS,
    vb: [],
    dua: '',
    enc: DEFAULT_ENC,
    qa: DEFAULT_QUICK_TILES,
    schk: {},
    em: false,
    lm: false,
    agent_log: [],
    last_sync: null,
    mem: '',
    search_history: [],
  });
  AGENTS_INIT.forEach((id) => {
    if (localStorage.getItem(`los_chat_${id}`) === null) {
      lsSetLocal(`chat_${id}`, []);
    }
  });
}

function AppInner() {
  const toast = useToast();
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem('los_unlocked') === '1');
  const [screen, setScreen] = useState('/home');
  const [searchOpen, setSearchOpen] = useState(false);
  const [offline, setOffline] = useState(!navigator.onLine);
  const [syncState, setSyncState] = useState('idle');
  const { lightMode, toggle } = useTheme();
  const { editMode, showPin, setShowPin, toggleEdit, unlockWithPin, touch } = useEditMode();
  const { status } = useOpenClaw();
  const [pinInput, setPinInput] = useState('');

  useEffect(() => { initApp(); }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('light-mode', lightMode);
  }, [lightMode]);

  useEffect(() => {
    const on = () => setOffline(false);
    const off = () => setOffline(true);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);

  useEffect(() => {
    function onKey(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((o) => !o);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  async function handleSync() {
    try {
      await syncToObsidian(setSyncState);
      toast('Obsidian sync complete', 'emerald');
      setTimeout(() => setSyncState('idle'), 2000);
    } catch {
      setSyncState('error');
      toast('Sync failed', 'amber');
    }
  }

  function handleUnlock() {
    sessionStorage.setItem('los_unlocked', '1');
    setUnlocked(true);
  }

  function navigate(path) {
    if (path === '/edit') { toggleEdit(); return; }
    touch();
    setScreen(path);
  }

  if (!unlocked) return <><AmbientGlow /><PinLock onUnlock={handleUnlock} /></>;

  const homeProps = {
    onNavigate: navigate, editMode, openClawStatus: status,
    onSync: handleSync, syncState, onToggleTheme: toggle, lightMode,
  };

  function renderScreen() {
    switch (screen) {
      case '/home': return <Home {...homeProps} />;
      case '/calendar': return <CalendarScreen editMode={editMode} />;
      case '/brain': return <BrainScreen editMode={editMode} onNavigate={navigate} />;
      case '/encyclopedia': return <EncyclopediaScreen editMode={editMode} />;
      case '/life': return <LifeScreen editMode={editMode} />;
      case '/dashboards': return <DashboardsScreen editMode={editMode} />;
      case '/todo': return <TodoScreen editMode={editMode} />;
      case '/coach': return <CoachScreen onNavigate={navigate} />;
      case '/agents': return <AgentsScreen onNavigate={navigate} />;
      default: return <Home {...homeProps} />;
    }
  }

  return (
    <NeuralProvider>
      <AmbientGlow />
      {offline && <div className="offline-banner">Offline — AI features may use fallback mode</div>}
      {editMode && <div className="edit-mode-banner">🔐 EDIT MODE ACTIVE</div>}

      <div className="app-shell">
        <Sidebar screen={screen} onNavigate={navigate} lightMode={lightMode} onToggleTheme={toggle}
          onSync={handleSync} syncState={syncState} editMode={editMode} openClawStatus={status} />
        <main className="app-main" onClick={touch}>
          <AIStrip openClawStatus={status} offline={offline} />
          {renderScreen()}
        </main>
        <TabBar screen={screen} onNavigate={navigate} editMode={editMode} />
      </div>

      <div className="mobile-build-strip">
        <BuildBadge variant="compact" />
      </div>

      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} onNavigate={navigate} />

      <BottomSheet open={showPin} onClose={() => setShowPin(false)} title="Enter PIN for Edit Mode">
        <input className="glass-input mb-16" type="password" inputMode="numeric" maxLength={4} placeholder="2232"
          value={pinInput} onChange={(e) => {
            const v = e.target.value.replace(/\D/g, '').slice(0, 4);
            setPinInput(v);
            if (v.length === 4 && !unlockWithPin(v)) setPinInput('');
          }} />
      </BottomSheet>
    </NeuralProvider>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <SyncProvider>
        <AppInner />
      </SyncProvider>
    </ToastProvider>
  );
}
