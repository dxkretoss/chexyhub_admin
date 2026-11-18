import { create } from 'zustand';

export const useAdminThemeStore = create((set, get) => ({
  theme: localStorage.getItem('chexyhub_admin_theme') || 'light',

  initTheme: () => {
    const savedTheme = localStorage.getItem('chexyhub_admin_theme') || 'light';
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    set({ theme: savedTheme });
  },

  toggleTheme: () => {
    const nextTheme = get().theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('chexyhub_admin_theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    set({ theme: nextTheme });
  }
}));
