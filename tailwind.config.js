/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {},
      fontFamily: {
        macos: "ChiKareGo2, ui-serif",
        wii: "FOT-RodinNTLG Pro, sans-serif",
      },
      cursor: {
        default: "url(/macos_assets/cursor.png), auto",
        wii: "url(/wii_assets/cursor.png), auto",
      },
      backgroundImage: {
        chessboard: "url(/macos_assets/background.png)",
        wiiFooter: "url(/wii_assets/footer.svg)",
      },
      animation: {
        flash: "flash 2s infinite",
      },
      keyframes: {
        flash: {
          "0%, 50%": { opacity: "0.7" },
          "51%, 100%": { opacity: "0" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
