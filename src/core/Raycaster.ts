import { Object3D } from 'three'
import { defineComponent, inject, PropType } from 'vue'
import usePointer, { IntersectObject, PointerInterface, PointerIntersectCallbackType } from './usePointer'
import { RendererInterface } from './Renderer'
import { ThreeInterface } from './useThree'

// eslint-disable-next-line @typescript-eslint/no-empty-function
const emptyCallBack: PointerIntersectCallbackType = () => {}

interface RaycasterSetupInterface {
  renderer: RendererInterface
  three: ThreeInterface
  pointer?: PointerInterface
}

export default defineComponent({
  name: 'Raycaster',
  props: {
    onPointerEnter: { type: Function as PropType<PointerIntersectCallbackType>, default: emptyCallBack },
    onPointerOver: { type: Function as PropType<PointerIntersectCallbackType>, default: emptyCallBack },
    onPointerMove: { type: Function as PropType<PointerIntersectCallbackType>, default: emptyCallBack },
    onPointerLeave: { type: Function as PropType<PointerIntersectCallbackType>, default: emptyCallBack },
    onClick: { type: Function as PropType<PointerIntersectCallbackType>, default: emptyCallBack },
    intersectMode: { type: String, default: 'move' },
  },
  setup(): RaycasterSetupInterface {
    const renderer = inject('renderer') as RendererInterface
    const three = inject('three') as ThreeInterface
    return { renderer, three }
  },
  mounted() {
    this.renderer.onMounted(() => {
      if (!this.three.camera) return

      this.pointer = usePointer({
        camera: this.three.camera,
        domElement: this.renderer.canvas,
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
      if (this.three.scene) {
        const children = this.three.scene.children.filter((c: Object3D) => ['Mesh', 'InstancedMesh'].includes(c.type))
        return children as IntersectObject[]
      }
      return []
    },
  },
  render() {
    return []
  },
  __hmrId: 'Raycaster',
})
