// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ['vuetify/lib/styles/main.sass', '@mdi/font/css/materialdesignicons.min.css'],
  ssr: false,
  build: {
    transpile: ['vuetify'],
  },
  runtimeConfig: {
    public: {
      registrationCode: process.env.REGISTRATION_CODE,
    },
  },
  components: {
    dirs: [
      { path: '~/components/formSubtypes', global: true, prefix: 'form-subtypes' },
      { path: '~/components/submitTemplates', global: true, prefix: 'submit-templates' },
      '~/components',
    ],
  },
  vite: {
    define: {
      'process.env.DEBUG': false,
    },
  },
})
