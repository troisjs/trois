import { geometryComponent } from './Geometry'
import { IcosahedronGeometry } from 'three'

export const props = {
  radius: { type: Number, default: 1 },
  detail: { type: Number, default: 0 },
} as const

export function createGeometry(comp: any): IcosahedronGeometry {
  return new IcosahedronGeometry(comp.radius, comp.detail)
}

export default geometryComponent('IcosahedronGeometry', props, createGeometry)
