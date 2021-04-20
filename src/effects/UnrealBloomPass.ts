import { defineComponent, watch } from 'vue'
import { Vector2 } from 'three'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import EffectPass from './EffectPass'

const props = {
  strength: { type: Number, default: 1.5 },
  radius: { type: Number, default: 0 },
  threshold: { type: Number, default: 0 },
}

export default defineComponent({
  extends: EffectPass,
  props,
  created() {
    const size = new Vector2(this.three.size.width, this.three.size.height)
    const pass = new UnrealBloomPass(size, this.strength, this.radius, this.threshold)

    Object.keys(props).forEach(p => {
      // @ts-ignore
      watch(() => this[p], (value) => { pass.uniforms[p].value = value })
    })

    this.initEffectPass(pass)
  },
  __hmrId: 'UnrealBloomPass',
})