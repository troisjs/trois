import { defineComponent } from 'vue'
import { TubeGeometry, Vector3 } from 'three'
import Mesh from './Mesh'
import { props, createGeometry, updateTubeGeometryPoints } from '../geometries/TubeGeometry'

export default defineComponent({
  extends: Mesh,
  props,
  created() {
    this.createGeometry()
    this.addGeometryWatchers(props)
  },
  methods: {
    createGeometry() {
      this.geometry = createGeometry(this)
    },
    // update curve points (without using prop, faster)
    updatePoints(points: Vector3[]) {
      updateTubeGeometryPoints(this.geometry as TubeGeometry, points)
    },
  },
  __hmrId: 'Tube',
})
