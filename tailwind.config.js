/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      colors: {
        mainRed: "#F94144",
        matteBlack: "#28282B",
        stripe: "#6772e5",
        text: "#fdfcfc",
        background: "#060505",
        primary: "#F94144",
        secondary: "#1c1717",
        accent: "#73738c",
      },
      dropShadow: {
        glow: [
          "0 0px 20px rgba(255,255, 255, 0.35)",
          "0 0px 65px rgba(255, 255,255, 0.2)",
        ],
        "glow-gradient":
          "0 0px 20px rgba(63, 236, 157, 0.35), 0 0px 65px rgba(159, 122, 234, 0.2)",
      },
    },
  },
  plugins: [
    require("@tailwindcss/aspect-ratio"),
  ],
};
