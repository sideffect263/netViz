import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://netviz-backend.onrender.com',
        changeOrigin: true,
        secure: true
      }
    }
  },
  optimizeDeps: {
    include: ['three', '3d-force-graph', 'three-spritetext'],
    esbuildOptions: {
      target: 'es2020'
    }
  },
  build: {
    target: 'es2020',
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          'force-graph': ['3d-force-graph', 'three-spritetext']
        }
      }
    }
  }
});