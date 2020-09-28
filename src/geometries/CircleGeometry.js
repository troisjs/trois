import { CircleBufferGeometry } from 'three';
import Geometry from './Geometry.js';

export default {
  extends: Geometry,
  props: {
    radius: { type: Number, default: 1 },
    segments: { type: Number, default: 8 },
    thetaStart: { type: Number, default: 0 },
    thetaLength: { type: Number, default: Math.PI * 2 },
  },
  created() {
    this.parent.geometry = new CircleBufferGeometry(this.radius, this.segments, this.thetaStart, this.thetaLength);
  },
};
