import { defineComponent, inject, InjectionKey, onUnmounted, provide } from 'vue'
// @ts-ignore
import * as PP from 'postprocessing'
import { ComposerInjectionKey, EffectComposerInterface } from './EffectComposer'
import { RendererPublicInterface } from '../../../../build/trois'
// import { RendererPublicInterface } from '../../../export'

export interface EffectPassInterface {
  composer: EffectComposerInterface
  renderer: RendererPublicInterface
  effectPass: PP.EffectPass
  effects: Array<PP.Effect>
  getEffectIndex: {(): number}
  addEffect: {(effect: PP.Effect, index: number): number}
  removeEffect: {(effect: PP.Effect): number}
}

export const EffectPassInjectionKey: InjectionKey<EffectPassInterface> = Symbol('Composer')

export default defineComponent({
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
    let effectPass: PP.EffectPass

    const effects: Array<PP.Effect> = []
    let effectIndex = 0
    const getEffectIndex = () => { return effectIndex++ }

    const refreshEffectPass = () => {
      // we have to recreate EffectPass (modifying effectPass.effects don't work)
      if (effectPass) {
        composer.composer.removePass(effectPass)
        effectPass.dispose()
      }
      effectPass = new PP.EffectPass(composer.renderer.camera, ...effects)
      composer.composer.addPass(effectPass, passIndex)
    }

    const addEffect = (effect: PP.Effect, index: number) => {
      effects.splice(index, 1, effect)
      refreshEffectPass()
    }

    const removeEffect = (effect: PP.Effect) => {
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
})
