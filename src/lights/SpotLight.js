import { SpotLight } from 'three';
import Light from './Light.js';

export default {
  extends: Light,
  props: {
    distance: {
      type: Number,
      default: 0,
    },
    angle: {
      type: Number,
      default: Math.PI / 3,
    },
    penumbra: {
      type: Number,
      default: 0,
    },
    decay: {
      type: Number,
      default: 1,
    },
  },
  created() {
    this.light = new SpotLight(this.color, this.intensity, this.distance, this.angle, this.penumbra, this.decay);
  },
};
