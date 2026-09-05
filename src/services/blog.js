import { api } from './api';

export const blogService = {
  async getAll(filters = {}) {
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.published !== undefined) params.append('published', filters.published);
    const query = params.toString();
    return api.get(`/blog${query ? '?' + query : ''}`);
  },

  async getBySlug(slug) {
    return api.get(`/blog/${slug}`);
  },

  async create(postData) {
    return api.post('/blog', postData);
  },

  async update(id, postData) {
    return api.put(`/blog/${id}`, postData);
  },

  async delete(id) {
    return api.delete(`/blog/${id}`);
  }
};
