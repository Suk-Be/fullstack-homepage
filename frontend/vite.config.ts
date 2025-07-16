import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default ({ mode }: { mode: string }) => {
    process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

    return defineConfig({
        plugins: [
            tsconfigPaths({
                projects: ['./tsconfig.json', './tsconfig.app.json'],
            }),
            react(),
        ],
        server: {
            proxy: {
                '/api': process.env.VITE_SERVER_BASE_URL || 'http://localhost:8000',
            },
        },
    });
};
