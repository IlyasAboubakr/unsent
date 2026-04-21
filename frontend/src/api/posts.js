import axios from 'axios'

const BASE = `${import.meta.env.VITE_API_URL || ''}/posts`

export const fetchPosts = async (page = 1, limit = 10) => {
  const { data } = await axios.get(BASE, { params: { page, limit } })
  return data
}

export const createPost = async (text) => {
  const { data } = await axios.post(BASE, { text })
  return data
}
