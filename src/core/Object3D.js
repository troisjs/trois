import { watch } from 'vue';
import { bindProp } from '../tools.js';

export default {
  name: 'Object3D',
  inject: ['three', 'scene', 'rendererComponent'],
  props: {
    position: { type: Object, default: { x: 0, y: 0, z: 0 } },
    rotation: { type: Object, default: { x: 0, y: 0, z: 0 } },
    scale: { type: Object, default: { x: 1, y: 1, z: 1 } },
    lookAt: { type: Object, default: null },
  },
  // can't use setup because it will not be used in sub components
  // setup() {},
  unmounted() {
    // traverse ancestors until we find something we can remove from
    let parent = this.$parent;
    while (parent) {
      if (parent.remove) {
        parent.remove(this.o3d);
        break;
      }
      parent = parent.$parent;
    }
  },
  methods: {
    initObject3D(o3d) {
      this.o3d = o3d;

      bindProp(this, 'position', this.o3d);
      bindProp(this, 'rotation', this.o3d);
      bindProp(this, 'scale', this.o3d);

      // fix lookat.x
      if (this.lookAt) this.o3d.lookAt(this.lookAt.x, this.lookAt.y, this.lookAt.z);
      watch(() => this.lookAt, (v) => { this.o3d.lookAt(v.x, v.y, v.z); }, { deep: true });

      // traverse ancestors until we find something we can add to
      let parent = this.$parent;
      while (parent) {
        if (parent.add) {
          parent.add(this.o3d);
          break;
        }
        parent = parent.$parent;
      }
    },
    add(o) { this.o3d.add(o); },
    remove(o) { this.o3d.remove(o); },
  },
  render() {
    return this.$slots.default ? this.$slots.default() : [];
  },
  __hmrId: 'Object3D',
};
