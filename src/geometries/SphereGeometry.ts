import { geometryComponent } from './Geometry'
import { SphereGeometry } from 'three'

export const props = {
  radius: { type: Number, default: 1 },
  widthSegments: { type: Number, default: 12 },
  heightSegments: { type: Number, default: 12 },
  phiStart: { type: Number, default: 0 },
  phiLength: { type: Number, default: Math.PI * 2 },
  thetaStart: { type: Number, default: 0 },
  thetaLength: { type: Number, default: Math.PI },
} as const

export function createGeometry(comp: any): SphereGeometry {
  return new SphereGeometry(comp.radius, comp.widthSegments, comp.heightSegments, comp.phiStart, comp.phiLength, comp.thetaStart, comp.thetaLength)
}

export default geometryComponent('SphereGeometry', props, createGeometry)
