import { create } from 'zustand';

const AUTH_STORAGE_KEY = 'chexyhub_admin_auth';

export const useAdminAuthStore = create((set) => ({
  isAuthenticated: (() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      return saved ? JSON.parse(saved).isAuthenticated : false;
    } catch {
      return false;
    }
  })(),
  adminUser: (() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      return saved ? JSON.parse(saved).adminUser : null;
    } catch {
      return null;
    }
  })(),

  login: async ({ email, password }) => {
    // Standard mock authentication delay for realistic UX
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Case-insensitive email check
    const normalizedEmail = (email || '').trim().toLowerCase();

    // Accepted Admin Credentials:
    // admin@chexyhub.com / ChexyAdmin2026!
    // Or any email with password "admin" or "ChexyAdmin2026!" for easy testing
    if (
      (normalizedEmail === 'admin@chexyhub.com' && password === 'ChexyAdmin2026!') ||
      password === 'ChexyAdmin2026!' ||
      (normalizedEmail.includes('admin') && password.length >= 4)
    ) {
      const user = {
        name: 'Chief Atelier Director',
        email: normalizedEmail || 'admin@chexyhub.com',
        role: 'Super Administrator',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        lastLogin: new Date().toISOString()
      };

      localStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({ isAuthenticated: true, adminUser: user })
      );

      set({ isAuthenticated: true, adminUser: user });
      return { success: true, user };
    }

    return {
      success: false,
      error: 'Invalid credentials. Please use admin@chexyhub.com / ChexyAdmin2026!'
    };
  },

  logout: () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    set({ isAuthenticated: false, adminUser: null });
  }
}));
