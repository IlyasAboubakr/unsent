import React from 'react'
import { motion } from 'framer-motion'
import useDarkMode from '../store/useDarkMode'

const MoonIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
)

const SunIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
)

export default function Navbar({ postCount }) {
  const { dark, toggle } = useDarkMode()

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 30, width: '100%' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        padding: '16px 72px',
      }}>
        {/* Logo — absolutely centered */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
        >
          <h1 style={{
            fontFamily: 'Outfit, sans-serif',
            color: 'var(--text-primary)',
            fontSize: '1.75rem',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            margin: 0,
            lineHeight: 1.2
          }}>
            unsent<span style={{ color: 'var(--accent)' }}>.</span>
          </h1>

          {/* Live indicator + post count */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
            {/* Pulsing live dot */}
            <span style={{ position: 'relative', display: 'inline-flex' }}>
              <span style={{
                width: '6px', height: '6px', borderRadius: '50%',
                background: '#22c55e', display: 'block',
              }} />
              <span style={{
                position: 'absolute', inset: 0, borderRadius: '50%',
                background: '#22c55e', animation: 'live-ping 1.8s ease-out infinite',
              }} />
            </span>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.68rem', margin: 0, letterSpacing: '0.04em' }}>
              {postCount != null && postCount > 0
                ? `${postCount.toLocaleString()} message${postCount === 1 ? '' : 's'} in the void`
                : 'anonymous messages to no one'}
            </p>
          </div>
        </motion.div>

        {/* Dark mode toggle — fixed to right edge */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          onClick={toggle}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={{
            position: 'fixed',
            right: '24px',
            top: '16px',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            color: 'var(--text-secondary)',
            boxShadow: 'var(--shadow-card)',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 50,
          }}
          aria-label="Toggle dark mode"
          id="dark-mode-toggle"
        >
          <motion.div
            key={dark ? 'sun' : 'moon'}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {dark ? <SunIcon /> : <MoonIcon />}
          </motion.div>
        </motion.button>
      </div>
    </header>
  )
}
