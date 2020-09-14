import { MeshBasicMaterial } from 'three';
import Material from './Material';

export default {
  extends: Material,
  created() {
    this.material = new MeshBasicMaterial({
      color: this.color,
    });
  },
};
