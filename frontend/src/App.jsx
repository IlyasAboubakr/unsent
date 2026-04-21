import React, { useState, useEffect } from 'react'
import useDarkMode from './store/useDarkMode'
import Navbar from './components/Navbar'
import BackgroundBlobs from './components/BackgroundBlobs'
import PostFeed from './components/PostFeed'
import FloatingAddButton from './components/FloatingAddButton'
import AddPostModal from './components/AddPostModal'

function App() {
  const initDarkMode = useDarkMode(state => state.init)
  const [posts, setPosts] = useState([])
  const [totalPosts, setTotalPosts] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    initDarkMode()
  }, [initDarkMode])

  const handlePostCreated = (newPost) => {
    setPosts(prev => [newPost, ...prev])
    setTotalPosts(prev => prev + 1)
  }

  return (
    <div className="app-bg" style={{ minHeight: '100dvh', paddingBottom: '80px' }}>
      <BackgroundBlobs />

      {/* Content layer */}
      <div style={{ position: 'relative', zIndex: 10, width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Navbar postCount={totalPosts > 0 ? totalPosts : posts.length} />

        {/* Feed — centered with max width */}
        <main style={{ width: '100%', maxWidth: '640px', padding: '16px 16px 96px' }}>
          <PostFeed posts={posts} setPosts={setPosts} setTotalPosts={setTotalPosts} />
        </main>
      </div>

      <FloatingAddButton
        isModalOpen={isModalOpen}
        onClick={() => setIsModalOpen(true)}
      />

      <AddPostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPostCreated={handlePostCreated}
      />
    </div>
  )
}

export default App
