import { defineComponent } from 'vue'
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js'
import EffectPass from './EffectPass'

export default defineComponent({
  extends: EffectPass,
  created() {
    if (!this.renderer) return

    const pass = new SMAAPass(this.renderer.size.width, this.renderer.size.height)
    this.initEffectPass(pass)
  },
  __hmrId: 'SMAAPass',
})
