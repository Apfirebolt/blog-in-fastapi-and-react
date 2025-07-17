import axios from "axios";
import type { BlogPost, ApiResponse } from "../../types/Blog";

const API_URL = "http://localhost:8000/blog/";


// Create new post
const createBlog = async (
  postData: Omit<BlogPost, "id" | "createdAt" | "updatedAt">,
  token: string
): Promise<BlogPost> => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post<BlogPost>(API_URL, postData, config);

  return response.data;
};

// Get user blog posts
const getPosts = async (token: string): Promise<BlogPost[]> => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get<BlogPost[]>(API_URL, config);
  return response.data;
};

// Delete a post
const deletePost = async (token: string, postId: string): Promise<any> => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.delete(API_URL + postId, config);
  return response.data;
};

// Update a post
const updatePost = async (
  postId: string,
  postData: Omit<BlogPost, "id" | "createdAt" | "updatedAt">,
  token: string
): Promise<BlogPost> => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put<BlogPost>(API_URL + postId, postData, config);
  return response.data;
};

// Get single post
const getSinglePost = async (token: string, postId: string): Promise<BlogPost> => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get<BlogPost>(API_URL + postId, config);
  return response.data;
};

// Post a comment on a blog post
const postComment = async (
  postId: string,
  commentData: { content: string },
  token: string
): Promise<any> => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(`${API_URL}${postId}/comments`, commentData, config);
  return response.data;
};

const deleteComment = async (
  postId: string,
  commentId: string,
  token: string
): Promise<any> => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.delete(`${API_URL}${postId}/comments/${commentId}`, config);
  return response.data;
};

const updateComment = async (
  postId: string,
  commentId: string,
  commentData: { content: string },
  token: string
): Promise<any> => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(`${API_URL}${postId}/comments/${commentId}`, commentData, config);
  return response.data;
};

const blogService = {
  createBlog,
  getPosts,
  deletePost,
  updatePost,
  getSinglePost,
  postComment,
  deleteComment,
  updateComment,
};

export default blogService;
