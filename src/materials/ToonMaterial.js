import { MeshToonMaterial } from 'three';
import { bindProps, propsValues } from '../tools.js';
import Material, { wireframeProps } from './Material';

export default {
  extends: Material,
  props: {
    ...wireframeProps,
  },
  methods: {
    createMaterial() {
      this.material = new MeshToonMaterial(propsValues(this.$props));
    },
    addWatchers() {
      bindProps(this, Object.keys(wireframeProps), this.material);
    },
  },
  __hmrId: 'ToonMaterial',
};
