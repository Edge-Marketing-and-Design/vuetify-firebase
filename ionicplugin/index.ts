import * as edgeGlobal from '../global'
import * as ionicComponents from '../ionic'

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
