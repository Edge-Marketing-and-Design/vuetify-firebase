import * as globalEdge from './global'
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

export { globalEdge }
