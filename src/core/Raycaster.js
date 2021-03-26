import { Raycaster, Vector2 } from 'three'

export default {
  name: 'Raycaster',
  inject: ['three'],
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
    // add update method
    this.three.onBeforeRender(this.update);

    // if we have a custom onBeforeRender method, assume 
    // the user is handling everything and exit setup
    if (this.onBeforeRender) return;


    // prep non-reactive list of intersections
    this._intersects = [];

    // save camera if we don't already have one
    if (!this.camera) {
      let parent = this.$parent;
      while (parent && !this.raycasterCamera) {
        this.raycasterCamera = parent.camera;
        parent = parent.$parent;
      }
    } else {
      this.raycasterCamera = this.camera;
    }

    // add event listeners
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('touchmove', this.onTouchMove);
    // TODO: touch
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
          this.onPointerEnter(newIntersects);
        }
      }

      // capture current intersects
      if (this.onPointerOver) {
        this.onPointerOver(intersects);
      }

      // save internal intersect list
      this._intersects = intersects;
    },
    onMouseMove(evt) {
      const { top: canvasTop, left: canvasLeft } = this.three.mouse_move_element.getBoundingClientRect();
      this.pointer.x = ((evt.x - canvasLeft) / this.three.size.width) * 2 - 1;
      this.pointer.y = - ((evt.y - canvasTop) / this.three.size.height) * 2 + 1;
    },
  },
  render() {
    return this.$slots.default ? this.$slots.default() : [];
  },
  unmounted() {
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('touchstart', this.onTouchMove);

    // TODO: touch
  },
  __hmrId: 'Raycaster',
};
