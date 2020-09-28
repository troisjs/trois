import { CylinderBufferGeometry } from 'three';
import Geometry from './Geometry.js';

export default {
  extends: Geometry,
  props: {
    radiusTop: { type: Number, default: 1 },
    radiusBottom: { type: Number, default: 1 },
    height: { type: Number, default: 1 },
    radialSegments: { type: Number, default: 8 },
    heightSegments: { type: Number, default: 1 },
    openEnded: { type: Boolean, default: false },
    thetaStart: { type: Number, default: 0 },
    thetaLength: { type: Number, default: Math.PI * 2 },
  },
  created() {
    this.parent.geometry = new CylinderBufferGeometry(this.radiusTop, this.radiusBottom, this.height, this.radialSegments, this.heightSegments, this.openEnded, this.thetaStart, this.thetaLength);
  },
};
