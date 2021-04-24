import { defineComponent, inject, InjectionKey, provide, watch } from 'vue'
import { Scene, Color, Object3D, Texture } from 'three'
import { RendererInjectionKey } from './Renderer'

export const SceneInjectionKey: InjectionKey<Scene> = Symbol('Scene')

export default defineComponent({
  name: 'Scene',
  props: {
    background: [String, Number, Object],
  },
  setup(props) {
    const renderer = inject(RendererInjectionKey)
    const scene = new Scene()

    if (!renderer) {
      console.error('Renderer not found')
      return
    }

    renderer.scene = scene
    provide(SceneInjectionKey, scene)

    const setBackground = (value: any): void => {
      if (!value) return
      if (typeof value === 'string' || typeof value === 'number') {
        if (scene.background instanceof Color) scene.background.set(value)
        else scene.background = new Color(value)
      } else if (value instanceof Texture) {
        scene.background = value
      }
    }

    setBackground(props.background)
    watch(() => props.background, setBackground)

    const add = (o: Object3D): void => { scene.add(o) }
    const remove = (o: Object3D): void => { scene.remove(o) }

    return { scene, add, remove }
  },
  render() {
    return this.$slots.default ? this.$slots.default() : []
  },
  __hmrId: 'Scene',
})
