import { Curve, TubeBufferGeometry } from 'three';
import { watch } from 'vue';
import Mesh from './Mesh.js';

export default {
  extends: Mesh,
  props: {
    path: Curve,
    tubularSegments: { type: Number, default: 64 },
    radius: { type: Number, default: 1 },
    radialSegments: { type: Number, default: 8 },
    closed: { type: Boolean, default: false },

  },
  created() {
    this.createGeometry();

    const watchProps = ['path', 'tubularSegments', 'radius', 'radialSegments', 'closed'];
    watchProps.forEach(prop => {
      watch(() => this[prop], () => {
        this.refreshGeometry();
      });
    });
  },
  methods: {
    createGeometry() {
      this.geometry = new TubeBufferGeometry(this.path, this.tubularSegments, this.radius, this.radialSegments, this.closed);
    },
  },
  __hmrId: 'Tube',
};
