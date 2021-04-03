import { geometryComponent } from './Geometry.js';
import { SphereGeometry } from 'three';

export const props = {
  radius: { type: Number, default: 1 },
  widthSegments: { type: Number, default: 12 },
  heightSegments: { type: Number, default: 12 },
};

export function createGeometry(comp) {
  return new SphereGeometry(comp.radius, comp.widthSegments, comp.heightSegments);
};

export default geometryComponent('SphereGeometry', props, createGeometry);
