import { geometryComponent } from './Geometry'
import { TetrahedronGeometry } from 'three'

export const props = {
  radius: { type: Number, default: 1 },
  detail: { type: Number, default: 0 },
} as const

export function createGeometry(comp: any): TetrahedronGeometry {
  return new TetrahedronGeometry(comp.radius, comp.detail)
}

export default geometryComponent('TetrahedronGeometry', props, createGeometry)
