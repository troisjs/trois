import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';
import EffectPass from './EffectPass.js';

export default {
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
  // watch: {
  //   focus() {
  //     this.pass.focus = this.focus;
  //   },
  //   aperture() {
  //     this.pass.aperture = this.aperture;
  //   },
  //   maxblur() {
  //     this.pass.maxblur = this.maxblur;
  //   },
  // },
  mounted() {
    if (!this.three.scene) {
      console.error('Missing Scene');
    }
    if (!this.three.camera) {
      console.error('Missing Camera');
    }
    const params = { ...this.$props, width: this.three.size.width, height: this.three.size.height };
    const pass = new BokehPass(this.three.scene, this.three.camera, params);
    this.passes.push(pass);
    this.pass = pass;
  },
};
