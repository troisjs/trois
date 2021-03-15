import { watch } from 'vue';
import Mesh from './Mesh.js';
import { props, createGeometry } from '../geometries/BoxGeometry.js';

export default {
  extends: Mesh,
  props,
  created() {
    this.createGeometry();
    Object.keys(props).forEach(prop => {
      watch(() => this[prop], () => {
        this.refreshGeometry();
      });
    });
  },
  methods: {
    createGeometry() {
      this.geometry = createGeometry(this);
    },
  },
  __hmrId: 'Box',
};
