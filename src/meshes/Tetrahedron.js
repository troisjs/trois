import { meshComponent } from './Mesh.js';
import { props, createGeometry } from '../geometries/TetrahedronGeometry.js';

export default meshComponent('Tetrahedron', props, createGeometry);
