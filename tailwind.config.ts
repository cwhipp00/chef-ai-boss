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
			fontSize: {
				'xs': ['calc(0.75rem * var(--font-size-scale, 1))', { lineHeight: 'calc(1rem * var(--font-size-scale, 1))' }],
				'sm': ['calc(0.875rem * var(--font-size-scale, 1))', { lineHeight: 'calc(1.25rem * var(--font-size-scale, 1))' }],
				'base': ['calc(1rem * var(--font-size-scale, 1))', { lineHeight: 'calc(1.5rem * var(--font-size-scale, 1))' }],
				'lg': ['calc(1.125rem * var(--font-size-scale, 1))', { lineHeight: 'calc(1.75rem * var(--font-size-scale, 1))' }],
				'xl': ['calc(1.25rem * var(--font-size-scale, 1))', { lineHeight: 'calc(1.75rem * var(--font-size-scale, 1))' }],
				'2xl': ['calc(1.5rem * var(--font-size-scale, 1))', { lineHeight: 'calc(2rem * var(--font-size-scale, 1))' }],
				'3xl': ['calc(1.875rem * var(--font-size-scale, 1))', { lineHeight: 'calc(2.25rem * var(--font-size-scale, 1))' }],
				'4xl': ['calc(2.25rem * var(--font-size-scale, 1))', { lineHeight: 'calc(2.5rem * var(--font-size-scale, 1))' }]
			},
			spacing: {
				'0.5': 'calc(0.125rem * var(--spacing-scale, 1))',
				'1': 'calc(0.25rem * var(--spacing-scale, 1))',
				'1.5': 'calc(0.375rem * var(--spacing-scale, 1))',
				'2': 'calc(0.5rem * var(--spacing-scale, 1))',
				'2.5': 'calc(0.625rem * var(--spacing-scale, 1))',
				'3': 'calc(0.75rem * var(--spacing-scale, 1))',
				'3.5': 'calc(0.875rem * var(--spacing-scale, 1))',
				'4': 'calc(1rem * var(--spacing-scale, 1))',
				'5': 'calc(1.25rem * var(--spacing-scale, 1))',
				'6': 'calc(1.5rem * var(--spacing-scale, 1))',
				'7': 'calc(1.75rem * var(--spacing-scale, 1))',
				'8': 'calc(2rem * var(--spacing-scale, 1))',
				'9': 'calc(2.25rem * var(--spacing-scale, 1))',
				'10': 'calc(2.5rem * var(--spacing-scale, 1))',
				'11': 'calc(2.75rem * var(--spacing-scale, 1))',
				'12': 'calc(3rem * var(--spacing-scale, 1))',
				'14': 'calc(3.5rem * var(--spacing-scale, 1))',
				'16': 'calc(4rem * var(--spacing-scale, 1))',
				'20': 'calc(5rem * var(--spacing-scale, 1))',
				'24': 'calc(6rem * var(--spacing-scale, 1))',
				'28': 'calc(7rem * var(--spacing-scale, 1))',
				'32': 'calc(8rem * var(--spacing-scale, 1))'
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					glow: 'hsl(var(--primary-glow))'
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
				inventory: {
					low: 'hsl(var(--inventory-low))',
					medium: 'hsl(var(--inventory-medium))',
					high: 'hsl(var(--inventory-high))',
					category: 'hsl(var(--inventory-category))'
				},
				success: {
					DEFAULT: 'hsl(var(--success))',
					foreground: 'hsl(var(--success-foreground))'
				},
				warning: {
					DEFAULT: 'hsl(var(--warning))',
					foreground: 'hsl(var(--warning-foreground))'
				},
				info: {
					DEFAULT: 'hsl(var(--info))',
					foreground: 'hsl(var(--info-foreground))'
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
				},
				prep: {
					header: 'hsl(var(--prep-header))',
					category: 'hsl(var(--prep-category))',
					item: 'hsl(var(--prep-item))',
					grid: 'hsl(var(--prep-grid))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			backgroundImage: {
				'gradient-primary': 'var(--gradient-primary)',
				'gradient-card': 'var(--gradient-card)'
			},
			boxShadow: {
				'soft': 'var(--shadow-soft)',
				'medium': 'var(--shadow-medium)',
				'strong': 'var(--shadow-strong)'
			},
			transitionProperty: {
				'default': 'var(--transition)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0', opacity: '0' },
					to: { height: 'var(--radix-accordion-content-height)', opacity: '1' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)', opacity: '1' },
					to: { height: '0', opacity: '0' }
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'fade-out': {
					'0%': { opacity: '1', transform: 'translateY(0)' },
					'100%': { opacity: '0', transform: 'translateY(10px)' }
				},
				'scale-in': {
					'0%': { transform: 'scale(0.95)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'slide-in-right': {
					'0%': { transform: 'translateX(100%)' },
					'100%': { transform: 'translateX(0)' }
				},
				'slide-out-right': {
					'0%': { transform: 'translateX(0)' },
					'100%': { transform: 'translateX(100%)' }
				},
				'pulse-glow': {
					'0%, 100%': { boxShadow: '0 0 0 0 hsl(var(--primary) / 0.3)' },
					'50%': { boxShadow: '0 0 20px 10px hsl(var(--primary) / 0.1)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'fade-out': 'fade-out 0.3s ease-out',
				'scale-in': 'scale-in 0.2s ease-out',
				'slide-in-right': 'slide-in-right 0.3s ease-out',
				'slide-out-right': 'slide-out-right 0.3s ease-out',
				'pulse-glow': 'pulse-glow 2s infinite',
				'enter': 'fade-in 0.3s ease-out, scale-in 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
