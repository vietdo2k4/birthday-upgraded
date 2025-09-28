/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  safelist: [
    "emoji-float",
    "emoji-sm",
    "emoji-md",
    "emoji-lg",
    "aura-lite",
    "a1",
    "a2",
    "decor-lite"
  ],
  theme: { extend: {} },
  plugins: [],
};
