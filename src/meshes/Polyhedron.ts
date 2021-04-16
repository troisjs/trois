import { meshComponent } from './Mesh'
import { props, createGeometry } from '../geometries/PolyhedronGeometry.js'

export default meshComponent('Polyhedron', props, createGeometry)
