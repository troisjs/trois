import { PointLight } from 'three';
import Light from './Light.js';

export default {
  extends: Light,
  created() {
    this.light = new PointLight(this.color, this.intensity, this.distance, this.decay);
  },
};
