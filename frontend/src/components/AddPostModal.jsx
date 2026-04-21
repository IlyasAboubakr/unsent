import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createPost } from '../api/posts'

const MAX_CHARS = 500

export default function AddPostModal({ isOpen, onClose, onPostCreated }) {
  const [text, setText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [cooldown, setCooldown] = useState(0)   // seconds remaining
  const cooldownRef = React.useRef(null)

  // Start a 20-second cooldown after posting
  const startCooldown = () => {
    setCooldown(20)
    const tick = () => {
      setCooldown(prev => {
        if (prev <= 1) { clearInterval(cooldownRef.current); return 0 }
        return prev - 1
      })
    }
    cooldownRef.current = setInterval(tick, 1000)
  }

  React.useEffect(() => () => clearInterval(cooldownRef.current), [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!text.trim() || cooldown > 0) return

    setIsSubmitting(true)
    setError(null)
    try {
      const newPost = await createPost(text)
      setText('')
      onPostCreated(newPost)
      onClose()
      startCooldown()
    } catch (err) {
      if (err?.response?.status === 429) {
        setError('Slow down — too many messages. Wait a moment.')
      } else {
        setError('Something went wrong. Try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const remaining = MAX_CHARS - text.length
  const isOverLimit = remaining < 0
  const isNearLimit = remaining <= 60 && !isOverLimit

  return (
    <AnimatePresence>
      {isOpen && (
        <React.Fragment key="modal-overlay">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.55)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              zIndex: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
            }}
          >
            {/* Modal Panel */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
              style={{
                background: 'var(--modal-bg)',
                border: '1px solid transparent',
                borderRadius: '20px',
                boxShadow: '0 8px 32px rgba(139,92,246,0.15), 0 32px 64px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.1)',
                backdropFilter: 'blur(28px)',
                WebkitBackdropFilter: 'blur(28px)',
                width: '100%',
                maxWidth: '520px',
              }}
            >
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                {/* Header */}
                <div style={{ padding: '24px 24px 0' }}>
                  <h2 style={{
                    color: 'var(--text-primary)',
                    fontSize: '1.15rem',
                    fontWeight: 600,
                    textAlign: 'center',
                    margin: '0 0 16px 0',
                    fontFamily: 'Outfit, sans-serif'
                  }}>
                    Write a message
                  </h2>

                  <textarea
                    autoFocus
                    rows={5}
                    placeholder="Type whatever is on your mind..."
                    value={text}
                    onChange={e => setText(e.target.value.slice(0, MAX_CHARS + 20))}
                    disabled={isSubmitting}
                    style={{
                      width: '100%',
                      background: 'transparent',
                      outline: 'none',
                      border: '1px solid var(--border)',
                      borderRadius: '6px',
                      padding: '12px',
                      resize: 'none',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '1rem',
                      lineHeight: '1.7',
                      color: 'var(--text-primary)',
                      caretColor: 'var(--accent)',
                    }}
                  />

                  {/* Character count */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginTop: '6px',
                    marginBottom: '12px',
                  }}>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      color: isOverLimit ? '#ef4444' : isNearLimit ? '#f59e0b' : 'var(--text-muted)',
                      transition: 'color 0.2s ease',
                    }}>
                      {remaining < 100 ? `${remaining} left` : ''}
                    </span>
                  </div>
                </div>

                {/* Error message */}
                {error && (
                  <div style={{
                    margin: '0 24px 8px',
                    padding: '10px 14px',
                    background: 'rgba(239,68,68,0.1)',
                    border: '1px solid rgba(239,68,68,0.25)',
                    borderRadius: '8px',
                    color: '#ef4444',
                    fontSize: '0.82rem',
                    textAlign: 'center',
                  }}>
                    {error}
                  </div>
                )}

                {/* Footer */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '12px',
                  padding: '12px 24px 20px',
                  borderTop: '1px solid var(--border)'
                }}>
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isSubmitting}
                    style={{
                      padding: '10px 20px',
                      color: 'var(--text-secondary)',
                      background: 'transparent',
                      border: '1px solid var(--border)',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.9rem',
                      fontWeight: 500,
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!text.trim() || isSubmitting || isOverLimit || cooldown > 0}
                    style={{
                      padding: '10px 24px',
                      background: (isOverLimit || cooldown > 0) ? '#6b7280' : 'var(--accent)',
                      color: 'white',
                      border: '2px solid transparent',
                      borderRadius: '4px',
                      cursor: (!text.trim() || isSubmitting || isOverLimit || cooldown > 0) ? 'not-allowed' : 'pointer',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      boxShadow: (isOverLimit || cooldown > 0) ? 'none' : '0 4px 14px var(--accent-glow)',
                      opacity: (!text.trim() || isSubmitting) ? 0.5 : 1,
                      transition: 'all 0.2s ease',
                      minWidth: '160px',
                    }}
                  >
                    {isSubmitting ? 'Sending...' : cooldown > 0 ? `Wait ${cooldown}s...` : 'Send into the void'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </React.Fragment>
      )}
    </AnimatePresence>
  )
}
