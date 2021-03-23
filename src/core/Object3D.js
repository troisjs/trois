import { watch } from 'vue';
import { bindProp } from '../tools.js';

export default {
  name: 'Object3D',
  inject: ['three', 'scene', 'rendererComponent'],
  emits: ['created', 'ready'],
  props: {
    position: { type: Object, default: { x: 0, y: 0, z: 0 } },
    rotation: { type: Object, default: { x: 0, y: 0, z: 0 } },
    scale: { type: Object, default: { x: 1, y: 1, z: 1 } },
    lookAt: { type: Object, default: null },
    onPointerEnter: { type: Function, default: null }
  },
  // can't use setup because it will not be used in sub components
  // setup() {},
  unmounted() {
    if (this._parent) this._parent.remove(this.o3d);
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

      if (this.onPointerEnter) {
        this.three.onBeforeRender(this.raycastEnter)
      }

      // find first viable parent
      let parent = this.$parent;
      while (parent) {
        if (parent.add) {
          parent.add(this.o3d);
          this._parent = parent;
          break;
        }
        parent = parent.$parent;
      }
      if (!this._parent) console.error('Missing parent (Scene, Group...)');
      else this.$emit('ready', this);
    },
    add(o) { this.o3d.add(o); },
    remove(o) { this.o3d.remove(o); },
    raycastEnter() {
      this.three.raycaster.setFromCamera(this.three.mouse, this.three.camera)
      const intersects = this.three.raycaster.intersectObjects([this.o3d])
      if (intersects.length) {
        console.log(intersects[0].distance)

        this.onPointerEnter(intersects[0])
      }
    }
  },
  render() {
    return this.$slots.default ? this.$slots.default() : [];
  },
  __hmrId: 'Object3D',
};
