/**
 * ================================================
 * API CLIENT - Optimized with Caching
 * ================================================
 * Performance features:
 * - TTL cache for GET requests (5 minutes)
 * - Stale-while-revalidate pattern
 * - Instant navigation (no spinner on revisit)
 * ================================================
 */

const API_BASE = import.meta.env.VITE_API_URL || '/api';

// Cache storage untuk GET requests
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

class ApiClient {
  constructor() {
    this.baseUrl = API_BASE;
  }

  getToken() {
    return localStorage.getItem('portfolio_token');
  }

  /**
   * Check cache untuk GET request
   * Returns cached data if fresh, triggers background revalidate if stale
   */
  checkCache(endpoint) {
    const hit = cache.get(endpoint);
    if (!hit) return null;

    if (Date.now() < hit.expires) {
      // Fresh - return instantly (but NOT if it's an empty array - might be stale)
      if (Array.isArray(hit.data) && hit.data.length === 0) {
        cache.delete(endpoint);
        return null;
      }
      return hit.data;
    }

    // Stale - return stale data, revalidate in background
    this.fetchFromNetwork(endpoint)
      .then(data => {
        // Don't cache empty arrays
        if (!Array.isArray(data) || data.length > 0) {
          cache.set(endpoint, { data, expires: Date.now() + CACHE_TTL });
        }
      })
      .catch(() => {});

    return hit.data;
  }

  async fetchFromNetwork(endpoint) {
    const url = `${this.baseUrl}${endpoint}`;
    const token = this.getToken();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    };

    const response = await fetch(url, config);

    if (response.status === 401) {
      localStorage.removeItem('portfolio_token');
      localStorage.removeItem('portfolio_user');
      throw new ApiError('Unauthorized', 401);
    }

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(data.error || 'Request failed', response.status, data);
    }

    return data;
  }

  async request(endpoint, options = {}) {
    const method = options.method || 'GET';

    // Cache GET requests (unless explicitly skipped)
    if (method === 'GET' && !options.skipCache) {
      const cached = this.checkCache(endpoint);
      if (cached !== null) return cached;
    }

    const url = `${this.baseUrl}${endpoint}`;
    const token = this.getToken();

    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    };

    const response = await fetch(url, config);

    if (response.status === 401) {
      localStorage.removeItem('portfolio_token');
      localStorage.removeItem('portfolio_user');
      // Don't redirect here, let the caller handle it
      throw new ApiError('Unauthorized', 401);
    }

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(data.error || 'Request failed', response.status, data);
    }

    // Cache successful GET responses (but NOT empty arrays - they might be stale)
    if (method === 'GET' && response.ok) {
      // Don't cache empty results - they might become non-empty after data insertion
      const shouldCache = !Array.isArray(data) || data.length > 0;
      if (shouldCache) {
        cache.set(endpoint, { data, expires: Date.now() + CACHE_TTL });
      }
    }

    return data;
  }

  /**
   * Invalidate cache untuk specific pattern
   * Useful setelah create/update/delete operations
   */
  invalidateCache(pattern = '') {
    if (!pattern) {
      cache.clear();
      return;
    }
    for (const key of cache.keys()) {
      if (key.includes(pattern)) {
        cache.delete(key);
      }
    }
  }

  /**
   * Clear all cached empty arrays
   * Called on app startup to prevent stale empty results
   */
  clearEmptyCache() {
    for (const [key, hit] of cache.entries()) {
      if (Array.isArray(hit.data) && hit.data.length === 0) {
        cache.delete(key);
      }
    }
  }

  get(endpoint) {
    return this.request(endpoint);
  }

  post(endpoint, body) {
    // Invalidate cache untuk entity ini setelah mutasi
    this.invalidateCache(this._getEntityKey(endpoint));
    return this.request(endpoint, { method: 'POST', body: JSON.stringify(body) });
  }

  put(endpoint, body) {
    this.invalidateCache(this._getEntityKey(endpoint));
    return this.request(endpoint, { method: 'PUT', body: JSON.stringify(body) });
  }

  patch(endpoint, body) {
    this.invalidateCache(this._getEntityKey(endpoint));
    return this.request(endpoint, { method: 'PATCH', body: JSON.stringify(body) });
  }

  delete(endpoint, body) {
    this.invalidateCache(this._getEntityKey(endpoint));
    return this.request(endpoint, { method: 'DELETE', body: body ? JSON.stringify(body) : undefined });
  }

  /**
   * Extract entity key dari endpoint untuk cache invalidation
   * Contoh: /projects/123 → 'projects', /blog/abc → 'blog'
   */
  _getEntityKey(endpoint) {
    const parts = endpoint.replace(/^\//, '').split('/');
    return parts[0] || '';
  }

  // Special method for file uploads (no Content-Type header - let browser set it)
  async upload(endpoint, formData) {
    const url = `${this.baseUrl}${endpoint}`;
    const token = this.getToken();

    const response = await fetch(url, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) throw new ApiError(data.error || 'Upload failed', response.status, data);
    return data;
  }
}

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

export const api = new ApiClient();
export { ApiError };
