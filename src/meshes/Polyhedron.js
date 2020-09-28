import { PolyhedronBufferGeometry } from 'three';
import { watch } from 'vue';
import Mesh from './Mesh.js';

export default {
  extends: Mesh,
  props: {
    vertices: Array,
    indices: Array,
    radius: { type: Number, default: 1 },
    detail: { type: Number, default: 0 },
  },
  created() {
    this.createGeometry();

    const watchProps = ['vertices', 'indices', 'radius', 'detail'];
    watchProps.forEach(prop => {
      watch(() => this[prop], () => {
        this.refreshGeometry();
      });
    });
  },
  methods: {
    createGeometry() {
      this.geometry = new PolyhedronBufferGeometry(this.vertices, this.indices, this.radius, this.detail);
    },
  },
  __hmrId: 'Polyhedron',
};
