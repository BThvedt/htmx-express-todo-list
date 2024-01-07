/** @type {import('tailwindcss').Config} */
export default {
  content: ["./views/**/*.ejs"],
  theme: {
    extend: {
      colors: {
        "lime-450": "#9de130"
      },
      fontFamily: {
        sans: ["Lato", "sans-serif"],
        todo: ["Indie Flower", "sans-serif"],
        header: ["Rubik Doodle Shadow", "sans-serif"]
      }
    }
  },
  plugins: []
}
