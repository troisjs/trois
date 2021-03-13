import { MeshBasicMaterial } from 'three';
import { bindProps, propsValues } from '../tools.js';
import Material, { wireframeProps } from './Material';

export default {
  extends: Material,
  props: {
    ...wireframeProps,
  },
  methods: {
    createMaterial() {
      this.material = new MeshBasicMaterial(propsValues(this.$props));
    },
    addWatchers() {
      bindProps(this, Object.keys(wireframeProps), this.material);
    },
  },
  __hmrId: 'BasicMaterial',
};
