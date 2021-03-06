import { MeshPhysicalMaterial } from 'three';
import { propsValues } from '../tools.js';
import StandardMaterial from './StandardMaterial';

export default {
  extends: StandardMaterial,
  methods: {
    createMaterial() {
      this.material = new MeshPhysicalMaterial(propsValues(this.$props));
    },
  },
  __hmrId: 'PhysicalMaterial',
};
