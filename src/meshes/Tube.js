import { CatmullRomCurve3, Curve, TubeBufferGeometry, Vector3 } from 'three';
import { watch } from 'vue';
import Mesh from './Mesh.js';

export default {
  extends: Mesh,
  props: {
    path: Curve,
    points: Array,
    tubularSegments: { type: Number, default: 64 },
    radius: { type: Number, default: 1 },
    radialSegments: { type: Number, default: 8 },
    closed: { type: Boolean, default: false },
  },
  created() {
    this.createGeometry();
    const watchProps = ['path', 'points', 'tubularSegments', 'radius', 'radialSegments', 'closed'];
    watchProps.forEach(prop => {
      watch(() => this[prop], () => {
        this.refreshGeometry();
      });
    });
  },
  methods: {
    createGeometry() {
      let curve;

      if (this.points) {
        const _points = [];
        this.points.forEach(p => _points.push(new Vector3(p[0], p[1], p[2])));
        curve = new CatmullRomCurve3(_points);
      } else if (this.path) {
        curve = this.path;
      } else {
        console.error('Missing path curve or points.');
      }

      this.geometry = new TubeBufferGeometry(curve, this.tubularSegments, this.radius, this.radialSegments, this.closed);
    },
  },
  __hmrId: 'Tube',
};
