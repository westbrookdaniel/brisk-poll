module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {
      fontFamily: {
        logo: [
          "Satoshi-BlackItalic",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
        body: [
          "GeneralSans-Variable",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
        display: [
          "GeneralSans-Variable",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
        mono: ["Monaco", "Consolas", "Courier New", "Courier", "monospace"],
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
