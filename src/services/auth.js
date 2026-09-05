/**
 * ================================================
 * AUTHENTICATION SERVICE - SUPABASE AUTH
 * ================================================
 * Handles admin authentication using Supabase Auth
 * Manages session tokens and user state
 * ================================================
 */

import { api } from './api';

export const authService = {
  /**
   * Login with email/password
   * Uses Supabase Auth for secure session management
   */
  async login(username, password) {
    const data = await api.post('/auth/login', { username, password });
    
    // Store Supabase session data
    if (data.session) {
      localStorage.setItem('portfolio_token', data.session.access_token);
      localStorage.setItem('portfolio_refresh_token', data.session.refresh_token);
      localStorage.setItem('portfolio_user', JSON.stringify(data.user));
    } else {
      // Backward compatibility: old JWT format
      localStorage.setItem('portfolio_token', data.token);
      localStorage.setItem('portfolio_user', JSON.stringify(data.user));
    }
    
    return data;
  },

  /**
   * Verify current session is valid
   */
  async verify() {
    try {
      const data = await api.get('/auth/verify');
      return data;
    } catch (error) {
      // If verification fails, clear session
      if (error.status === 401) {
        this.logout();
      }
      throw error;
    }
  },

  /**
   * Logout and clear session
   */
  async logout() {
    try {
      // Call backend logout endpoint
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage regardless
      localStorage.removeItem('portfolio_token');
      localStorage.removeItem('portfolio_refresh_token');
      localStorage.removeItem('portfolio_user');
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    const token = localStorage.getItem('portfolio_token');
    return !!token;
  },

  /**
   * Get current user data
   */
  getUser() {
    const user = localStorage.getItem('portfolio_user');
    return user ? JSON.parse(user) : null;
  },

  /**
   * Get access token
   */
  getToken() {
    return localStorage.getItem('portfolio_token');
  },

  /**
   * Get refresh token
   */
  getRefreshToken() {
    return localStorage.getItem('portfolio_refresh_token');
  },

  /**
   * Forgot password - kirim email reset
   */
  async forgotPassword(email) {
    const data = await api.post('/auth/forgot-password', { email });
    return data;
  },

  /**
   * Reset password - set password baru (setelah klik link email)
   * @param {string} password - password baru
   * @param {Object} tokens - { access, refresh } dari URL fragment
   */
  async resetPassword(password, tokens = {}) {
    const data = await api.post('/auth/reset-password', {
      password,
      accessToken: tokens.access,
      refreshToken: tokens.refresh,
    });
    return data;
  }
};
