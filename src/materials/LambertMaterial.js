import { MeshLambertMaterial } from 'three';
import { propsValues } from '../tools.js';
import Material from './Material';

export default {
  extends: Material,
  methods: {
    createMaterial() {
      this.material = new MeshLambertMaterial(propsValues(this.$props));
    },
  },
  __hmrId: 'LambertMaterial',
};
