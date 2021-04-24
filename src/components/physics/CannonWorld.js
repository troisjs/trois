import { defineComponent } from 'vue'
import useCannon from './useCannon.js'
import { RendererInjectionKey, SceneInjectionKey } from '../../../build/trois.module.js'

export default defineComponent({
  inject: {
    renderer: RendererInjectionKey,
    scene: SceneInjectionKey,
  },
  props: {
    gravity: { type: Object, default: () => ({ x: 0, y: 0, z: -9.82 }) },
    broadphase: { type: String },
    onBeforeStep: Function,
  },
  created() {
    this._parent = this.getParent()
    if (!this._parent) console.error('Missing parent (Scene, Group...)')

    this.cannon = useCannon({ gravity: this.gravity, broadphase: this.broadphase })
  },
  mounted() {
    this.renderer.onBeforeRender(this.step)
  },
  unmounted() {
    this.renderer.offBeforeRender(this.step)
  },
  methods: {
    step() {
      this.onBeforeStep?.(this.cannon)
      this.cannon.step()
    },
    add(o) {
      this.addToParent(o)
      this.cannon.addMesh(o)
    },
    remove(o) {
      this.removeFromParent(o)
      this.cannon.removeMesh(o)
    },
    getParent() {
      let parent = this.$parent
      while (parent) {
        if (parent.add) return parent
        parent = parent.$parent
      }
      return false
    },
    addToParent(o) {
      if (this._parent) {
        this._parent.add(o)
        return true
      }
      return false
    },
    removeFromParent(o) {
      if (this._parent) {
        this._parent.remove(o)
        return true
      }
      return false
    },
  },
  render() {
    return this.$slots.default ? this.$slots.default() : []
  },
})
