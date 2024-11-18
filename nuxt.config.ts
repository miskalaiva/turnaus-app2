// nuxt.config.ts
export default defineNuxtConfig({
  css: ['@/assets/css/tailwind.css'], // Lisää Tailwind CSS tähän
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
})