/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        secondary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        dark: {
          background: '#1a1a1a',
          foreground: '#ffffff',
          card: '#2a2a2a',
          'card-foreground': '#ffffff',
          popover: '#1a1a1a',
          'popover-foreground': '#ffffff',
          primary: '#ef4444',
          'primary-foreground': '#ffffff',
          secondary: '#22c55e',
          'secondary-foreground': '#ffffff',
          muted: '#3a3a3a',
          'muted-foreground': '#a1a1aa',
          accent: '#3a3a3a',
          'accent-foreground': '#ffffff',
          destructive: '#dc2626',
          'destructive-foreground': '#ffffff',
          border: '#3a3a3a',
          input: '#3a3a3a',
          ring: '#ef4444',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}