import { Object3D } from 'three'
import { defineComponent } from 'vue'
import usePointer, { PointerIntersectCallbackType } from './usePointer'

// eslint-disable-next-line @typescript-eslint/no-empty-function
const emptyCallBack: PointerIntersectCallbackType = () => {}

export default defineComponent({
  name: 'Raycaster',
  inject: ['three', 'renderer'],
  props: {
    onPointerEnter: { type: Function, default: emptyCallBack },
    onPointerOver: { type: Function, default: emptyCallBack },
    onPointerMove: { type: Function, default: emptyCallBack },
    onPointerLeave: { type: Function, default: emptyCallBack },
    onClick: { type: Function, default: emptyCallBack },
    intersectMode: { type: String, default: 'move' },
  },
  mounted() {
    this.renderer.onMounted(() => {
      this.pointer = usePointer({
        camera: this.three.camera,
        domElement: this.three.renderer.domElement,
        intersectObjects: this.getIntersectObjects(),
        onIntersectEnter: (<PointerIntersectCallbackType> this.onPointerEnter),
        onIntersectOver: (<PointerIntersectCallbackType> this.onPointerOver),
        onIntersectMove: (<PointerIntersectCallbackType> this.onPointerMove),
        onIntersectLeave: (<PointerIntersectCallbackType> this.onPointerLeave),
        onIntersectClick: (<PointerIntersectCallbackType> this.onClick),
      })
      this.pointer.addListeners()

      if (this.intersectMode === 'frame') {
        this.renderer.onBeforeRender(this.pointer.intersect)
      }
    })
  },
  unmounted() {
    if (this.pointer) {
      this.pointer.removeListeners()
      this.renderer.offBeforeRender(this.pointer.intersect)
    }
  },
  methods: {
    getIntersectObjects() {
      return this.three.scene.children.filter((c: Object3D) => ['Mesh', 'InstancedMesh'].includes(c.type))
    },
  },
  render() {
    return []
  },
  __hmrId: 'Raycaster',
})
