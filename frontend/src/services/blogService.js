import api from './api';

const blogService = {
  // Get all blogs with pagination
  getAllBlogs: async () => {
    try {
      const response = await api.get('/blogs');
      return response.data;
    } catch (error) {
      throw new Error('Error fetching blogs: ' + error.message);
    }
  },

  // Get a specific blog by ID
  getBlogById: async (blogId) => {
    try {
      const response = await api.get(`/blogs/${blogId}`);
      return response.data;
    } catch (error) {
      throw new Error('Error fetching blog details: ' + error.message);
    }
  },

  // Get blogs by current user
  getUserBlogs: async () => {
    try {
      const response = await api.get('/my-blogs');
      return response.data;
    } catch (error) {
      throw new Error('Error fetching your blogs: ' + error.message);
    }
  },

  // Create a new blog
  createBlog: async (blogData) => {
    try {
      // Use FormData for handling file uploads
      const formData = new FormData();
      
      // Append text fields
      formData.append('title', blogData.title);
      formData.append('content', blogData.content);
      if (blogData.published !== undefined) {
        // Convert boolean to string '1' or '0' for proper boolean handling in FormData
        formData.append('published', blogData.published ? 1 : 0);
      }
      
      // Append image if exists
      if (blogData.image) {
        formData.append('image', blogData.image);
      }
      
      const response = await api.post('/blogs', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      throw new Error('Error creating blog: ' + error.message);
    }
  },

  // Update an existing blog
  updateBlog: async (blogId, blogData) => {
    try {
      // Use FormData for handling file uploads
      const formData = new FormData();
      
      // Append text fields
      formData.append('title', blogData.title);
      formData.append('content', blogData.content);
      if (blogData.published !== undefined) {
        // Convert boolean to string '1' or '0' for proper boolean handling in FormData
        formData.append('published', blogData.published ? 1 : 0);
      }
      
      // Append image if exists
      if (blogData.image) {
        formData.append('image', blogData.image);
      }
      
      const response = await api.post(`/blogs/${blogId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        _method: 'PUT' // Laravel's way of handling PUT with FormData
      });
      
      return response.data;
    } catch (error) {
      throw new Error('Error updating blog: ' + error.message);
    }
  },

  // Delete a blog
  deleteBlog: async (blogId) => {
    try {
      const response = await api.delete(`/blogs/${blogId}`);
      return response.data;
    } catch (error) {
      throw new Error('Error deleting blog: ' + error.message);
    }
  },

  // Like or unlike a blog
  likeBlog: async (blogId) => {
    try {
      const response = await api.post(`/blogs/${blogId}/like`);
      return response.data;
    } catch (error) {
      throw new Error('Error liking blog: ' + error.message);
    }
  },

  // Add a comment to a blog
  addComment: async (blogId, commentContent) => {
    try {
      const response = await api.post(`/blogs/${blogId}/comments`, {
        content: commentContent
      });
      return response.data;
    } catch (error) {
      throw new Error('Error adding comment: ' + error.message);
    }
  }
};

export default blogService;