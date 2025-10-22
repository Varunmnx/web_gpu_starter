// vite.config.js
import { resolve } from 'path';
import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl';

export default defineConfig({
  // Loaders/plugins go here
  plugins: [
    glsl() // This automatically handles importing .glsl files as strings
  ],

  // Optional: Define the root of your source files
  root: './', 
  build: {
    rollupOptions: {
      input: {
        // Define all HTML entry points
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'src/pages/3d.html')
        // Add more here: projects: resolve(__dirname, 'projects.html'),
      },
    },
  },
});