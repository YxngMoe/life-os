import { Home, Calendar, Brain, BookOpen, Target, LayoutDashboard, CheckSquare, Sparkles, Lock } from 'lucide-react';

const TABS = [
  { id: '/home', label: 'Home', icon: Home, color: '#6366f1' },
  { id: '/calendar', label: 'Cal', icon: Calendar, color: '#34d399' },
  { id: '/brain', label: 'Brain', icon: Brain, color: '#8b5cf6' },
  { id: '/encyclopedia', label: 'Enc', icon: BookOpen, color: '#fbbf24' },
  { id: '/life', label: 'Life', icon: Target, color: '#fb923c' },
  { id: '/dashboards', label: 'Dash', icon: LayoutDashboard, color: '#2dd4bf' },
  { id: '/todo', label: 'Tasks', icon: CheckSquare, color: '#60a5fa' },
  { id: '/coach', label: 'Coach', icon: Sparkles, color: '#f472b6' },
  { id: '/edit', label: 'Edit', icon: Lock, color: '#fbbf24' },
];

export default function TabBar({ screen, onNavigate, editMode }) {
  return (
    <nav className="tab-bar">
      {TABS.map(({ id, label, icon: Icon, color }) => {
        const active = screen === id;
        const isEdit = id === '/edit' && editMode;
        return (
          <button key={id} type="button" className={active || isEdit ? 'active' : ''} style={{ '--tab-color': color }} onClick={() => onNavigate(id)}>
            <Icon strokeWidth={active ? 2.2 : 1.6} />
            <span>{label}</span>
            <span className="tab-indicator" />
          </button>
        );
      })}
    </nav>
  );
}
