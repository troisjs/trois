import { SphereBufferGeometry } from 'three';
import Mesh from './Mesh.js';

export default {
  extends: Mesh,
  props: {
    radius: Number,
    widthSegments: {
      type: Number,
      default: 12,
    },
    heightSegments: {
      type: Number,
      default: 12,
    },
  },
  created() {
    this.geometry = new SphereBufferGeometry(this.radius, this.widthSegments, this.heightSegments);
  },
  __hmrId: 'Sphere',
};
