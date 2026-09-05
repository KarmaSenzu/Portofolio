import { api } from './api';

export const skillService = {
  async getAll(category) {
    const query = category ? `?category=${category}` : '';
    return api.get(`/skills${query}`);
  },

  async create(data) {
    return api.post('/skills', data);
  },

  async update(id, data) {
    return api.put(`/skills/${id}`, data);
  },

  async delete(id) {
    return api.delete(`/skills/${id}`);
  }
};
