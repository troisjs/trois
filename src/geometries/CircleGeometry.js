import { defineComponent } from 'vue';
import { CircleGeometry } from 'three';
import Geometry from './Geometry.js';

export const props = {
  radius: { type: Number, default: 1 },
  segments: { type: Number, default: 8 },
  thetaStart: { type: Number, default: 0 },
  thetaLength: { type: Number, default: Math.PI * 2 },
};

export function createGeometry(comp) {
  return new CircleGeometry(comp.radius, comp.segments, comp.thetaStart, comp.thetaLength);
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
