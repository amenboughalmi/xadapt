/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Design Palette
        teal: {
          50: '#F0FFFE',
          100: '#E0FFFD',
          900: '#1E4A5A',
          light: '#4A90E2',
        },
        light: {
          50: '#F5F7FA',
          100: '#E8ECEF',
        },
        dark: {
          900: '#000000',
          white: '#FFFFFF',
        },
        // Extended Premium Palette
        primary: '#4A90E2',
        secondary: '#1E4A5A',
        accent: '#4A90E2',
        background: '#F5F7FA',
        // Premium additional colors
        'premium-gold': '#FFD700',
        'premium-silver': '#C0C0C0',
        'premium-purple': '#9D4EDD',
        'premium-cyan': '#00D9FF',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      fontSize: {
        xs: ['12px', { lineHeight: '16px', letterSpacing: '0.5px' }],
        sm: ['14px', { lineHeight: '20px', letterSpacing: '0.3px' }],
        base: ['16px', { lineHeight: '24px' }],
        lg: ['18px', { lineHeight: '28px' }],
        xl: ['20px', { lineHeight: '30px' }],
        '2xl': ['24px', { lineHeight: '36px', letterSpacing: '-0.5px' }],
        '3xl': ['32px', { lineHeight: '40px', letterSpacing: '-1px' }],
        '4xl': ['40px', { lineHeight: '48px', letterSpacing: '-1.5px' }],
      },
      backdropFilter: {
        none: 'none',
        xs: 'blur(2px)',
        sm: 'blur(4px)',
        md: 'blur(8px)',
        lg: 'blur(12px)',
        xl: 'blur(16px)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #4A90E2 0%, #1E4A5A 100%)',
        'gradient-light': 'linear-gradient(135deg, #F5F7FA 0%, #E8ECEF 100%)',
        'gradient-accent': 'linear-gradient(135deg, #4A90E2 0%, #2E5C7A 100%)',
        'gradient-premium': 'linear-gradient(135deg, #9D4EDD 0%, #4A90E2 50%, #00D9FF 100%)',
        'gradient-gold': 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
        'gradient-glass': 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 100%)',
        'gradient-glow': 'linear-gradient(135deg, rgba(74,144,226,0.4) 0%, rgba(30,74,90,0.2) 100%)',
        'orb-glow': 'radial-gradient(circle at center, rgba(74,144,226,0.25) 0%, transparent 70%)',
      },
      boxShadow: {
        glow: '0 0 20px rgba(74, 144, 226, 0.3)',
        'glow-lg': '0 0 40px rgba(74, 144, 226, 0.4)',
        'glow-xl': '0 0 60px rgba(74, 144, 226, 0.5)',
        card: '0 4px 20px rgba(30, 74, 90, 0.08)',
        'card-hover': '0 12px 48px rgba(74, 144, 226, 0.15)',
        'card-premium': '0 20px 60px rgba(74, 144, 226, 0.2), 0 0 40px rgba(74, 144, 226, 0.1)',
        'inner-glow': 'inset 0 0 30px rgba(74,144,226,0.15)',
        'focus-glow': '0 0 0 4px rgba(74,144,226,0.25)',
        'card-float': '0 20px 40px rgba(30,74,90,0.12), 0 0 60px rgba(74,144,226,0.15)',
        'button-lift': '0 10px 30px rgba(74,144,226,0.3)',
        'button-hover': '0 0 30px rgba(74, 144, 226, 0.4), 0 10px 30px rgba(74, 144, 226, 0.2)',
      },
      keyframes: {
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(74, 144, 226, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(74, 144, 226, 0.6)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        'slide-in': {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'float-smooth': {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '25%': { transform: 'translateY(-5px) translateX(2px)' },
          '50%': { transform: 'translateY(-10px) translateX(0px)' },
          '75%': { transform: 'translateY(-5px) translateX(-2px)' },
        },
        'bounce-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'rotate-3d': {
          '0%': { transform: 'rotateX(0deg) rotateY(0deg)' },
          '100%': { transform: 'rotateX(5deg) rotateY(5deg)' },
        },
        'neon-flicker': {
          '0%, 100%': { textShadow: '0 0 10px #4A90E2' },
          '50%': { textShadow: '0 0 20px #4A90E2, 0 0 30px #00D9FF' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-40px) rotate(5deg)' },
        },
        ripple: {
          '0%': { boxShadow: '0 0 0 0 rgba(74,144,226,0.4)' },
          '100%': { boxShadow: '0 0 0 20px rgba(74,144,226,0)' },
        },
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        shimmer: 'shimmer 2s infinite',
        'slide-in': 'slide-in 0.3s ease-out',
        'scale-in': 'scale-in 0.3s ease-out',
        'gradient-shift': 'gradient-shift 3s ease infinite',
        'float-smooth': 'float-smooth 4s ease-in-out infinite',
        'bounce-slow': 'bounce-slow 2s ease-in-out infinite',
        'neon-flicker': 'neon-flicker 3s ease-in-out infinite',
        'float-slow': 'float 20s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ripple': 'ripple 1.2s ease-out',
      },
      
    },
  },
  plugins: [],
}
