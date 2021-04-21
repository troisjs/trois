import { defineComponent, inject } from 'vue'
import { RendererInterface } from './Renderer'
// import Object3D from './Object3D'

export default defineComponent({
  // TODO: eventually extend Object3D
  // extends: Object3D,

  // don't work with typescript, bug ?
  // but works in sub components (injection, not typescript)
  inject: ['renderer'],

  setup() {
    // this works with typescript in sub component
    // but setup is not called
    const renderer = inject('renderer') as RendererInterface
    return { renderer }
  },
  render() {
    return this.$slots.default ? this.$slots.default() : []
  },
})
