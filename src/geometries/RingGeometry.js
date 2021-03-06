import { RingGeometry } from 'three';
import Geometry from './Geometry.js';

export default {
  extends: Geometry,
  props: {
    innerRadius: { type: Number, default: 0.5 },
    outerRadius: { type: Number, default: 1 },
    thetaSegments: { type: Number, default: 8 },
    phiSegments: { type: Number, default: 1 },
    thetaStart: { type: Number, default: 0 },
    thetaLength: { type: Number, default: Math.PI * 2 },
  },
  methods: {
    createGeometry() {
      this.geometry = new RingGeometry(this.innerRadius, this.outerRadius, this.thetaSegments, this.phiSegments, this.thetaStart, this.thetaLength);
    },
  },
};
