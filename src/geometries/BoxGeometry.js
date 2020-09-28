import { BoxBufferGeometry } from 'three';
import Geometry from './Geometry.js';

export default {
  extends: Geometry,
  props: {
    size: { type: Number },
    width: { type: Number, default: 1 },
    height: { type: Number, default: 1 },
    depth: { type: Number, default: 1 },
  },
  created() {
    if (this.size) {
      this.parent.geometry = new BoxBufferGeometry(this.size, this.size, this.size);
    } else {
      this.parent.geometry = new BoxBufferGeometry(this.width, this.height, this.depth);
    }
  },
};
