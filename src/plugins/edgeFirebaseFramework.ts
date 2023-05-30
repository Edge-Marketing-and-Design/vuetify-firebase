import { getComponents } from '../testplugin2'

const framework = 'vuetify' // Or 'ionic'

let vuetify

const components: any = getComponents(framework)

export default defineNuxtPlugin(async (nuxtApp) => {
  if (framework === 'vuetify') {
    const { createVuetify } = await import('vuetify')
    const components = await import('vuetify/components')
    const directives = await import('vuetify/directives')
    vuetify = createVuetify({
      theme: {
        defaultTheme: 'light',
      },
      components,
      directives,
    })

    nuxtApp.vueApp.use(vuetify)
  }
  Object.keys(components).forEach((componentName) => {
    nuxtApp.vueApp.component(componentName, components[componentName])
  })
})
