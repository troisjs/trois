import { defineComponent, watch } from 'vue'
import { HalftonePass } from 'three/examples/jsm/postprocessing/HalftonePass.js'
import EffectPass from './EffectPass'

const props = {
  shape: { type: Number, default: 1 },
  radius: { type: Number, default: 4 },
  rotateR: { type: Number, default: Math.PI / 12 * 1 },
  rotateG: { type: Number, default: Math.PI / 12 * 2 },
  rotateB: { type: Number, default: Math.PI / 12 * 3 },
  scatter: { type: Number, default: 0 },
} as const

export default defineComponent({
  extends: EffectPass,
  props,
  created() {
    if (!this.renderer) return

    const pass = new HalftonePass(this.renderer.size.width, this.renderer.size.height, {})

    Object.keys(props).forEach(p => {
      // @ts-ignore
      pass.uniforms[p].value = this[p]
      // @ts-ignore
      watch(() => this[p], (value) => { pass.uniforms[p].value = value })
    })

    this.initEffectPass(pass)
  },
  __hmrId: 'HalftonePass',
})
