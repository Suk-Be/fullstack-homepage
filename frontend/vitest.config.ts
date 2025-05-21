import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: './src/tests/setupTests.tsx',
        include: ['src/**/*.{test,spec}.{ts,tsx}'],
        exclude: ['node_modules', 'dist', '.git'],
        poolOptions: {
            threads: {
                singleThread: true, // Forces single-threaded test runner (no parallelism)
            },
        },
    },
    optimizeDeps: {
        include: ['@mui/material', '@mui/system', 'react', 'react-dom'],
        exclude: [
            '@mui/icons-material', // this is likely causing the "too many files" issue
            '@mui/material',
        ],
    },
});
