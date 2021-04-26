import { Pass } from 'three/examples/jsm/postprocessing/Pass'
import { defineComponent } from 'vue'
import { RendererInjectionKey, RendererInterface } from '../core/Renderer'
import { ComposerInjectionKey, EffectComposerInterface } from './EffectComposer'

export interface EffectSetupInterface {
  renderer?: RendererInterface
  composer?: EffectComposerInterface
  pass?: Pass
}

export default defineComponent({
  // inject for sub components
  inject: {
    renderer: RendererInjectionKey as symbol,
    composer: ComposerInjectionKey as symbol,
  },
  emits: ['ready'],
  setup(): EffectSetupInterface {
    return {}
  },
  created() {
    if (!this.composer) {
      console.error('Missing parent EffectComposer')
    }
    if (!this.renderer) {
      console.error('Missing parent Renderer')
    }
  },
  unmounted() {
    if (this.pass) {
      this.composer?.removePass(this.pass);
      (this.pass as any).dispose?.()
    }
  },
  methods: {
    initEffectPass(pass: Pass) {
      this.pass = pass
      this.composer?.addPass(pass)
      this.$emit('ready', pass)
    },
  },
  render() {
    return []
  },
  __hmrId: 'EffectPass',
})
