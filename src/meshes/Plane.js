import { PlaneGeometry } from 'three';
import { watch } from 'vue';
import Mesh from './Mesh.js';

export default {
  extends: Mesh,
  props: {
    width: { type: Number, default: 1 },
    height: { type: Number, default: 1 },
    widthSegments: { type: Number, default: 1 },
    heightSegments: { type: Number, default: 1 },
  },
  created() {
    this.createGeometry();

    const watchProps = ['width', 'height', 'widthSegments', 'heightSegments'];
    watchProps.forEach(prop => {
      watch(() => this[prop], () => {
        this.refreshGeometry();
      });
    });
  },
  methods: {
    createGeometry() {
      this.geometry = new PlaneGeometry(this.width, this.height, this.widthSegments, this.heightSegments);
    },
  },
  __hmrId: 'Plane',
};
