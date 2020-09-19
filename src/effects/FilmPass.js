import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js';
import EffectPass from './EffectPass.js';

export default {
  extends: EffectPass,
  props: {
    noiseIntensity: {
      type: Number,
      default: 0.5,
    },
    scanlinesIntensity: {
      type: Number,
      default: 0.05,
    },
    scanlinesCount: {
      type: Number,
      default: 4096,
    },
    grayscale: {
      type: Number,
      default: 0,
    },
  },
  watch: {
    noiseIntensity() { this.pass.uniforms.nIntensity.value = this.noiseIntensity; },
    scanlinesIntensity() { this.pass.uniforms.sIntensity.value = this.scanlinesIntensity; },
    scanlinesCount() { this.pass.uniforms.sCount.value = this.scanlinesCount; },
    grayscale() { this.pass.uniforms.grayscale.value = this.grayscale; },
  },
  mounted() {
    const pass = new FilmPass(this.noiseIntensity, this.scanlinesIntensity, this.scanlinesCount, this.grayscale);
    this.passes.push(pass);
    this.pass = pass;
  },
  __hmrId: 'FilmPass',
};
