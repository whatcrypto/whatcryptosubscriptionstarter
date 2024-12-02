const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    '../pages/**/*.{js,jsx,ts,tsx}',    // Updated paths
    '../components/**/*.{js,jsx,ts,tsx}',
    '../app/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    theme: {
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1400px',
        },
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          yellow: '#ffcf30',
          gold: '#dcaf1a',
          green: '#52c41a',
          teal: '#1db66c',
          red: '#ff4d4f',
          'red-bright': '#ff4242'
        },
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
        // Light colors
        'surface-light': '#f8fafc',
        // Dark mode / Background colors
        dark: {
          DEFAULT: '#1a1e29',
          lighter: '#2f3037',
          forest: '#1a2928',
          wine: '#301e24',
          overlay: '#1a1e2980',
          base: '#1a1a20',
          'overlay-heavy': '#141414cc',
          deeper: '#121212',
          darkest: '#111116'
        },
        // Neutral colors
        neutral: {
          DEFAULT: '#a1a1aa',
          slate: '#94a3b8',
          darker: '#414249',
          darkest: '#09090b'
        }
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    }
  },
  plugins: [require('tailwindcss-animate')]
};
