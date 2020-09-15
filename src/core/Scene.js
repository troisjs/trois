import { Scene } from 'three';

export default {
  props: {
    id: String,
  },
  setup () {
    const scene = new Scene();
    return { scene };
  },
  inject: ['three'],
  provide() {
    return {
      scene: this.scene,
    };
  },
  mounted() {
    this.three.scene = this.scene;
  },
  render() {
    if (this.$slots.default) {
      return this.$slots.default();
    }
    return [];
  },
};
