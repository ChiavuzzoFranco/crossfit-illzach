/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",        // <-- C'est ici que ça change
    "./components/**/*.{js,ts,jsx,tsx,mdx}", // <-- Pour le dossier qu'on va créer
  ],
  theme: {
    extend: {
      colors: {
        bg: '#080808',
        primary: '#FF2E00',
        secondary: '#1A1A1A',
        offwhite: '#EAEAEA',
      },
      fontFamily: {
        display: ['var(--font-anton)'],
        body: ['var(--font-manrope)'],
      },
      backgroundImage: {
        'noise': "url('https://grainy-gradients.vercel.app/noise.svg')",
      }
    },
  },
  plugins: [],
};