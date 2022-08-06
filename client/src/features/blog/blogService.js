import axios from 'axios'

const API_URL = 'http://localhost:8000/blog'

// Create new post
const createBlog = async (postData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.post(API_URL, postData, config)

  return response.data
}

// Get user blog posts
const getPosts = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.get(API_URL, config)
  console.log('Response is ', response)
  return response.data
}

const blogService = {
  createBlog,
  getPosts,
}

export default blogService
