/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: '#C6FF00',
        'neon-dim': '#a8d900',
        'dark-bg': '#080808',
        'dark-surface': '#0f0f0f',
        'card-bg': '#141414',
        'card-border': '#1f1f1f',
        'glass': 'rgba(255,255,255,0.04)',
        'glass-border': 'rgba(255,255,255,0.08)',
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      keyframes: {
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideOutRight: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
        fadeUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulse_neon: {
          '0%, 100%': { boxShadow: '0 0 5px #C6FF00, 0 0 20px #C6FF0033' },
          '50%': { boxShadow: '0 0 20px #C6FF00, 0 0 60px #C6FF0066' },
        },
      },
      animation: {
        slideInRight: 'slideInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        slideOutRight: 'slideOutRight 0.3s ease-in forwards',
        fadeUp: 'fadeUp 0.6s ease forwards',
        fadeIn: 'fadeIn 0.4s ease forwards',
        scaleIn: 'scaleIn 0.4s ease forwards',
        shimmer: 'shimmer 2s linear infinite',
        pulse_neon: 'pulse_neon 2s infinite',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
