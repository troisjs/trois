import { meshComponent } from './Mesh'
import { props, createGeometry } from '../geometries/TetrahedronGeometry'

export default meshComponent('Tetrahedron', props, createGeometry)
