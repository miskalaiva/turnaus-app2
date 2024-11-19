// nuxt.config.ts
export default defineNuxtConfig({
  // Lisää Tailwind CSS tähän
  css: ['@/assets/css/tailwind.css'],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  compatibilityDate: '2024-11-18',
})