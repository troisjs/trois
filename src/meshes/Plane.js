import { meshComponent } from './Mesh.js';
import { props, createGeometry } from '../geometries/PlaneGeometry.js';

export default meshComponent('Plane', props, createGeometry);
