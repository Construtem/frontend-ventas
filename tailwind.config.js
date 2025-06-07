// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/**/*.{js,jsx,ts,tsx}',   // adjust paths if needed
    ],
    theme: {
        extend: {
            fontFamily:{
                montserrat: {
                    'sans-serif': ['Montserrat', 'sans-serif'],
                }
            }
        },
    },
    plugins: [],
};
