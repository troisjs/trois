import { Pass } from 'three/examples/jsm/postprocessing/Pass'
import { defineComponent, inject } from 'vue'
import { ThreeInterface } from '../core/useThree'
import { EffectComposerInterface } from './EffectComposer'

interface EffectSetupInterface {
  three: ThreeInterface
  composer: EffectComposerInterface
  pass?: Pass
}

export default defineComponent({
  inject: ['three', 'composer'],
  emits: ['ready'],
  setup(): EffectSetupInterface {
    const three = inject('three') as ThreeInterface
    const composer = inject('composer') as EffectComposerInterface
    return { three, composer }
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
