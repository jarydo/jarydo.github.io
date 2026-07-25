/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        macos: "ChiKareGo2, ui-serif",
      },
      backgroundImage: {
        chessboard: "url(/macos_assets/background.png)",
      },
    },
  },
  plugins: [],
};
