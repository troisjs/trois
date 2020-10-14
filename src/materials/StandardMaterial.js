import { MeshStandardMaterial, Vector2 } from 'three';
import { watch } from 'vue';
import { propsValues } from '../tools.js';
import useBindProp from '../use/useBindProp.js';
import Material from './Material';

const props = {
  aoMapIntensity: { type: Number, default: 1 },
  bumpScale: { type: Number, default: 1 },
  displacementBias: { type: Number, default: 0 },
  displacementScale: { type: Number, default: 1 },
  emissive: { type: [Number, String], default: 0 },
  emissiveIntensity: { type: Number, default: 1 },
  envMapIntensity: { type: Number, default: 1 },
  lightMapIntensity: { type: Number, default: 1 },
  metalness: { type: Number, default: 0 },
  normalScale: { type: Object, default: () => new Vector2(1, 1) },
  roughness: { type: Number, default: 1 },
  refractionRatio: { type: Number, default: 0.98 },
  wireframe: Boolean,
};

export default {
  extends: Material,
  props,
  methods: {
    createMaterial() {
      this.material = new MeshStandardMaterial(propsValues(this.$props, ['id', 'normalScale']));
    },
    addWatchers() {
      // todo : use setProp ?
      Object.keys(props).forEach(p => {
        if (p === 'normalScale') return;
        watch(() => this[p], (value) => {
          if (p === 'emissive') {
            this.material[p].set(value);
          } else {
            this.material[p] = value;
          }
        });
      });
      useBindProp(this, 'normalScale', this.material.normalScale);
    },
  },
  __hmrId: 'StandardMaterial',
};
