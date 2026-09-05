import { api } from './api';

export const certificateService = {
  async getAll() {
    return api.get('/certificates');
  },

  async create(data) {
    return api.post('/certificates', data);
  },

  async update(id, data) {
    return api.put(`/certificates/${id}`, data);
  },

  async delete(id) {
    return api.delete(`/certificates/${id}`);
  }
};
