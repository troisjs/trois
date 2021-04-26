import { geometryComponent } from './Geometry'
import { CircleGeometry } from 'three'

export const props = {
  radius: { type: Number, default: 1 },
  segments: { type: Number, default: 8 },
  thetaStart: { type: Number, default: 0 },
  thetaLength: { type: Number, default: Math.PI * 2 },
} as const

export function createGeometry(comp: any): CircleGeometry {
  return new CircleGeometry(comp.radius, comp.segments, comp.thetaStart, comp.thetaLength)
}

export default geometryComponent('CircleGeometry', props, createGeometry)
