import { create } from 'zustand';
import { customAdminAuth, ADMIN_STORAGE_KEY } from '../services/supabaseClient';

export const useAdminAuthStore = create((set) => ({
  isAuthenticated: (() => {
    try {
      const saved = localStorage.getItem(ADMIN_STORAGE_KEY);
      return saved ? JSON.parse(saved).isAuthenticated : false;
    } catch {
      return false;
    }
  })(),
  adminUser: (() => {
    try {
      const saved = localStorage.getItem(ADMIN_STORAGE_KEY);
      return saved ? JSON.parse(saved).adminUser : null;
    } catch {
      return null;
    }
  })(),

  login: async ({ email, password }) => {
    try {
      const result = await customAdminAuth.login({ email, password });
      set({ isAuthenticated: true, adminUser: result.user });
      return { success: true, user: result.user };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  logout: () => {
    customAdminAuth.logout();
    set({ isAuthenticated: false, adminUser: null });
  },
}));
