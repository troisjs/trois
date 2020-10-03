import { TorusKnotBufferGeometry } from 'three';
import Geometry from './Geometry.js';

export default {
  extends: Geometry,
  props: {
    radius: { type: Number, default: 1 },
    tube: { type: Number, default: 0.4 },
    radialSegments: { type: Number, default: 64 },
    tubularSegments: { type: Number, default: 8 },
    p: { type: Number, default: 2 },
    q: { type: Number, default: 3 },
  },
  methods: {
    createGeometry() {
      this.geometry = new TorusKnotBufferGeometry(this.radius, this.tube, this.radialSegments, this.tubularSegments, this.p, this.q);
    },
  },
};
