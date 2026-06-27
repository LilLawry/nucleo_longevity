import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#15191B",
        // NB: do not add a color literally named "base" — it collides with
        // Tailwind's built-in `text-base` font-size utility and overrides color.
        surface: "#EEF1F1",
        teal: {
          DEFAULT: "#11605F",
          300: "#9FBEBC",
          900: "#0B3D3C",
        },
      },
      fontFamily: {
        sans: ["var(--font-hanken)", "system-ui", "sans-serif"],
        serif: ["var(--font-newsreader)", "Georgia", "serif"],
        mono: ["var(--font-plex-mono)", "monospace"],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "1rem" }],
      },
      // Clinical: neutralise soft radii everywhere; keep pills/circles only.
      borderRadius: {
        none: "0",
        sm: "2px",
        DEFAULT: "2px",
        md: "2px",
        lg: "2px",
        xl: "2px",
        "2xl": "2px",
        "3xl": "2px",
        full: "9999px",
      },
      letterSpacing: {
        widest2: "0.2em",
        widest3: "0.3em",
      },
      typography: ({ theme }: { theme: (path: string) => string }) => ({
        DEFAULT: {
          css: {
            "--tw-prose-body": theme("colors.ink"),
            "--tw-prose-headings": theme("colors.ink"),
            "--tw-prose-links": theme("colors.teal.DEFAULT"),
            "--tw-prose-bold": theme("colors.ink"),
            "--tw-prose-counters": theme("colors.teal.300"),
            "--tw-prose-bullets": theme("colors.teal.DEFAULT"),
            "--tw-prose-hr": "rgba(21,25,27,0.12)",
            "--tw-prose-quotes": theme("colors.ink"),
            "--tw-prose-quote-borders": theme("colors.teal.DEFAULT"),
            "--tw-prose-captions": "#5C6669",
            "--tw-prose-code": theme("colors.ink"),
            "--tw-prose-pre-code": theme("colors.surface"),
            "--tw-prose-pre-bg": theme("colors.ink"),
            fontFamily: theme("fontFamily.serif"),
            fontSize: "1.0625rem",
            lineHeight: "1.75",
            maxWidth: "none",
            a: { textDecoration: "none", fontWeight: "500", "&:hover": { color: theme("colors.teal.900") } },
            "h1,h2,h3,h4": { fontFamily: theme("fontFamily.sans"), fontWeight: "500", letterSpacing: "-0.02em" },
            code: { fontFamily: theme("fontFamily.mono"), fontSize: "0.875em", fontWeight: "400" },
            "code::before": { content: '""' },
            "code::after": { content: '""' },
          },
        },
        invert: {
          css: {
            "--tw-prose-body": "#E8EDEC",
            "--tw-prose-headings": "#F0F4F3",
            "--tw-prose-links": theme("colors.teal.300"),
            "--tw-prose-hr": "rgba(238,241,241,0.12)",
            "--tw-prose-quotes": "#E8EDEC",
            "--tw-prose-quote-borders": theme("colors.teal.300"),
          },
        },
      }),
    },
  },
  plugins: [typography],
};

export default config;
