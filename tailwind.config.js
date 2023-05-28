const plugin = require('tailwindcss/plugin');

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
        timebar: {
          '0%': { right: '0%' },
          '100%': { right: '100%' },
        },
      },
      animation: {
        'spin-slow': 'spin 2s linear infinite',
        fade: 'fade .2s linear forwards',
        timebar: 'timebar 1s linear forwards',
      },
    },
  },
  plugins: [
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          'animation-duration': (value) => ({
            animationDuration: value,
          }),
        },
        { values: theme('animationDuration') },
      );
    }),
  ],
};
