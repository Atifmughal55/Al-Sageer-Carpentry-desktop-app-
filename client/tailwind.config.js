/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#3B82F6", // Tailwind's blue-500
          light: "#60A5FA", // blue-400
          dark: "#2563EB", // blue-600
        },
      },
    },
  },
  plugins: [],
};
