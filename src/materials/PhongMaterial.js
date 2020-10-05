import { MeshPhongMaterial } from 'three';
import { watch } from 'vue';
import { propsValues } from '../tools.js';
import Material from './Material';

export default {
  extends: Material,
  props: {
    emissive: { type: [Number, String], default: 0 },
    emissiveIntensity: { type: Number, default: 1 },
    reflectivity: { type: Number, default: 1 },
    shininess: { type: Number, default: 30 },
    specular: { type: [String, Number], default: 0x111111 },
  },
  methods: {
    createMaterial() {
      this.material = new MeshPhongMaterial(propsValues(this.$props, ['id']));
    },
    addWatchers() {
      ['emissive', 'emissiveIntensity', 'reflectivity', 'shininess', 'specular'].forEach(p => {
        watch(() => this[p], (value) => {
          if (p === 'emissive' || p === 'specular') {
            this.material[p].set(value);
          } else {
            this.material[p] = value;
          }
        });
      });
    },
  },
  __hmrId: 'PhongMaterial',
};
