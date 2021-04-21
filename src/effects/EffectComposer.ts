import { defineComponent, inject } from 'vue'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { Pass } from 'three/examples/jsm/postprocessing/Pass'
import { RendererInterface } from '../core/Renderer'

interface EffectComposerSetupInterface {
  renderer: RendererInterface
  composer?: EffectComposer
}

export interface EffectComposerInterface extends EffectComposerSetupInterface {
  addPass(pass: Pass): void
  removePass(pass: Pass): void
}

export default defineComponent({
  setup(): EffectComposerSetupInterface {
    const renderer = inject('renderer') as RendererInterface
    return {
      renderer,
    }
  },
  provide() {
    return {
      composer: this,
    }
  },
  created() {
    const composer = new EffectComposer(this.renderer.renderer)
    this.composer = composer
    this.renderer.three.composer = composer

    // this.renderer.onInit(() => {
    this.renderer.addListener('init', () => {
      this.renderer.renderer.autoClear = false
      this.resize()
      // this.renderer.onResize(this.resize)
      this.renderer.addListener('resize', this.resize)
    })
  },
  unmounted() {
    // this.renderer.offResize(this.resize)
    this.renderer.removeListener('resize', this.resize)
  },
  methods: {
    addPass(pass: Pass) {
      this.composer?.addPass(pass)
    },
    removePass(pass: Pass) {
      this.composer?.removePass(pass)
    },
    resize() {
      this.composer?.setSize(this.renderer.size.width, this.renderer.size.height)
    },
  },
  render() {
    return this.$slots.default ? this.$slots.default() : []
  },
  __hmrId: 'EffectComposer',
})
