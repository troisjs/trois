import { Color, MeshStandardMaterial } from 'three';
import { watch } from 'vue';
import Material from './Material';

export default {
  extends: Material,
  props: {
    emissive: {
      type: [Number, String],
      default: 0,
    },
    emissiveIntensity: {
      type: Number,
      default: 1,
    },
    metalness: {
      type: Number,
      default: 0,
    },
    roughness: {
      type: Number,
      default: 1,
    },
  },
  created() {
    this.material = new MeshStandardMaterial(this.propsValues());
    ['emissive', 'emissiveIntensity', 'metalness', 'roughness'].forEach(p => {
      watch(() => this[p], () => {
        if (p === 'emissive') {
          this.material.emissive = new Color(this.emissive);
        } else {
          this.material[p] = this[p];
        }
      });
    });
  },
  __hmrId: 'StandardMaterial',
};
