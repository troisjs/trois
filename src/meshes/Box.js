import { meshComponent } from './Mesh.js';
import { props, createGeometry } from '../geometries/BoxGeometry.js';

export default meshComponent('Box', props, createGeometry);
