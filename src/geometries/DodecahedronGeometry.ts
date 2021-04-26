import { geometryComponent } from './Geometry'
import { DodecahedronGeometry } from 'three'

export const props = {
  radius: { type: Number, default: 1 },
  detail: { type: Number, default: 0 },
} as const

export function createGeometry(comp: any): DodecahedronGeometry {
  return new DodecahedronGeometry(comp.radius, comp.detail)
}

export default geometryComponent('DodecahedronGeometry', props, createGeometry)
