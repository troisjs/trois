import { Scene, Color } from 'three';

export default {
  inject: ['three'],
  props: {
    id: String,
    background: [String, Number],
  },
  setup (props) {
    const scene = new Scene();
    if (props.background) scene.background = new Color(props.background);
    return { scene };
  },
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
