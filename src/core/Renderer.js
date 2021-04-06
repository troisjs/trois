import { defineComponent, h } from 'vue';
import useThree from './useThree';

export default defineComponent({
  name: 'Renderer',
  props: {
    antialias: Boolean,
    alpha: Boolean,
    autoClear: { type: Boolean, default: true },
    orbitCtrl: { type: [Boolean, Object], default: false },
    pointer: { type: [Boolean, Object], default: false },
    resize: { type: [Boolean, String], default: false },
    shadow: Boolean,
    width: String,
    height: String,
    xr: Boolean,
  },
  setup() {
    return {
      three: useThree(),
      raf: true,
      onMountedCallbacks: [],
      beforeRenderCallbacks: [],
      afterRenderCallbacks: [],
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
      pointer: this.pointer,
      resize: this.resize,
      width: this.width,
      height: this.height,
    };

    if (this.three.init(params)) {
      this.renderer = this.three.renderer;
      this.renderer.shadowMap.enabled = this.shadow;

      this._render = this.three.composer ? this.three.renderC : this.three.render;

      if (this.xr) {
        this.renderer.xr.enabled = true;
        this.renderer.setAnimationLoop(this.render);
      } else {
        requestAnimationFrame(this.renderLoop);
      }
    };

    this.onMountedCallbacks.forEach(c => c());
  },
  beforeUnmount() {
    this.beforeRenderCallbacks = [];
    this.afterRenderCallbacks = [];
    this.raf = false;
    this.three.dispose();
  },
  methods: {
    onMounted(cb) {
      this.onMountedCallbacks.push(cb);
    },
    onBeforeRender(cb) {
      this.beforeRenderCallbacks.push(cb);
    },
    offBeforeRender(cb) {
      this.beforeRenderCallbacks = this.beforeRenderCallbacks.filter(c => c !== cb);
    },
    onAfterRender(cb) {
      this.afterRenderCallbacks.push(cb);
    },
    offAfterRender(cb) {
      this.afterRenderCallbacks = this.afterRenderCallbacks.filter(c => c !== cb);
    },
    onAfterResize(cb) {
      this.three.onAfterResize(cb);
    },
    offAfterResize(cb) {
      this.three.offAfterResize(cb);
    },
    render(time) {
      this.beforeRenderCallbacks.forEach(c => c({ time }));
      this._render();
      this.afterRenderCallbacks.forEach(c => c({ time }));
    },
    renderLoop(time) {
      if (this.raf) requestAnimationFrame(this.renderLoop);
      this.render(time);
    },
  },
  render() {
    return h('canvas', {}, this.$slots.default());
  },
  __hmrId: 'Renderer',
});
