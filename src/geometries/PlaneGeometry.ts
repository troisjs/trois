import { geometryComponent } from './Geometry'
import { PlaneGeometry } from 'three'

export const props = {
  width: { type: Number, default: 1 },
  height: { type: Number, default: 1 },
  widthSegments: { type: Number, default: 1 },
  heightSegments: { type: Number, default: 1 },
} as const

export function createGeometry(comp: any): PlaneGeometry {
  return new PlaneGeometry(comp.width, comp.height, comp.widthSegments, comp.heightSegments)
}

export default geometryComponent('PlaneGeometry', props, createGeometry)
