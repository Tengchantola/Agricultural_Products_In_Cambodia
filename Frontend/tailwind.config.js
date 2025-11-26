/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        khmer: [
          "var(--font-khmer-os)",
          "Khmer OS",
          "Hanuman",
          "Battambang",
          "system-ui",
          "sans-serif",
        ],
        "khmer-heading": [
          "var(--font-moul)",
          "Moul",
          "var(--font-khmer-os)",
          "Khmer OS",
          "system-ui",
          "sans-serif",
        ],
        "khmer-content": [
          "var(--font-khmer-os)",
          "Khmer OS",
          "var(--font-hanuman)",
          "Hanuman",
          "system-ui",
          "sans-serif",
        ],
        inter: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      lineHeight: {
        khmer: "1.8",
        "khmer-tight": "1.4",
      },
      spacing: {
        khmer: "0.02em",
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
