import { meshComponent } from './Mesh'
import { props, createGeometry } from '../geometries/TorusGeometry.js'

export default meshComponent('Torus', props, createGeometry)
