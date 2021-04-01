import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import EffectPass from './EffectPass.js';
import ZoomBlur from '../shaders/ZoomBlur.js';
import { bindProp } from '../tools';

export default {
  extends: EffectPass,
  props: {
    center: { type: Object, default: { x: 0.5, y: 0.5 } },
    strength: { type: Number, default: 0.5 },
  },
  mounted() {
    const pass = new ShaderPass(ZoomBlur);

    const uniforms = this.uniforms = pass.uniforms;
    bindProp(this, 'center', uniforms.center, 'value');
    bindProp(this, 'strength', uniforms.strength, 'value');

    this.completePass(pass);
  },
  __hmrId: 'ZoomBlurPass',
};
