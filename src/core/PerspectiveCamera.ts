import { defineComponent, PropType, watch } from 'vue'
import { PerspectiveCamera } from 'three'
import { bindProp } from '../tools'
import Camera from './Camera'
import { Vector3PropInterface } from './Object3D'

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
    const camera = new PerspectiveCamera(props.fov, props.aspect, props.near, props.far)

    bindProp(props, 'position', camera)

    if (props.lookAt) camera.lookAt(props.lookAt.x ?? 0, props.lookAt.y, props.lookAt.z)
    watch(() => props.lookAt, (v) => { camera.lookAt(v.x ?? 0, v.y, v.z) }, { deep: true })

    const watchProps = ['aspect', 'far', 'fov', 'near']
    watchProps.forEach(p => {
      // @ts-ignore
      watch(() => props[p], (value) => {
        // @ts-ignore
        camera[p] = value
        camera.updateProjectionMatrix()
      })
    })

    return { camera }
  },
  created() {
    this.renderer.camera = this.camera
  },
  __hmrId: 'PerspectiveCamera',
})
