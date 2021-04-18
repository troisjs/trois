import { defineComponent } from 'vue'
import Mesh, { defaultSetup, meshComponent } from './Mesh'
import { props, createGeometry } from '../geometries/BoxGeometry'

export default meshComponent('Box', props, createGeometry)

// export default defineComponent({
//   extends: Mesh,
//   props,
//   created() {
//     this.createGeometry()
//     this.addGeometryWatchers(props)
//   },
//   methods: {
//     createGeometry() {
//       this.geometry = createGeometry(this)
//     },
//   },
// })
