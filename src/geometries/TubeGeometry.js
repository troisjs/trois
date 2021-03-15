import { CatmullRomCurve3, Curve, TubeGeometry, Vector3 } from 'three';
import Geometry from './Geometry.js';

export const props = {
  points: Array,
  path: Curve,
  tubularSegments: { type: Number, default: 64 },
  radius: { type: Number, default: 1 },
  radialSegments: { type: Number, default: 8 },
  closed: { type: Boolean, default: false },
};

export function createGeometry(comp) {
  let curve;
  if (comp.points) {
    curve = new CatmullRomCurve3(comp.points);
  } else if (comp.path) {
    curve = comp.path;
  } else {
    console.error('Missing path curve or points.');
  }
  return new TubeGeometry(curve, comp.tubularSegments, comp.radius, comp.radiusSegments, comp.closed);
};

export default {
  extends: Geometry,
  props,
  methods: {
    createGeometry() {
      this.geometry = createGeometry(this);
    },
    // update points (without using prop, faster)
    updatePoints(points) {
      updateTubeGeometryPoints(this.geometry, points);
    },
  },
};

export function updateTubeGeometryPoints(tube, points) {
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
