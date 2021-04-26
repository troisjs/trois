import { geometryComponent } from './Geometry'
import { SphereGeometry } from 'three'

export const props = {
  radius: { type: Number, default: 1 },
  widthSegments: { type: Number, default: 12 },
  heightSegments: { type: Number, default: 12 },
} as const

export function createGeometry(comp: any): SphereGeometry {
  return new SphereGeometry(comp.radius, comp.widthSegments, comp.heightSegments)
}

export default geometryComponent('SphereGeometry', props, createGeometry)
