import * as edgeGlobal from './global'
import * as vuetifyComponents from './vuetify'
import * as ionicComponents from './ionic'

export function getComponents(framework: 'vuetify' | 'ionic'): typeof vuetifyComponents | typeof ionicComponents {
  switch (framework) {
    case 'vuetify':
      return vuetifyComponents
    case 'ionic':
      return ionicComponents
    default:
      throw new Error(`Unsupported framework: ${framework}`)
  }
}

export default {
  install: async (app: any, framework: 'vuetify' | 'ionic') => {
    app.provide('edgeGlobal', edgeGlobal)
    if (framework === 'vuetify') {
      const { createVuetify } = await import('vuetify')
      const components = await import('vuetify/components')
      const directives = await import('vuetify/directives')
      const vuetify = createVuetify({
        theme: {
          defaultTheme: 'light',
        },
        components,
        directives,
      })
      app.use(vuetify)
    }
    const edgeComponents: any = getComponents(framework)
    Object.keys(edgeComponents).forEach((componentName) => {
      app.component(componentName, edgeComponents[componentName])
    })
  },
}
