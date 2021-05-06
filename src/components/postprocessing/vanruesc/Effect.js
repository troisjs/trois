import { defineComponent, inject, onMounted, onUnmounted } from 'vue'
import { LoadingManager } from 'three'
import { BloomEffect, DepthOfFieldEffect, EdgeDetectionMode, GodRaysEffect, SMAAEffect, SMAAImageLoader, SMAAPreset } from 'postprocessing'
import { EffectPassInjectionKey } from './EffectPass'

// type EffectTypes = 'bloom' | 'dof' | 'godrays' | 'smaa'

export default defineComponent({
  props: {
    type: { type: String, required: true },
    options: { type: Object, default: () => ({}) },
    onReady: Function,
  },
  setup(props) {
    const effectPass = inject(EffectPassInjectionKey)
    if (!effectPass) {
      console.error('EffectPass not found')
      return
    }

    let effect
    const effectIndex = effectPass.getEffectIndex()

    const initEffect = (params) => {
      effect = createEffect(effectPass, props.type, props.options, params)
      if (!effect) {
        console.error('Invalid effect type')
        return
      }
      if (props.onReady) props.onReady(effect)
      effectPass.addEffect(effect, effectIndex)
    }

    onMounted(() => {
      if (props.type === 'smaa') {
        const smaaImageLoader = new SMAAImageLoader(new LoadingManager())
        smaaImageLoader.load(([search, area]) => {
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

function createEffect(effectPass, type, options, assets) {
  let effect
  switch (type) {
    case 'bloom' :
      effect = new BloomEffect(options)
      break
    case 'dof' :
      effect = new DepthOfFieldEffect(effectPass.composer.renderer, options)
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

function createSmaaEffect(options, assets) {
  const { smaaSearch, smaaArea } = assets
  const params = [options.preset ?? SMAAPreset.HIGH, options.edgeDetectionMode ?? EdgeDetectionMode.COLOR]
  return new SMAAEffect(smaaSearch, smaaArea, ...params)
}

function createGodraysEffect(effectPass, options) {
  const opts = { ...options }
  const { lightSource } = options
  if (typeof lightSource !== 'string') {
    console.error('Invalid lightSource')
    return
  }
  delete opts.lightSource

  const lightSourceComp = effectPass.renderer.$root.$refs[lightSource]
  if (!lightSourceComp) {
    console.error('Invalid lightSource ref')
    return
  }

  return new GodRaysEffect(effectPass.composer.renderer.camera, lightSourceComp.mesh, opts)
}
