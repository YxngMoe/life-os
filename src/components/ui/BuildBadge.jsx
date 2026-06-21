import { useState } from 'react';
import { GitCommit, Clock } from 'lucide-react';
import BottomSheet from './BottomSheet';
import { BUILD_TIME, BUILD_SHA, BUILD_VERSION, formatBuildTime, buildLabel } from '../../constants/build';

export default function BuildBadge({ variant = 'default', className = '' }) {
  const [open, setOpen] = useState(false);
  const compact = variant === 'compact';
  const prominent = variant === 'prominent';

  return (
    <>
      <button
        type="button"
        className={`build-badge ${compact ? 'build-badge--compact' : ''} ${prominent ? 'build-badge--prominent' : ''} ${className}`}
        onClick={() => setOpen(true)}
        title="Tap for deploy details"
      >
        <Clock size={compact ? 11 : 13} />
        <span>
          {compact ? formatBuildTime().replace(/,\s*\d{4}/, '') : `Updated ${formatBuildTime()}`}
        </span>
        {!compact && <span className="build-badge__sha">{BUILD_SHA}</span>}
      </button>

      <BottomSheet open={open} onClose={() => setOpen(false)} title="Deploy Info">
        <div className="build-detail">
          <div className="build-detail__row">
            <Clock size={16} />
            <div>
              <div className="text-micro text-tertiary">Last deployed</div>
              <div className="text-headline">{formatBuildTime()}</div>
            </div>
          </div>
          <div className="build-detail__row">
            <GitCommit size={16} />
            <div>
              <div className="text-micro text-tertiary">Git commit</div>
              <div className="text-headline" style={{ fontFamily: 'ui-monospace, monospace' }}>{BUILD_SHA}</div>
            </div>
          </div>
          <div className="build-detail__meta">
            <span className="glass-pill glass-pill--active">v{BUILD_VERSION}</span>
            <span className="glass-pill">Life OS · React PWA</span>
          </div>
          <p className="text-caption text-secondary" style={{ marginTop: 16, lineHeight: 1.6 }}>
            If this timestamp matches your latest push, the live site is current.
            Hard-refresh or reinstall the PWA if it looks stale.
          </p>
        </div>
      </BottomSheet>
    </>
  );
}

export { formatBuildTime, buildLabel, BUILD_TIME, BUILD_SHA, BUILD_VERSION };
