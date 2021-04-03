import { geometryComponent } from './Geometry.js';
import { PlaneGeometry } from 'three';

export const props = {
  width: { type: Number, default: 1 },
  height: { type: Number, default: 1 },
  widthSegments: { type: Number, default: 1 },
  heightSegments: { type: Number, default: 1 },
};

export function createGeometry(comp) {
  return new PlaneGeometry(comp.width, comp.height, comp.widthSegments, comp.heightSegments);
};

export default geometryComponent('PlaneGeometry', props, createGeometry);
