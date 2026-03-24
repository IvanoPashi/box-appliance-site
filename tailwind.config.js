/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,liquid,js,md}"],
  theme: {
    extend: {
      colors: {
        "primefix-navy": "#032640",
        "primefix-cream": "#f2edec",
        "primefix-orange": "#d53200",
        "primefix-orange-light": "#ff6b35",
        "primefix-purple": "#6b46c1",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["Georgia", "serif"],
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
      },
      maxWidth: {
        "8xl": "88rem",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [
    // Add line-clamp utility for text truncation
    function ({ addUtilities }) {
      addUtilities({
        ".line-clamp-1": {
          overflow: "hidden",
          display: "-webkit-box",
          "-webkit-box-orient": "vertical",
          "-webkit-line-clamp": "1",
        },
        ".line-clamp-2": {
          overflow: "hidden",
          display: "-webkit-box",
          "-webkit-box-orient": "vertical",
          "-webkit-line-clamp": "2",
        },
        ".line-clamp-3": {
          overflow: "hidden",
          display: "-webkit-box",
          "-webkit-box-orient": "vertical",
          "-webkit-line-clamp": "3",
        },
      });
    },
  ],
};
