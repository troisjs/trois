import { defineComponent } from 'vue'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import EffectPass from './EffectPass'

export default defineComponent({
  extends: EffectPass,
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
    const pass = new RenderPass(this.renderer.scene, this.renderer.camera)
    this.initEffectPass(pass)
  },
  __hmrId: 'RenderPass',
})
