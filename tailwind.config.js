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
        // Brand Colors
        'sage': '#8B9F7E',
        'terra': '#A0725A', 
        'coral': '#D47B6A',
        'ochre': '#C4A772',
        'rust': '#B5651D',
        'gold': '#D4AF37',
        'copper': '#B87333',
        'burgundy': '#722F37',
        
        // Neutral Colors
        'charcoal': '#2C2A26',
        'warm-gray': '#4A453E',
        'cream': '#FAF8F4',
        'stone': '#E8E4DD',
        
        // Legacy support
        'primary-sage': '#8B9F7E',
        'primary-terra': '#A0725A',
        'primary-coral': '#D47B6A',
        'neutral-charcoal': '#2C2A26',
        'neutral-warm-gray': '#4A453E',
        'neutral-cream': '#FAF8F4',
        'neutral-stone': '#E8E4DD',
      },
      fontFamily: {
        'display': ['"Playfair Display"', 'Georgia', 'serif'],
        'sans': ['"Space Grotesk"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        'mono': ['"JetBrains Mono"', '"SF Mono"', 'Monaco', 'monospace'],
      },
      fontSize: {
        'hero': ['clamp(3rem, 8vw, 5rem)', { lineHeight: '1.1', fontWeight: '600' }],
        'h1': ['clamp(2.5rem, 6vw, 4rem)', { lineHeight: '1.2', fontWeight: '600' }],
        'h2': ['clamp(2rem, 5vw, 3rem)', { lineHeight: '1.3', fontWeight: '600' }],
        'h3': ['clamp(1.5rem, 4vw, 2.25rem)', { lineHeight: '1.4', fontWeight: '500' }],
        'body-large': ['1.1rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        'small': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
        'data': ['0.875rem', { lineHeight: '1.4', fontWeight: '500' }],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'data-pulse-h1': 'data-pulse-h1 4.2s ease-in-out infinite',
        'data-pulse-h2': 'data-pulse-h2 3.8s ease-in-out infinite',
        'data-pulse-h3': 'data-pulse-h3 4.5s ease-in-out infinite',
        'data-pulse-h4': 'data-pulse-h4 3.6s ease-in-out infinite',
        'data-pulse-v1': 'data-pulse-v1 3.9s ease-in-out infinite',
        'data-pulse-v2': 'data-pulse-v2 4.3s ease-in-out infinite',
        'data-pulse-v3': 'data-pulse-v3 3.7s ease-in-out infinite',
        'data-pulse-v4': 'data-pulse-v4 4.1s ease-in-out infinite',
        'subtle-glow': 'subtle-glow 4s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 8s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'data-pulse-h1': {
          '0%': { transform: 'translateX(-120%)', opacity: '0' },
          '15%': { opacity: '1' },
          '85%': { opacity: '1' },
          '100%': { transform: 'translateX(220%)', opacity: '0' },
        },
        'data-pulse-h2': {
          '0%': { transform: 'translateX(-110%)', opacity: '0' },
          '20%': { opacity: '1' },
          '80%': { opacity: '1' },
          '100%': { transform: 'translateX(210%)', opacity: '0' },
        },
        'data-pulse-h3': {
          '0%': { transform: 'translateX(-130%)', opacity: '0' },
          '12%': { opacity: '1' },
          '88%': { opacity: '1' },
          '100%': { transform: 'translateX(230%)', opacity: '0' },
        },
        'data-pulse-h4': {
          '0%': { transform: 'translateX(-105%)', opacity: '0' },
          '18%': { opacity: '1' },
          '82%': { opacity: '1' },
          '100%': { transform: 'translateX(205%)', opacity: '0' },
        },
        'data-pulse-v1': {
          '0%': { transform: 'translateY(-115%)', opacity: '0' },
          '16%': { opacity: '1' },
          '86%': { opacity: '1' },
          '100%': { transform: 'translateY(215%)', opacity: '0' },
        },
        'data-pulse-v2': {
          '0%': { transform: 'translateY(-125%)', opacity: '0' },
          '14%': { opacity: '1' },
          '86%': { opacity: '1' },
          '100%': { transform: 'translateY(225%)', opacity: '0' },
        },
        'data-pulse-v3': {
          '0%': { transform: 'translateY(-108%)', opacity: '0' },
          '22%': { opacity: '1' },
          '78%': { opacity: '1' },
          '100%': { transform: 'translateY(208%)', opacity: '0' },
        },
        'data-pulse-v4': {
          '0%': { transform: 'translateY(-118%)', opacity: '0' },
          '19%': { opacity: '1' },
          '81%': { opacity: '1' },
          '100%': { transform: 'translateY(218%)', opacity: '0' },
        },
        'subtle-glow': {
          '0%, 100%': { 
            boxShadow: '0 0 4px rgba(212, 175, 55, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.3)',
            transform: 'scale(1)',
          },
          '50%': { 
            boxShadow: '0 0 8px rgba(212, 175, 55, 0.8), inset 0 1px 1px rgba(255, 255, 255, 0.5)',
            transform: 'scale(1.1)',
          },
        },
        'gradient-shift': {
          '0%, 100%': { 
            backgroundPosition: '0% 50%',
          },
          '50%': { 
            backgroundPosition: '100% 50%',
          },
        },
        'float': {
          '0%, 100%': { 
            transform: 'translateY(0px)',
          },
          '50%': { 
            transform: 'translateY(-10px)',
          },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-animated': 'linear-gradient(-45deg, #8B9F7E, #A0725A, #D47B6A, #C4A772)',
        'gradient-subtle': 'linear-gradient(135deg, #FAF8F4 0%, #E8E4DD 100%)',
      },
      boxShadow: {
        'sophisticated': '0 10px 25px -3px rgba(44, 42, 38, 0.1), 0 4px 6px -2px rgba(44, 42, 38, 0.05)',
        'premium': '0 20px 40px -8px rgba(44, 42, 38, 0.15), 0 8px 16px -4px rgba(44, 42, 38, 0.1)',
      },
    },
  },
  plugins: [],
} 