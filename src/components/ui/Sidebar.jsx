import { Home, Calendar, Brain, BookOpen, Target, LayoutDashboard, CheckSquare, Sparkles, Lock, Sun, Moon, Cloud } from 'lucide-react';
import { formatShortDate } from '../../utils/dates';
import { getStreak } from '../../hooks/useStreak';

const NAV = [
  { id: '/home', label: 'Home', icon: Home },
  { id: '/calendar', label: 'Calendar', icon: Calendar },
  { id: '/brain', label: 'Brain', icon: Brain },
  { id: '/encyclopedia', label: 'Encyclopedia', icon: BookOpen },
  { id: '/life', label: 'Life', icon: Target },
  { id: '/dashboards', label: 'Dashboards', icon: LayoutDashboard },
  { id: '/todo', label: 'To-Do', icon: CheckSquare },
  { id: '/coach', label: 'Coach', icon: Sparkles },
  { id: '/edit', label: 'Edit Mode', icon: Lock },
];

export default function Sidebar({ screen, onNavigate, lightMode, onToggleTheme, onSync, syncState, editMode }) {
  const streak = getStreak();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-m">M</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700 }}>Life OS</div>
          <div className="text-micro">Mohamed</div>
        </div>
      </div>
      <nav className="sidebar-nav">
        {NAV.map(({ id, label, icon: Icon }) => (
          <button key={id} type="button" className={screen === id || (id === '/edit' && editMode) ? 'active' : ''} onClick={() => onNavigate(id)}>
            <Icon size={18} />
            {label}
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="text-caption text-secondary mb-8">{formatShortDate(new Date())}</div>
        <div className="text-caption mb-12">🔥 {streak.cur || 0} day streak</div>
        <div className="flex gap-8">
          <button type="button" className="glass-pill" onClick={onToggleTheme}>{lightMode ? <Sun size={14} /> : <Moon size={14} />}</button>
          <button type="button" className="glass-pill" onClick={onSync} title="Obsidian sync">
            <Cloud size={14} className={syncState === 'syncing' ? 'spin' : ''} />
            {syncState === 'synced' && ' ✓'}
          </button>
        </div>
      </div>
    </aside>
  );
}
