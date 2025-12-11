// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // 1. Importe o módulo 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],

  // 2. Adicione a seção 'resolve'
  resolve: {
    alias: {
      "src": path.resolve(__dirname, "./src"),
      // 3. Mapeie o '@' para o diretório 'src'
      // '__dirname' aponta para o diretório atual (frontend)
      "@": path.resolve(__dirname, "./src"),
    },
  },
});