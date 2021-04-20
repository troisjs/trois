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
    if (!this.three.scene) {
      console.error('Missing Scene')
      return
    }
    if (!this.three.camera) {
      console.error('Missing Camera')
      return
    }

    const pass = new SSAOPass(
      this.three.scene,
      this.three.camera,
      this.three.size.width,
      this.three.size.height
    )

    Object.keys(this.options).forEach(key => {
      // @ts-ignore
      pass[key] = this.options[key]
    })

    this.initEffectPass(pass)
  },
  __hmrId: 'SSAOPass',
})
