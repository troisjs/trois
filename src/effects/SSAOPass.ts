import { defineComponent } from 'vue'
import { SSAOPass } from 'three/examples/jsm/postprocessing/SSAOPass.js'
import EffectPass from './EffectPass'

export default defineComponent({
  extends: EffectPass,
  props: {
    options: {
      type: Object,
      default: () => ({}),
    },
  },
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

    const pass = new SSAOPass(
      this.renderer.scene,
      this.renderer.camera,
      this.renderer.size.width,
      this.renderer.size.height
    )

    Object.keys(this.options).forEach(key => {
      // @ts-ignore
      pass[key] = this.options[key]
    })

    this.initEffectPass(pass)
  },
  __hmrId: 'SSAOPass',
})
