import { meshComponent } from './Mesh.js';
import { props, createGeometry } from '../geometries/TorusKnotGeometry.js';

export default meshComponent('TorusKnot', props, createGeometry);
