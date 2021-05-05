import { defineComponent, inject, PropType, watch } from 'vue'
import { OrthographicCamera } from 'three'
import { bindObjectProp, bindProp } from '../tools'
import Camera, { cameraSetProp } from './Camera'
import { Vector3PropInterface } from './Object3D'
import { RendererInjectionKey } from './Renderer'

export default defineComponent({
  extends: Camera,
  name: 'OrthographicCamera',
  props: {
    left: { type: Number, default: -1 },
    right: { type: Number, default: 1 },
    top: { type: Number, default: 1 },
    bottom: { type: Number, default: -1 },
    near: { type: Number, default: 0.1 },
    far: { type: Number, default: 2000 },
    zoom: { type: Number, default: 1 },
    position: { type: Object as PropType<Vector3PropInterface>, default: () => ({ x: 0, y: 0, z: 0 }) },
  },
  setup(props) {
    const renderer = inject(RendererInjectionKey)
    if (!renderer) {
      console.error('Renderer not found')
      return
    }

    const camera = new OrthographicCamera(props.left, props.right, props.top, props.bottom, props.near, props.far)
    renderer.camera = camera

    bindProp(props, 'position', camera)
    bindObjectProp(props, 'props', camera, true, cameraSetProp);

    ['left', 'right', 'top', 'bottom', 'near', 'far', 'zoom'].forEach(p => {
      // @ts-ignore
      watch(() => props[p], (value) => {
        cameraSetProp(camera, p, value)
      })
    })

    return { renderer, camera }
  },
  __hmrId: 'OrthographicCamera',
})
