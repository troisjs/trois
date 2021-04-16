import { meshComponent } from './Mesh'
import { props, createGeometry } from '../geometries/PlaneGeometry.js'

export default meshComponent('Plane', props, createGeometry)
