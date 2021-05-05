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

  props: {
    props: { type: Object, default: () => ({}) },
  },

  // inject: { renderer: RendererInjectionKey as symbol },

  // setup(): CameraSetupInterface {
  //   return {}
  // },

  render() {
    return this.$slots.default ? this.$slots.default() : []
  },
})

export function cameraSetProp(camera: any, key: string, value: any, updateProjectionMatrix = true) {
  camera[key] = value
  if (updateProjectionMatrix) camera.updateProjectionMatrix()
}
