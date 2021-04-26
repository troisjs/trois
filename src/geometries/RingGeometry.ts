import { geometryComponent } from './Geometry'
import { RingGeometry } from 'three'

export const props = {
  innerRadius: { type: Number, default: 0.5 },
  outerRadius: { type: Number, default: 1 },
  thetaSegments: { type: Number, default: 8 },
  phiSegments: { type: Number, default: 1 },
  thetaStart: { type: Number, default: 0 },
  thetaLength: { type: Number, default: Math.PI * 2 },
} as const

export function createGeometry(comp: any): RingGeometry {
  return new RingGeometry(comp.innerRadius, comp.outerRadius, comp.thetaSegments, comp.phiSegments, comp.thetaStart, comp.thetaLength)
}

export default geometryComponent('RingGeometry', props, createGeometry)
