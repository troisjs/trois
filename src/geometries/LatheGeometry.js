import { geometryComponent } from './Geometry.js';
import { LatheGeometry } from 'three';

export const props = {
  points: Array,
  segments: { type: Number, default: 12 },
  phiStart: { type: Number, default: 0 },
  phiLength: { type: Number, default: Math.PI * 2 },
};

export function createGeometry(comp) {
  return new LatheGeometry(comp.points, comp.segments, comp.phiStart, comp.phiLength);
};

export default geometryComponent('LatheGeometry', props, createGeometry);
