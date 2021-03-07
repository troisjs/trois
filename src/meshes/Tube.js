import { CatmullRomCurve3, Curve, TubeGeometry, Vector3 } from 'three';
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
    const watchProps = ['tubularSegments', 'radius', 'radialSegments', 'closed'];
    watchProps.forEach(prop => {
      watch(() => this[prop], (v) => {
        this.refreshGeometry();
      });
    });
    // watch(() => this.points, () => {
    //   this.updatePoints();
    // });
  },
  methods: {
    createGeometry() {
      let curve;
      if (this.points) {
        curve = new CatmullRomCurve3(this.points);
      } else if (this.path) {
        curve = this.path;
      } else {
        console.error('Missing path curve or points.');
      }
      this.geometry = new TubeGeometry(curve, this.tubularSegments, this.radius, this.radialSegments, this.closed);
    },
    updateCurve() {
      updateTubeGeometryPoints(this.geometry, this.points);
    },
  },
  __hmrId: 'Tube',
};

function updateTubeGeometryPoints(tube, points) {
  const curve = new CatmullRomCurve3(points);
  const { radialSegments, radius, tubularSegments, closed } = tube.parameters;
  const frames = curve.computeFrenetFrames(tubularSegments, closed);
  tube.tangents = frames.tangents;
  tube.normals = frames.normals;
  tube.binormals = frames.binormals;
  tube.parameters.path = curve;

  const pArray = tube.attributes.position.array;
  const nArray = tube.attributes.normal.array;
  const normal = new Vector3();
  let P;

  for (let i = 0; i < tubularSegments; i++) {
    updateSegment(i);
  }
  updateSegment(tubularSegments);

  tube.attributes.position.needsUpdate = true;
  tube.attributes.normal.needsUpdate = true;

  function updateSegment(i) {
    P = curve.getPointAt(i / tubularSegments, P);
    const N = frames.normals[i];
    const B = frames.binormals[i];
    for (let j = 0; j <= radialSegments; j++) {
      const v = j / radialSegments * Math.PI * 2;
      const sin = Math.sin(v);
      const cos = -Math.cos(v);
      normal.x = (cos * N.x + sin * B.x);
      normal.y = (cos * N.y + sin * B.y);
      normal.z = (cos * N.z + sin * B.z);
      normal.normalize();
      const index = (i * (radialSegments + 1) + j) * 3;
      nArray[index] = normal.x;
      nArray[index + 1] = normal.y;
      nArray[index + 2] = normal.z;
      pArray[index] = P.x + radius * normal.x;
      pArray[index + 1] = P.y + radius * normal.y;
      pArray[index + 2] = P.z + radius * normal.z;
    }
  }
}
