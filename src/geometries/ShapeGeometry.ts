import { PropType } from 'vue'
import { geometryComponent } from './Geometry'
import { Shape, ShapeGeometry } from 'three'

export const props = {
  shapes: { type: [Object, Array] as PropType<Shape | Shape[]> },
  curveSegments: { type: Number },
} as const

export function createGeometry(comp: any): ShapeGeometry {
  return new ShapeGeometry(comp.shapes, comp.curveSegments)
}

export default geometryComponent('ShapeGeometry', props, createGeometry)
