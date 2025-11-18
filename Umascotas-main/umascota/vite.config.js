import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname, 'src/main/resources/react'),
        build: {
          outDir: path.resolve(__dirname, 'src/main/resources/static'),
          emptyOutDir: false, // No vaciar el directorio para preservar imágenes y otros archivos estáticos
          rollupOptions: {
      input: path.resolve(__dirname, 'src/main/resources/react/index.html'),
      output: {
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
      },
    },
    manifest: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/main/resources/react'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/auth': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
});

