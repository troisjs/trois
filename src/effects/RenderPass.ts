import { defineComponent } from 'vue'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import EffectPass from './EffectPass'

export default defineComponent({
  extends: EffectPass,
  created() {
    if (!this.three.scene) {
      console.error('Missing Scene')
      return
    }
    if (!this.three.camera) {
      console.error('Missing Camera')
      return
    }
    const pass = new RenderPass(this.three.scene, this.three.camera)
    this.initEffectPass(pass)
  },
  __hmrId: 'RenderPass',
})
