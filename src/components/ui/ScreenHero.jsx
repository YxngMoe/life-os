import GlassCard from './GlassCard';
import CountUp from './CountUp';

export default function ScreenHero({ icon, title, subtitle, accent = 'var(--neon)', stats = [], badge, children }) {
  return (
    <div className="screen-hero mb-20" style={{ '--hero-accent': accent }}>
      <div className="screen-hero__grid" aria-hidden="true" />
      <div className="screen-hero__glow" aria-hidden="true" />
      <div className="screen-hero__content">
        <div className="screen-hero__top">
          <div className="screen-hero__icon-wrap">{icon}</div>
          <div className="min-w-0">
            {badge && <span className="screen-hero__badge">{badge}</span>}
            <h1 className="screen-hero__title">{title}</h1>
            {subtitle && <p className="screen-hero__sub">{subtitle}</p>}
          </div>
        </div>
        {stats.length > 0 && (
          <div className="screen-hero__stats">
            {stats.map((s) => (
              <GlassCard key={s.label} holographic style={{ padding: '10px 12px', textAlign: 'center', flex: 1, minWidth: 72 }}>
                <div className="text-micro text-tertiary">{s.label}</div>
                <div className="text-headline" style={{ color: s.color || accent }}>
                  {typeof s.value === 'number' ? <CountUp value={s.value} /> : s.value}
                </div>
              </GlassCard>
            ))}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
