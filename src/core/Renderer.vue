<template>
  <canvas ref="canvas">
    <slot></slot>
  </canvas>
</template>

<script>
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
      type: Boolean,
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
      beforeRender: [],
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
      this.animate();
    };
  },
  beforeUnmount() {
    this.raf = false;
    this.beforeRender.splice(0);
    this.three.dispose();
  },
  methods: {
    onBeforeRender(callback) {
      this.beforeRender.push(callback);
    },
    onAfterResize() {},
    animate() {
      if (this.raf) requestAnimationFrame(this.animate);
      this.beforeRender.forEach(c => c());
      this.three.render();
    },
  },
};
</script>

<style>
canvas {
  display: block;
}
</style>
