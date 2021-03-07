import { HemisphereLight } from 'three';
import Light from './Light.js';
import { bindProp } from '../tools.js';

export default {
  extends: Light,
  props: {
    groundColor: { type: String, default: '#ffffff' },
  },
  created() {
    this.light = new HemisphereLight(this.color, this.groundColor, this.intensity);
    bindProp(this, 'groundColor', this.light);
    this.initLight();
  },
  __hmrId: 'HemisphereLight',
};
