import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'jsdom',
        environmentOptions: {
            jsdom: {
                url: 'http://localhost:8000', // ✅ This is required!
            },
        },
        globals: true,
        setupFiles: './src/tests/setupTests.tsx',
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
        include: ['@mui/system', 'react', 'react-dom'],
        exclude: [
            '@mui/icons-material', // this is likely causing the "too many files" issue
            '@mui/material',
        ],
    },
});
