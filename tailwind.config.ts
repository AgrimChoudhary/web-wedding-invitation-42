import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
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
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				wedding: {
					blush: '#FFDEE2',
					gold: '#D4AF37',
					cream: '#FEF7E5',
					ivory: '#FFFFF0',
					maroon: '#800020',
					lavender: '#E6E6FA',
					'deep-gold': '#B8860B',
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
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
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				'slide-in-left': {
					'0%': { 
						opacity: '0',
						transform: 'translateX(-20px)'
					},
					'100%': { 
						opacity: '1',
						transform: 'translateX(0)'
					}
				},
				'slide-in-right': {
					'0%': { 
						opacity: '0',
						transform: 'translateX(20px)'
					},
					'100%': { 
						opacity: '1',
						transform: 'translateX(0)'
					}
				},
				'pulse-soft': {
					'0%, 100%': { 
						transform: 'scale(1)',
						opacity: '1'
					},
					'50%': { 
						transform: 'scale(1.05)',
						opacity: '0.9'
					}
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'shimmer': {
					'0%': { 
						backgroundPosition: '-500px 0' 
					},
					'100%': { 
						backgroundPosition: '500px 0' 
					}
				},
				'draw-in': {
					'0%': { 
						strokeDashoffset: '1000' 
					},
					'100%': { 
						strokeDashoffset: '0' 
					}
				},
				'float-petals': {
					'0%': { 
						transform: 'translate(0, 0) rotate(0deg)',
						opacity: '1'
					},
					'100%': { 
						transform: 'translate(calc(100vw - 20px), 100vh) rotate(720deg)',
						opacity: '0'
					}
				},
				'glow-soft': {
					'0%, 100%': { 
						filter: 'drop-shadow(0 0 5px rgba(212, 175, 55, 0.4))' 
					},
					'50%': { 
						filter: 'drop-shadow(0 0 15px rgba(212, 175, 55, 0.7))' 
					}
				},
				'bounce-light': {
					'0%, 100%': { 
						transform: 'translateY(0)',
						animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)'
					},
					'50%': { 
						transform: 'translateY(-5px)',
						animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)'
					}
				},
				'confetti': {
					'0%': { 
						transform: 'translateY(0) rotate(0)',
						opacity: '1'
					},
					'100%': { 
						transform: 'translateY(100vh) rotate(720deg)',
						opacity: '0'
					}
				},
				'firework-explosion': {
					'0%': {
						transform: 'scale(0)',
						opacity: '0'
					},
					'20%': {
						opacity: '1'
					},
					'100%': {
						transform: 'scale(2)',
						opacity: '0'
					}
				},
				'blink': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0' }
				},
				'handwriting': {
					'0%': { 
						strokeDashoffset: '1000',
						opacity: '0.3'
					},
					'80%': {
						opacity: '0.8'
					},
					'100%': { 
						strokeDashoffset: '0',
						opacity: '1'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in-up': 'fade-in-up 0.7s ease-out forwards',
				'fade-in': 'fade-in 0.7s ease-out forwards',
				'slide-in-left': 'slide-in-left 0.7s ease-out forwards',
				'slide-in-right': 'slide-in-right 0.7s ease-out forwards',
				'pulse-soft': 'pulse-soft 2s infinite ease-in-out',
				'float': 'float 6s infinite ease-in-out',
				'shimmer': 'shimmer 3s infinite linear',
				'draw-in': 'draw-in 2s ease-out forwards',
				'float-petals': 'float-petals 10s ease-in-out forwards',
				'glow-soft': 'glow-soft 3s infinite ease-in-out',
				'bounce-light': 'bounce-light 2s infinite',
				'confetti': 'confetti 5s linear forwards',
				'firework': 'firework-explosion 1.5s ease-out forwards',
				'blink': 'blink 0.8s infinite',
				'handwriting': 'handwriting 3s ease-out forwards'
			},
			fontFamily: {
				'great-vibes': ['"Great Vibes"', 'cursive'],
				'montserrat': ['Montserrat', 'sans-serif'],
				'dancing-script': ['"Dancing Script"', 'cursive'],
				'playfair': ['"Playfair Display"', 'serif'],
				'devanagari': ['Poppins', 'sans-serif'],
				'kruti': ['Hind', '"Rozha One"', 'sans-serif']
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'floral-pattern': 'url("data:image/svg+xml,%3Csvg width="52" height="26" viewBox="0 0 52 26" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23d4af37" fill-opacity="0.1"%3E%3Cpath d="M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z" /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
			},
			backdropBlur: {
				xs: '2px',
			},
			boxShadow: {
				'gold-soft': '0 4px 14px 0 rgba(212, 175, 55, 0.15)',
				'gold-glow': '0 0 20px rgba(212, 175, 55, 0.5)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
