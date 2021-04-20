import { defineComponent, watch } from 'vue'
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js'
import EffectPass from './EffectPass'

const props = {
  focus: { type: Number, default: 1 },
  aperture: { type: Number, default: 0.025 },
  maxblur: { type: Number, default: 0.01 },
}

export default defineComponent({
  extends: EffectPass,
  props,
  created() {
    if (!this.three.scene) {
      console.error('Missing Scene')
      return
    }
    if (!this.three.camera) {
      console.error('Missing Camera')
      return
    }

    const params = {
      focus: this.focus,
      aperture: this.aperture,
      maxblur: this.maxblur,
      width: this.three.size.width,
      height: this.three.size.height,
    }

    const pass = new BokehPass(this.three.scene, this.three.camera, params)

    Object.keys(props).forEach(p => {
      // @ts-ignore
      watch(() => this[p], (value) => { pass.uniforms[p].value = value })
    })

    this.initEffectPass(pass)
  },
  __hmrId: 'BokehPass',
})