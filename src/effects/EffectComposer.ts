import { defineComponent, inject } from 'vue'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { ThreeInterface } from '../core/useThree'
import { Pass } from 'three/examples/jsm/postprocessing/Pass'

interface EffectComposerSetupInterface {
  three: ThreeInterface
  // passes: Pass[]
  composer?: EffectComposer
}

export interface EffectComposerInterface extends EffectComposerSetupInterface {
  addPass(pass: Pass): void
  removePass(pass: Pass): void
}

export default defineComponent({
  setup(): EffectComposerSetupInterface {
    const three = inject('three') as ThreeInterface
    return {
      three,
      // passes: [],
    }
  },
  provide() {
    return {
      composer: this,
    }
  },
  created() {
    const composer = new EffectComposer(this.three.renderer)
    this.composer = composer
    this.three.composer = composer

    this.three.onAfterInit(() => {
      this.three.renderer.autoClear = false
      this.resize()
      this.three.onAfterResize(this.resize)
    })
  },
  unmounted() {
    this.three.offAfterResize(this.resize)
  },
  methods: {
    addPass(pass: Pass) {
      this.composer?.addPass(pass)
    },
    removePass(pass: Pass) {
      this.composer?.removePass(pass)
    },
    resize() {
      this.composer?.setSize(this.three.size.width, this.three.size.height)
    },
  },
  render() {
    return this.$slots.default ? this.$slots.default() : []
  },
  __hmrId: 'EffectComposer',
})
