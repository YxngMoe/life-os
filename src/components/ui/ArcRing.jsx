import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function ArcRing({ value = 0, size = 76, stroke = 5, color = '#6366f1', glow = true }) {
  const [animated, setAnimated] = useState(0);
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animated / 100) * circumference;

  useEffect(() => {
    const t = setTimeout(() => setAnimated(Math.min(100, Math.max(0, value))), 100);
    return () => clearTimeout(t);
  }, [value]);

  return (
    <div className={`ring-wrap ${glow ? 'ring-glow' : ''}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ type: 'spring', stiffness: 200, damping: 28, duration: 1.5 }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 20, fontWeight: 800, color }}>{Math.round(value)}%</span>
      </div>
    </div>
  );
}
