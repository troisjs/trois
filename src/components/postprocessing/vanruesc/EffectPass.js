import { inject, onUnmounted, provide } from 'vue'
import { EffectPass } from 'postprocessing'
import { ComposerInjectionKey } from './EffectComposer.js'

export const EffectPassInjectionKey = Symbol('EffectPass')

export default {
  props: {
    // needsSwap: { type: Boolean, default: false },
    renderToScreen: { type: Boolean, default: false },
  },
  setup() {
    const composer = inject(ComposerInjectionKey)
    if (!composer) {
      console.error('Composer not found')
      return {}
    }

    const passIndex = composer.getPassIndex()
    let effectPass

    const effects = []
    let effectIndex = 0
    const getEffectIndex = () => { return effectIndex++ }

    const refreshEffectPass = () => {
      // we have to recreate EffectPass (modifying effectPass.effects don't work)
      if (effectPass) {
        composer.composer.removePass(effectPass)
        effectPass.dispose()
      }
      effectPass = new EffectPass(composer.renderer.camera, ...effects)
      composer.composer.addPass(effectPass, passIndex)
    }

    const addEffect = (effect, index) => {
      effects.splice(index, 1, effect)
      refreshEffectPass()
    }

    const removeEffect = (effect) => {
      const index = effects.indexOf(effect)
      if (index >= 0) {
        effects.splice(index, 1)
        refreshEffectPass()
      }
    }

    onUnmounted(() => {
      if (effectPass) {
        composer.composer.removePass(effectPass)
        effectPass.dispose()
      }
    })

    provide(EffectPassInjectionKey, {
      composer,
      renderer: composer.renderer,
      effectPass,
      effects,
      getEffectIndex,
      addEffect, removeEffect,
    })
  },
  render() { return this.$slots.default ? this.$slots.default() : [] },
}
