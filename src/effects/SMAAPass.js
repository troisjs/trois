import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js';
import EffectPass from './EffectPass.js';

export default {
  extends: EffectPass,
  mounted() {
    // three size is not set yet, but this pass will be resized by effect composer
    const pass = new SMAAPass(this.three.size.width, this.three.size.height);
    this.passes.push(pass);
    this.pass = pass;
  },
  __hmrId: 'SMAAPass',
};
