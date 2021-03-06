import { DodecahedronGeometry } from 'three';
import Geometry from './Geometry.js';

export default {
  extends: Geometry,
  props: {
    radius: { type: Number, default: 1 },
    detail: { type: Number, default: 0 },
  },
  methods: {
    createGeometry() {
      this.geometry = new DodecahedronGeometry(this.radius, this.detail);
    },
  },
};
