import { defineComponent } from 'vue';
import { RingGeometry } from 'three';
import Geometry from './Geometry.js';

export const props = {
  innerRadius: { type: Number, default: 0.5 },
  outerRadius: { type: Number, default: 1 },
  thetaSegments: { type: Number, default: 8 },
  phiSegments: { type: Number, default: 1 },
  thetaStart: { type: Number, default: 0 },
  thetaLength: { type: Number, default: Math.PI * 2 },
};

export function createGeometry(comp) {
  return new RingGeometry(comp.innerRadius, comp.outerRadius, comp.thetaSegments, comp.phiSegments, comp.thetaStart, comp.thetaLength);
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
