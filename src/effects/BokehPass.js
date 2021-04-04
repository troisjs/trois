import { defineComponent } from 'vue';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';
import EffectPass from './EffectPass.js';

export default defineComponent({
  extends: EffectPass,
  props: {
    focus: {
      type: Number,
      default: 1,
    },
    aperture: {
      type: Number,
      default: 0.025,
    },
    maxblur: {
      type: Number,
      default: 0.01,
    },
  },
  watch: {
    focus() { this.pass.uniforms.focus.value = this.focus; },
    aperture() { this.pass.uniforms.aperture.value = this.aperture; },
    maxblur() { this.pass.uniforms.maxblur.value = this.maxblur; },
  },
  mounted() {
    if (!this.three.scene) {
      console.error('Missing Scene');
    }
    if (!this.three.camera) {
      console.error('Missing Camera');
    }
    const params = {
      focus: this.focus,
      aperture: this.aperture,
      maxblur: this.maxblur,
      width: this.three.size.width,
      height: this.three.size.height,
    };
    const pass = new BokehPass(this.three.scene, this.three.camera, params);
    this.completePass(pass);
  },
  __hmrId: 'BokehPass',
});
