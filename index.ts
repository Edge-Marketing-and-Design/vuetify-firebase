import * as edgeGlobal from './global'
import * as vuetifyComponents from './vuetify'
// import * as ionicComponents from './ionic'

// TODO FOLLOWING WORK TO MAKE SURE GLOBALS WORK USING PROVIDE/INJECT NEED UPDATE VUETIFY SIDE

export function getComponents(framework: 'vuetify' | 'ionic'): typeof vuetifyComponents | typeof ionicComponents {
  switch (framework) {
    case 'vuetify':
      return vuetifyComponents
    // case 'ionic':
    //   return ionicComponents
    default:
      throw new Error(`Unsupported framework: ${framework}`)
  }
}

export default {
  install: async (app: any, framework: 'vuetify' | 'ionic') => {
    app.provide('edgeGlobal', edgeGlobal)
    const edgeComponents: any = getComponents(framework)
    Object.keys(edgeComponents).forEach((componentName) => {
      app.component(componentName, edgeComponents[componentName])
    })
  },
}
