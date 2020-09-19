import { SphereBufferGeometry } from 'three';
import Mesh from './Mesh.js';

export default {
  extends: Mesh,
  props: {
    radius: Number,
    widthSegments: {
      type: Number,
      default: 12,
    },
    heightSegments: {
      type: Number,
      default: 12,
    },
  },
  watch: {
    radius() { this.refreshGeometry(); },
    widthSegments() { this.refreshGeometry(); },
    heightSegments() { this.refreshGeometry(); },
  },
  created() {
    this.createGeometry();
  },
  methods: {
    createGeometry() {
      this.geometry = new SphereBufferGeometry(this.radius, this.widthSegments, this.heightSegments);
    },
  },
  __hmrId: 'Sphere',
};
