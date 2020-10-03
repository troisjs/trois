import { Color, MeshStandardMaterial } from 'three';
import { watch } from 'vue';
import { propsValues } from '../tools.js';
import Material from './Material';

export default {
  extends: Material,
  props: {
    emissive: { type: [Number, String], default: 0 },
    emissiveIntensity: { type: Number, default: 1 },
    metalness: { type: Number, default: 0 },
    roughness: { type: Number, default: 1 },
  },
  methods: {
    createMaterial() {
      this.material = new MeshStandardMaterial(propsValues(this.$props, ['id']));
    },
    addWatchers() {
      ['emissive', 'emissiveIntensity', 'metalness', 'roughness'].forEach(p => {
        watch(() => this[p], (value) => {
          if (p === 'emissive') {
            this.material.emissive = new Color(value);
          } else {
            this.material[p] = value;
          }
        });
      });
    },
  },
  __hmrId: 'StandardMaterial',
};
