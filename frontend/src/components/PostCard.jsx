import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const MAX_LINES = 6

export default function PostCard({ post }) {
  const date = new Date(post.createdAt)
  const [expanded, setExpanded] = useState(false)

  // Brand new if rendered within 8 seconds of creation
  const [isBrandNew] = useState(() => (Date.now() - date.getTime()) < 8000)

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
  const minsDiff = Math.round((date.getTime() - Date.now()) / (1000 * 60))
  const hrsDiff  = Math.round((date.getTime() - Date.now()) / (1000 * 60 * 60))
  const daysDiff = Math.round((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24))

  let timeString = ''
  if (Math.abs(minsDiff) < 1)       timeString = 'Just now'
  else if (Math.abs(minsDiff) < 60) timeString = rtf.format(minsDiff, 'minute')
  else if (Math.abs(hrsDiff) < 24)  timeString = rtf.format(hrsDiff, 'hour')
  else                               timeString = rtf.format(daysDiff, 'day')

  const lineCount = (post.text.match(/\n/g) || []).length + 1
  const isLong = lineCount > MAX_LINES || post.text.length > 320
  const needsExpand = isLong && !expanded

  const { ref, inView } = useInView({ threshold: 0.5 })

  return (
    <motion.div
      ref={ref}
      initial={isBrandNew ? { opacity: 0, y: -50, scale: 0.95 } : { opacity: 0, y: 20 }}
      animate={{
        opacity: inView ? 1 : 0.3,
        scale:   inView ? 1.015 : 0.97,
        y: 0,
      }}
      transition={isBrandNew
        ? { type: 'spring', stiffness: 260, damping: 22, mass: 0.9 }
        : { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }
      }
      style={{ scrollSnapAlign: 'center', marginBottom: '16px', willChange: 'transform, opacity' }}
      className={`card w-full ${isBrandNew ? 'new-glow-anim' : ''}`}
    >
      {/* Inner content with generous padding so text never touches borders */}
      <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
        
        {/* Message text — centered, never touching the edges */}
        <div style={{ position: 'relative', width: '100%' }}>
          <p
            className="text-base whitespace-pre-wrap leading-relaxed break-words"
            style={{
              color: 'var(--text-primary)',
              textAlign: 'center',
              display: '-webkit-box',
              WebkitLineClamp: needsExpand ? MAX_LINES : 'unset',
              WebkitBoxOrient: 'vertical',
              overflow: needsExpand ? 'hidden' : 'visible',
              margin: 0,
            }}
          >
            {post.text}
          </p>

          {/* Fade-out overlay when clamped */}
          {needsExpand && (
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: '10%',
              right: '10%',
              height: '48px',
              background: 'linear-gradient(to bottom, transparent, var(--surface))',
              pointerEvents: 'none',
            }} />
          )}
        </div>

        {/* Read more / less */}
        {isLong && (
          <button
            onClick={() => setExpanded(e => !e)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--accent)',
              fontSize: '0.78rem',
              fontWeight: 600,
              padding: 0,
              opacity: 0.8,
            }}
          >
            {expanded ? '↑ show less' : '↓ read more'}
          </button>
        )}

        {/* Timestamp */}
        <span style={{
          fontSize: '0.7rem',
          fontWeight: 500,
          color: 'var(--text-muted)',
          letterSpacing: '0.03em',
        }}>
          {timeString}
        </span>
      </div>
    </motion.div>
  )
}
