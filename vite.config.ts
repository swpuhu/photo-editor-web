import { defineConfig } from 'vite';

import plainText from 'vite-plugin-plain-text';
import vue from '@vitejs/plugin-vue';
import { join } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            '@': join(__dirname, '/'),
        },
    },

    plugins: [
        vue(),
        plainText(['**/*.text', /\.glsl$/], {
            namedExport: false,
            dtsAutoGen: true,
            distAutoClean: true,
        }),
    ],
});
