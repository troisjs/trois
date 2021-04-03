import { defineComponent, watch } from 'vue';
import { bindProp } from '../tools';

export default defineComponent({
  name: 'Object3D',
  inject: ['three', 'scene', 'rendererComponent'],
  emits: ['created', 'ready'],
  props: {
    position: { type: Object, default: { x: 0, y: 0, z: 0 } },
    rotation: { type: Object, default: { x: 0, y: 0, z: 0 } },
    scale: { type: Object, default: { x: 1, y: 1, z: 1 } },
    lookAt: { type: Object, default: null },
    autoRemove: { type: Boolean, default: true },
  },
  // can't use setup because it will not be used in sub components
  // setup() {},
  unmounted() {
    if (this.autoRemove) this.removeFromParent();
  },
  methods: {
    initObject3D(o3d) {
      this.o3d = o3d;
      this.$emit('created', this.o3d);

      bindProp(this, 'position', this.o3d);
      bindProp(this, 'rotation', this.o3d);
      bindProp(this, 'scale', this.o3d);

      // TODO : fix lookat.x
      if (this.lookAt) this.o3d.lookAt(this.lookAt.x, this.lookAt.y, this.lookAt.z);
      watch(() => this.lookAt, (v) => { this.o3d.lookAt(v.x, v.y, v.z); }, { deep: true });

      this._parent = this.getParent();
      if (this.addToParent()) this.$emit('ready', this);
      else console.error('Missing parent (Scene, Group...)');
    },
    getParent() {
      let parent = this.$parent;
      while (parent) {
        if (parent.add) return parent;
        parent = parent.$parent;
      }
      return false;
    },
    addToParent(o) {
      const o3d = o || this.o3d;
      if (this._parent) {
        this._parent.add(o3d);
        return true;
      }
      return false;
    },
    removeFromParent(o) {
      const o3d = o || this.o3d;
      if (this._parent) {
        this._parent.remove(o3d);
        return true;
      }
      return false;
    },
    add(o) { this.o3d.add(o); },
    remove(o) { this.o3d.remove(o); },
  },
  render() {
    return this.$slots.default ? this.$slots.default() : [];
  },
  __hmrId: 'Object3D',
});
