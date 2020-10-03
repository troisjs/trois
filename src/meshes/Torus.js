import { TorusBufferGeometry } from 'three';
import { watch } from 'vue';
import Mesh from './Mesh.js';

export default {
  extends: Mesh,
  props: {
    radius: { type: Number, default: 0.5 },
    tube: { type: Number, default: 0.4 },
    radialSegments: { type: Number, default: 8 },
    tubularSegments: { type: Number, default: 6 },
    arc: { type: Number, default: Math.PI * 2 },
  },
  created() {
    this.createGeometry();

    const watchProps = ['radius', 'tube', 'radialSegments', 'tubularSegments', 'arc'];
    watchProps.forEach(prop => {
      watch(() => this[prop], () => {
        this.refreshGeometry();
      });
    });
  },
  methods: {
    createGeometry() {
      this.geometry = new TorusBufferGeometry(this.radius, this.tube, this.radialSegments, this.tubularSegments, this.arc);
    },
  },
  __hmrId: 'Torus',
};
