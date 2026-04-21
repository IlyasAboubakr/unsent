import React, { useState, useEffect, useRef } from 'react'
import { useInView } from 'react-intersection-observer'
import { motion, AnimatePresence } from 'framer-motion'
import { fetchPosts } from '../api/posts'
import PostCard from './PostCard'
import LoadingSkeleton from './LoadingSkeleton'
import EmptyState from './EmptyState'

const POLL_INTERVAL = 5000

export default function PostFeed({ posts, setPosts, setTotalPosts }) {
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [isFetchingMore, setIsFetchingMore] = useState(false)
  
  const newestIdRef = useRef(null)
  const { ref, inView } = useInView({ rootMargin: '200px' })

  // ── Sync newest ID whenever posts change (manual post or fetch) ───────────
  useEffect(() => {
    if (posts.length > 0) {
      // Keep track of the absolute latest post we have
      if (!newestIdRef.current || posts[0]._id > newestIdRef.current) {
        newestIdRef.current = posts[0]._id
      }
    }
  }, [posts])

  // ── Initial load ──────────────────────────────────────────────────────────
  useEffect(() => {
    const loadInitial = async () => {
      setIsLoading(true)
      try {
        const data = await fetchPosts(1, 10)
        setPosts(data.posts)
        if (setTotalPosts && data.total != null) setTotalPosts(data.total)
        setHasMore(data.hasMore)
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    loadInitial()
  }, [setPosts])

  // ── Live poll: auto-prepend new posts ─────────────────────────────────────
  useEffect(() => {
    const poll = async () => {
      if (!newestIdRef.current) return
      try {
        const data = await fetchPosts(1, 20)
        if (setTotalPosts && data.total != null) setTotalPosts(data.total)
        const brandNew = data.posts.filter(p => p._id > newestIdRef.current)
        if (brandNew.length > 0) {
          setPosts(prev => {
            const seen = new Set(prev.map(p => p._id))
            return [...brandNew.filter(p => !seen.has(p._id)), ...prev]
          })
        }
      } catch (_) { /* silent */ }
    }
    const timer = setInterval(poll, POLL_INTERVAL)
    return () => clearInterval(timer)
  }, [setPosts])

  // ── Infinite scroll ───────────────────────────────────────────────────────
  useEffect(() => {
    if (inView && hasMore && !isLoading && !isFetchingMore) {
      const loadMore = async () => {
        setIsFetchingMore(true)
        try {
          const nextPage = page + 1
          const data = await fetchPosts(nextPage, 10)
          if (setTotalPosts && data.total != null) setTotalPosts(data.total)
          setPosts(prev => {
            const seen = new Set(prev.map(p => p._id))
            return [...prev, ...data.posts.filter(p => !seen.has(p._id))]
          })
          setPage(nextPage)
          setHasMore(data.hasMore)
        } catch (err) {
          console.error(err)
        } finally {
          setIsFetchingMore(false)
        }
      }
      loadMore()
    }
  }, [inView, hasMore, isLoading, isFetchingMore, page, setPosts])

  // ── Render ────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div style={{ width: '100%', paddingTop: '16px' }}>
        <LoadingSkeleton />
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div style={{ width: '100%', paddingTop: '60px' }}>
        <EmptyState />
      </div>
    )
  }

  return (
    <div style={{ width: '100%', scrollSnapType: 'y proximity' }}>
      <AnimatePresence mode="popLayout">
        {posts.map(post => (
          <PostCard key={post._id} post={post} />
        ))}
      </AnimatePresence>

      {hasMore && (
        <div ref={ref} style={{ padding: '32px 0' }}>
          <LoadingSkeleton />
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          style={{ padding: '48px 0', textAlign: 'center', color: 'var(--text-muted)' }}
        >
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--border)', margin: '0 auto 16px' }} />
          you've reached the void
        </motion.div>
      )}
    </div>
  )
}
