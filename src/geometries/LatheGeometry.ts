import { geometryComponent } from './Geometry'
import { LatheGeometry } from 'three'

export const props = {
  points: Array,
  segments: { type: Number, default: 12 },
  phiStart: { type: Number, default: 0 },
  phiLength: { type: Number, default: Math.PI * 2 },
} as const

export function createGeometry(comp: any): LatheGeometry {
  return new LatheGeometry(comp.points, comp.segments, comp.phiStart, comp.phiLength)
}

export default geometryComponent('LatheGeometry', props, createGeometry)
