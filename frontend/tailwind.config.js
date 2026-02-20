/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
        extend: {
                fontFamily: {
                        'heading': ['Cormorant Garamond', 'serif'],
                        'body': ['DM Sans', 'sans-serif'],
                },
                borderRadius: {
                        lg: 'var(--radius)',
                        md: 'calc(var(--radius) - 2px)',
                        sm: 'calc(var(--radius) - 4px)'
                },
                colors: {
                        'warm-cream': '#faf8f5',
                        'soft-beige': '#f5f0e8',
                        'warm-sand': '#e8dfd3',
                        'terracotta': '#c4a484',
                        'deep-sage': '#7a9484',
                        'forest': '#5a7a6a',
                        'charcoal': '#3a3a3a',
                        'soft-brown': '#8b7355',
                        background: 'hsl(var(--background))',
                        foreground: 'hsl(var(--foreground))',
                        card: {
                                DEFAULT: 'hsl(var(--card))',
                                foreground: 'hsl(var(--card-foreground))'
                        },
                        primary: {
                                DEFAULT: 'hsl(var(--primary))',
                                foreground: 'hsl(var(--primary-foreground))'
                        },
                        secondary: {
                                DEFAULT: 'hsl(var(--secondary))',
                                foreground: 'hsl(var(--secondary-foreground))'
                        },
                        muted: {
                                DEFAULT: 'hsl(var(--muted))',
                                foreground: 'hsl(var(--muted-foreground))'
                        },
                        accent: {
                                DEFAULT: 'hsl(var(--accent))',
                                foreground: 'hsl(var(--accent-foreground))'
                        },
                        border: 'hsl(var(--border))',
                        input: 'hsl(var(--input))',
                        ring: 'hsl(var(--ring))',
                },
                keyframes: {
                        'float': {
                                '0%, 100%': { transform: 'translateY(0)' },
                                '50%': { transform: 'translateY(-10px)' }
                        },
                        'fade-up': {
                                '0%': { opacity: '0', transform: 'translateY(30px)' },
                                '100%': { opacity: '1', transform: 'translateY(0)' }
                        },
                        'scale-in': {
                                '0%': { opacity: '0', transform: 'scale(0.95)' },
                                '100%': { opacity: '1', transform: 'scale(1)' }
                        }
                },
                animation: {
                        'float': 'float 6s ease-in-out infinite',
                        'fade-up': 'fade-up 0.8s ease-out forwards',
                        'scale-in': 'scale-in 0.5s ease-out forwards'
                }
        }
  },
  plugins: [require("tailwindcss-animate")],
};
