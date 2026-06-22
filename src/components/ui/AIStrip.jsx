import { useState, useEffect } from 'react';
import { Sparkles, Wifi, WifiOff } from 'lucide-react';
import { buildLabel } from '../../constants/build';
import { useNeuralOptional } from '../../context/NeuralContext';

export default function AIStrip({ openClawStatus, offline }) {
  const online = openClawStatus === 'connected';
  const neural = useNeuralOptional();
  const tickers = neural?.tickerMessages || [];
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!tickers.length) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % tickers.length), 5000);
    return () => clearInterval(id);
  }, [tickers.length]);

  const dynamic = tickers[idx] || (neural?.recommendedAgent ? `${neural.recommendedAgent.emoji} ${neural.recommendedAgent.name} active` : '');

  return (
    <div className="ai-strip">
      <div className="ai-strip__pulse" aria-hidden="true" />
      <div className="ai-strip__inner">
        <Sparkles size={12} className="ai-strip__icon" />
        <span className="ai-strip__label">NEURAL OS</span>
        <span className="ai-strip__dot" />
        <span className="ai-strip__status">{online ? 'GATEWAY LIVE' : 'GATEWAY OFFLINE'}</span>
        {dynamic && <span className="ai-strip__dynamic">{dynamic}</span>}
        {offline ? <WifiOff size={11} /> : <Wifi size={11} />}
        <span className="ai-strip__version">{buildLabel()}</span>
      </div>
    </div>
  );
}
