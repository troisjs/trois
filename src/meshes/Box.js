import { BoxBufferGeometry } from 'three';
import { watch } from 'vue';
import Mesh from './Mesh.js';

export default {
  extends: Mesh,
  props: {
    size: Number,
    width: { type: Number, default: 1 },
    height: { type: Number, default: 1 },
    depth: { type: Number, default: 1 },
    widthSegments: { type: Number, default: 1 },
    heightSegments: { type: Number, default: 1 },
    depthSegments: { type: Number, default: 1 },
  },
  created() {
    this.createGeometry();

    ['size', 'width', 'height', 'depth', 'widthSegments', 'heightSegments', 'depthSegments'].forEach(prop => {
      watch(() => this[prop], () => {
        this.refreshGeometry();
      });
    });
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
