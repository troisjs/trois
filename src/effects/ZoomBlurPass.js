import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import EffectPass from './EffectPass.js';
import ZoomBlur from '../shaders/ZoomBlur.js';
import { bindProp } from '../tools.js';

export default {
  extends: EffectPass,
  props: {
    center: { type: Object, default: { x: 0.5, y: 0.5 } },
    strength: { type: Number, default: 0.5 },
  },
  mounted() {
    this.pass = new ShaderPass(ZoomBlur);
    this.passes.push(this.pass);

    const uniforms = this.uniforms = this.pass.uniforms;
    bindProp(this, 'center', uniforms.center, 'value');
    bindProp(this, 'strength', uniforms.strength, 'value');
  },
  __hmrId: 'ZoomBlurPass',
};
