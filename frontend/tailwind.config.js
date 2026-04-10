/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: "#f8fafc",
        "surface-muted": "#f1f5f9",

        ink: "#0f172a",
        "ink-muted": "#475569",
        "ink-light": "#94a3b8",

        primary: {
          50: "#ecfdf5",
          400: "#34d399",
          700: "#15803d",
          800: "#166534",
        },
      },

      fontFamily: {
        body: ["Inter", "sans-serif"],
        display: ["Poppins", "sans-serif"],
      },

      boxShadow: {
        card: "0 4px 12px rgba(0,0,0,0.05)",
        "card-hover": "0 8px 20px rgba(0,0,0,0.08)",
        green: "0 4px 14px rgba(34,197,94,0.3)",
      },
    },
  },
  plugins: [],
};