import { defineComponent } from 'vue'
// import { Camera } from 'three'
// import { RendererInjectionKey, RendererInterface } from './Renderer'
// import Object3D from './Object3D'

// export interface CameraSetupInterface {
//   renderer?: RendererInterface
//   camera: Camera
// }

export default defineComponent({
  // TODO: eventually extend Object3D
  // extends: Object3D,

  // inject: { renderer: RendererInjectionKey as symbol },

  // setup(): CameraSetupInterface {
  //   return {}
  // },

  render() {
    return this.$slots.default ? this.$slots.default() : []
  },
})
