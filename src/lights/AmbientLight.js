import { AmbientLight } from 'three';
import Light from './Light.js';

export default {
  extends: Light,
  created() {
    this.light = new AmbientLight(this.color, this.intensity);
  },
};
