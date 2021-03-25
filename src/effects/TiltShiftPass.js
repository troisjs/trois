import { Vector2 } from 'three';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { watch } from 'vue';
import EffectPass from './EffectPass.js';
import TiltShift from '../shaders/TiltShift.js';
import { bindProp } from '../tools';

export default {
  extends: EffectPass,
  props: {
    blurRadius: { type: Number, default: 10 },
    gradientRadius: { type: Number, default: 100 },
    start: { type: Object, default: { x: 0, y: 100 } },
    end: { type: Object, default: { x: 10, y: 100 } },
  },
  mounted() {
    this.pass = new ShaderPass(TiltShift);
    this.passes.push(this.pass);

    this.pass1 = new ShaderPass(TiltShift);
    this.passes.push(this.pass1);

    const uniforms = this.uniforms = this.pass.uniforms;
    const uniforms1 = this.uniforms1 = this.pass1.uniforms;
    uniforms1.blurRadius = uniforms.blurRadius;
    uniforms1.gradientRadius = uniforms.gradientRadius;
    uniforms1.start = uniforms.start;
    uniforms1.end = uniforms.end;
    uniforms1.texSize = uniforms.texSize;

    bindProp(this, 'blurRadius', uniforms.blurRadius, 'value');
    bindProp(this, 'gradientRadius', uniforms.gradientRadius, 'value');

    this.updateFocusLine();
    ['start', 'end'].forEach(p => {
      watch(() => this[p], this.updateFocusLine, { deep: true });
    });

    this.pass.setSize = (width, height) => {
      uniforms.texSize.value.set(width, height);
    };
  },
  methods: {
    updateFocusLine() {
      this.uniforms.start.value.copy(this.start);
      this.uniforms.end.value.copy(this.end);
      const dv = new Vector2().copy(this.end).sub(this.start).normalize();
      this.uniforms.delta.value.copy(dv);
      this.uniforms1.delta.value.set(-dv.y, dv.x);
    },
  },
  __hmrId: 'TiltShiftPass',
};
