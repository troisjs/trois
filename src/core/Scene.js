import { Scene, Color } from 'three';
import { watch } from 'vue';

export default {
  inject: ['three'],
  props: {
    id: String,
    background: [String, Number],
  },
  setup(props) {
    const scene = new Scene();
    if (props.background) scene.background = new Color(props.background);
    watch(() => props.background, (value) => { scene.background = new Color(value); });
    return { scene };
  },
  provide() {
    return {
      scene: this.scene,
    };
  },
  mounted() {
    if (!this.three.scene) {
      this.three.scene = this.scene;
    }
  },
  methods: {
    // add(o) {
    //   this.scene.add(o);
    // },
    // remove(o) {
    //   this.scene.remove(o);
    // },
  },
  render() {
    if (this.$slots.default) {
      return this.$slots.default();
    }
    return [];
  },
};
