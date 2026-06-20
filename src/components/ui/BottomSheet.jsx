import { motion, AnimatePresence } from 'framer-motion';

export default function BottomSheet({ open, onClose, title, children }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="sheet-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="sheet-panel"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
          >
            <div className="glass-card glass-card--elevated" style={{ borderRadius: '28px 28px 0 0', padding: '0 20px 24px' }}>
              <div className="sheet-handle" />
              {title && <h3 className="text-headline mb-16" style={{ textAlign: 'center' }}>{title}</h3>}
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
