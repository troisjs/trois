import { defineComponent } from 'vue';
import { PointLight } from 'three';
import Light from './Light.js';

export default defineComponent({
  extends: Light,
  props: {
    distance: {
      type: Number,
      default: 0,
    },
    decay: {
      type: Number,
      default: 1,
    },
  },
  created() {
    this.light = new PointLight(this.color, this.intensity, this.distance, this.decay);
    this.initLight();
  },
  __hmrId: 'PointLight',
});
