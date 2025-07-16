import forms from '@tailwindcss/forms';
import tailwindcssAnimate from 'tailwindcss-animate';

export default {
    content: [
        './src/pages/ProjectTemplateEnginePage.tsx',
        './src/pages/ProjectTemplateEnginePage.css',
    ],
    theme: {
        extend: {},
    },
    plugins: [forms, tailwindcssAnimate],
};
