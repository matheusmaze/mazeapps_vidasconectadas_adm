const colors = require("tailwindcss/colors");

module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      primary: "#372417",
      secondary: "#F7B71C",
      ternary: "#1C74B4",
      quaternary: "#7EACD5",
      ...colors,
    },
    extend: {
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
      },
    },
    fontFamily: {
      sans: ["Roboto"],
    },
  },
  variants: {
    extend: {
      textColor: ['active'],
    }
  },
  plugins: [],
};
