import { MeshLambertMaterial } from 'three';
import { propsValues } from '../tools.js';
import Material from './Material';

export default {
  extends: Material,
  props: {
    wireframe: { type: Boolean, default: false },
    wireframeLinecap: { type: String, default: 'round' },
    wireframeLinejoin: { type: String, default: 'round' },
    wireframeLinewidth: { type: Number, default: 1 }
  },
  methods: {
    createMaterial() {
      this.material = new MeshLambertMaterial(propsValues(this.$props));
    },
  },
  __hmrId: 'LambertMaterial',
};
