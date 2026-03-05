/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        // 🎨 BRAND COLORS - Based on Logo
        navy: {
          50: '#f0f2f5',
          100: '#d9dfe6',
          200: '#b3bfcd',
          300: '#8d9fb4',
          400: '#677f9b',
          500: '#415f82',
          600: '#1a2b4a',  // PRIMARY - Logo navy blue
          700: '#152238',
          800: '#101a2a',
          900: '#0a111c',
        },
        gold: {
          50: '#faf8f3',
          100: '#f5f1e8',
          200: '#ebe3d1',
          300: '#e1d5ba',
          400: '#d7c7a3',
          500: '#c9a961',  // PRIMARY - Logo gold
          600: '#b8954a',
          700: '#9a7d3d',
          800: '#7c6531',
          900: '#5e4d25',
        },
        cream: {
          50: '#fdfcfb',
          100: '#f5f1e8',
          200: '#ebe7de',
          300: '#e1ddd4',
        },

        // Legacy support (mapped to new colors)
        primary: {
          50: '#f0f2f5',
          100: '#d9dfe6',
          200: '#b3bfcd',
          300: '#8d9fb4',
          400: '#677f9b',
          500: '#415f82',
          600: '#1a2b4a',  // Maps to navy-600
          700: '#152238',
          800: '#101a2a',
          900: '#0a111c',
        },
        brand: {
          navy: '#1a2b4a',
          gold: '#c9a961',
          sand: '#f5f1e8',
          soft: '#fdfcfb',
          accent: '#c9a961',
        },

        // UI Colors
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "collapsible-down": {
          from: { height: 0 },
          to: { height: "var(--radix-collapsible-content-height)" },
        },
        "collapsible-up": {
          from: { height: "var(--radix-collapsible-content-height)" },
          to: { height: 0 },
        },
        "fade-in": {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        "slide-up": {
          from: { transform: "translateY(10px)", opacity: 0 },
          to: { transform: "translateY(0)", opacity: 1 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "collapsible-down": "collapsible-down 0.2s ease-out",
        "collapsible-up": "collapsible-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
      },
      boxShadow: {
        'navy': '0 10px 25px -5px rgba(26, 43, 74, 0.15), 0 8px 10px -6px rgba(26, 43, 74, 0.1)',
        'gold': '0 10px 25px -5px rgba(201, 169, 97, 0.15), 0 8px 10px -6px rgba(201, 169, 97, 0.1)',
      },
    },
  },
  plugins: [],
}