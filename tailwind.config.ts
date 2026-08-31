import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#0f0c10",
          2: "#161218",
          3: "#1d1922",
        },
        ink: {
          DEFAULT: "#f4eee7",
          soft: "#d8cfc6",
          muted: "#8a8090",
        },
        line: {
          DEFAULT: "rgba(244, 238, 231, 0.08)",
          strong: "rgba(244, 238, 231, 0.16)",
        },
        accent: {
          rose: "#d96b7c",
          gold: "#c8a96a",
          navy: "#4b5a8a",
          sage: "#7a9a7e",
          plum: "#8e5d8a",
        },
      },
      fontFamily: {
        sans: ["var(--font-noto-kr)", "system-ui", "sans-serif"],
        serif: ["var(--font-cormorant)", "var(--font-noto-kr)", "serif"],
      },
      borderRadius: {
        DEFAULT: "14px",
      },
      maxWidth: {
        site: "1180px",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
