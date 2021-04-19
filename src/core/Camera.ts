import { Camera } from 'three'
import { defineComponent, inject } from 'vue'
// import Object3D from './Object3D'

interface ThreeInterface {
  camera?: Camera
}

export default defineComponent({
  // TODO: eventually extend Object3D
  // extends: Object3D,

  // don't work with typescript, bug ?
  // but works in sub components (injection, not typescript)
  inject: ['three'],

  setup() {
    // this works with typescript in sub component
    // but setup is not called
    const three = inject('three') as ThreeInterface
    return { three }
  },
  render() {
    return this.$slots.default ? this.$slots.default() : []
  },
})
