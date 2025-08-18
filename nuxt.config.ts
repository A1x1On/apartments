export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: false },

  typescript: {
    strict: true,
    typeCheck: true,
  },

  modules: [
    "@vueuse/nuxt",
    "@nuxt/test-utils/module",
    "@nuxt/fonts",
    "@nuxt/image",
    "@pinia/nuxt",
    "dayjs-nuxt",
    "nuxt-typed-router",
    "@nuxt/ui",
  ],

  css: ["@/assets/css/main.css", "@/assets/css/styles.scss"],

  colorMode: {
    preference: "light",
    fallback: "light",
    classSuffix: "",
  },
  nitro: {
    routeRules: {
      "/api/**": { proxy: "http://localhost:9091/api/v1/**" },
    },
  },

  fonts: {
    families: [{ name: "PT Root UI", provider: "local", global: true }],
    defaults: {
      weights: [400, 500, 700],
      styles: ["normal"],
      subsets: ["latin", "cyrillic"],
    },
  },
});
