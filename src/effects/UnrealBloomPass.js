import { defineComponent } from 'vue';
import { Vector2 } from 'three';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import EffectPass from './EffectPass.js';

export default defineComponent({
  extends: EffectPass,
  props: {
    strength: { type: Number, default: 1.5 },
    radius: { type: Number, default: 0 },
    threshold: { type: Number, default: 0 },
  },
  watch: {
    strength() { this.pass.strength = this.strength; },
    radius() { this.pass.radius = this.radius; },
    threshold() { this.pass.threshold = this.threshold; },
  },
  mounted() {
    const size = new Vector2(this.three.size.width, this.three.size.height);
    const pass = new UnrealBloomPass(size, this.strength, this.radius, this.threshold);
    this.completePass(pass);
  },
  __hmrId: 'UnrealBloomPass',
});
