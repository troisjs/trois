import { defineComponent, inject, onUnmounted, PropType } from 'vue'
import { LoadingManager } from 'three'
// @ts-ignore
import * as PP from 'postprocessing'
// import { RendererInterface } from '../../../build/trois'
import { RendererInterface } from '../../../export'
import { EffectPassInjectionKey } from './EffectPass'

type EffectTypes = 'bloom' | 'dof' | 'smaa'

export default defineComponent({
  props: {
    type: { type: String as PropType<EffectTypes>, required: true },
    options: { type: Object, default: () => ({}) },
  },
  setup(props) {
    const effectPass = inject(EffectPassInjectionKey)
    if (!effectPass) {
      console.error('EffectPass not found')
      return
    }

    let effect: undefined | PP.Effect // not useful
    const effectIndex = effectPass.getEffectIndex()
    // console.log(effectIndex)

    const initEffect = (params: any = undefined) => {
      effect = createEffect(effectPass.composer.renderer, props.type, props.options, params)
      if (!effect) {
        console.error('Invalid effect type')
        return
      }
      effectPass.addEffect(effect, effectIndex)
    }

    onUnmounted(() => {
      if (effect) {
        effectPass.removeEffect(effect)
        effect.dispose()
      }
    })

    if (props.type === 'smaa') {
      const smaaImageLoader = new PP.SMAAImageLoader(new LoadingManager())
      smaaImageLoader.load(([search, area]: [HTMLImageElement, HTMLImageElement]) => {
        initEffect({ smaaSearch: search, smaaArea: area })
      })
    } else {
      initEffect()
    }
  },
  render() { return [] },
})

function createEffect(
  renderer: RendererInterface,
  type: string,
  options: Record<string, any>,
  assets: any = undefined
): PP.Effect {
  let effect
  switch (type) {
    case 'bloom' :
      effect = new PP.BloomEffect(options)
      break
    case 'dof' :
      effect = new PP.DepthOfFieldEffect(renderer, options)
      break
    case 'smaa' :
      effect = createSmaaEffect(options, assets)
      break
  }
  return effect
}

function createSmaaEffect(options: Record<string, any>, assets: any): PP.Pass {
  const { smaaSearch, smaaArea } = assets
  // TODO : options
  return new PP.SMAAEffect(smaaSearch, smaaArea)
}
