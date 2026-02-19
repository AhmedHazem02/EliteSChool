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
        // Primary brand colors — unified with globals.css @theme
        navy: {
          DEFAULT: '#1A2B45',
          light: '#2A3F5F',
          dark: '#0F1B2D',
        },
        burgundy: {
          DEFAULT: '#80182A',
          light: '#9A2035',
          dark: '#601020',
        },
        gold: {
          DEFAULT: '#C9A84C',
          light: '#D4B85C',
          dark: '#A8873A',
        },
        'off-white': '#F8F9FA',
        // Grays - Cool tinted to match Navy
        'gray-100': '#F1F5F9',
        'gray-200': '#E2E8F0',
        'gray-300': '#CBD5E1',
        'gray-500': '#64748B',
        'gray-700': '#334155',
        'gray-900': '#0F172A',
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
        'gold': '0 0 25px rgba(201, 168, 76, 0.25)',
        'gold-lg': '0 0 40px rgba(201, 168, 76, 0.35)',
        'gold-glow': '0 0 60px rgba(201, 168, 76, 0.4), 0 0 120px rgba(201, 168, 76, 0.15)',
        'navy': '0 4px 20px rgba(26, 43, 69, 0.25)',
        'card': '0 4px 24px rgba(26, 43, 69, 0.06)',
        'card-hover': '0 12px 40px rgba(26, 43, 69, 0.12)',
        'luxury': '0 20px 60px rgba(26, 43, 69, 0.15), 0 0 0 1px rgba(201, 168, 76, 0.1)',
        'inner-gold': 'inset 0 0 30px rgba(201, 168, 76, 0.1)',
      },
      backgroundImage: {
        'gradient-navy': 'linear-gradient(135deg, #1A2B45 0%, #0F1B2D 100%)',
        'gradient-gold': 'linear-gradient(135deg, #C9A84C 0%, #A8873A 100%)',
        'gradient-hero': 'linear-gradient(to bottom, rgba(26, 43, 69, 0.9) 0%, rgba(26, 43, 69, 0.5) 50%, rgba(26, 43, 69, 0.95) 100%)',
        'shimmer': 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
      },
      animation: {
        'shimmer': 'shimmer 2s infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'count-up': 'countUp 2s ease-out',
        'pulse-gold': 'pulseGold 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'marquee': 'marquee 40s linear infinite',
        'spin-slow': 'spin 12s linear infinite',
        'bounce-subtle': 'bounceSubtle 2s ease-in-out infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
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
          '50%': { opacity: '.7', boxShadow: '0 0 30px rgba(201, 168, 76, 0.5)' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(201, 168, 76, 0.2)' },
          '50%': { boxShadow: '0 0 40px rgba(201, 168, 76, 0.5), 0 0 80px rgba(201, 168, 76, 0.2)' },
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
