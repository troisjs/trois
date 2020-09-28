import { ConeBufferGeometry } from 'three';
import { watch } from 'vue';
import Mesh from './Mesh.js';

export default {
  extends: Mesh,
  props: {
    radius: { type: Number, default: 1 },
    height: { type: Number, default: 1 },
    radialSegments: { type: Number, default: 8 },
    heightSegments: { type: Number, default: 1 },
    openEnded: { type: Boolean, default: false },
    thetaStart: { type: Number, default: 0 },
    thetaLength: { type: Number, default: Math.PI * 2 },

  },
  created() {
    this.createGeometry();

    const watchProps = ['radius', 'height', 'radialSegments', 'heightSegments', 'openEnded', 'thetaStart', 'thetaLength'];
    watchProps.forEach(prop => {
      watch(() => this[prop], () => {
        this.refreshGeometry();
      });
    });
  },
  methods: {
    createGeometry() {
      this.geometry = new ConeBufferGeometry(this.radius, this.height, this.radialSegments, this.heightSegments, this.openEnded, this.thetaStart, this.thetaLength);
    },
  },
  __hmrId: 'Cone',
};
