import { TorusBufferGeometry } from 'three';
import Geometry from './Geometry.js';

export default {
  extends: Geometry,
  props: {
    radius: { type: Number, default: 1 },
    tube: { type: Number, default: 0.4 },
    radialSegments: { type: Number, default: 8 },
    tubularSegments: { type: Number, default: 6 },
    arc: { type: Number, default: Math.PI * 2 },
  },
  methods: {
    createGeometry() {
      this.geometry = new TorusBufferGeometry(this.radius, this.tube, this.radialSegments, this.tubularSegments, this.arc);
    },
  },
};
