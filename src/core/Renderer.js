import { h } from 'vue';
import useThree from './useThree';

export default {
  props: {
    antialias: {
      type: Boolean,
      default: true,
    },
    alpha: {
      type: Boolean,
      default: false,
    },
    shadow: {
      type: Boolean,
      default: false,
    },
    orbitCtrl: {
      type: [Boolean, Object],
      default: false,
    },
    mouseMove: {
      type: [Boolean, String],
      default: false,
    },
    mouseRaycast: {
      type: Boolean,
      default: false,
    },
    resize: {
      type: [Boolean, String, Element],
      default: 'window',
    },
    width: String,
    height: String,
  },
  setup(props) {
    return {
      three: useThree(),
      raf: true,
    };
  },
  provide() {
    return {
      three: this.three,
    };
  },
  mounted() {
    const params = {
      canvas: this.$refs.canvas,
      antialias: this.antialias,
      alpha: this.alpha,
      orbit_ctrl: this.orbitCtrl,
      mouse_move: this.mouseMove,
      mouse_raycast: this.mouseRaycast,
      resize: this.resize,
      width: this.width,
      height: this.height,
    };

    if (this.three.init(params)) {
      this.three.renderer.shadowMap.enabled = this.shadow;
      if (this.three.composer) this.animateC();
      else this.animate();
    };
  },
  beforeUnmount() {
    this.raf = false;
    this.three.dispose();
  },
  methods: {
    onBeforeRender(callback) {
      this.three.onBeforeRender(callback);
    },
    onAfterResize(callback) {
      this.three.onAfterResize(callback);
    },
    animate() {
      if (this.raf) requestAnimationFrame(this.animate);
      this.three.render();
    },
    animateC() {
      if (this.raf) requestAnimationFrame(this.animateC);
      this.three.renderC();
    },
  },
  render() {
    return h(
      'canvas',
      { ref: 'canvas' },
      this.$slots.default()
    );
  },
};
