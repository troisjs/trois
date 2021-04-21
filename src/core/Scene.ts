import { defineComponent, inject, watch } from 'vue'
import { Scene, Color, Object3D } from 'three'
import { RendererInterface } from './Renderer'

export default defineComponent({
  name: 'Scene',
  props: {
    // id: String,
    background: [String, Number],
  },
  setup(props) {
    const renderer = inject('renderer') as RendererInterface
    const scene = new Scene()
    if (props.background) {
      scene.background = new Color(props.background)
    }
    watch(() => props.background, (value) => { if (scene.background instanceof Color && value) scene.background.set(value) })
    return { renderer, scene }
  },
  provide() {
    return {
      scene: this.scene,
    }
  },
  created() {
    this.renderer.scene = this.scene
  },
  methods: {
    add(o: Object3D) { this.scene.add(o) },
    remove(o: Object3D) { this.scene.remove(o) },
  },
  render() {
    return this.$slots.default ? this.$slots.default() : []
  },
  __hmrId: 'Scene',
})
