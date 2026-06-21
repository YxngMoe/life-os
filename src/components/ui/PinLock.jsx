import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { PIN } from '../../data/defaults';
import AmbientGlow from './AmbientGlow';
import BuildBadge from './BuildBadge';

export default function PinLock({ onUnlock }) {
  const [digits, setDigits] = useState([]);
  const [shake, setShake] = useState(false);
  const [error, setError] = useState(false);
  const inputRef = useRef(null);

  function trySubmit(str) {
    if (str.length !== 4) return;
    if (str === PIN) setTimeout(onUnlock, 150);
    else {
      setShake(true);
      setError(true);
      if (navigator.vibrate) navigator.vibrate(200);
      setTimeout(() => { setDigits([]); setShake(false); setError(false); }, 500);
    }
  }

  function press(key) {
    if (key === '⌫') { setDigits((d) => d.slice(0, -1)); return; }
    if (digits.length >= 4) return;
    const next = [...digits, key];
    setDigits(next);
    if (next.length === 4) trySubmit(next.join(''));
  }

  return (
    <div className="pin-screen">
      <AmbientGlow />
      <motion.div
        className="glass-card glass-card--elevated glass-card--neon"
        style={{ padding: '44px 32px', maxWidth: 340, width: '100%', textAlign: 'center', zIndex: 1 }}
        initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
      >
        <div className="sidebar-m" style={{ margin: '0 auto 20px', width: 48, height: 48, fontSize: 18 }}>M</div>
        <h1 className="text-display gradient-text" style={{ fontSize: 28 }}>Neural OS</h1>
        <p className="text-micro text-secondary" style={{ marginTop: 10 }}>Mohamed&apos;s AI Operating System · 2032</p>

        <input ref={inputRef} type="password" inputMode="numeric" autoFocus
          style={{ position: 'absolute', opacity: 0, width: 1, height: 1 }}
          onChange={(e) => { const v = e.target.value.replace(/\D/g, '').slice(0, 4); setDigits(v.split('')); if (v.length === 4) trySubmit(v); }}
        />

        <div className={`pin-dots ${shake ? 'pin-shake' : ''}`}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={`pin-dot ${error ? 'error' : digits[i] !== undefined ? 'filled' : ''}`} />
          ))}
        </div>

        <div className="pin-pad">
          {['1','2','3','4','5','6','7','8','9','','0','⌫'].map((k, i) =>
            k === '' ? <div key={i} /> : (
              <button key={i} type="button" onClick={() => press(k)}>{k}</button>
            )
          )}
        </div>
        {error && <p style={{ color: 'var(--rose)', fontSize: 13, marginTop: 16, fontWeight: 600 }}>Incorrect PIN</p>}
        <div style={{ marginTop: 24 }}>
          <BuildBadge variant="compact" />
        </div>
      </motion.div>
    </div>
  );
}
