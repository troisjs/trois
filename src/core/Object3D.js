import { watch } from 'vue';
import { bindProp } from '../tools/index.js';

export default {
  name: 'Object3D',
  inject: ['three', 'scene', 'rendererComponent'],
  emits: ['created', 'ready', 'pointerEnter', 'pointerOver', 'pointerLeave'],
  props: {
    position: { type: Object, default: { x: 0, y: 0, z: 0 } },
    rotation: { type: Object, default: { x: 0, y: 0, z: 0 } },
    scale: { type: Object, default: { x: 1, y: 1, z: 1 } },
    lookAt: { type: Object, default: null },
    onPointerEnter: { type: Function, default: null },
    onPointerOver: { type: Function, default: null },
    onPointerLeave: { type: Function, default: null },
    usePointerEvents: { type: Boolean, default: false }
  },
  data() {
    return {
      pointerOver: null
    }
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

      if (this.onPointerEnter || this.onPointerOver || this.onPointerLeave) {
        this.three.onBeforeRender(this.pointerHandler)
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
    pointerHandler() {
      this.three.raycaster.setFromCamera(this.three.mouse, this.three.camera)
      const intersects = this.three.raycaster.intersectObjects([this.o3d])
      if (intersects.length) {
        // pass single intersection if we only have one, for convenience
        const toPass = intersects.length === 1 ? intersects[0] : intersects;

        // pointer is newly over o3d
        if (!this.pointerOver) {
          this.pointerOver = true;

          if (this.onPointerEnter) {

            this.onPointerEnter({ object: this.o3d, intersects: toPass });

            if (this.usePointerEvents) {
              this.$emit('pointerEnter', toPass);
            }
          }
        }
        // pointer is still over o3d
        else if (this.onPointerOver) {
          this.onPointerOver({ object: this.o3d, intersects: toPass });

          if (this.usePointerEvents) {
            this.$emit('pointerOver', toPass);
          }
        }
      } else {
        // pointer is not over o3d

        // pointer has just left o3d
        if (this.pointerOver) {
          this.pointerOver = false;
          if (this.onPointerLeave) {
            this.onPointerLeave({ object: this.o3d });
          }

          if (this.usePointerEvents) {
            this.$emit('pointerLeave');
          }
        }
      }
    }
  },
  render() {
    return this.$slots.default ? this.$slots.default() : [];
  },
  __hmrId: 'Object3D',
};
