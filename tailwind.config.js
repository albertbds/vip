/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0066CC', // Blue
          dark: '#004C99',
          light: '#3399FF'
        },
        secondary: {
          DEFAULT: '#FF0000', // Red
          dark: '#CC0000',
          light: '#FF3333'
        },
        accent: {
          DEFAULT: '#00CC00', // Green
          dark: '#009900',
          light: '#33FF33'
        },
        background: {
          dark: '#000000', // Black
          DEFAULT: '#1A1A1A'
        }
      },
      animation: {
        'gradient': 'gradient 8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      },
      backdropBlur: {
        xs: '2px',
      },
      screens: {
        'xs': '475px',
        '3xl': '1600px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      fontSize: {
        'xxs': '0.625rem',
      },
      minHeight: {
        '44': '2.75rem', // 44px - minimum touch target
      },
      minWidth: {
        '44': '2.75rem', // 44px - minimum touch target
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      aspectRatio: {
        '4/3': '4 / 3',
        '3/2': '3 / 2',
        '2/3': '2 / 3',
        '9/16': '9 / 16',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
        '1200': '1200ms',
      },
      scale: {
        '102': '1.02',
        '103': '1.03',
        '98': '0.98',
        '97': '0.97',
      },
      blur: {
        '4xl': '72px',
        '5xl': '96px',
      },
      brightness: {
        '25': '.25',
        '175': '1.75',
      },
      contrast: {
        '25': '.25',
        '175': '1.75',
      },
      saturate: {
        '25': '.25',
        '175': '1.75',
      },
      sepia: {
        '25': '.25',
        '75': '.75',
      },
      grayscale: {
        '25': '.25',
        '75': '.75',
      },
      invert: {
        '25': '.25',
        '75': '.75',
      },
      hueRotate: {
        '15': '15deg',
        '30': '30deg',
        '60': '60deg',
        '90': '90deg',
        '270': '270deg',
      },
    },
  },
  plugins: [
    // Plugin para container queries
    function({ addUtilities }) {
      addUtilities({
        '.touch-target': {
          'min-height': '44px',
          'min-width': '44px',
        },
        '.safe-area-inset': {
          'padding-left': 'max(1rem, env(safe-area-inset-left))',
          'padding-right': 'max(1rem, env(safe-area-inset-right))',
        },
        '.safe-area-top': {
          'padding-top': 'max(1rem, env(safe-area-inset-top))',
        },
        '.safe-area-bottom': {
          'padding-bottom': 'max(1rem, env(safe-area-inset-bottom))',
        },
        '.text-rendering-optimized': {
          'text-rendering': 'optimizeLegibility',
          '-webkit-font-smoothing': 'antialiased',
          '-moz-osx-font-smoothing': 'grayscale',
        },
        '.will-change-transform': {
          'will-change': 'transform',
        },
        '.will-change-auto': {
          'will-change': 'auto',
        },
        '.touch-action-manipulation': {
          'touch-action': 'manipulation',
        },
        '.scroll-smooth': {
          'scroll-behavior': 'smooth',
        },
        '.form-control': {
          'width': '100%',
          'padding': '0.75rem 1rem',
          'background-color': 'rgba(255, 255, 255, 0.05)',
          'border': '1px solid rgba(255, 255, 255, 0.1)',
          'border-radius': '0.5rem',
          'color': 'white',
          'transition': 'all 0.2s',
          '&::placeholder': {
            'color': 'rgba(156, 163, 175, 1)',
          },
          '&:focus': {
            'outline': 'none',
            'box-shadow': '0 0 0 2px rgba(59, 130, 246, 0.5)',
            'border-color': 'rgba(59, 130, 246, 0.5)',
          },
        },
        '.responsive-grid': {
          'display': 'grid',
          'grid-template-columns': 'repeat(auto-fit, minmax(280px, 1fr))',
          'gap': '1.5rem',
          '@media (max-width: 640px)': {
            'grid-template-columns': '1fr',
            'gap': '1rem',
          },
        },
        '.card-modern': {
          'background-color': 'rgba(255, 255, 255, 0.05)',
          'backdrop-filter': 'blur(16px)',
          'border': '1px solid rgba(255, 255, 255, 0.1)',
          'border-radius': '0.75rem',
          'box-shadow': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          'transition': 'all 0.3s',
          '&:hover': {
            'background-color': 'rgba(255, 255, 255, 0.1)',
            'transform': 'translateY(-4px)',
            'box-shadow': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          },
        },
        '.button-states': {
          'transition': 'all 0.2s ease-in-out',
          '&:hover': {
            'transform': 'scale(1.05)',
          },
          '&:active': {
            'transform': 'scale(0.95)',
          },
          '&:focus': {
            'outline': 'none',
            'box-shadow': '0 0 0 2px rgba(59, 130, 246, 0.5)',
          },
          '&:disabled': {
            'opacity': '0.5',
            'cursor': 'not-allowed',
            'transform': 'none',
          },
        },
      });
    },
  ],
};