import { defineComponent } from 'vue'
// import Object3D from '../core/Object3D';

export default defineComponent({
  // TODO: eventually extend Object3D, for now: error 'injection "scene" not found'
  // because camera is a sibling of scene in Trois
  // extends: Object3D,
  inject: ['three'],
  render() {
    return this.$slots.default ? this.$slots.default() : []
  },
})
