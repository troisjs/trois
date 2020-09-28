import { LatheBufferGeometry } from 'three';
import { watch } from 'vue';
import Mesh from './Mesh.js';

export default {
  extends: Mesh,
  props: {
    points: Array,
    segments: { type: Number, default: 12 },
    phiStart: { type: Number, default: 0 },
    phiLength: { type: Number, default: Math.PI * 2 },

  },
  created() {
    this.createGeometry();

    const watchProps = ['points', 'segments', 'phiStart', 'phiLength'];
    watchProps.forEach(prop => {
      watch(() => this[prop], () => {
        this.refreshGeometry();
      });
    });
  },
  methods: {
    createGeometry() {
      this.geometry = new LatheBufferGeometry(this.points, this.segments, this.phiStart, this.phiLength);
    },
  },
  __hmrId: 'Lathe',
};
