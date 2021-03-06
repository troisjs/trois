import { h } from 'vue';
import useThree from './useThree';

export default {
  props: {
    antialias: Boolean,
    alpha: Boolean,
    autoClear: { type: Boolean, default: true },
    mouseMove: { type: [Boolean, String], default: false },
    mouseRaycast: { type: Boolean, default: false },
    mouseOver: { type: Boolean, default: false },
    click: { type: Boolean, default: false },
    orbitCtrl: { type: [Boolean, Object], default: false },
    resize: { type: [Boolean, String], default: false },
    shadow: Boolean,
    width: String,
    height: String,
  },
  setup() {
    return {
      three: useThree(),
      raf: true,
      onMountedCallbacks: [],
    };
  },
  provide() {
    return {
      three: this.three,
      // renderer: this.three.renderer,
      rendererComponent: this,
    };
  },
  mounted() {
    const params = {
      canvas: this.$el,
      antialias: this.antialias,
      alpha: this.alpha,
      autoClear: this.autoClear,
      orbit_ctrl: this.orbitCtrl,
      mouse_move: this.mouseMove,
      mouse_raycast: this.mouseRaycast,
      mouse_over: this.mouseOver,
      click: this.click,
      resize: this.resize,
      width: this.width,
      height: this.height,
    };

    if (this.three.init(params)) {
      this.renderer = this.three.renderer;
      this.renderer.shadowMap.enabled = this.shadow;
      if (this.three.composer) this.animateC();
      else this.animate();
    };

    this.onMountedCallbacks.forEach(c => c());
  },
  beforeUnmount() {
    this.raf = false;
    this.three.dispose();
  },
  methods: {
    onMounted(callback) {
      this.onMountedCallbacks.push(callback);
    },
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
    return h('canvas', {}, this.$slots.default());
  },
};
