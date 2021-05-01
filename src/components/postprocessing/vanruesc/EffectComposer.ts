import { defineComponent, inject, InjectionKey, onUnmounted, provide } from 'vue'
import { Clock } from 'three'
// @ts-ignore
import * as PP from 'postprocessing'
// import { RendererInjectionKey, RendererInterface } from '../../../build/trois'
import { RendererInjectionKey, RendererInterface } from '../../../export'

export interface EffectComposerInterface {
  renderer: RendererInterface
  composer: PP.EffectComposer
  getPassIndex: {(): number}
}

export const ComposerInjectionKey: InjectionKey<EffectComposerInterface> = Symbol('Composer')

export default defineComponent({
  setup() {
    const renderer = inject(RendererInjectionKey)
    if (!renderer) {
      console.error('Renderer not found')
      return
    }

    const composer = new PP.EffectComposer(renderer.renderer)
    const clock = new Clock()
    const render = () => { composer.render(clock.getDelta()) }
    const setSize = () => { composer.setSize(renderer.size.width, renderer.size.height) }

    let passIndex = 0
    const getPassIndex = () => { return passIndex++ }

    renderer.onInit(() => {
      renderer.renderer.autoClear = false
      renderer.renderFn = render
      setSize()
      renderer.onResize(setSize)
    })

    onUnmounted(() => {
      renderer.offResize(setSize)
      composer.dispose()
    })

    provide(ComposerInjectionKey, { renderer, composer, getPassIndex })
  },
  render() {
    return this.$slots.default ? this.$slots.default() : []
  },
})
