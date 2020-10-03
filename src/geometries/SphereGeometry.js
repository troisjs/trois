import { SphereBufferGeometry } from 'three';
import Geometry from './Geometry.js';

export default {
  extends: Geometry,
  props: {
    radius: { type: Number, default: 1 },
    widthSegments: { type: Number, default: 12 },
    heightSegments: { type: Number, default: 12 },
  },
  methods: {
    createGeometry() {
      this.geometry = new SphereBufferGeometry(this.radius, this.widthSegments, this.heightSegments);
    },
  },
};
