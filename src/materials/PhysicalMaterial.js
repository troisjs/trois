import { MeshPhysicalMaterial } from 'three';
import Material from './Material';

export default {
  extends: Material,
  created() {
    this.material = new MeshPhysicalMaterial({
      color: this.color,
    });
  },
};
