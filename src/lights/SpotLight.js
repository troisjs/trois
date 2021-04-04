import { defineComponent, watch } from 'vue';
import { SpotLight } from 'three';
import Light from './Light.js';

export default defineComponent({
  extends: Light,
  props: {
    angle: { type: Number, default: Math.PI / 3 },
    decay: { type: Number, default: 1 },
    distance: { type: Number, default: 0 },
    penumbra: { type: Number, default: 0 },
    target: Object,
  },
  created() {
    this.light = new SpotLight(this.color, this.intensity, this.distance, this.angle, this.penumbra, this.decay);
    ['angle', 'decay', 'distance', 'penumbra'].forEach(p => {
      watch(() => this[p], () => {
        this.light[p] = this[p];
      });
    });
    this.initLight();
  },
  __hmrId: 'SpotLight',
});
