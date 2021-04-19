import { defineComponent, watch } from 'vue'
import { OrthographicCamera } from 'three'
import { bindProp } from '../tools'
import Camera from './Camera'

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
    position: { type: Object, default: () => ({ x: 0, y: 0, z: 0 }) },
  },
  setup(props) {
    const camera = new OrthographicCamera(props.left, props.right, props.top, props.bottom, props.near, props.far)

    bindProp(this, 'position', camera)

    const watchProps = ['left', 'right', 'top', 'bottom', 'near', 'far', 'zoom']
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
    this.three.camera = this.camera
  },
  __hmrId: 'OrthographicCamera',
})
