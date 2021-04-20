import { defineComponent } from 'vue'
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js'
import EffectPass from './EffectPass'

export default defineComponent({
  extends: EffectPass,
  created() {
    // three size is not set yet, but this pass will be resized by effect composer
    const pass = new SMAAPass(this.three.size.width, this.three.size.height)
    this.initEffectPass(pass)
  },
  __hmrId: 'SMAAPass',
})
