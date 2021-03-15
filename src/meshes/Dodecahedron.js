import Mesh from './Mesh.js';
import { props, createGeometry } from '../geometries/DodecahedronGeometry.js';

export default {
  extends: Mesh,
  props,
  created() {
    this.createGeometry();
    this.addGeometryWatchers(props);
  },
  methods: {
    createGeometry() {
      this.geometry = createGeometry(this);
    },
  },
  __hmrId: 'Dodecahedron',
};
