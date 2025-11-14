import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, loadEnv } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default ({ mode }: { mode: string }) => {
    process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

    return defineConfig({
        base: '/staging/', // only needed for staging
        plugins: [
            react(),
            tsconfigPaths({
                projects: ['./tsconfig.json', './tsconfig.app.json'],
            }),

            visualizer({
                filename: 'dist/stats.html',
                open: false,
                gzipSize: true,
                brotliSize: true,
            }),
        ],
        server: {
            host: '0.0.0.0', // wichtig, sonst nur localhost erreichbar
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
        build: {
            rollupOptions: {
                output: {
                    manualChunks: {
                        // 🔹 Framework Core
                        react: ['react', 'react-dom', 'react-router', 'react-router-dom'],

                        // 🔹 State Management
                        redux: ['react-redux', '@reduxjs/toolkit'],

                        // 🔹 Material UI Core (wird auf allen Seiten benötigt)
                        mui: [
                            '@mui/material',
                            '@mui/icons-material',
                            '@emotion/react',
                            '@emotion/styled',
                        ],

                        // 🔹 Headless UI (nur in Protected-Bereich)
                        headlessui: ['@headlessui/react'],
                    },
                },
            },

            // Optional: leicht erhöhen, damit Vite keine Warnungen spammt
            chunkSizeWarningLimit: 800,
        },
    });
};
