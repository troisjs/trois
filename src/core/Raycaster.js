import usePointer from './usePointer';

export default {
  name: 'Raycaster',
  inject: ['three', 'rendererComponent'],
  props: {
    onPointerEnter: { type: Function, default: () => {} },
    onPointerOver: { type: Function, default: () => {} },
    onPointerMove: { type: Function, default: () => {} },
    onPointerLeave: { type: Function, default: () => {} },
    onClick: { type: Function, default: () => {} },
    intersectMode: { type: String, default: 'move' },
  },
  mounted() {
    this.rendererComponent.onMounted(() => {
      this.pointer = usePointer({
        camera: this.three.camera,
        domElement: this.three.renderer.domElement,
        intersectObjects: this.getIntersectObjects(),
        onIntersectEnter: this.onPointerEnter,
        onIntersectOver: this.onPointerOver,
        onIntersectMove: this.onPointerMove,
        onIntersectLeave: this.onPointerLeave,
        onIntersectClick: this.onClick,
      });
      this.pointer.addListeners();

      if (this.intersectMode === 'frame') {
        this.three.onBeforeRender(this.pointer.intersect);
      }
    });
  },
  unmounted() {
    if (this.pointer) {
      this.pointer.removeListeners();
      this.three.offBeforeRender(this.pointer.intersect);
    }
  },
  methods: {
    getIntersectObjects() {
      return this.three.scene.children.filter(e => e.type === 'Mesh');
    },
  },
  render() {
    return [];
  },
  __hmrId: 'Raycaster',
};
