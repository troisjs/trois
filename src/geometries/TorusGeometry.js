import { defineComponent } from 'vue';
import { TorusGeometry } from 'three';
import Geometry from './Geometry.js';

export const props = {
  radius: { type: Number, default: 1 },
  tube: { type: Number, default: 0.4 },
  radialSegments: { type: Number, default: 8 },
  tubularSegments: { type: Number, default: 6 },
  arc: { type: Number, default: Math.PI * 2 },
};

export function createGeometry(comp) {
  return new TorusGeometry(comp.radius, comp.tube, comp.radialSegments, comp.tubularSegments, comp.arc);
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
