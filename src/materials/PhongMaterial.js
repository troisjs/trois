import { defineComponent, watch } from 'vue';
import { MeshPhongMaterial } from 'three';
import { bindProps, propsValues } from '../tools';
import Material, { wireframeProps } from './Material';

export default defineComponent({
  extends: Material,
  props: {
    emissive: { type: [Number, String], default: 0 },
    emissiveIntensity: { type: Number, default: 1 },
    reflectivity: { type: Number, default: 1 },
    shininess: { type: Number, default: 30 },
    specular: { type: [String, Number], default: 0x111111 },
    flatShading: Boolean,
    ...wireframeProps,
  },
  methods: {
    createMaterial() {
      this.material = new MeshPhongMaterial(propsValues(this.$props));
    },
    addWatchers() {
      // TODO : handle flatShading ?
      ['emissive', 'emissiveIntensity', 'reflectivity', 'shininess', 'specular'].forEach(p => {
        watch(() => this[p], (value) => {
          if (p === 'emissive' || p === 'specular') {
            this.material[p].set(value);
          } else {
            this.material[p] = value;
          }
        });
      });
      bindProps(this, Object.keys(wireframeProps), this.material);
    },
  },
  __hmrId: 'PhongMaterial',
});
