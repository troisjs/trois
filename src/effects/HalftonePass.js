import { HalftonePass } from 'three/examples/jsm/postprocessing/HalftonePass.js';
import { watch } from 'vue';
import EffectPass from './EffectPass.js';

export default {
  extends: EffectPass,
  props: {
    shape: { type: Number, default: 1 },
    radius: { type: Number, default: 4 },
    rotateR: { type: Number, default: Math.PI / 12 * 1 },
    rotateG: { type: Number, default: Math.PI / 12 * 2 },
    rotateB: { type: Number, default: Math.PI / 12 * 3 },
    scatter: { type: Number, default: 0 },
  },
  mounted() {
    const pass = new HalftonePass(this.three.size.width, this.three.size.height, {});

    ['shape', 'radius', 'rotateR', 'rotateG', 'rotateB', 'scatter'].forEach(p => {
      pass.uniforms[p].value = this[p];
      watch(() => this[p], () => {
        pass.uniforms[p].value = this[p];
      });
    });

    this.passes.push(pass);
    this.pass = pass;
  },
  __hmrId: 'HalftonePass',
};
