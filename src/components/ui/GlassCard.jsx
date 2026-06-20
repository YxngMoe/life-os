import { motion } from 'framer-motion';

const spring = { type: 'spring', stiffness: 400, damping: 35 };

export default function GlassCard({
  children,
  className = '',
  elevated = false,
  accentColor,
  checked = false,
  doneGreen = false,
  onClick,
  style,
  hover = false,
}) {
  const classes = [
    'glass-card',
    elevated && 'glass-card--elevated',
    accentColor && 'glass-card--accent-left',
    checked && 'glass-card--checked',
    doneGreen && 'glass-card--done-green',
    className,
  ].filter(Boolean).join(' ');

  const cardStyle = {
    ...style,
    ...(accentColor ? { '--card-accent': accentColor } : {}),
  };

  const Component = onClick || hover ? motion.div : 'div';
  const motionProps = onClick || hover ? {
    onClick,
    whileHover: hover ? { y: -3, transition: spring } : undefined,
    whileTap: onClick ? { scale: 0.98, transition: { duration: 0.08 } } : undefined,
    style: { cursor: onClick ? 'pointer' : undefined, ...cardStyle },
  } : { style: cardStyle };

  return (
    <Component className={classes} {...motionProps}>
      {children}
    </Component>
  );
}
