import axios from 'axios'

const API_URL = 'http://localhost:8000/blog/'

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
  return response.data
}

// Delete a post
const deletePost = async (token, postId) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.delete(API_URL + postId, config)
  return response.data
}

const blogService = {
  createBlog,
  getPosts,
  deletePost
}

export default blogService
