import { inject, onUnmounted, provide } from 'vue'
import { Clock } from 'three'
import { EffectComposer } from 'postprocessing'
import { RendererInjectionKey } from '../../../../build/trois.module.js'
// import { RendererInjectionKey } from '../../../core'

export const ComposerInjectionKey = Symbol('Composer')

export default {
  setup() {
    const renderer = inject(RendererInjectionKey)
    if (!renderer) {
      console.error('Renderer not found')
      return
    }

    const composer = new EffectComposer(renderer.renderer)
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
}
