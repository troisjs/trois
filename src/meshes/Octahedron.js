import { meshComponent } from './Mesh.js';
import { props, createGeometry } from '../geometries/OctahedronGeometry.js';

export default meshComponent('Octahedron', props, createGeometry);
