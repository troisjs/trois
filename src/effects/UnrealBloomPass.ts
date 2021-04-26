import { defineComponent, watch } from 'vue'
import { Vector2 } from 'three'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import EffectPass from './EffectPass'

const props = {
  strength: { type: Number, default: 1.5 },
  radius: { type: Number, default: 0 },
  threshold: { type: Number, default: 0 },
} as const

export default defineComponent({
  extends: EffectPass,
  props,
  created() {
    if (!this.renderer) return

    const size = new Vector2(this.renderer.size.width, this.renderer.size.height)
    const pass = new UnrealBloomPass(size, this.strength, this.radius, this.threshold)

    Object.keys(props).forEach(p => {
      // @ts-ignore
      watch(() => this[p], (value) => { pass.uniforms[p].value = value })
    })

    this.initEffectPass(pass)
  },
  __hmrId: 'UnrealBloomPass',
})
