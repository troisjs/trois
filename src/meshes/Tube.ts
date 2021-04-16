import { defineComponent } from 'vue'
import Mesh from './Mesh'
import { props, createGeometry, updateTubeGeometryPoints } from '../geometries/TubeGeometry.js'

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
    updatePoints(points) {
      updateTubeGeometryPoints(this.geometry, points)
    },
  },
  __hmrId: 'Tube',
})
