import { api } from './api';

export const experienceService = {
  async getAll(type) {
    const query = type ? `?type=${type}` : '';
    return api.get(`/experiences${query}`);
  },

  async create(data) {
    return api.post('/experiences', data);
  },

  async update(id, data) {
    return api.put(`/experiences/${id}`, data);
  },

  async delete(id) {
    return api.delete(`/experiences/${id}`);
  }
};
