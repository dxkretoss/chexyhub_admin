import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'sonner': path.resolve(__dirname, './src/components/common/CustomToast.jsx'),
    },
  },
  server: {
    port: 3001,
    open: true
  }
});
