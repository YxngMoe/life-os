import { useState, useEffect } from 'react';
import PinLock from './components/ui/PinLock';
import TabBar from './components/ui/TabBar';
import Sidebar from './components/ui/Sidebar';
import Home from './components/screens/Home';
import CalendarScreen from './components/screens/Calendar';
import BrainScreen from './components/screens/Brain';
import EncyclopediaScreen from './components/screens/Encyclopedia';
import LifeScreen from './components/screens/Life';
import DashboardsScreen from './components/screens/Dashboards';
import TodoScreen from './components/screens/Todo';
import CoachScreen from './components/screens/Coach';
import BottomSheet from './components/ui/BottomSheet';
import { useTheme } from './hooks/useTheme';
import { useEditMode } from './hooks/useEditMode';
import { useOpenClaw } from './hooks/useOpenClaw';
import { initStorage, migrateLegacyKeys } from './data/storage';
import {
  DEFAULT_GOALS, DEFAULT_SUBJECTS, DEFAULT_DASHBOARDS, DEFAULT_ENC, DEFAULT_QUICK_TILES,
} from './data/defaults';

const AGENTS_INIT = ['moe', 'abw', 'islamic', 'finance', 'builder'];

function initApp() {
  migrateLegacyKeys();
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
  });
  AGENTS_INIT.forEach((id) => {
    if (localStorage.getItem(`los_chat_${id}`) === null) {
      localStorage.setItem(`los_chat_${id}`, '[]');
    }
  });
}

export default function App() {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem('los_unlocked') === '1');
  const [screen, setScreen] = useState('/home');
  const { lightMode, toggle } = useTheme();
  const { editMode, showPin, setShowPin, toggleEdit, unlockWithPin, touch } = useEditMode();
  const { status } = useOpenClaw();
  const [pinInput, setPinInput] = useState('');

  useEffect(() => {
    initApp();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('light-mode', lightMode);
  }, [lightMode]);

  function handleUnlock() {
    sessionStorage.setItem('los_unlocked', '1');
    setUnlocked(true);
  }

  function navigate(path) {
    if (path === '/edit') {
      toggleEdit();
      return;
    }
    touch();
    setScreen(path);
  }

  if (!unlocked) {
    return <PinLock onUnlock={handleUnlock} />;
  }

  function renderScreen() {
    const props = { onNavigate: navigate, editMode, openClawStatus: status };
    switch (screen) {
      case '/home': return <Home {...props} />;
      case '/calendar': return <CalendarScreen editMode={editMode} />;
      case '/brain': return <BrainScreen editMode={editMode} onNavigate={navigate} />;
      case '/encyclopedia': return <EncyclopediaScreen editMode={editMode} />;
      case '/life': return <LifeScreen editMode={editMode} />;
      case '/dashboards': return <DashboardsScreen editMode={editMode} />;
      case '/todo': return <TodoScreen editMode={editMode} />;
      case '/coach': return <CoachScreen onNavigate={navigate} />;
      default: return <Home {...props} />;
    }
  }

  return (
    <div className="app-shell">
      {editMode && <div className="edit-mode-banner">🔐 EDIT MODE ACTIVE</div>}

      <Sidebar screen={screen} onNavigate={navigate} lightMode={lightMode} onToggleTheme={toggle} />

      <main className="app-main" onClick={touch}>
        {renderScreen()}
      </main>

      <TabBar screen={screen} onNavigate={navigate} />

      <BottomSheet open={showPin} onClose={() => setShowPin(false)} title="Enter PIN for Edit Mode">
        <input
          className="glass-input mb-16"
          type="password"
          inputMode="numeric"
          maxLength={4}
          placeholder="2232"
          value={pinInput}
          onChange={(e) => {
            const v = e.target.value.replace(/\D/g, '').slice(0, 4);
            setPinInput(v);
            if (v.length === 4) {
              if (!unlockWithPin(v)) setPinInput('');
            }
          }}
        />
      </BottomSheet>
    </div>
  );
}
