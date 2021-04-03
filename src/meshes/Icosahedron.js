import { meshComponent } from './Mesh.js';
import { props, createGeometry } from '../geometries/IcosahedronGeometry.js';

export default meshComponent('Icosahedron', props, createGeometry);
