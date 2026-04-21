import React from 'react'
import { motion } from 'framer-motion'

export default function LoadingSkeleton() {
  return (
    <>
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card p-5 mb-4 sm:p-6 sm:mb-6 flex flex-col gap-4 w-full"
        >
          <div className="skeleton h-4 w-3/4" />
          <div className="skeleton h-4 w-1/2" />
          <div className="skeleton h-4 w-5/6" />
          <div className="skeleton h-6 w-20 mt-2" style={{ borderRadius: '6px' }} />
        </motion.div>
      ))}
    </>
  )
}
