import { defineComponent } from 'vue'
import { CatmullRomCurve3, Curve, TubeGeometry, Vector3 } from 'three'
import Geometry from './Geometry'

export const props = {
  points: Array,
  path: Curve,
  tubularSegments: { type: Number, default: 64 },
  radius: { type: Number, default: 1 },
  radialSegments: { type: Number, default: 8 },
  closed: { type: Boolean, default: false },
} as const

export function createGeometry(comp: any): TubeGeometry {
  let curve
  if (comp.points) {
    curve = new CatmullRomCurve3(comp.points)
  } else if (comp.path) {
    curve = comp.path
  } else {
    console.error('Missing path curve or points.')
  }
  return new TubeGeometry(curve, comp.tubularSegments, comp.radius, comp.radiusSegments, comp.closed)
}

export default defineComponent({
  extends: Geometry,
  props,
  methods: {
    createGeometry() {
      this.geometry = createGeometry(this)
    },
    // update points (without using prop, faster)
    updatePoints(points: Vector3[]) {
      updateTubeGeometryPoints(this.geometry as TubeGeometry, points)
    },
  },
})

export function updateTubeGeometryPoints(tube: TubeGeometry, points: Vector3[]): void {
  const curve = new CatmullRomCurve3(points)
  const { radialSegments, radius, tubularSegments, closed } = tube.parameters
  const frames = curve.computeFrenetFrames(tubularSegments, closed)
  tube.tangents = frames.tangents
  tube.normals = frames.normals
  tube.binormals = frames.binormals
  tube.parameters.path = curve

  const pAttribute = tube.getAttribute('position')
  const nAttribute = tube.getAttribute('normal')

  const normal = new Vector3()
  const P = new Vector3()

  for (let i = 0; i < tubularSegments; i++) {
    updateSegment(i)
  }
  updateSegment(tubularSegments)

  tube.attributes.position.needsUpdate = true
  tube.attributes.normal.needsUpdate = true

  function updateSegment(i: number) {
    curve.getPointAt(i / tubularSegments, P)
    const N = frames.normals[i]
    const B = frames.binormals[i]
    for (let j = 0; j <= radialSegments; j++) {
      const v = j / radialSegments * Math.PI * 2
      const sin = Math.sin(v)
      const cos = -Math.cos(v)
      normal.x = (cos * N.x + sin * B.x)
      normal.y = (cos * N.y + sin * B.y)
      normal.z = (cos * N.z + sin * B.z)
      normal.normalize()
      const index = (i * (radialSegments + 1) + j)
      nAttribute.setXYZ(index, normal.x, normal.y, normal.z)
      pAttribute.setXYZ(index, P.x + radius * normal.x, P.y + radius * normal.y, P.z + radius * normal.z)
    }
  }
}
