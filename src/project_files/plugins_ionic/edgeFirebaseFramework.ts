import edgeFirebaseFramework from '@edgedev/firebase-framework'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(edgeFirebaseFramework, 'ionic')
})
