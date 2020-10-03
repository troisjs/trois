import { LatheBufferGeometry } from 'three';
import Geometry from './Geometry.js';

export default {
  extends: Geometry,
  props: {
    points: Array,
    segments: { type: Number, default: 12 },
    phiStart: { type: Number, default: 0 },
    phiLength: { type: Number, default: Math.PI * 2 },
  },
  methods: {
    createGeometry() {
      this.geometry = new LatheBufferGeometry(this.points, this.segments, this.phiStart, this.phiLength);
    },
  },
};
