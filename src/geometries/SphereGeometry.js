import { SphereGeometry } from 'three';
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
      this.geometry = new SphereGeometry(this.radius, this.widthSegments, this.heightSegments);
    },
  },
};
