// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./app/**/*.{js,jsx,ts,tsx}",
      "./src/components/**/*.{js,jsx,ts,tsx}"
    ],
    presets: [require("nativewind/preset")],
    theme: {
      extend: {
        colors: {
          paper: '#FAF9F6',
          ink: '#1A1A1A',
          sand: '#E5E2DB',
          taupe: '#8E8B82',
          thaiGold: '#D4AF37',
          accent: '#B8956A',
        },
      },
    },
    plugins: [],
  }