import edgeFirebaseFramework from '@edgedev/firebase-framework/ionicplugin'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(edgeFirebaseFramework)
})
