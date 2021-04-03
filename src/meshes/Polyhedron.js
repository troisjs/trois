import { meshComponent } from './Mesh.js';
import { props, createGeometry } from '../geometries/PolyhedronGeometry.js';

export default meshComponent('Polyhedron', props, createGeometry);
