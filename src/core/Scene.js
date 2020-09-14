import { Scene } from 'three';

export default {
  emits: ['scene-ready'],
  inject: ['three'],
  setup (props) {
    const scene = new Scene();
    return { scene };
  },
  provide() {
    return {
      scene: this.scene,
    };
  },
  mounted() {
    this.three.scene = this.scene;
    this.$emit('scene-ready');
  },
  render() {
    return this.$slots.default();
  },
};
