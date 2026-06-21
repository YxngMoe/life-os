import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../ui/GlassCard';
import { useNeuralOptional } from '../../context/NeuralContext';

export default function NeuralPulse({ onNavigate }) {
  const neural = useNeuralOptional();
  const [idx, setIdx] = useState(0);
  const items = neural?.pulseItems || [];

  useEffect(() => {
    if (!items.length) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % items.length), 7000);
    return () => clearInterval(id);
  }, [items.length]);

  if (!items.length) return null;
  const item = items[idx];

  return (
    <GlassCard holographic neon className="neural-pulse mb-20" style={{ padding: 0, overflow: 'hidden' }}>
      <div className="neural-pulse__bar">
        {items.map((_, i) => (
          <button key={i} type="button" className={`neural-pulse__dot ${i === idx ? 'neural-pulse__dot--active' : ''}`} onClick={() => setIdx(i)} />
        ))}
        <span className="neural-pulse__phase">{neural?.phaseLabel}</span>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={item.id + idx}
          className="neural-pulse__body"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.35 }}
          onClick={() => {
            if (item.id === 'agent') onNavigate?.('/agents');
            else if (item.id === 'block' || item.id === 'next') onNavigate?.('/calendar');
            else if (item.id === 'goal') onNavigate?.('/life');
          }}
          style={{ cursor: 'pointer' }}
        >
          <div className="neural-pulse__icon" style={{ filter: `drop-shadow(0 0 12px ${item.color})` }}>{item.icon}</div>
          <div className="min-w-0">
            <div className="text-micro" style={{ color: item.color }}>{item.label}</div>
            <div className="neural-pulse__text">{item.text}</div>
            <div className="text-caption text-secondary" style={{ marginTop: 4 }}>{item.sub}</div>
          </div>
          <span className="neural-pulse__live">LIVE</span>
        </motion.div>
      </AnimatePresence>
    </GlassCard>
  );
}
