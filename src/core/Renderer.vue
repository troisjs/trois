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
    orbitCtrl: {
      default: false,
    },
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
    };

    if (this.three.init(params)) {
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
