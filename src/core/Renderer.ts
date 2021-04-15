import { WebGLRenderer } from 'three'
import { defineComponent, h } from 'vue'
import useThree, { ThreeConfigInterface } from './useThree'

export default defineComponent({
  name: 'Renderer',
  props: {
    antialias: Boolean,
    alpha: Boolean,
    autoClear: { type: Boolean, default: true },
    orbitCtrl: { type: [Boolean, Object], default: false },
    pointer: { type: [Boolean, Object], default: false },
    resize: { type: [Boolean, String], default: false },
    shadow: Boolean,
    width: String,
    height: String,
    xr: Boolean,
  },
  setup() {
    const renderer: null | WebGLRenderer = null

    const onMountedCallbacks: {(): void}[] = []
    const beforeRenderCallbacks: {(): void}[] = []
    const afterRenderCallbacks: {(): void}[] = []

    return {
      three: useThree(),
      renderer,
      raf: true,
      onMountedCallbacks,
      beforeRenderCallbacks,
      afterRenderCallbacks,
    }
  },
  provide() {
    return {
      renderer: this,
      three: this.three,
    }
  },
  mounted() {
    const params: ThreeConfigInterface = {
      canvas: this.$el,
      antialias: this.antialias,
      alpha: this.alpha,
      autoClear: this.autoClear,
      orbitCtrl: this.orbitCtrl,
      pointer: this.pointer,
      resize: this.resize,
    }

    if (this.width) params.width = parseInt(this.width)
    if (this.height) params.height = parseInt(this.height)

    if (this.three.init(params)) {
      this.renderer = this.three.renderer
      this.renderer.shadowMap.enabled = this.shadow

      this._render = this.three.composer ? this.three.renderC : this.three.render

      if (this.xr) {
        this.renderer.xr.enabled = true
        this.renderer.setAnimationLoop(this.render)
      } else {
        requestAnimationFrame(this.renderLoop)
      }
    };

    this.onMountedCallbacks.forEach(c => c())
  },
  beforeUnmount() {
    this.beforeRenderCallbacks = []
    this.afterRenderCallbacks = []
    this.raf = false
    this.three.dispose()
  },
  methods: {
    onMounted(cb: {(): void}) {
      this.onMountedCallbacks.push(cb)
    },
    onBeforeRender(cb: {(): void}) {
      this.beforeRenderCallbacks.push(cb)
    },
    offBeforeRender(cb: {(): void}) {
      this.beforeRenderCallbacks = this.beforeRenderCallbacks.filter(c => c !== cb)
    },
    onAfterRender(cb: {(): void}) {
      this.afterRenderCallbacks.push(cb)
    },
    offAfterRender(cb: {(): void}) {
      this.afterRenderCallbacks = this.afterRenderCallbacks.filter(c => c !== cb)
    },
    onAfterResize(cb: {(): void}) {
      this.three.onAfterResize(cb)
    },
    offAfterResize(cb: {(): void}) {
      this.three.offAfterResize(cb)
    },
    render(time: number) {
      this.beforeRenderCallbacks.forEach(c => c({ time }))
      this._render()
      this.afterRenderCallbacks.forEach(c => c({ time }))
    },
    renderLoop(time: number) {
      if (this.raf) requestAnimationFrame(this.renderLoop)
      this.render(time)
    },
  },
  render() {
    return h('canvas', {}, this.$slots.default ? this.$slots.default() : [])
  },
  __hmrId: 'Renderer',
})
