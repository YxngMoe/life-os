import { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

export default function CountUp({ value, duration = 1.4, className = '', style = {} }) {
  const spring = useSpring(0, { stiffness: 80, damping: 20 });
  const display = useTransform(spring, (v) => Math.round(v));
  const [shown, setShown] = useState(0);

  useEffect(() => {
    spring.set(value);
    const unsub = display.on('change', (v) => setShown(v));
    return unsub;
  }, [value, spring, display]);

  return <motion.span className={className} style={style}>{shown}</motion.span>;
}
