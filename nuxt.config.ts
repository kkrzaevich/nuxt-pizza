// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: ["@nuxtjs/supabase", "@vueuse/nuxt", "@nuxt/fonts"],
  router: {
    options: {
      scrollBehaviorType: "smooth",
    },
  },
  css: ["~/assets/main.scss"],
});
