import Stats from 'stats.js'
import { RendererInjectionKey } from '../../../build/trois.module.js'

export default {
  props: {
    noSetup: { type: Boolean, default: false },
  },
  emits: ['created'],
  inject: { renderer: RendererInjectionKey },
  setup({ noSetup }) {
    const stats = new Stats()
    if (!noSetup) {
      stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
      document.body.appendChild(stats.dom)
    }
    return { stats }
  },
  mounted() {
    if (!this.noSetup) {
      this.renderer.onBeforeRender(this.begin)
      this.renderer.onAfterRender(this.end)
    }
    this.$emit('created', { stats: this.stats })
  },
  methods: {
    begin() {
      if (this.stats) {
        this.stats.begin()
      }
    },
    end() {
      if (this.stats) {
        this.stats.end()
      }
    },
  },
  unmounted() {
    if (this.stats && this.stats.dom) {
      this.stats.dom.parentElement.removeChild(this.stats.dom)
    }
    this.renderer.offBeforeRender(this.begin)
    this.renderer.offAfterRender(this.end)
  },
  render() {
    return this.$slots.default ? this.$slots.default() : []
  },
}
