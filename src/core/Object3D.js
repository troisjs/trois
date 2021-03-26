import { Vector2 } from 'three';
import { watch } from 'vue';
import { bindProp } from '../tools/index.js';

export default {
  name: 'Object3D',
  inject: ['three', 'scene', 'rendererComponent'],
  emits: ['created', 'ready', 'pointerEnter', 'pointerOver', 'pointerLeave', 'click'],
  props: {
    position: { type: Object, default: { x: 0, y: 0, z: 0 } },
    rotation: { type: Object, default: { x: 0, y: 0, z: 0 } },
    scale: { type: Object, default: { x: 1, y: 1, z: 1 } },
    lookAt: { type: Object, default: null },
    onPointerEnter: { type: Function, default: null },
    onPointerOver: { type: Function, default: null },
    onPointerLeave: { type: Function, default: null },
    onClick: { type: Function, default: null },
    usePointerEvents: { type: Boolean, default: false },
    pointerObjects: { type: [Boolean, Array], default: null }
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

    // teardown listeners
    this.three.offBeforeRender(this.pointerHandler);
    if (this.three.mouse_move_element) {
      this.three.mouse_move_element.removeEventListener('mouseleave', this.renderElementLeaveHandler)
    }
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

      if (this.usePointerEvents
        || this.onPointerEnter
        || this.onPointerOver
        || this.onPointerLeave
        || this.onClick) {
        this.three.onBeforeRender(this.pointerHandler);
      }
      if (this.onPointerLeave) {
        // we need to wait a tick so the mouse_move_element is created
        // TODO: more robust fix
        this.$nextTick(() => this.three.mouse_move_element.addEventListener('mouseleave', this.renderElementLeaveHandler));
      }
      if (this.onClick) {
        window.addEventListener('click', this.clickHandler);
        // TODO: touch
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
      this.three.raycaster.setFromCamera(this.three.mouse, this.three.camera);

      // determine what we're raycasting against 
      let objectsToCastAgainst = this.pointerObjects;
      if (objectsToCastAgainst) {
        // cast against all objects in scene if prop is `true`
        if (objectsToCastAgainst === true) {
          objectsToCastAgainst = this.three.scene.children;
        }
      } else {
        // default: just cast against this object
        objectsToCastAgainst = [this.o3d];
      }

      // find all intersects
      const intersects = this.three.raycaster.intersectObjects(objectsToCastAgainst);
      // determine if the first intersect is this object
      const match = intersects.length &&
        intersects[0].object.uuid === this.o3d.uuid
        ? intersects[0]
        : null;

      // if so, let's start the callback process
      if (match) {
        // pointer is newly over o3d
        if (!this.pointerOver) {
          this.pointerOver = true;

          if (this.onPointerEnter) {

            this.onPointerEnter({
              object: this.o3d,
              intersect: match
            });

            if (this.usePointerEvents) {
              this.$emit('pointerEnter', {
                object: this.o3d,
                intersect: match
              });
            }
          }
        }
        // pointer is still over o3d
        else if (this.onPointerOver) {
          this.onPointerOver({
            object: this.o3d,
            intersect: match
          });

          if (this.usePointerEvents) {
            this.$emit('pointerOver', {
              object: this.o3d,
              intersect: match
            });
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
            this.$emit('pointerLeave', {
              object: this.o3d
            });
          }
        }
      }
    },
    clickHandler(evt) {
      if (this.pointerOver) {
        // cast a ray so we can provide hit info
        this.three.raycaster.setFromCamera(this.three.mouse, this.three.camera);
        const [intersect] = this.three.raycaster.intersectObjects([this.o3d]);

        // callbacks and events
        if (this.onClick) {
          this.onClick({ object: this.o3d, intersect });
        }
        if (this.usePointerEvents) {
          this.$emit('click', { object: this.o3d, intersect });
        }
      }
    },
    renderElementLeaveHandler() {
      // since the mouse is off the renderer, we'll set its values to an unreachable number
      this.three.mouse.x = this.three.mouse.y = Infinity;
      // then run the normal pointer handler with these updated mouse values
      this.pointerHandler();
    }
  },
  render() {
    return this.$slots.default ? this.$slots.default() : [];
  },
  __hmrId: 'Object3D',
};
