import { MeshStandardMaterial } from 'three';
import Material from './Material';

export default {
  extends: Material,
  props: {
    emissive: {
      type: [Number, String],
      default: 0,
    },
    emissiveIntensity: {
      type: Number,
      default: 1,
    },
    metalness: {
      type: Number,
      default: 0,
    },
    roughness: {
      type: Number,
      default: 1,
    },
  },
  created() {
    this.material = new MeshStandardMaterial(this.propsValues());
  },
};
