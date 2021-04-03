import { meshComponent } from './Mesh.js';
import { props, createGeometry } from '../geometries/DodecahedronGeometry.js';

export default meshComponent('Dodecahedron', props, createGeometry);
