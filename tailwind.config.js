/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Dark Foundation
        'void': '#0A0A0C',
        'carbon': '#111114',
        'graphite': '#1A1A1F',
        'slate': '#2A2A32',
        'zinc': '#3A3A45',
        
        // Light Elements (for cards)
        'cream': '#F5F4F0',
        'pearl': '#E8E6E1',
        'stone': '#9A9890',
        
        // Primary Accent - Purple
        'violet': '#8B5CF6',
        'violet-light': '#A78BFA',
        'violet-bright': '#C4B5FD',
        
        // Tweed Colors
        'sage': '#4A5D4C',
        'sage-light': '#5C7360',
        'taupe': '#8C7B6B',
        'rust': '#9C6B5C',
        
        // Scientific Accent
        'helix-cyan': '#22D3EE',
        
        // Legacy support
        'charcoal': '#0A0A0C',
        'warm-gray': '#9A9890',
        'terra': '#9C6B5C',
        'coral': '#D47B6A',
        'ochre': '#C4A772',
        'gold': '#D4AF37',
        'copper': '#B87333',
        'burgundy': '#722F37',
      },
      fontFamily: {
        'sans': ['"DM Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        'display': ['"DM Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        'mono': ['"JetBrains Mono"', '"SF Mono"', 'Monaco', 'monospace'],
      },
      fontSize: {
        'hero': ['clamp(2.5rem, 5.5vw, 4rem)', { lineHeight: '1.1', fontWeight: '300' }],
        'h1': ['clamp(2rem, 4.5vw, 3.5rem)', { lineHeight: '1.15', fontWeight: '300' }],
        'h2': ['clamp(1.75rem, 3.5vw, 2.5rem)', { lineHeight: '1.2', fontWeight: '400' }],
        'h3': ['1.125rem', { lineHeight: '1.35', fontWeight: '500' }],
        'body-large': ['1rem', { lineHeight: '1.7', fontWeight: '400' }],
        'body': ['0.9375rem', { lineHeight: '1.7', fontWeight: '400' }],
        'small': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
        'mono-label': ['0.6875rem', { lineHeight: '1.4', fontWeight: '500', letterSpacing: '0.15em' }],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-up': 'fadeUp 0.6s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-glow': 'pulseGlow 4s ease-in-out infinite',
        'network-pulse': 'networkPulse 4s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 8s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'helix-rotate': 'helixRotate 20s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '0.8' },
        },
        networkPulse: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.2)' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        helixRotate: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-50%)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-dark': 'linear-gradient(135deg, #0A0A0C 0%, #111114 50%, #1A1A1F 100%)',
        'gradient-violet': 'linear-gradient(135deg, #8B5CF6 0%, #22D3EE 100%)',
      },
      boxShadow: {
        'glow-violet': '0 0 20px rgba(139, 92, 246, 0.25)',
        'glow-violet-lg': '0 0 40px rgba(139, 92, 246, 0.3)',
        'glow-cyan': '0 0 20px rgba(34, 211, 238, 0.2)',
        'card-dark': '0 4px 20px rgba(0, 0, 0, 0.3)',
        'card-light': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'card-light-hover': '0 12px 40px rgba(0, 0, 0, 0.12)',
      },
      spacing: {
        'xs': '0.5rem',
        'sm': '1rem',
        'md': '1.5rem',
        'lg': '2.5rem',
        'xl': '4rem',
        '2xl': '6rem',
        '3xl': '10rem',
      },
    },
  },
  plugins: [],
}
