import { meshComponent } from './Mesh'
import { props, createGeometry } from '../geometries/DodecahedronGeometry.js'

export default meshComponent('Dodecahedron', props, createGeometry)
