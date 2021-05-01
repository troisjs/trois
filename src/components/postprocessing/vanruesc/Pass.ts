import { defineComponent, inject, onUnmounted, PropType } from 'vue'
// @ts-ignore
import * as PP from 'postprocessing'
import { ComposerInjectionKey } from './EffectComposer'
// import { RendererInterface } from '../../../build/trois'
import { RendererInterface } from '../../../export'

type PassTypes = 'render'

export default defineComponent({
  props: {
    type: { type: String as PropType<PassTypes>, required: true },
    options: { type: Object, default: () => ({}) },
    // needsSwap: { type: Boolean, default: false },
    renderToScreen: { type: Boolean, default: false },
  },
  setup(props) {
    const composer = inject(ComposerInjectionKey)
    if (!composer || !composer.renderer) {
      console.error('Composer/Renderer not found')
      return {}
    }

    let pass: undefined | PP.Pass
    const passIndex = composer.getPassIndex()

    const initPass = (params: any = undefined) => {
      pass = createPass(composer.renderer, props.type, props.options)
      if (!pass) {
        console.error('Invalid pass type')
        return
      }
      pass.renderToScreen = props.renderToScreen
      composer.composer.addPass(pass, passIndex)
    }

    onUnmounted(() => {
      if (pass) {
        composer.composer.removePass(pass)
        pass.dispose()
      }
    })

    initPass()
  },
  render() { return [] },
})

function createPass(
  renderer: RendererInterface,
  type: string,
  options: Record<string, any>
): PP.Pass {
  let pass
  switch (type) {
    case 'render' :
      pass = new PP.RenderPass(renderer.scene, renderer.camera)
      break
  }
  return pass
}
