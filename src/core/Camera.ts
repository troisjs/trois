import { Camera } from 'three'
import { defineComponent, inject } from 'vue'
// import Object3D from './Object3D'

interface ThreeInterface {
  camera?: Camera
}

export default defineComponent({
  // TODO: eventually extend Object3D
  // extends: Object3D,
  // inject: ['three'], // don't work with typescript, bug ?
  setup() {
    // this works in sub component ??
    const three = inject('three') as ThreeInterface
    return { three }
  },
  render() {
    return this.$slots.default ? this.$slots.default() : []
  },
})
