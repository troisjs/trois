import { meshComponent } from './Mesh'
import { props, createGeometry } from '../geometries/PolyhedronGeometry'

export default meshComponent('Polyhedron', props, createGeometry)
