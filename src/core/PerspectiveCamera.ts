import { defineComponent, watch } from 'vue'
import { PerspectiveCamera } from 'three'
import { bindProp } from '../tools'
import Camera from './Camera'

export default defineComponent({
  extends: Camera,
  name: 'PerspectiveCamera',
  inject: ['three'],
  props: {
    aspect: { type: Number, default: 1 },
    far: { type: Number, default: 2000 },
    fov: { type: Number, default: 50 },
    near: { type: Number, default: 0.1 },
    position: { type: Object, default: () => ({ x: 0, y: 0, z: 0 }) },
    lookAt: { type: Object, default: null },
  },
  setup(props) {
    return {
      camera: new PerspectiveCamera(props.fov, props.aspect, props.near, props.far),
    }
  },
  created() {
    bindProp(this, 'position', this.camera)

    // TODO : fix lookAt x
    if (this.lookAt) this.camera.lookAt(this.lookAt.x, this.lookAt.y, this.lookAt.z)
    watch(() => this.lookAt, (v) => { this.camera.lookAt(v.x, v.y, v.z) }, { deep: true })

    const watchProps = ['aspect', 'far', 'fov', 'near']
    watchProps.forEach(p => {
      watch(() => this[p], () => {
        this.camera[p] = this[p]
        this.camera.updateProjectionMatrix()
      })
    })

    this.three.camera = this.camera
  },
  __hmrId: 'PerspectiveCamera',
})
