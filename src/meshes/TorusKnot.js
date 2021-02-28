import { TorusKnotBufferGeometry } from 'three';
import { watch } from 'vue';
import Mesh from './Mesh.js';

export default {
  extends: Mesh,
  props: {
    radius: { type: Number, default: 0.5 },
    tube: { type: Number, default: 0.4 },
    tubularSegments: { type: Number, default: 8 },
    radialSegments: { type: Number, default: 64 },
    p: { type: Number, default: 2 },
    q: { type: Number, default: 3 },
  },
  created() {
    this.createGeometry();

    const watchProps = ['radius', 'tube', 'radialSegments', 'tubularSegments', 'p', 'q'];
    watchProps.forEach(prop => {
      watch(() => this[prop], () => {
        this.refreshGeometry();
      });
    });
  },
  methods: {
    createGeometry() {
      this.geometry = new TorusKnotBufferGeometry(this.radius, this.tube, this.tubularSegments, this.radialSegments, this.p, this.q);
    },
  },
  __hmrId: 'TorusKnot',
};
