import { defineComponent, watch } from 'vue'
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js'
import EffectPass from './EffectPass'

const props = {
  focus: { type: Number, default: 1 },
  aperture: { type: Number, default: 0.025 },
  maxblur: { type: Number, default: 0.01 },
} as const

export default defineComponent({
  extends: EffectPass,
  props,
  created() {
    if (!this.renderer) return

    if (!this.renderer.scene) {
      console.error('Missing Scene')
      return
    }
    if (!this.renderer.camera) {
      console.error('Missing Camera')
      return
    }

    const params = {
      focus: this.focus,
      aperture: this.aperture,
      maxblur: this.maxblur,
      width: this.renderer.size.width,
      height: this.renderer.size.height,
    }

    const pass = new BokehPass(this.renderer.scene, this.renderer.camera, params)

    Object.keys(props).forEach(p => {
      // @ts-ignore
      watch(() => this[p], (value) => { pass.uniforms[p].value = value })
    })

    this.initEffectPass(pass)
  },
  __hmrId: 'BokehPass',
})
