import { Curve, TubeBufferGeometry } from 'three';
import Geometry from './Geometry.js';

export default {
  extends: Geometry,
  props: {
    path: Curve,
    tubularSegments: { type: Number, default: 64 },
    radius: { type: Number, default: 1 },
    radiusSegments: { type: Number, default: 8 },
    closed: { type: Boolean, default: false },
  },
  created() {
    this.parent.geometry = new TubeBufferGeometry(this.path, this.tubularSegments, this.radius, this.radiusSegments, this.closed);
  },
};
