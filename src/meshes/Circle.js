import { meshComponent } from './Mesh.js';
import { props, createGeometry } from '../geometries/CircleGeometry.js';

export default meshComponent('Circle', props, createGeometry);
