import { BoxGeometry } from 'three';
import Geometry from './Geometry.js';

export default {
  extends: Geometry,
  props: {
    size: Number,
    width: { type: Number, default: 1 },
    height: { type: Number, default: 1 },
    depth: { type: Number, default: 1 },
    widthSegments: { type: Number, default: 1 },
    heightSegments: { type: Number, default: 1 },
    depthSegments: { type: Number, default: 1 },
  },
  methods: {
    createGeometry() {
      let w = this.width, h = this.height, d = this.depth;
      if (this.size) {
        w = this.size; h = this.size; d = this.size;
      }
      this.geometry = new BoxGeometry(w, h, d, this.widthSegments, this.heightSegments, this.depthSegments);
    },
  },
};
