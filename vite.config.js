import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => {
  // Use '/' for local development, '/CanyonConciergeJan26/' for GitHub Pages production
  const base = command === 'build' ? '/CanyonConciergeJan26/' : '/';
  
  return {
    plugins: [react()],
    base,
    server: {
      port: 3000,
      open: true
    }
  };
});

