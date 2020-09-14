import { MeshStandardMaterial } from 'three';
import Material from './Material';

export default {
  extends: Material,
  created() {
    this.material = new MeshStandardMaterial({
      color: this.color,
    });
  },
};
