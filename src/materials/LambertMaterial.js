import { MeshLambertMaterial } from 'three';
import Material from './Material';

export default {
  extends: Material,
  created() {
    this.material = new MeshLambertMaterial({
      color: this.color,
    });
  },
};
