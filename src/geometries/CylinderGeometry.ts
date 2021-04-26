import { geometryComponent } from './Geometry'
import { CylinderGeometry } from 'three'

export const props = {
  radiusTop: { type: Number, default: 1 },
  radiusBottom: { type: Number, default: 1 },
  height: { type: Number, default: 1 },
  radialSegments: { type: Number, default: 8 },
  heightSegments: { type: Number, default: 1 },
  openEnded: { type: Boolean, default: false },
  thetaStart: { type: Number, default: 0 },
  thetaLength: { type: Number, default: Math.PI * 2 },
} as const

export function createGeometry(comp: any): CylinderGeometry {
  return new CylinderGeometry(comp.radiusTop, comp.radiusBottom, comp.height, comp.radialSegments, comp.heightSegments, comp.openEnded, comp.thetaStart, comp.thetaLength)
}

export default geometryComponent('CylinderGeometry', props, createGeometry)
