import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand colors - Refined for harmony
        navy: {
          DEFAULT: '#1B365D', // Oxford Blue - richer and more "academic"
          light: '#2C4B7C',   // Lighter, legible on dark backgrounds
          dark: '#0D1B2E',    // Very deep navy, almost black
        },
        burgundy: {
          DEFAULT: '#8D1B3D', // Claret - less "red", more "wine"
          light: '#A82B4E',
          dark: '#5C0F22',
        },
        gold: {
          DEFAULT: '#C5A059', // Metallic Gold - less yellow/green
          light: '#E6C47A',   // Champagne gold
          dark: '#947535',    // Bronze gold
        },
        'off-white': '#FAFAFA', // Cleaner white
        // Grays - Cool tinted to match Navy
        'gray-100': '#F1F5F9', // Slate-50 equivalent
        'gray-200': '#E2E8F0', // Slate-200
        'gray-300': '#CBD5E1', // Slate-300
        'gray-500': '#64748B', // Slate-500
        'gray-700': '#334155', // Slate-700
        'gray-900': '#0F172A', // Slate-900
      },
      fontFamily: {
        playfair: ['var(--font-playfair)', 'Georgia', 'serif'],
        jakarta: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
        tajawal: ['var(--font-tajawal)', 'Arial', 'sans-serif'],
      },
      fontSize: {
        'display': ['3.5rem', { lineHeight: '1.1', fontWeight: '700' }],
        'h1': ['3rem', { lineHeight: '1.2', fontWeight: '700' }],
        'h2': ['2.5rem', { lineHeight: '1.25', fontWeight: '600' }],
        'h3': ['1.75rem', { lineHeight: '1.3', fontWeight: '600' }],
        'h4': ['1.25rem', { lineHeight: '1.4', fontWeight: '500' }],
        'body-lg': ['1.125rem', { lineHeight: '1.7' }],
        'body-sm': ['0.875rem', { lineHeight: '1.6' }],
        'caption': ['0.75rem', { lineHeight: '1.5' }],
      },
      boxShadow: {
        'gold': '0 0 25px rgba(197, 160, 89, 0.25)',
        'gold-lg': '0 0 40px rgba(197, 160, 89, 0.35)',
        'navy': '0 4px 20px rgba(27, 54, 93, 0.25)',
        'card': '0 4px 24px rgba(27, 54, 93, 0.06)',
        'card-hover': '0 12px 40px rgba(27, 54, 93, 0.12)',
      },
      backgroundImage: {
        'gradient-navy': 'linear-gradient(135deg, #1B365D 0%, #0D1B2E 100%)',
        'gradient-gold': 'linear-gradient(135deg, #C5A059 0%, #947535 100%)',
        'gradient-hero': 'linear-gradient(to bottom, rgba(27, 54, 93, 0.9) 0%, rgba(27, 54, 93, 0.5) 50%, rgba(27, 54, 93, 0.95) 100%)',
        'shimmer': 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
      },
      animation: {
        'shimmer': 'shimmer 2s infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'count-up': 'countUp 2s ease-out',
        'pulse-gold': 'pulseGold 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'marquee': 'marquee 40s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGold: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.7', boxShadow: '0 0 30px rgba(197, 160, 89, 0.5)' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
      },
      borderRadius: {
        'xl': '0.875rem',
        '2xl': '1rem',
        '3xl': '1.25rem',
      },
      transitionDuration: {
        '400': '400ms',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
