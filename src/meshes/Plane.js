import { PlaneBufferGeometry } from 'three';
import Mesh from './Mesh.js';

export default {
  extends: Mesh,
  props: {
    width: {
      type: Number,
      default: 1,
    },
    height: {
      type: Number,
      default: 1,
    },
    widthSegments: {
      type: Number,
      default: 1,
    },
    heightSegments: {
      type: Number,
      default: 1,
    },
  },
  created() {
    this.geometry = new PlaneBufferGeometry(this.width, this.height, this.widthSegments, this.heightSegments);
  },
};
