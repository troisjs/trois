import { watch } from 'vue';
import { bindProp } from '../tools.js';
import { Raycaster, Vector2 } from 'three'

export default {
  name: 'Raycaster',
  inject: ['three'],
  // emits: ['created', 'ready'],
  props: {
    onBeforeRender: {
      type: Function,
      default: null
    },
    onPointerEnter: {
      type: Function,
      default: null
    },
    onPointerLeave: {
      type: Function,
      default: null
    },
    onPointerOver: {
      type: Function,
      default: null
    },
    scene: {
      type: Object,
      default: null
    },
    // user-provided camera. defaults to first parent camera
    camera: {
      type: Object,
      default: null
    },
    intersects: {
      type: Array,
      default: null
    }
  },
  setup() {
    const raycaster = new Raycaster();
    const pointer = new Vector2();

    return { pointer, raycaster }
  },
  data() {
    return {
      raycasterCamera: null
    }
  },
  mounted() {
    // prep non-reactive list of intersections
    this._intersects = []

    // save camera if we don't already have one
    if (!this.camera) {
      let parent = this.$parent
      while (parent && !this.raycasterCamera) {
        this.raycasterCamera = parent.camera
        parent = parent.$parent
      }
    }

    // add event listeners
    window.addEventListener('mousemove', this.onMouseMove)
    window.addEventListener('touchstart', this.onTouchMove)
    window.addEventListener('touchmove', this.onTouchMove)

    // add update method
    this.three.onBeforeRender(this.update)
  },
  methods: {
    update() {
      // custom callback
      if (this.onBeforeRender) {
        this.onBeforeRender(this.raycaster);
        return;
      }

      // save scene
      const scene = this.scene || this.three.scene;
      if (!scene) {
        console.log('No scene detected');
        return;
      }

      // run standard camera-based raycaster...
      this.raycaster.setFromCamera(this.pointer, this.raycasterCamera);
      const intersects = this.raycaster.intersectObjects(
        // ...against either our predefined objects or all objects in scene
        this.intersects || scene.children
      );

      // capture new intersects
      if (this.onPointerEnter) {
        const old = this._intersects.map(intersect => {
          return {
            object: intersect.object,
            instanceId: intersect.instanceId
          }
        });
        // TODO: optimize
        const newIntersects = intersects.filter(intersect => !old.find(val => val.object === intersect.object && val.instanceId === intersect.instanceId));
        if (newIntersects.length) {
          this.onPointerEnter(newIntersects)
        }
      }

      // capture current intersects
      if (this.onPointerOver) {
        this.onPointerOver(intersects)
      }

      // capture expired intersects
      if (this.onPointerLeave) {
        const newObjects = intersects.map(intersect => {
          return {
            object: intersect.object,
            instanceId: intersect.instanceId
          }
        });
        // TODO: optimize
        const expiredIntersects = this._intersects.filter(intersect => !newObjects.find(val => val.object === intersect.object && val.instanceId === intersect.instanceId));
        if (expiredIntersects.length) {
          this.onPointerLeave(expiredIntersects)
        }
      }

      // save internal intersect list
      this._intersects = intersects;
    },
    onMouseMove(evt) {
      this.pointer.x = (evt.offsetX / this.three.size.width) * 2 - 1;
      this.pointer.y = - (evt.offsetY / this.three.size.height) * 2 + 1;
    },
    onTouchMove(evt) {
      const touch = evt.touches[0]
      const { top: canvasTop, left: canvasLeft } = touch.target.getBoundingClientRect()
      this.pointer.x = ((touch.clientX - canvasLeft) / this.three.size.width) * 2 - 1
      this.pointer.y = -((touch.clientY) / this.three.size.height) * 2 + 1
    }
  },
  render() {
    return this.$slots.default ? this.$slots.default() : [];
  },
  unmounted() {
    window.removeEventListener('mousemove', this.onMouseMove)
    window.removeEventListener('touchstart', this.onTouchMove)
    window.removeEventListener('touchmove', this.onTouchMove)
  },
  __hmrId: 'Raycaster',
};
