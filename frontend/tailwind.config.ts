import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          50: '#fdfcf9',
          100: '#f9f5ef',
          200: '#f0ebe0',
          300: '#e6ddd0',
          400: '#d8d0c4',
          500: '#c8bcac',
        },
        espresso: {
          50: '#f5ede8',
          100: '#e8d5c8',
          200: '#c4a48a',
          300: '#9a6f50',
          400: '#6b4226',
          500: '#2c1810',
          600: '#1e100a',
          700: '#120906',
        },
        taupe: {
          300: '#b8a898',
          400: '#9a8878',
          500: '#8a7a6a',
          600: '#6a5a4a',
          700: '#4a3a2a',
        },
        ink: {
          DEFAULT: '#1a0f08',
          muted: '#6a5a4a',
          light: '#9a8878',
        },
      },
      fontFamily: {
        serif: ['"DM Serif Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-md': ['3rem', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
        'display-sm': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },
      borderRadius: {
        'sm': '2px',
        DEFAULT: '4px',
        'md': '6px',
        'lg': '10px',
      },
      boxShadow: {
        'editorial': '0 1px 3px rgba(26,15,8,0.06), 0 4px 16px rgba(26,15,8,0.04)',
        'editorial-lg': '0 4px 8px rgba(26,15,8,0.08), 0 16px 48px rgba(26,15,8,0.08)',
        'espresso': '0 4px 20px rgba(44,24,16,0.15)',
      },
      backgroundImage: {
        'paper-texture': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4'%3E%3Crect width='4' height='4' fill='%23f9f5ef'/%3E%3Ccircle cx='1' cy='1' r='0.5' fill='%23e6ddd0' opacity='0.5'/%3E%3C/svg%3E\")",
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'fade-up': 'fadeUp 0.6s ease-out',
        'fade-up-delay': 'fadeUp 0.6s ease-out 0.2s both',
        'slide-in': 'slideIn 0.5s ease-out',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '33%': { transform: 'translateY(-12px) rotate(1deg)' },
          '66%': { transform: 'translateY(-6px) rotate(-0.5deg)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
