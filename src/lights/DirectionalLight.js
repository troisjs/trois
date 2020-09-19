import { DirectionalLight } from 'three';
import Light from './Light.js';

export default {
  extends: Light,
  created() {
    this.light = new DirectionalLight(this.color, this.intensity);
  },
  __hmrId: 'DirectionalLight',
};
