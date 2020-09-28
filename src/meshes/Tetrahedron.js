import { TetrahedronBufferGeometry } from 'three';
import { watch } from 'vue';
import Mesh from './Mesh.js';

export default {
  extends: Mesh,
  props: {
    radius: { type: Number, default: 1 },
    detail: { type: Number, default: 0 },
  },
  created() {
    this.createGeometry();

    const watchProps = ['radius', 'detail'];
    watchProps.forEach(prop => {
      watch(() => this[prop], () => {
        this.refreshGeometry();
      });
    });
  },
  methods: {
    createGeometry() {
      this.geometry = new TetrahedronBufferGeometry(this.radius, this.detail);
    },
  },
  __hmrId: 'Tetrahedron',
};
