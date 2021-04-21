import { Pass } from 'three/examples/jsm/postprocessing/Pass'
import { defineComponent, inject } from 'vue'
import { RendererInterface } from '../core/Renderer'
import { EffectComposerInterface } from './EffectComposer'

interface EffectSetupInterface {
  renderer: RendererInterface
  composer: EffectComposerInterface
  pass?: Pass
}

export default defineComponent({
  inject: ['renderer', 'composer'],
  emits: ['ready'],
  setup(): EffectSetupInterface {
    const renderer = inject('renderer') as RendererInterface
    const composer = inject('composer') as EffectComposerInterface
    return { renderer, composer }
  },
  created() {
    if (!this.composer) {
      console.error('Missing parent EffectComposer')
    }
  },
  unmounted() {
    if (this.pass) {
      this.composer.removePass(this.pass);
      (this.pass as any).dispose?.()
    }
  },
  methods: {
    initEffectPass(pass: Pass) {
      this.pass = pass
      this.composer.addPass(pass)
      this.$emit('ready', pass)
    },
  },
  render() {
    return []
  },
  __hmrId: 'EffectPass',
})
