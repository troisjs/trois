import { defineComponent, inject, PropType, watch } from 'vue'
import { PerspectiveCamera } from 'three'
import { bindObjectProp, bindProp } from '../tools'
import Camera, { cameraSetProp } from './Camera'
import { Vector3PropInterface } from './Object3D'
import { RendererInjectionKey } from './Renderer'

export default defineComponent({
  extends: Camera,
  name: 'PerspectiveCamera',
  props: {
    aspect: { type: Number, default: 1 },
    far: { type: Number, default: 2000 },
    fov: { type: Number, default: 50 },
    near: { type: Number, default: 0.1 },
    position: { type: Object as PropType<Vector3PropInterface>, default: () => ({ x: 0, y: 0, z: 0 }) },
    lookAt: { type: Object as PropType<Vector3PropInterface>, default: null },
  },
  setup(props) {
    const renderer = inject(RendererInjectionKey)
    if (!renderer) {
      console.error('Renderer not found')
      return
    }

    const camera = new PerspectiveCamera(props.fov, props.aspect, props.near, props.far)
    renderer.camera = camera

    bindProp(props, 'position', camera)

    if (props.lookAt) camera.lookAt(props.lookAt.x ?? 0, props.lookAt.y, props.lookAt.z)
    watch(() => props.lookAt, (v) => { camera.lookAt(v.x ?? 0, v.y, v.z) }, { deep: true })

    bindObjectProp(props, 'props', camera, true, cameraSetProp);

    ['aspect', 'far', 'fov', 'near'].forEach(p => {
      // @ts-ignore
      watch(() => props[p], (value) => {
        cameraSetProp(camera, p, value)
      })
    })

    return { renderer, camera }
  },
  __hmrId: 'PerspectiveCamera',
})
