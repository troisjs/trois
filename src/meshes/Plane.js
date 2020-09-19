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
  watch: {
    width() { this.refreshGeometry(); },
    height() { this.refreshGeometry(); },
    widthSegments() { this.refreshGeometry(); },
    heightSegments() { this.refreshGeometry(); },
  },
  created() {
    this.createGeometry();
  },
  methods: {
    createGeometry() {
      this.geometry = new PlaneBufferGeometry(this.width, this.height, this.widthSegments, this.heightSegments);
    },
  },
  __hmrId: 'Plane',
};
