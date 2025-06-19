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
        'primary-sage': '#8B9F7E',
        'primary-terra': '#A0725A',
        'primary-coral': '#D47B6A',
        'secondary-ochre': '#C4A772',
        'secondary-rust': '#B5651D',
        'accent-gold': '#D4AF37',
        'accent-copper': '#B87333',
        'accent-burgundy': '#722F37',
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
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
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
      },
    },
  },
  plugins: [],
} 