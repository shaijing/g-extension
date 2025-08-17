import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({
    plugins: [tailwindcss(), solidPlugin()],
    server: {
        port: 3000,
    },
    build: {
        target: 'esnext',
        rollupOptions: {
            input: {
                newtab: 'newtab.html',    // 新标签页
                options: 'options.html', // 设置页
                popup: 'popup.html'      // 弹出页
            }
        }
    },
});
