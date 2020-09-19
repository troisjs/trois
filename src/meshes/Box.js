import { BoxBufferGeometry } from 'three';
import Mesh from './Mesh.js';

export default {
  extends: Mesh,
  props: {
    size: {
      type: Number,
    },
    width: {
      type: Number,
      default: 1,
    },
    height: {
      type: Number,
      default: 1,
    },
    depth: {
      type: Number,
      default: 1,
    },
  },
  watch: {
    size() { this.refreshGeometry(); },
    width() { this.refreshGeometry(); },
    height() { this.refreshGeometry(); },
    depth() { this.refreshGeometry(); },
  },
  created() {
    this.createGeometry();
  },
  methods: {
    createGeometry() {
      if (this.size) {
        this.geometry = new BoxBufferGeometry(this.size, this.size, this.size);
      } else {
        this.geometry = new BoxBufferGeometry(this.width, this.height, this.depth);
      }
    },
  },
  __hmrId: 'Box',
};
