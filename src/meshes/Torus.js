import { meshComponent } from './Mesh.js';
import { props, createGeometry } from '../geometries/TorusGeometry.js';

export default meshComponent('Torus', props, createGeometry);
