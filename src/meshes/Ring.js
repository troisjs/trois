import { RingBufferGeometry } from 'three';
import { watch } from 'vue';
import Mesh from './Mesh.js';

export default {
  extends: Mesh,
  props: {
    innerRadius: { type: Number, default: 0.5 },
    outerRadius: { type: Number, default: 1 },
    thetaSegments: { type: Number, default: 8 },
    phiSegments: { type: Number, default: 1 },
    thetaStart: { type: Number, default: 0 },
    thetaLength: { type: Number, default: Math.PI * 2 },

  },
  created() {
    this.createGeometry();

    const watchProps = ['innerRadius', 'outerRadius', 'thetaSegments', 'phiSegments', 'thetaStart', 'thetaLength'];
    watchProps.forEach(prop => {
      watch(() => this[prop], () => {
        this.refreshGeometry();
      });
    });
  },
  methods: {
    createGeometry() {
      this.geometry = new RingBufferGeometry(this.innerRadius, this.outerRadius, this.thetaSegments, this.phiSegments, this.thetaStart, this.thetaLength);
    },
  },
  __hmrId: 'Ring',
};
