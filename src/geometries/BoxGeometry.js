import { defineComponent } from 'vue';
import { BoxGeometry } from 'three';
import Geometry from './Geometry.js';

export const props = {
  size: Number,
  width: { type: Number, default: 1 },
  height: { type: Number, default: 1 },
  depth: { type: Number, default: 1 },
  widthSegments: { type: Number, default: 1 },
  heightSegments: { type: Number, default: 1 },
  depthSegments: { type: Number, default: 1 },
};

export function createGeometry(comp) {
  if (comp.size) {
    return new BoxGeometry(comp.size, comp.size, comp.size, comp.widthSegments, comp.heightSegments, comp.depthSegments);
  } else {
    return new BoxGeometry(comp.width, comp.height, comp.depth, comp.widthSegments, comp.heightSegments, comp.depthSegments);
  }
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
