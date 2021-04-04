import { defineComponent } from 'vue';
import { SSAOPass } from 'three/examples/jsm/postprocessing/SSAOPass.js';
import EffectPass from './EffectPass.js';

export default defineComponent({
  extends: EffectPass,
  props: {
    scene: null,
    camera: null,
    options: {
      type: Object,
      default: () => ({}),
    },
  },
  mounted() {
    const pass = new SSAOPass(
      this.scene || this.three.scene,
      this.camera || this.three.camera,
      this.three.size.width,
      this.three.size.height
    );

    for (const key of Object.keys(this.options)) {
      pass[key] = this.options[key];
    }

    this.completePass(pass);
  },
  __hmrId: 'SSAOPass',
});
