import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
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
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
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
        // Pirate theme colors
        parchment: {
          DEFAULT: "hsl(var(--parchment))",
          dark: "hsl(var(--parchment-dark))",
        },
        treasure: {
          DEFAULT: "hsl(var(--treasure-gold))",
          glow: "hsl(var(--treasure-glow))",
        },
        ocean: {
          deep: "hsl(var(--ocean-deep))",
          light: "hsl(var(--ocean-light))",
        },
        wood: {
          dark: "hsl(var(--wood-dark))",
          light: "hsl(var(--wood-light))",
        },
        brass: {
          DEFAULT: "hsl(var(--brass))",
          light: "hsl(var(--brass-light))",
        },
        mapInk: "hsl(var(--map-ink))",
        bloodRed: "hsl(var(--blood-red))",
      },
      backgroundImage: {
        'gradient-ocean': 'var(--gradient-ocean)',
        'gradient-treasure': 'var(--gradient-treasure)',
        'gradient-parchment': 'var(--gradient-parchment)',
        'gradient-brass': 'var(--gradient-brass)',
      },
      boxShadow: {
        'treasure': 'var(--shadow-treasure)',
        'map': 'var(--shadow-map)',
        'compass': 'var(--shadow-compass)',
      },
      fontFamily: {
        'pirate': ['var(--font-pirate)'],
        'nautical': ['var(--font-nautical)'],
      },
      transitionTimingFunction: {
        'sail': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'wave': 'cubic-bezier(0.45, 0, 0.55, 1)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
