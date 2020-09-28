import { CircleBufferGeometry } from 'three';
import { watch } from 'vue';
import Mesh from './Mesh.js';

export default {
  extends: Mesh,
  props: {
    radius: { type: Number, default: 1 },
    segments: { type: Number, default: 8 },
    thetaStart: { type: Number, default: 0 },
    thetaLength: { type: Number, default: Math.PI * 2 },
  },
  created() {
    this.createGeometry();

    const watchProps = ['radius', 'segments', 'thetaStart', 'thetaLength'];
    watchProps.forEach(prop => {
      watch(() => this[prop], () => {
        this.refreshGeometry();
      });
    });
  },
  methods: {
    createGeometry() {
      this.geometry = new CircleBufferGeometry(this.radius, this.segments, this.thetaStart, this.thetaLength);
    },
  },
  __hmrId: 'Circle',
};
