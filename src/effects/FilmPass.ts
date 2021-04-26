import { defineComponent, watch } from 'vue'
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js'
import EffectPass from './EffectPass'

const props = {
  noiseIntensity: { type: Number, default: 0.5 },
  scanlinesIntensity: { type: Number, default: 0.05 },
  scanlinesCount: { type: Number, default: 4096 },
  grayscale: { type: Number, default: 0 },
} as const

export default defineComponent({
  extends: EffectPass,
  props,
  created() {
    const pass = new FilmPass(this.noiseIntensity, this.scanlinesIntensity, this.scanlinesCount, this.grayscale)

    Object.keys(props).forEach(p => {
      // @ts-ignore
      watch(() => this[p], (value) => { pass.uniforms[p].value = value })
    })

    this.initEffectPass(pass)
  },
  __hmrId: 'FilmPass',
})
