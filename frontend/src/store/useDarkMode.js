import { create } from 'zustand'

const useDarkMode = create((set, get) => ({
  dark: localStorage.getItem('unsent-theme') === 'dark',
  toggle: () => {
    const next = !get().dark
    localStorage.setItem('unsent-theme', next ? 'dark' : 'light')
    document.documentElement.setAttribute('data-theme', next ? 'dark' : '')
    set({ dark: next })
  },
  init: () => {
    const stored = localStorage.getItem('unsent-theme') || 'dark'
    const isDark = stored === 'dark'
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : '')
    set({ dark: isDark })
  },
}))

export default useDarkMode
