import { TorusKnotGeometry } from 'three';
import Geometry from './Geometry.js';

export default {
  extends: Geometry,
  props: {
    radius: { type: Number, default: 1 },
    tube: { type: Number, default: 0.4 },
    tubularSegments: { type: Number, default: 64 },
    radialSegments: { type: Number, default: 8 },
    p: { type: Number, default: 2 },
    q: { type: Number, default: 3 },
  },
  methods: {
    createGeometry() {
      this.geometry = new TorusKnotGeometry(this.radius, this.tube, this.tubularSegments, this.radialSegments, this.p, this.q);
    },
  },
};
