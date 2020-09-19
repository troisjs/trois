import { PointLight } from 'three';
import Light from './Light.js';

export default {
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
  },
  __hmrId: 'PointLight',
};
