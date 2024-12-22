import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      //replace by your lib
      'mylib': path.resolve(__dirname, '../../dist/esm'),
    },
  },
});
