import { meshComponent } from './Mesh'
import { props, createGeometry } from '../geometries/TetrahedronGeometry.js'

export default meshComponent('Tetrahedron', props, createGeometry)
