import { geometryComponent } from './Geometry'
import { OctahedronGeometry } from 'three'

export const props = {
  radius: { type: Number, default: 1 },
  detail: { type: Number, default: 0 },
} as const

export function createGeometry(comp: any): OctahedronGeometry {
  return new OctahedronGeometry(comp.radius, comp.detail)
}

export default geometryComponent('OctahedronGeometry', props, createGeometry)
