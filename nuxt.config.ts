// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/supabase",
    "@vueuse/nuxt",
    "@nuxt/fonts",
    "vuetify-nuxt-module",
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
  ],
  router: {
    options: {
      scrollBehaviorType: "smooth",
    },
  },
  supabase: {
    redirect: false,
  },
  app: {
    pageTransition: { name: "fly-fade", mode: "out-in" },
  },
  css: ["~/assets/main.scss"],
});
