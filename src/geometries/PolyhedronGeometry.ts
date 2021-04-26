import { geometryComponent } from './Geometry'
import { PolyhedronGeometry } from 'three'

export const props = {
  vertices: Array,
  indices: Array,
  radius: { type: Number, default: 1 },
  detail: { type: Number, default: 0 },
} as const

export function createGeometry(comp: any): PolyhedronGeometry {
  return new PolyhedronGeometry(comp.vertices, comp.indices, comp.radius, comp.detail)
}

export default geometryComponent('PolyhedronGeometry', props, createGeometry)
