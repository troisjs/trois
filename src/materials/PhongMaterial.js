import { MeshPhongMaterial } from 'three';
import Material from './Material';

export default {
  extends: Material,
  created() {
    this.material = new MeshPhongMaterial({
      color: this.color,
    });
  },
};
