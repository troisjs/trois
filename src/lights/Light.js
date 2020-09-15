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
    castShadow: {
      type: Boolean,
      default: false,
    },
    position: Object,
  },
  mounted() {
    setFromProp(this.light.position, this.position);
    this.light.castShadow = this.castShadow;
    this.scene.add(this.light);
    if (this.light.target) this.scene.add(this.light.target);
  },
  render() {
    return [];
  },
};
