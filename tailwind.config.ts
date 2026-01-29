import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // FinovateX Color Palette
        'finovate-beige': '#F8EEDB',
        'finovate-beige-light': '#F5E8D5',
        'finovate-navy': '#1A1E29',
        'finovate-orange': '#F28B30',
        'finovate-orange-hover': '#E2741C',
        'finovate-orange-light': '#FFF3E6',
        'finovate-gray': '#F9FAFB',
        'finovate-blue': '#5A6CF5',
        'finovate-dark-gray': '#3B3B3B',
        'finovate-white': '#FFFFFF',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'finovate': '0 4px 12px rgba(0,0,0,0.05)',
        'finovate-hover': '0 8px 24px rgba(0,0,0,0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-in',
        'hover-lift': 'hoverLift 0.3s ease',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite alternate',
        'gradient-shift': 'gradientShift 8s ease infinite',
      },
      keyframes: {
        fadeIn: {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        hoverLift: {
          'from': { transform: 'translateY(0)' },
          'to': { transform: 'translateY(-5px)' },
        },
        pulseGlow: {
          'from': { boxShadow: '0 0 20px rgba(242, 139, 48, 0.3)' },
          'to': { boxShadow: '0 0 40px rgba(242, 139, 48, 0.6)' },
        },
        gradientShift: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
    },
  },
  plugins: [],
}
export default config