import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      // Make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['@google/genai'],
      output: {
        globals: {
          '@google/genai': 'GoogleGenAI'
        }
      }
    }
  }
});