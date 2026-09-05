/**
 * ================================================
 * RECYCLE BIN SERVICE
 * ================================================
 */

import { api } from './api';

export const recycleBinService = {
  /**
   * List semua item yang dihapus (soft deleted)
   */
  async getAll() {
    const data = await api.get('/recycle-bin');
    return data;
  },

  /**
   * Restore item(s) - single atau bulk
   * @param {Array} items - [{ entity, id }, ...]
   */
  async restore(items) {
    const data = await api.post('/recycle-bin/restore', { items });
    return data;
  },

  /**
   * Restore single item
   * @param {string} entity - table name
   * @param {number} id - item id
   */
  async restoreOne(entity, id) {
    const data = await api.post('/recycle-bin/restore', { entity, id });
    return data;
  },

  /**
   * Permanent delete item(s) - single atau bulk
   * @param {Array} items - [{ entity, id }, ...]
   */
  async permanentDelete(items) {
    const data = await api.delete('/recycle-bin/permanent', { items });
    return data;
  },

  /**
   * Permanent delete single item
   */
  async permanentDeleteOne(entity, id) {
    const data = await api.delete('/recycle-bin/permanent', { entity, id });
    return data;
  },

  /**
   * Empty seluruh recycle bin
   */
  async empty() {
    const data = await api.post('/recycle-bin/empty');
    return data;
  }
};
