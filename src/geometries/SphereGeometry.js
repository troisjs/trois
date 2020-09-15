import { SphereBufferGeometry } from 'three';
import Geometry from './Geometry.js';

export default {
  extends: Geometry,
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
  mounted() {
    this.parent.geometry = new SphereBufferGeometry(this.radius, this.widthSegments, this.heightSegments);
  },
};
