import React from 'react'
import { motion } from 'framer-motion'

export default function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 16px', textAlign: 'center' }}
    >
      {/* Animated floating icon */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          width: '72px',
          height: '72px',
          borderRadius: '20px',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          boxShadow: '0 8px 32px var(--accent-glow)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px',
        }}
      >
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent)', opacity: 0.8 }}>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </motion.div>

      <h3 style={{ color: 'var(--text-primary)', fontSize: '1.2rem', fontWeight: 600, marginBottom: '8px', fontFamily: 'Outfit, sans-serif' }}>
        The void is silent.
      </h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, maxWidth: '240px' }}>
        No messages yet. Be the first to say something into the dark.
      </p>

      {/* Decorative dots */}
      <div style={{ display: 'flex', gap: '6px', marginTop: '32px' }}>
        {[0, 0.3, 0.6].map((delay, i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.2, 0.7, 0.2] }}
            transition={{ duration: 1.8, repeat: Infinity, delay }}
            style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)', opacity: 0.3 }}
          />
        ))}
      </div>
    </motion.div>
  )
}
