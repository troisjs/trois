import Mesh from './Mesh.js';
import { props, createGeometry } from '../geometries/IcosahedronGeometry.js';

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
  __hmrId: 'Icosahedron',
};
