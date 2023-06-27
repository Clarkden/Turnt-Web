/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      colors: {
        mainRed: "#F94144",
        matteBlack: "#28282B",
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
  plugins: [],
};
