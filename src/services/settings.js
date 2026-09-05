import { api } from './api';

export const settingsService = {
  async getAll() {
    return api.get('/settings');
  },

  async get(key) {
    return api.get(`/settings/${key}`);
  },

  async update(key, value) {
    return api.put(`/settings/${key}`, { value });
  }
};
