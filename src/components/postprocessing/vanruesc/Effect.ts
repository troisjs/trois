import { defineComponent, inject, onMounted, onUnmounted, PropType } from 'vue'
import { LoadingManager } from 'three'
// @ts-ignore
import * as PP from 'postprocessing'
import { EffectPassInjectionKey, EffectPassInterface } from './EffectPass'

type EffectTypes = 'bloom' | 'dof' | 'godrays' | 'smaa'

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

    const initEffect = (params: any = undefined) => {
      effect = createEffect(effectPass, props.type, props.options, params)
      if (!effect) {
        console.error('Invalid effect type')
        return
      }
      effectPass.addEffect(effect, effectIndex)
    }

    onMounted(() => {
      if (props.type === 'smaa') {
        const smaaImageLoader = new PP.SMAAImageLoader(new LoadingManager())
        smaaImageLoader.load(([search, area]: [HTMLImageElement, HTMLImageElement]) => {
          initEffect({ smaaSearch: search, smaaArea: area })
        })
      } else {
        initEffect()
      }
    })

    onUnmounted(() => {
      if (effect) {
        effectPass.removeEffect(effect)
        effect.dispose()
      }
    })
  },
  render() { return [] },
})

function createEffect(
  effectPass: EffectPassInterface,
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
      effect = new PP.DepthOfFieldEffect(effectPass.composer.renderer, options)
      break
    case 'godrays' :
      effect = createGodraysEffect(effectPass, options)
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

function createGodraysEffect(effectPass: EffectPassInterface, options: Record<string, any>): PP.Pass {
  const opts = { ...options }
  const { lightSource } = options
  if (typeof lightSource !== 'string') {
    console.error('Invalid lightSource')
    return
  }
  delete opts.lightSource

  const lightSourceComp = effectPass.renderer.$root?.$refs[lightSource] as any
  if (!lightSourceComp) {
    console.error('Invalid lightSource ref')
    return
  }

  return new PP.GodRaysEffect(effectPass.composer.renderer.camera, lightSourceComp.mesh, opts)
}
