import {
  Vector3,
} from 'three';

import { setFromProp } from '../tools.js';

export default {
  inject: ['scene'],
  props: {
    color: {
      type: String,
      default: '#ffffff',
    },
    intensity: {
      type: Number,
      default: 1,
    },
    distance: {
      type: Number,
      default: 0,
    },
    decay: {
      type: Number,
      default: 1,
    },
    position: Object,
  },
  mounted() {
    setFromProp(this.light.position, this.position);
    this.scene.add(this.light);
  },
  render() {
    return [];
  },
};
