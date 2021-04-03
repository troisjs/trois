import { meshComponent } from './Mesh.js';
import { props, createGeometry } from '../geometries/CylinderGeometry.js';

export default meshComponent('Cylinder', props, createGeometry);
