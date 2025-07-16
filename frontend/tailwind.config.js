import forms from '@tailwindcss/forms';
import tailwindcssAnimate from 'tailwindcss-animate';

export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', './src/*.css'],
    plugins: [forms, tailwindcssAnimate],
};
