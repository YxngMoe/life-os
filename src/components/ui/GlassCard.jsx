import { motion } from 'framer-motion';
import { cardHover } from '../../utils/motion';

export default function GlassCard({
  children, className = '', elevated = false, accentColor,
  checked = false, doneGreen = false, focusGlow = false,
  onClick, style, hover = false, index = 0,
}) {
  const classes = [
    'glass-card',
    elevated && 'glass-card--elevated',
    accentColor && 'glass-card--accent-left',
    checked && 'glass-card--checked',
    doneGreen && 'glass-card--done-green',
    focusGlow && 'glass-card--focus-glow',
    (hover || onClick) && 'glass-card--hover',
    className,
  ].filter(Boolean).join(' ');

  const cardStyle = {
    ...style,
    ...(accentColor ? { '--card-accent': accentColor } : {}),
  };

  if (onClick || hover) {
    return (
      <motion.div
        className={classes}
        style={{ cursor: onClick ? 'pointer' : undefined, ...cardStyle }}
        onClick={onClick}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 380, damping: 32, delay: index * 0.045 }}
        {...cardHover}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={classes}
      style={cardStyle}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 380, damping: 32, delay: index * 0.045 }}
    >
      {children}
    </motion.div>
  );
}
