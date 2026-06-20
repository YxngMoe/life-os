import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { PIN } from '../../data/defaults';

export default function PinLock({ onUnlock, title = 'Life OS', subtitle = 'Enter PIN to continue' }) {
  const [digits, setDigits] = useState([]);
  const [shake, setShake] = useState(false);
  const inputRef = useRef(null);

  function trySubmit(str) {
    if (str.length !== 4) return;
    if (str === PIN) {
      setTimeout(onUnlock, 120);
    } else {
      setShake(true);
      setTimeout(() => { setDigits([]); setShake(false); }, 500);
    }
  }

  function press(key) {
    if (key === '⌫') {
      setDigits((d) => d.slice(0, -1));
      return;
    }
    if (digits.length >= 4) return;
    const next = [...digits, key];
    setDigits(next);
    if (next.length === 4) trySubmit(next.join(''));
  }

  function handleInput(e) {
    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
    setDigits(val.split(''));
    if (val.length === 4) trySubmit(val);
  }

  return (
    <div className="pin-screen" onClick={() => inputRef.current?.focus()}>
      <motion.div
        className="glass-card glass-card--elevated"
        style={{ padding: '40px 28px', maxWidth: 320, width: '100%', textAlign: 'center' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 35 }}
      >
        <div className="sidebar-monogram" style={{ margin: '0 auto 16px' }}>M</div>
        <h1 className="text-title2 gradient-text">{title}</h1>
        <p className="text-caption text-secondary" style={{ marginTop: 8 }}>{subtitle}</p>

        <input
          ref={inputRef}
          type="password"
          inputMode="numeric"
          value={digits.join('')}
          onChange={handleInput}
          autoFocus
          style={{ position: 'absolute', opacity: 0, width: 1, height: 1 }}
        />

        <div className={`pin-dots ${shake ? 'pin-shake' : ''}`}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={`pin-dot ${digits[i] !== undefined ? 'filled' : ''}`} />
          ))}
        </div>

        <div className="pin-pad">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'].map((k, i) =>
            k === '' ? <div key={i} /> : (
              <button key={i} type="button" onClick={() => press(k)}>{k}</button>
            )
          )}
        </div>

        {shake && <p style={{ color: 'var(--accent-rose)', fontSize: 13, marginTop: 16, fontWeight: 600 }}>Incorrect PIN</p>}
      </motion.div>
    </div>
  );
}
