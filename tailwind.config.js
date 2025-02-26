/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        slideDown: {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(100%)', opacity: '0' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        fadeScale: {
          '0%': { 
            opacity: '0',
            transform: 'scale(0.95)'
          },
          '100%': { 
            opacity: '1',
            transform: 'scale(1)'
          }
        },
        fadeOut: {
          '0%': { 
            opacity: '1',
            transform: 'scale(1)'
          },
          '100%': { 
            opacity: '0',
            transform: 'scale(1.05)'
          }
        },
        blink: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0 },
        },
        'swing-in-top-fwd': {
          '0%': {
            transform: 'rotateX(-100deg)',
            'transform-origin': 'top',
            opacity: '0'
          },
          '100%': {
            transform: 'rotateX(0deg)',
            'transform-origin': 'top',
            opacity: '1'
          }
        },
        'slide-in-elliptic-top-fwd': {
          '0%': {
            transform: 'translateY(-600px) rotateX(-30deg) scale(0)',
            'transform-origin': '50% 100%',
            opacity: '0'
          },
          '100%': {
            transform: 'translateY(0) rotateX(0) scale(1)',
            'transform-origin': '50% 1400px',
            opacity: '1'
          }
        },
        'swing-in-left-fwd': {
          '0%': {
            transform: 'rotateY(100deg)',
            'transform-origin': 'left',
            opacity: '0'
          },
          '100%': {
            transform: 'rotateY(0)',
            'transform-origin': 'left',
            opacity: '1'
          }
        },
      },
      animation: {
        slideUp: 'slideUp 0.3s ease-out',
        slideDown: 'slideDown 0.3s ease-out',
        fadeIn: 'fadeIn 0.2s ease-out',
        fadeScale: 'fadeScale 0.2s ease-out',
        fadeOut: 'fadeOut 0.3s ease-out forwards',
        blink: 'blink 1s ease-in-out infinite',
        'swing-in-top': 'swing-in-top-fwd 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) both',
        'slide-in-elliptic-top': 'slide-in-elliptic-top-fwd 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) both',
        'swing-in-left': 'swing-in-left-fwd 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) both',
      },
      transitionProperty: {
        'all': 'all',
      },
      transitionDuration: {
        '200': '200ms',
      },
      transitionTimingFunction: {
        'ease-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDelay: {
        '100': '100ms',
      },
    },
  },
  plugins: [],
}