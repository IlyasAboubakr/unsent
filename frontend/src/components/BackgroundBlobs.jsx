import React from 'react'

export default function BackgroundBlobs() {
  return (
    <>
      <div 
        className="blob" 
        style={{ 
          width: '500px', 
          height: '500px', 
          background: 'var(--blob-a)', 
          top: '-10%', 
          left: '-10%',
          animationDelay: '0s'
        }} 
      />
      <div 
        className="blob" 
        style={{ 
          width: '400px', 
          height: '400px', 
          background: 'var(--blob-b)', 
          bottom: '10%', 
          right: '-5%',
          animationDelay: '-4s'
        }} 
      />
      <div 
        className="blob" 
        style={{ 
          width: '600px', 
          height: '600px', 
          background: 'var(--blob-c)', 
          top: '40%', 
          left: '30%',
          animationDelay: '-8s'
        }} 
      />
    </>
  )
}
