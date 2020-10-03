import { PolyhedronBufferGeometry } from 'three';
import Geometry from './Geometry.js';

export default {
  extends: Geometry,
  props: {
    vertices: Array,
    indices: Array,
    radius: { type: Number, default: 1 },
    detail: { type: Number, default: 0 },
  },
  methods: {
    createGeometry() {
      this.geometry = new PolyhedronBufferGeometry(this.vertices, this.indices, this.radius, this.detail);
    },
  },
};
