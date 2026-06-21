import { Sparkles, Wifi, WifiOff } from 'lucide-react';
import { buildLabel } from '../../constants/build';

export default function AIStrip({ openClawStatus, offline }) {
  const online = openClawStatus === 'connected';
  return (
    <div className="ai-strip">
      <div className="ai-strip__pulse" aria-hidden="true" />
      <div className="ai-strip__inner">
        <Sparkles size={12} className="ai-strip__icon" />
        <span className="ai-strip__label">NEURAL OS</span>
        <span className="ai-strip__dot" />
        <span className="ai-strip__status">{online ? 'AI ONLINE' : 'FALLBACK MODE'}</span>
        {offline ? <WifiOff size={11} /> : <Wifi size={11} />}
        <span className="ai-strip__version">{buildLabel()}</span>
      </div>
    </div>
  );
}
