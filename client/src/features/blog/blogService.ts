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

const blogService = {
  createBlog,
  getPosts,
  deletePost,
};

export default blogService;
