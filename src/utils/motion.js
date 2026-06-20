export const spring = { type: 'spring', stiffness: 400, damping: 35 };
export const springGentle = { type: 'spring', stiffness: 280, damping: 30 };
export const springSheet = { type: 'spring', stiffness: 380, damping: 36 };

export const screenEnter = {
  initial: { opacity: 0, y: 20, filter: 'blur(6px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  transition: { type: 'spring', stiffness: 380, damping: 32 },
};

export const stagger = (i) => ({ delay: i * 0.045 });

export const cardHover = {
  whileHover: { y: -4, transition: { type: 'spring', stiffness: 400, damping: 28 } },
  whileTap: { scale: 0.96, transition: { duration: 0.08 } },
};
