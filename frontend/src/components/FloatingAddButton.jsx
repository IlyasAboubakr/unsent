import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function FloatingAddButton({ onClick, isModalOpen }) {
  const [hovered, setHovered] = useState(false)

  return (
    <AnimatePresence>
      {!isModalOpen && (
        <div style={{ position: 'fixed', bottom: '32px', right: '32px', zIndex: 20, display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Tooltip */}
          <AnimatePresence>
            {hovered && (
              <motion.span
                key="tooltip"
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.15 }}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                  fontSize: '0.78rem',
                  fontWeight: 500,
                  padding: '6px 12px',
                  borderRadius: '6px',
                  whiteSpace: 'nowrap',
                  boxShadow: 'var(--shadow-card)',
                  pointerEvents: 'none',
                  backdropFilter: 'blur(12px)',
                }}
              >
                Write a message
              </motion.span>
            )}
          </AnimatePresence>

          {/* FAB Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClick}
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
            className="fab-pulse"
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--accent)',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 8px 32px var(--accent-glow)',
              flexShrink: 0,
            }}
            aria-label="Write a message"
          >
            <svg fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" style={{ width: '26px', height: '26px' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </motion.button>
        </div>
      )}
    </AnimatePresence>
  )
}
