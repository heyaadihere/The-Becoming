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
                        'heading': ['Playfair Display', 'serif'],
                        'body': ['Manrope', 'sans-serif'],
                        'mono': ['JetBrains Mono', 'monospace'],
                },
                borderRadius: {
                        lg: 'var(--radius)',
                        md: 'calc(var(--radius) - 2px)',
                        sm: 'calc(var(--radius) - 4px)'
                },
                colors: {
                        // Soft Pastel Palette
                        'pastel-green': '#a8d5ba',
                        'pastel-green-light': '#d4edda',
                        'pastel-blue': '#a8d4e6',
                        'pastel-blue-light': '#e3f2fd',
                        'pastel-lavender': '#d4c4e8',
                        'pastel-lavender-light': '#f3e8ff',
                        'cream': '#fdfbf7',
                        'off-white': '#f8f9fa',
                        'pale-mint': '#f0f9f4',
                        'soft-sage': '#7fb896',
                        'text-primary': '#2d3748',
                        'text-secondary': '#4a5568',
                        'text-muted': '#718096',
                        background: 'hsl(var(--background))',
                        foreground: 'hsl(var(--foreground))',
                        card: {
                                DEFAULT: 'hsl(var(--card))',
                                foreground: 'hsl(var(--card-foreground))'
                        },
                        popover: {
                                DEFAULT: 'hsl(var(--popover))',
                                foreground: 'hsl(var(--popover-foreground))'
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
                        destructive: {
                                DEFAULT: 'hsl(var(--destructive))',
                                foreground: 'hsl(var(--destructive-foreground))'
                        },
                        border: 'hsl(var(--border))',
                        input: 'hsl(var(--input))',
                        ring: 'hsl(var(--ring))',
                        chart: {
                                '1': 'hsl(var(--chart-1))',
                                '2': 'hsl(var(--chart-2))',
                                '3': 'hsl(var(--chart-3))',
                                '4': 'hsl(var(--chart-4))',
                                '5': 'hsl(var(--chart-5))'
                        }
                },
                keyframes: {
                        'accordion-down': {
                                from: {
                                        height: '0'
                                },
                                to: {
                                        height: 'var(--radix-accordion-content-height)'
                                }
                        },
                        'accordion-up': {
                                from: {
                                        height: 'var(--radix-accordion-content-height)'
                                },
                                to: {
                                        height: '0'
                                }
                        },
                        'fade-in-up': {
                                '0%': {
                                        opacity: '0',
                                        transform: 'translateY(20px)'
                                },
                                '100%': {
                                        opacity: '1',
                                        transform: 'translateY(0)'
                                }
                        },
                        'fade-in': {
                                '0%': {
                                        opacity: '0'
                                },
                                '100%': {
                                        opacity: '1'
                                }
                        }
                },
                animation: {
                        'accordion-down': 'accordion-down 0.2s ease-out',
                        'accordion-up': 'accordion-up 0.2s ease-out',
                        'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
                        'fade-in': 'fade-in 1s ease-out forwards'
                }
        }
  },
  plugins: [require("tailwindcss-animate")],
};
