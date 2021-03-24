import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js';
import EffectPass from './EffectPass.js';

export default {
  extends: EffectPass,
  mounted() {
    // three size is not set yet, but this pass will be resized by effect composer
    const pass = new SMAAPass(this.three.size.width, this.three.size.height);
    this.completePass(pass);
  },
  __hmrId: 'SMAAPass',
};
