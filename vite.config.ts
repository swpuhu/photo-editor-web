import { defineConfig } from 'vite'

import plainText from 'vite-plugin-plain-text';
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), 
    plainText(['**/*.text', /\.glsl$/], {
        namedExport: false,
        dtsAutoGen: true,
        distAutoClean: true,
    }),],
})
