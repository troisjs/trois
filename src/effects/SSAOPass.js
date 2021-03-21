import { SSAOPass } from 'three/examples/jsm/postprocessing/SSAOPass.js';
import EffectPass from './EffectPass.js';

export default {
  extends: EffectPass,
  props: {
    scene: null,
    camera: null,
    options: {
      type: Object,
      default: () => ({})
    }
  },
  mounted() {
    const pass = new SSAOPass(
      this.scene || this.three.scene,
      this.camera || this.three.camera,
      this.three.size.width,
      this.three.size.height
    );
    this.passes.push(pass);
    this.pass = pass;

    for (let key of Object.keys(this.options)) {
      this.pass[key] = this.options[key];
    }
    // resize will be called in three init
    this.three.onAfterResize(this.resize);
  },
  unmounted() {
    this.three.offAfterResize(this.resize);
  },
  methods: {
    resize() {
      this.pass.width = this.three.size.width
      this.pass.height = this.three.size.height
    },
  },
  __hmrId: 'FXAAPass',
};
