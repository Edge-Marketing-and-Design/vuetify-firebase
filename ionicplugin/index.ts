import * as edgeGlobal from '../global'
import * as ionicComponents from '../ionic'

// TODO FOLLOWING WORK TO MAKE SURE GLOBALS WORK USING PROVIDE/INJECT NEED UPDATE VUETIFY SIDE

export function getComponents(): typeof ionicComponents {
  return ionicComponents
}

export default {
  install: async (app: any) => {
    app.provide('edgeGlobal', edgeGlobal)
    const edgeComponents: any = getComponents()
    Object.keys(edgeComponents).forEach((componentName) => {
      app.component(componentName, edgeComponents[componentName])
    })
  },
}
