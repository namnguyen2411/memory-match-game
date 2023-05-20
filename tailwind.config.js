module.exports = {
  content: ['index.html', './src/**/*.{js,jsx,ts,tsx,vue,html}'],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins'],
      },
      colors: {
        slate300: '#94a3b8',
        red600: '#dc2626',
        cyan400: '#22d3ee',
      },
      keyframes: {
        fade: {
          '0%': { opacity: 1 },
          '50%': { opacity: 0.5 },
          '100%': { opacity: 0 },
        },
      },
      animation: {
        'spin-slow': 'spin 2s linear infinite',
        fade: 'fade .2s linear forwards',
      },
    },
  },
  plugins: [],
};
