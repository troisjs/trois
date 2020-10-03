import { MeshBasicMaterial } from 'three';
import { propsValues } from '../tools.js';
import Material from './Material';

export default {
  extends: Material,
  methods: {
    createMaterial() {
      this.material = new MeshBasicMaterial(propsValues(this.$props, ['id']));
    },
  },
  __hmrId: 'BasicMaterial',
};
