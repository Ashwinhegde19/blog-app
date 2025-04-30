import apiClient from './api';
import { User } from './auth.service';

export interface BlogPost {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  author: User;
}

export interface CreateBlogData {
  title: string;
  content: string;
}

export interface BlogsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: BlogPost[];
}

const BlogService = {
  getAllBlogs: async (page = 1): Promise<BlogsResponse> => {
    // Make sure to use trailing slashes with Django - we're requesting /api/blog/posts/ not /api/blog/posts
    const response = await apiClient.get(`blog/posts/?page=${page}`);
    return response.data;
  },

  getBlogById: async (id: number): Promise<BlogPost> => {
    const response = await apiClient.get(`blog/posts/${id}/`);
    return response.data;
  },

  createBlog: async (data: CreateBlogData): Promise<BlogPost> => {
    const response = await apiClient.post('blog/posts/', data);
    return response.data;
  },

  updateBlog: async (id: number, data: CreateBlogData): Promise<BlogPost> => {
    const response = await apiClient.put(`blog/posts/${id}/`, data);
    return response.data;
  },

  deleteBlog: async (id: number): Promise<void> => {
    await apiClient.delete(`blog/posts/${id}/`);
  },
};

export default BlogService