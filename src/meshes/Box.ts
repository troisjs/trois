import { meshComponent } from './Mesh'
import { props, createGeometry } from '../geometries/BoxGeometry'

export default meshComponent('Box', props, createGeometry)

// import { defineComponent } from 'vue'
// import Mesh, { meshComponent } from './Mesh'
//
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
