import { defineComponent } from 'vue';
import { PolyhedronGeometry } from 'three';
import Geometry from './Geometry.js';

export const props = {
  vertices: Array,
  indices: Array,
  radius: { type: Number, default: 1 },
  detail: { type: Number, default: 0 },
};

export function createGeometry(comp) {
  return new PolyhedronGeometry(comp.vertices, comp.indices, comp.radius, comp.detail);
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
