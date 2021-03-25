import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';
import EffectPass from './EffectPass.js';

export default {
  extends: EffectPass,
  mounted() {
    const pass = new ShaderPass(FXAAShader);
    this.completePass(pass);

    // resize will be called in three init
    this.three.onAfterResize(this.resize);
  },
  unmounted() {
    this.three.offAfterResize(this.resize);
  },
  methods: {
    resize() {
      const { resolution } = this.pass.material.uniforms;
      resolution.value.x = 1 / this.three.size.width;
      resolution.value.y = 1 / this.three.size.height;
    },
  },
  __hmrId: 'FXAAPass',
};
