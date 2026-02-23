import typography from '@tailwindcss/typography';
import containerQueries from '@tailwindcss/container-queries';
import animate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ['class'],
    content: ['index.html', 'src/**/*.{js,ts,jsx,tsx,html,css}'],
    theme: {
        container: {
            center: true,
            padding: '2rem',
            screens: {
                '2xl': '1400px'
            }
        },
        extend: {
            colors: {
                border: 'oklch(var(--border))',
                input: 'oklch(var(--input))',
                ring: 'oklch(var(--ring))',
                background: 'oklch(var(--background))',
                foreground: 'oklch(var(--foreground))',
                primary: {
                    DEFAULT: 'oklch(var(--primary))',
                    foreground: 'oklch(var(--primary-foreground))'
                },
                secondary: {
                    DEFAULT: 'oklch(var(--secondary))',
                    foreground: 'oklch(var(--secondary-foreground))'
                },
                destructive: {
                    DEFAULT: 'oklch(var(--destructive))',
                    foreground: 'oklch(var(--destructive-foreground))'
                },
                muted: {
                    DEFAULT: 'oklch(var(--muted))',
                    foreground: 'oklch(var(--muted-foreground))'
                },
                accent: {
                    DEFAULT: 'oklch(var(--accent))',
                    foreground: 'oklch(var(--accent-foreground))'
                },
                popover: {
                    DEFAULT: 'oklch(var(--popover))',
                    foreground: 'oklch(var(--popover-foreground))'
                },
                card: {
                    DEFAULT: 'oklch(var(--card))',
                    foreground: 'oklch(var(--card-foreground))'
                },
                success: {
                    DEFAULT: 'oklch(var(--success))',
                    foreground: 'oklch(var(--success-foreground))'
                },
                warning: {
                    DEFAULT: 'oklch(var(--warning))',
                    foreground: 'oklch(var(--warning-foreground))'
                },
                sidebar: {
                    DEFAULT: 'oklch(var(--sidebar))',
                    foreground: 'oklch(var(--sidebar-foreground))',
                    primary: 'oklch(var(--sidebar-primary))',
                    'primary-foreground': 'oklch(var(--sidebar-primary-foreground))',
                    accent: 'oklch(var(--sidebar-accent))',
                    'accent-foreground': 'oklch(var(--sidebar-accent-foreground))',
                    border: 'oklch(var(--sidebar-border))',
                    ring: 'oklch(var(--sidebar-ring))'
                },
                chart: {
                    '1': 'oklch(var(--chart-1))',
                    '2': 'oklch(var(--chart-2))',
                    '3': 'oklch(var(--chart-3))',
                    '4': 'oklch(var(--chart-4))',
                    '5': 'oklch(var(--chart-5))'
                }
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)'
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Poppins', 'Inter', 'system-ui', 'sans-serif']
            },
            boxShadow: {
                'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
                'glow': '0 0 20px rgba(var(--primary), 0.3)',
                'glow-lg': '0 0 30px rgba(var(--primary), 0.4)'
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
                'fade-in': {
                    '0%': {
                        opacity: '0',
                        '-webkit-transform': 'translateY(10px)',
                        transform: 'translateY(10px)'
                    },
                    '100%': {
                        opacity: '1',
                        '-webkit-transform': 'translateY(0)',
                        transform: 'translateY(0)'
                    }
                },
                'slide-in': {
                    '0%': {
                        '-webkit-transform': 'translateX(-100%)',
                        transform: 'translateX(-100%)'
                    },
                    '100%': {
                        '-webkit-transform': 'translateX(0)',
                        transform: 'translateX(0)'
                    }
                },
                'pulse-glow': {
                    '0%, 100%': {
                        opacity: '1',
                        '-webkit-transform': 'scale(1)',
                        transform: 'scale(1)'
                    },
                    '50%': {
                        opacity: '0.8',
                        '-webkit-transform': 'scale(1.05)',
                        transform: 'scale(1.05)'
                    }
                }
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
                'fade-in': 'fade-in 0.5s ease-out',
                'slide-in': 'slide-in 0.3s ease-out',
                'pulse-glow': 'pulse-glow 2s ease-in-out infinite'
            }
        }
    },
    plugins: [typography, containerQueries, animate]
};
