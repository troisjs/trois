import { defineComponent } from 'vue';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import EffectPass from './EffectPass.js';

export default defineComponent({
  extends: EffectPass,
  mounted() {
    if (!this.three.scene) {
      console.error('Missing Scene');
    }
    if (!this.three.camera) {
      console.error('Missing Camera');
    }
    const pass = new RenderPass(this.three.scene, this.three.camera);
    this.completePass(pass);
  },
  __hmrId: 'RenderPass',
});
