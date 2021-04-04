import { defineComponent } from 'vue';
import { MeshLambertMaterial } from 'three';
import { bindProps, propsValues } from '../tools';
import Material, { wireframeProps } from './Material';

export default defineComponent({
  extends: Material,
  props: {
    ...wireframeProps,
  },
  methods: {
    createMaterial() {
      this.material = new MeshLambertMaterial(propsValues(this.$props));
    },
    addWatchers() {
      bindProps(this, Object.keys(wireframeProps), this.material);
    },
  },
  __hmrId: 'LambertMaterial',
});
