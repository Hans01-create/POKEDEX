/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Bebas Neue'", "cursive"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'DM Mono'", "monospace"],
      },
      colors: {
        poke: {
          red: "#E3350D",
          dark: "#0A0A0F",
          card: "#13131A",
          border: "#1E1E2E",
          muted: "#3A3A4A",
          text: "#E8E8F0",
          sub: "#8888A0",
        },
      },
      keyframes: {
        fadeIn: { from: { opacity: "0", transform: "translateY(12px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
        spin3d: { "0%": { transform: "rotateY(0deg)" }, "100%": { transform: "rotateY(360deg)" } },
        pulseGlow: { "0%,100%": { boxShadow: "0 0 0px rgba(227,53,13,0)" }, "50%": { boxShadow: "0 0 30px rgba(227,53,13,0.4)" } },
        float: { "0%,100%": { transform: "translateY(0px)" }, "50%": { transform: "translateY(-8px)" } },
      },
      animation: {
        fadeIn: "fadeIn 0.4s ease forwards",
        shimmer: "shimmer 2s linear infinite",
        spin3d: "spin3d 8s linear infinite",
        pulseGlow: "pulseGlow 2s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
