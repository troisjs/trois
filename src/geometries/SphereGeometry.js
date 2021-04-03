import { defineComponent } from 'vue';
import { SphereGeometry } from 'three';
import Geometry from './Geometry.js';

export const props = {
  radius: { type: Number, default: 1 },
  widthSegments: { type: Number, default: 12 },
  heightSegments: { type: Number, default: 12 },
};

export function createGeometry(comp) {
  return new SphereGeometry(comp.radius, comp.widthSegments, comp.heightSegments);
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
