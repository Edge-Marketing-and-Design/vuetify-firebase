import edgeFirebaseVuetify from '@edgedev/vuetify-firebase'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(edgeFirebaseVuetify)
})
