import { Color, MeshPhysicalMaterial } from 'three';
import { watch } from 'vue';
import { propsValues } from '../tools.js';
import StandardMaterial from './StandardMaterial';

export default {
  extends: StandardMaterial,
  setup(props) {
    const material = new MeshPhysicalMaterial(propsValues(props, ['id']));
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
  __hmrId: 'PhysicalMaterial',
};
