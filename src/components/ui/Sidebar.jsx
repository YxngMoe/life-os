import { Home, Calendar, Brain, BookOpen, Target, LayoutDashboard, Sparkles, Lock, Sun, Moon } from 'lucide-react';
import { formatShortDate } from '../../utils/dates';
import { getStreak } from '../../hooks/useStreak';

const NAV = [
  { id: '/home', label: 'Home', icon: Home },
  { id: '/calendar', label: 'Calendar', icon: Calendar },
  { id: '/brain', label: 'Brain', icon: Brain },
  { id: '/encyclopedia', label: 'Encyclopedia', icon: BookOpen },
  { id: '/life', label: 'Life', icon: Target },
  { id: '/dashboards', label: 'Dashboards', icon: LayoutDashboard },
  { id: '/todo', label: 'To-Do', icon: Target },
  { id: '/coach', label: 'Coach', icon: Sparkles },
  { id: '/edit', label: 'Edit Mode', icon: Lock },
];

export default function Sidebar({ screen, onNavigate, lightMode, onToggleTheme }) {
  const streak = getStreak();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-monogram">M</div>
        <div>
          <div className="text-headline">Life OS</div>
          <div className="text-micro text-tertiary">Mohamed</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {NAV.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            className={screen === id ? 'active' : ''}
            onClick={() => onNavigate(id)}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="flex items-center justify-between mb-12">
          <span className="text-caption text-secondary">🔥 {streak.cur || 0} day streak</span>
          <button type="button" className="glass-pill" onClick={onToggleTheme}>
            {lightMode ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>
        <div className="text-micro text-tertiary">{formatShortDate(new Date())}</div>
      </div>
    </aside>
  );
}
