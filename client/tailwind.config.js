/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--primary-color)",
          light: "var(--primary-color-light)",
        },
        secondary: {
          DEFAULT: "var(--secondary-color)",
          light: "var(--secondary-color-light)",
        },
        neutral: {
          DEFAULT: "var(--neutral-color)",
          light: "var(--neutral-color-light)",
        },
      },
      animation: {
        spin: "spin 1s linear infinite",
      },
      keyframes: {
        spin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
    },
  },
};
