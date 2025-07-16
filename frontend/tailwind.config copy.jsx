import forms from '@tailwindcss/forms';
import tailwindcssAnimate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './src/componentsTemplateEngine/**/*.{js,jsx,ts,tsx}',
        './src/pages/ProjectTemplateEnginePage.tsx',
        './src/pages/ProjectTemplateEnginePage.css',
        './utils/templateEngine/**/*.{js,jsx,ts,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                'green-dark': '#356640',
                green: '#38ff94',
                yellow: '#ffc82c',
                'gray-dark': '#211d1d',
                gray: '#777576',
                'gray-light': '#b0adae',
            },
            fontFamily: {
                sans: ['Fira Sans', 'sans-serif'],
                eczar: ['Eczar', 'serif'],
            },
            spacing: {
                '8xl': '96rem',
                '9xl': '128rem',
            },
            borderRadius: {
                '4xl': '2rem',
            },
            boxShadow: {
                card: '0px_14px_34px_0px_rgba(53,102,64,0.50)', // 50% green-dark
            },
            // that is actual animation
            keyframes: {
                wave: {
                    /* In the context of the code snippet you provided, `'0%':` is used as a keyframe
                    selector in CSS animations. */
                    '0%': { transform: 'rotate(0.0deg)' },
                    '10%': { transform: 'rotate(14deg)' },
                    '20%': { transform: 'rotate(-8deg)' },
                    '30%': { transform: 'rotate(14deg)' },
                    '40%': { transform: 'rotate(-4deg)' },
                    '50%': { transform: 'rotate(10.0deg)' },
                    '60%': { transform: 'rotate(0.0deg)' },
                    '100%': { transform: 'rotate(0.0deg)' },
                },
            },
            // animation class e.g. animate-flyin
            animation: {
                'waving-hand': 'wave 2s linear infinite',
            },
        },
    },
    plugins: [forms, tailwindcssAnimate],
};
