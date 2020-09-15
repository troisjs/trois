import { SphereBufferGeometry } from 'three';
import Geometry from './Geometry.js';

export default {
  extends: Geometry,
  inject: ['parent'],
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
    this.geometry = new SphereBufferGeometry(this.radius, this.widthSegments, this.heightSegments);
  },
};
