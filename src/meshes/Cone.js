import { meshComponent } from './Mesh.js';
import { props, createGeometry } from '../geometries/ConeGeometry.js';

export default meshComponent('Cone', props, createGeometry);
