import { bindProp } from '../tools.js';

export default {
  inject: ['three', 'scene', 'rendererComponent'],
  props: {
    position: Object,
    rotation: Object,
    scale: Object,
  },
  // can't use setup because it will not be used in sub components
  // setup() {},
  created() {},
  unmounted() {
    if (this.$parent.remove) this.$parent.remove(this.o3d);
  },
  methods: {
    initObject3D(o3d) {
      this.o3d = o3d;

      bindProp(this, 'position', this.o3d.position);
      bindProp(this, 'rotation', this.o3d.rotation);
      bindProp(this, 'scale', this.o3d.scale);

      if (this.$parent.add) this.$parent.add(this.o3d);
    },
    add(o) { this.o3d.add(o); },
    remove(o) { this.o3d.remove(o); },
  },
  render() {
    return this.$slots.default ? this.$slots.default() : [];
  },
};
