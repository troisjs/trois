import { defineComponent } from 'vue';
import { PlaneGeometry } from 'three';
import Geometry from './Geometry.js';

export const props = {
  width: { type: Number, default: 1 },
  height: { type: Number, default: 1 },
  widthSegments: { type: Number, default: 1 },
  heightSegments: { type: Number, default: 1 },
};

export function createGeometry(comp) {
  return new PlaneGeometry(comp.width, comp.height, comp.widthSegments, comp.heightSegments);
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
