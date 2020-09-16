import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';

export default {
  setup() {
    return {
      passes: [],
    };
  },
  inject: ['three'],
  provide() {
    return {
      passes: this.passes,
    };
  },
  mounted() {
    this.three.onAfterInit(() => {
      this.composer = new EffectComposer(this.three.renderer);
      this.passes.forEach(pass => {
        this.composer.addPass(pass);
      });
      this.three.composer = this.composer;
    });
  },
  render() {
    return this.$slots.default();
  },
};
