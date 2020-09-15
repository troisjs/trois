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
    shadowMapSize: Object,
    position: Object,
  },
  mounted() {
    setFromProp(this.light.position, this.position);

    if (this.light.shadow) {
      this.light.castShadow = this.castShadow;
      setFromProp(this.light.shadow.mapSize, this.shadowMapSize);
    }

    this.scene.add(this.light);
    if (this.light.target) this.scene.add(this.light.target);
  },
  render() {
    return [];
  },
};
