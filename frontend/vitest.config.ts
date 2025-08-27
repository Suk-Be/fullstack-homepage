import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [
        tsconfigPaths({
            projects: ['./tsconfig.json', './tsconfig.app.json'],
        }),
        react(),
    ],
    test: {
        environment: 'jsdom',
        environmentOptions: {
            jsdom: {
                url: process.env.VITE_BASE_URL, // ✅ This is required!
            },
        },
        globals: true,
        setupFiles: './src/tests/utils/setupTests.tsx',
        css: false,
        include: ['src/**/*.{test,spec}.{ts,tsx}'],
        exclude: ['node_modules', 'dist', '.git'],
        poolOptions: {
            threads: {
                singleThread: true, // Forces single-threaded test runner (no parallelism)
            },
        },
        testTimeout: 10000, // Set all tests to timeout after 10 seconds
    },
    optimizeDeps: {
        include: ['@mui/material'],
        exclude: [
            '@mui/icons-material', // this is likely causing the "too many files" issue
        ],
    },
});
