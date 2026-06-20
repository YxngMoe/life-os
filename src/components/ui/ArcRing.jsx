import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function ArcRing({ value = 0, size = 64, stroke = 5, color = '#6366f1', label }) {
  const [animated, setAnimated] = useState(0);
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animated / 100) * circumference;

  useEffect(() => {
    const t = setTimeout(() => setAnimated(Math.min(100, Math.max(0, value))), 80);
    return () => clearTimeout(t);
  }, [value]);

  return (
    <div style={{ position: 'relative', width: size, height: size, margin: '0 auto' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ type: 'spring', stiffness: 280, damping: 30, duration: 0.6 }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: size * 0.22, fontWeight: 800, color }}>{Math.round(value)}%</span>
        {label && <span className="text-micro text-tertiary" style={{ fontSize: 8 }}>{label}</span>}
      </div>
    </div>
  );
}
