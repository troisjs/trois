<template>
  <canvas ref="canvas">
    <slot></slot>
  </canvas>
</template>

<script>
import useThree from './useThree';

const animateCallbacks = [];

export function useAnimate(callback) {
  animateCallbacks.push(callback);
};

export default {
  props: {
    alpha: {
      type: Boolean,
      default: false,
    },
    animate: {
      type: Function,
    },
  },
  data() {
    return {
      raf: true,
    };
  },
  setup(props) {
    return {
      three: useThree(),
    };
  },
  provide() {
    return {
      three: this.three,
    };
  },
  mounted() {
    // console.log('Renderer mounted');
    this.three.init({
      canvas: this.$refs.canvas,
    });

    this._animate();
  },
  beforeUnmount() {
    // console.log('Renderer beforeUnmount');
    // animateCallbacks.splice(0);
    this.raf = false;
    this.three.dispose();
  },
  methods: {
    _animate() {
      if (this.raf) requestAnimationFrame(this._animate);
      // if (this.animate) this.animate();
      animateCallbacks.forEach(c => c());
      if (this.three.scene) this.three.render(this.three.scene);
    },
  },
};
</script>

<style>
canvas {
  display: block;
}
</style>
