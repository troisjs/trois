import { inject, onUnmounted } from 'vue'
import { BlurPass, RenderPass } from 'postprocessing'
import { ComposerInjectionKey } from './EffectComposer'

// type PassTypes = 'render' | 'blur'

export default {
  props: {
    type: { type: String, required: true },
    options: { type: Object, default: () => ({}) },
    // needsSwap: { type: Boolean, default: false },
    renderToScreen: { type: Boolean, default: false },
    onReady: Function,
  },
  setup(props) {
    const composer = inject(ComposerInjectionKey)
    if (!composer || !composer.renderer) {
      console.error('Composer/Renderer not found')
      return {}
    }

    let pass
    const passIndex = composer.getPassIndex()

    const initPass = () => {
      pass = createPass(composer.renderer, props.type, props.options)
      if (!pass) {
        console.error('Invalid pass type')
        return
      }
      pass.renderToScreen = props.renderToScreen
      if (props.onReady) props.onReady(pass)
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
}

function createPass(renderer, type, options) {
  let pass
  switch (type) {
    case 'render' :
      pass = new RenderPass(renderer.scene, renderer.camera)
      break
    case 'blur' :
      pass = new BlurPass(options)
      break
  }
  return pass
}
