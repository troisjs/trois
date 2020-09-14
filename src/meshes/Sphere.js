import {
  SphereBufferGeometry,
} from 'three';

import Mesh from './Mesh.js';

export default {
  extends: Mesh,
  props: {
    radius: Number,
  },
  created() {
    this.geometry = new SphereBufferGeometry(this.radius, 32, 32);
  },
};
