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
            host: '0.0.0.0', // <- wichtig, sonst nur localhost erreichbar
            port: 5173,
            strictPort: true, // verhindert automatisches Hochzählen des Ports
            proxy: {
                '/api': {
                    target: process.env.VITE_SERVER_BASE_URL || 'http://localhost:8000',
                    changeOrigin: true,
                    secure: false,
                },
            },
            watch: {
                // Polling aktivieren, damit Hot Reload in Docker funktioniert
                usePolling: true,
                interval: 100,
            },
        },
    });
};
