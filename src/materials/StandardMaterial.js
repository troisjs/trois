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
  setup(props) {
    const material = new MeshStandardMaterial(propsValues(props, ['id']));
    ['emissive', 'emissiveIntensity', 'metalness', 'roughness'].forEach(p => {
      watch(() => props[p], (value) => {
        if (p === 'emissive') {
          material.emissive = new Color(value);
        } else {
          material[p] = value;
        }
      });
    });
    return { material };
  },
  __hmrId: 'StandardMaterial',
};
