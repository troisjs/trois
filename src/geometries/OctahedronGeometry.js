import { defineComponent } from 'vue';
import { OctahedronGeometry } from 'three';
import Geometry from './Geometry.js';

export const props = {
  radius: { type: Number, default: 1 },
  detail: { type: Number, default: 0 },
};

export function createGeometry(comp) {
  return new OctahedronGeometry(comp.radius, comp.detail);
};

export default defineComponent({
  extends: Geometry,
  props,
  methods: {
    createGeometry() {
      this.geometry = createGeometry(this);
    },
  },
});
